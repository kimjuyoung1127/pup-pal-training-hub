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

# --- 안정성 점수 계산 함수 (V2: 척추 안정성 기반) ---
def calculate_stability_score(keypoints_data: List[List[List[List[float]]]]) -> int:
    """
    척추선(어깨 중심-엉덩이 중심)의 각도 변화를 기반으로 안정성 점수를 계산합니다.
    점수가 높을수록 척추가 흔들림 없이 곧게 유지됨을 의미합니다.
    """
    if not keypoints_data:
        return 0

    # YOLO 17-point model 기준 관절 인덱스
    l_shoulder_idx, r_shoulder_idx = 5, 6
    l_hip_idx, r_hip_idx = 11, 12
    
    spine_angles = []

    for frame_keypoints in keypoints_data:
        if not frame_keypoints:
            continue
        
        # 첫 번째 감지된 객체(강아지)의 키포인트 사용
        dog_keypoints = frame_keypoints[0]
        
        # 필요한 모든 관절이 감지되었는지 확인
        if not (len(dog_keypoints) > max(l_shoulder_idx, r_shoulder_idx, l_hip_idx, r_hip_idx) and
                dog_keypoints[l_shoulder_idx] and dog_keypoints[r_shoulder_idx] and
                dog_keypoints[l_hip_idx] and dog_keypoints[r_hip_idx]):
            continue

        # 1. 어깨 중심점과 엉덩이 중심점 계산
        l_shoulder = np.array(dog_keypoints[l_shoulder_idx])
        r_shoulder = np.array(dog_keypoints[r_shoulder_idx])
        shoulder_center = (l_shoulder + r_shoulder) / 2
        
        l_hip = np.array(dog_keypoints[l_hip_idx])
        r_hip = np.array(dog_keypoints[r_hip_idx])
        hip_center = (l_hip + r_hip) / 2
        
        # 2. 척추선의 각도 계산 (x축 기준)
        # delta_y: y좌표 차이, delta_x: x좌표 차이
        delta_y = shoulder_center[1] - hip_center[1]
        delta_x = shoulder_center[0] - hip_center[0]
        
        # arctan2를 사용하여 -pi ~ +pi 범위의 각도(라디안) 계산
        angle_rad = np.arctan2(delta_y, delta_x)
        # 라디안을 도로 변환 (180/pi)
        angle_deg = np.degrees(angle_rad)
        
        spine_angles.append(angle_deg)

    if not spine_angles:
        return 0

    # 3. 모든 프레임에 걸친 척추 각도의 표준편차 계산
    angle_std_dev = np.std(spine_angles)

    # 4. 점수화 (100점 만점, 각도 변화가 클수록 점수 하락)
    # 가중치(예: 10)는 실험을 통해 조정 가능. 값이 클수록 작은 각도 변화에 더 민감해짐.
    score = max(0, 100 - (angle_std_dev * 10))
    
    return int(score)

# --- 기존 안정성 점수 계산 함수 (V1) ---
# def calculate_stability_score(keypoints_data: List[List[List[List[float]]]]) -> int:
#     """
#     관절 좌표 데이터의 표준편차를 기반으로 안정성 점수를 계산합니다.
#     점수가 높을수록 안정적입니다.
#     """
#     if not keypoints_data:
#         return 0

#     # 몸의 중심을 나타내는 주요 관절 인덱스 (YOLO 17-point model 기준)
#     # 5: l_shoulder, 6: r_shoulder, 11: l_hip, 12: r_hip
#     core_joint_indices = [5, 6, 11, 12]
    
#     all_core_joint_positions = []

#     for frame_keypoints in keypoints_data:
#         if not frame_keypoints: continue
#         # 첫 번째 감지된 객체(강아지)만 사용
#         dog_keypoints = frame_keypoints[0]
        
#         frame_core_positions = []
#         for idx in core_joint_indices:
#             if idx < len(dog_keypoints) and dog_keypoints[idx]:
#                 frame_core_positions.append(dog_keypoints[idx])
        
#         if frame_core_positions:
#             # 프레임 내 핵심 관절들의 평균 위치
#             avg_position_in_frame = np.mean(frame_core_positions, axis=0)
#             all_core_joint_positions.append(avg_position_in_frame)

#     if not all_core_joint_positions:
#         return 0

#     # 모든 프레임에 걸친 평균 위치의 표준편차 계산
#     std_dev = np.std(all_core_joint_positions, axis=0)
    
#     # 흔���림 정도 (x, y 표준편차의 평균)
#     shake_magnitude = np.mean(std_dev)

#     # 점수화 (100점 만점, 흔들림이 클수록 점수 하락)
#     # 가중치는 실험을 통해 조정 가능
#     score = max(0, 100 - (shake_magnitude * 5))
    
#     return int(score)

