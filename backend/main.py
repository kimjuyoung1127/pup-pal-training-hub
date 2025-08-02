from fastapi import FastAPI, File, UploadFile, Request, Form, BackgroundTasks, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uvicorn
import os
import shutil
from ultralytics import YOLO
import logging
import uuid
import cv2
import numpy as np
from pathlib import Path
from typing import Dict, List
from supabase import create_client, Client
from dotenv import load_dotenv

# --- 환경 변수 로드 ---
load_dotenv()

# --- 기본 설정 ---
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
app = FastAPI()

# --- Supabase 클라이언트 초기화 ---
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    logger.warning("Supabase 환경 변수가 설정되지 않았습니다. DB 연동 기능이 비활성화됩니다.")
    supabase: Client | None = None
else:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# --- 경로 설정 ---
BASE_DIR = Path(__file__).resolve().parent
UPLOAD_DIR = BASE_DIR / "uploads"
MODEL_PATH = BASE_DIR / "models" / "best.pt"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# --- CORS 설정 ---
origins = [
    "https://mungai.co.kr",
    "http://localhost:5173",
    "http://localhost:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 정적 파일 마운트 ---
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# --- 모델 및 작업 상태 저장소 ---
model = YOLO(MODEL_PATH)
jobs: Dict[str, Dict] = {}

# --- 안정성 점수 계산 함수 ---
def calculate_stability_score(keypoints_data: List[List[List[List[float]]]]) -> int:
    if not keypoints_data: return 0
    l_shoulder_idx, r_shoulder_idx = 5, 6
    l_hip_idx, r_hip_idx = 11, 12
    spine_angles = []
    for frame_keypoints in keypoints_data:
        if not frame_keypoints: continue
        dog_keypoints = frame_keypoints[0]
        if not (len(dog_keypoints) > max(l_shoulder_idx, r_shoulder_idx, l_hip_idx, r_hip_idx) and
                dog_keypoints[l_shoulder_idx] and dog_keypoints[r_shoulder_idx] and
                dog_keypoints[l_hip_idx] and dog_keypoints[r_hip_idx]):
            continue
        l_shoulder, r_shoulder = np.array(dog_keypoints[l_shoulder_idx]), np.array(dog_keypoints[r_shoulder_idx])
        shoulder_center = (l_shoulder + r_shoulder) / 2
        l_hip, r_hip = np.array(dog_keypoints[l_hip_idx]), np.array(dog_keypoints[r_hip_idx])
        hip_center = (l_hip + r_hip) / 2
        delta_y, delta_x = shoulder_center[1] - hip_center[1], shoulder_center[0] - hip_center[0]
        angle_rad = np.arctan2(delta_y, delta_x)
        spine_angles.append(np.degrees(angle_rad))
    if not spine_angles: return 0
    angle_std_dev = np.std(spine_angles)
    score = max(0, 100 - (angle_std_dev * 10))
    return int(score)

# --- 척추 만곡 각도 계산 함수 (V5: 벡터 내적 기반 + 이상치 제거) ---
def calculate_spine_curvature(keypoints_data: List[List[List[List[float]]]]) -> float:
    if not keypoints_data: return 0.0
    
    l_shoulder_idx, r_shoulder_idx = 5, 6
    l_hip_idx, r_hip_idx = 11, 12
    
    curvature_angles = []
    for frame_keypoints in keypoints_data:
        if not frame_keypoints: continue
        dog_keypoints = frame_keypoints[0]
        
        required_indices = [l_shoulder_idx, r_shoulder_idx, l_hip_idx, r_hip_idx]
        if not (len(dog_keypoints) > max(required_indices) and all(dog_keypoints[i] for i in required_indices)):
            continue
            
        shoulder_center = (np.array(dog_keypoints[l_shoulder_idx]) + np.array(dog_keypoints[r_shoulder_idx])) / 2
        hip_center = (np.array(dog_keypoints[l_hip_idx]) + np.array(dog_keypoints[r_hip_idx])) / 2
        
        # 1. 척추선 벡터와 수평선 벡터 정의
        spine_vector = hip_center - shoulder_center
        horizontal_vector = np.array([1, 0]) # 오른쪽을 향하는 수평선 벡터

        # 2. 두 벡터의 내적을 이용해 코사인 각도 계산
        dot_product = np.dot(spine_vector, horizontal_vector)
        norm_spine = np.linalg.norm(spine_vector)
        norm_horizontal = np.linalg.norm(horizontal_vector)

        if norm_spine == 0: continue

        cosine_angle = dot_product / (norm_spine * norm_horizontal)
        
        # 3. 코사인 값을 각도로 변환 (0 ~ 180도)
        angle_rad = np.arccos(np.clip(cosine_angle, -1.0, 1.0))
        angle_deg = np.degrees(angle_rad)
        
        # 4. 점수화: 수평에 가까울수록 180점에 가깝게 변환
        # 척추가 수평이면(0도 또는 180도) 180점이 되고, 수직이면(90도) 90점이 됨
        score = 180 - abs(angle_deg - 90) * 2 if angle_deg > 90 else angle_deg * 2
        # 위 로직보다 더 간단하고 직관적인 방법:
        # 척추선과 수평선이 이루는 각도의 절대값은 0~180 사이. 
        # 수평일수록 0 또는 180에 가까워짐. 
        # 우리는 180에 가까운 값을 원하므로, 0에 가까운 값(왼쪽으로 향할때)을 180에 가깝게 바꿔준다.
        final_score = 180 - angle_deg if angle_deg < 90 else angle_deg
        
        curvature_angles.append(final_score)

    if not curvature_angles: return 0.0

    # 이상치 제거 로직 (상/하위 10% 제거)
    if len(curvature_angles) < 10:
        return float(np.mean(curvature_angles))

    sorted_angles = np.sort(curvature_angles)
    trim_count = int(len(sorted_angles) * 0.1)
    trimmed_angles = sorted_angles[trim_count:-trim_count]
    
    if len(trimmed_angles) == 0:
        return float(np.mean(sorted_angles))

    return float(np.mean(trimmed_angles))

# --- 실제 분석 및 저장 로직 ---
def analyze_video_in_background(job_id: str, video_path: str, user_id: str, dog_id: str, original_filename: str):
    try:
        jobs[job_id]['status'] = 'processing'
        
        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened(): raise Exception("업로드된 비디오 파일을 열 수 없습니다.")
        
        fps, total_frames = (int(cap.get(p)) for p in [cv2.CAP_PROP_FPS, cv2.CAP_PROP_FRAME_COUNT])
        cap.release()

        results_generator = model.predict(source=video_path, save=False, stream=True, verbose=False)

        keypoints_data = []
        for r in results_generator:
            if r.keypoints and r.keypoints.xy.numel() > 0:
                keypoints_data.append(r.keypoints.xy.cpu().numpy().tolist())
            else:
                keypoints_data.append([])
            
            jobs[job_id]['progress'] = int((len(keypoints_data) / total_frames) * 100)
        
        stability_score = calculate_stability_score(keypoints_data)
        spine_curvature_angle = calculate_spine_curvature(keypoints_data)

        analysis_results_json = {
            "keypoints_data": keypoints_data, "fps": fps,
            "scores": {"stability": stability_score, "curvature": spine_curvature_angle},
            "metadata": {"fps": fps, "frame_count": len(keypoints_data)}
        }
        jobs[job_id]['result'] = analysis_results_json
        
        if supabase:
            try:
                storage_path = f"{user_id}/{job_id}_{original_filename}"
                with open(video_path, 'rb') as f: supabase.storage.from_("processed-videos").upload(file=f, path=storage_path, file_options={"content-type": "video/mp4"})
                public_url = supabase.storage.from_("processed-videos").get_public_url(storage_path)
                
                is_baseline_res = supabase.table('joint_analysis_records').select('id', count='exact').eq('dog_id', dog_id).execute()
                
                record_to_insert = {
                    "user_id": user_id, "dog_id": dog_id, "is_baseline": is_baseline_res.count == 0,
                    "original_video_filename": original_filename, "processed_video_url": public_url,
                    "analysis_results": analysis_results_json,
                    "notes": f"안정성: {stability_score}점, 허리 곧음: {spine_curvature_angle:.1f}°"
                }
                supabase.table('joint_analysis_records').insert(record_to_insert).execute()
                logger.info(f"작업 {job_id}의 분석 결과를 Supabase에 저장했습니다.")
            except Exception as db_error:
                logger.error(f"Supabase 저장/업로드 실패: {db_error}", exc_info=True)
                jobs[job_id]['error'] = f"DB/Storage Error: {db_error}"

        jobs[job_id]['status'] = 'completed'
    except Exception as e:
        logger.error(f"작업 {job_id} 실패: {e}", exc_info=True)
        jobs[job_id]['status'] = 'failed'; jobs[job_id]['error'] = str(e)

@app.get("/")
def read_root(): return {"message": "AI 관절 추적 API"}

@app.get("/api/health")
def health_check(): return {"status": "ok"}

@app.post("/api/jobs")
async def create_analysis_job(req: Request, bg: BackgroundTasks, file: UploadFile = File(...), user_id: str = Form(...), dog_id: str = Form(...)):
    job_id = str(uuid.uuid4())
    upload_path = str(UPLOAD_DIR / f"{job_id}_{file.filename}")
    with open(upload_path, "wb") as buffer: shutil.copyfileobj(file.file, buffer)
    
    scheme = req.headers.get("x-forwarded-proto", "http")
    host = req.headers.get("host", req.url.netloc)
    base_url = f"{scheme}://{host}"

    jobs[job_id] = {'status': 'pending', 'progress': 0, 'base_url': base_url}
    bg.add_task(analyze_video_in_background, job_id, upload_path, user_id, dog_id, file.filename)
    return JSONResponse(status_code=202, content={"job_id": job_id})

@app.get("/api/jobs/{job_id}")
async def get_job_status(job_id: str):
    job = jobs.get(job_id)
    if not job: raise HTTPException(status_code=404, detail="작업을 찾을 수 없습니다.")
    return JSONResponse(content={"job_id": job_id, "status": job['status'], "progress": job.get('progress', 0), "result": job.get('result'), "error": job.get('error')})
