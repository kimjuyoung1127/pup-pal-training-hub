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

# --- 실제 분석을 수행하는 함수 ---
def analyze_video_in_background(job_id: str, video_path: str):
    """백그라운드에서 비디오 분석을 수행하고 jobs 딕셔너리를 업데이트합니다."""
    try:
        jobs[job_id]['status'] = 'processing'
        
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
            # 진행률 업데이트
            jobs[job_id]['progress'] = int((processed_frames / total_frames) * 100)

        # 최종 결과 저장
        jobs[job_id]['status'] = 'completed'
        jobs[job_id]['result'] = {
            "keypoints_data": keypoints_data,
            "fps": fps
        }
        logger.info(f"작업 {job_id} 완료.")

    except Exception as e:
        logger.error(f"작업 {job_id} 실패: {e}", exc_info=True)
        jobs[job_id]['status'] = 'failed'
        jobs[job_id]['error'] = str(e)
    finally:
        # 분석이 끝난 원본 비디오 파일 삭제 (선택 사항)
        if os.path.exists(video_path):
            os.remove(video_path)


@app.get("/")
def read_root():
    return {"message": "AI 관절 추적 API 서버 V5 (비동기 작업 아키텍처)"}

# --- 1. 작업 생성 엔드포인트 ---
@app.post("/api/jobs")
async def create_analysis_job(
    request: Request,
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...)
):
    job_id = str(uuid.uuid4())
    unique_filename = f"{job_id}_{file.filename}"
    upload_path = os.path.join(UPLOAD_DIR, unique_filename)

    # 파일 저장
    with open(upload_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # 작업 초기 상태 설정
    scheme = request.headers.get("x-forwarded-proto", "https")
    host = request.headers.get("host", request.url.netloc)
    base_url = f"{scheme}://{host}"
    original_video_url = f"{base_url}/uploads/{unique_filename}"
    
    jobs[job_id] = {
        'status': 'pending',
        'progress': 0,
        'original_video_url': original_video_url
    }

    # 백그라운드에서 실제 분석 작업 시작
    background_tasks.add_task(analyze_video_in_background, job_id, upload_path)

    # 즉시 작업 ID와 상태 확인 URL 반환
    return JSONResponse(
        status_code=202, # 202 Accepted: 요청이 접수되었으며, 처리는 나중에 될 것임
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