# --- 실제 분석 및 저장 로직 ---
def analyze_video_in_background(job_id: str, video_path: str, user_id: str, dog_id: str, original_filename: str):
    """백그라운드에서 비디오 분석, 점수 계산, DB 저장을 수행합니다."""
    try:
        jobs[job_id]['status'] = 'processing'
        
        # 1. 비디오 분석
        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            raise Exception("업로드된 비디오 파일을 열 수 없습니다.")
        fps = cap.get(cv2.CAP_PROP_FPS)
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        cap.release()

        results = model.predict(source=video_path, save=False, stream=True, verbose=False)

        keypoints_data = []
        processed_frames = 0
        for r in results:
            if r.keypoints and r.keypoints.xy.numel() > 0:
                keypoints_for_frame = r.keypoints.xy.cpu().numpy().tolist()
                keypoints_data.append(keypoints_for_frame)
            else:
                keypoints_data.append([])
            
            processed_frames += 1
            jobs[job_id]['progress'] = int((processed_frames / total_frames) * 100)

        # 2. 안정성 점수 계산
        stability_score = calculate_stability_score(keypoints_data)

        # 3. 최종 결과 구성
        # 기존 코드 (135-143번째 줄)
        analysis_results_json = {
            "keypoints_data": keypoints_data,
            "fps": fps,
            "stability_score": stability_score
        }
        
        # 수정된 코드 (하위 호환성 유지)
        analysis_results_json = {
            "keypoints_data": keypoints_data,
            "fps": fps,
            "stability_score": stability_score,  # 기존 구조 유지
            "scores": {
                "stability": stability_score
            },
            "metadata": {
                "fps": fps,
                "frame_count": len(keypoints_data)
            }
        }
        
        jobs[job_id]['result'] = analysis_results_json
        
        # 4. Supabase에 저장
        if supabase:
            try:
                # 4-1. 원본 영상을 Supabase Storage에 업로드
                storage_file_path = f"{user_id}/{job_id}_{original_filename}"
                with open(video_path, 'rb') as f:
                    supabase.storage.from_("processed-videos").upload(
                        file=f,
                        path=storage_file_path,
                        file_options={"content-type": "video/mp4"}
                    )
                
                # 4-2. 업로드된 영상의 공개 URL 가져오기
                public_url = supabase.storage.from_("processed-videos").get_public_url(storage_file_path)
                logger.info(f"영상을 Supabase Storage에 업로드했습니다. URL: {public_url}")

                # 4-3. 이 강아지의 첫 분석인지 확인 (is_baseline)
                count_res = supabase.table('joint_analysis_records').select('id', count='exact').eq('dog_id', dog_id).execute()
                is_baseline = count_res.count == 0

                # 4-4. 저장할 데이터 준비 (영구 URL 사용)
                record_to_insert = {
                    "user_id": user_id,
                    "dog_id": dog_id,
                    "is_baseline": is_baseline,
                    "original_video_filename": original_filename,
                    "processed_video_url": public_url, # 임시 URL 대신 영구 URL 사용
                    "analysis_results": analysis_results_json,
                    "notes": f"Stability Score: {stability_score}"
                }
                
                supabase.table('joint_analysis_records').insert(record_to_insert).execute()
                logger.info(f"작업 {job_id}의 분석 결과를 Supabase에 저장했습니다.")

            except Exception as db_error:
                logger.error(f"Supabase 저장 또는 업로드 실패: {db_error}", exc_info=True)
                # 업로드/저장 실패 시에도 작업 상태는 계속 진행될 수 있으므로, 에러를 기록하고 넘어감
                jobs[job_id]['error'] = f"DB/Storage Error: {db_error}"

        jobs[job_id]['status'] = 'completed'
        logger.info(f"작업 {job_id} 완료.")

    except Exception as e:
        logger.error(f"작업 {job_id} 실패: {e}", exc_info=True)
        jobs[job_id]['status'] = 'failed'
        jobs[job_id]['error'] = str(e)
    finally:
        logger.info(f"작업 {job_id}의 백그라운드 처리가 종료되었습니다.")


@app.get("/")
def read_root():
    return {"message": "AI 관절 추적 API 서버 V6 (DB 저장 및 점수화 기능 추가)"}

# --- 헬스 체크 엔드포인트 ---
@app.get("/api/health")
def health_check():
    """서버가 활성 상태인지 확인하기 위한 간단한 엔드포인트."""
    return {"status": "ok", "message": "AI server is ready."}


# --- 1. 작업 생성 엔드포인트 ---
@app.post("/api/jobs")
async def create_analysis_job(
    request: Request,
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    user_id: str = Form(...),
    dog_id: str = Form(...)
):
    job_id = str(uuid.uuid4())
    unique_filename = f"{job_id}_{file.filename}"
    upload_path = os.path.join(UPLOAD_DIR, unique_filename)

    with open(upload_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    scheme = request.headers.get("x-forwarded-proto", "https")
    host = request.headers.get("host", request.url.netloc)
    base_url = f"{scheme}://{host}"
    original_video_url = f"{base_url}/uploads/{unique_filename}"
    
    jobs[job_id] = {
        'status': 'pending',
        'progress': 0,
        'original_video_url': original_video_url,
        'user_id': user_id,
        'dog_id': dog_id
    }

    background_tasks.add_task(analyze_video_in_background, job_id, upload_path, user_id, dog_id, file.filename)

    return JSONResponse(
        status_code=202,
        content={
            "message": "영상 분석 작업이 시작되었습니다.",
            "job_id": job_id,
            "status_url": f"{base_url}/api/jobs/{job_id}"
        }
    )

# --- 2. 작업 상태 확인 엔드포인트 ---
@app.get("/api/jobs/{job_id}")
async def get_job_status(job_id: str):
    job = jobs.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="작업을 찾을 수 없습니다.")

    response_content = {
        "job_id": job_id,
        "status": job['status'],
        "progress": job.get('progress', 0),
        "original_video_url": job['original_video_url']
    }
    
    if job['status'] == 'completed':
        response_content['result'] = job.get('result')
    elif job['status'] == 'failed':
        response_content['error'] = job.get('error')
        
    return JSONResponse(content=response_content)

# if __name__ == "__main__":
#     uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)