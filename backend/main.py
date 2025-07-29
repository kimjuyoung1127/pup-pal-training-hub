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
from pathlib import Path
from typing import Dict

# --- 기본 설정 ---
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
app = FastAPI()

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
# 경고: 이 방식은 서버 재시작 시 모든 작업 내역이 사라���는 한계가 있습니다.
# 실제 프로덕션에서는 Redis나 DB를 사용하여 작업 상태를 영구적으로 저장해야 합니다.
jobs: Dict[str, Dict] = {}

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
        analysis_results_json = {
            "keypoints_data": keypoints_data,
            "fps": fps,
            "stability_score": stability_score
        }
        
        jobs[job_id]['result'] = analysis_results_json
        
        # 4. Supabase에 저장
        if supabase:
            try:
                # 4-1. 이 강아지의 첫 분석인지 확인 (is_baseline)
                count_res = supabase.table('joint_analysis_records').select('id', count='exact').eq('dog_id', dog_id).execute()
                is_baseline = count_res.count == 0

                # 4-2. 저장할 데이터 준비
                record_to_insert = {
                    "user_id": user_id,
                    "dog_id": dog_id,
                    "is_baseline": is_baseline,
                    "original_video_filename": original_filename,
                    "processed_video_url": jobs[job_id]['original_video_url'],
                    "analysis_results": analysis_results_json,
                    "notes": f"Stability Score: {stability_score}" # 예시 노트
                }
                
                supabase.table('joint_analysis_records').insert(record_to_insert).execute()
                logger.info(f"작업 {job_id}의 ���석 결과를 Supabase에 저장했습니다.")

            except Exception as db_error:
                logger.error(f"Supabase 저장 실패: {db_error}", exc_info=True)
                # DB 저장이 실패해도 작업 자체는 성공으로 간주할 수 있음
                # 또는 jobs[job_id]['status'] = 'db_failed' 와 같이 별도 상태 관리 가능

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
