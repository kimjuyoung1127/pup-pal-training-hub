from fastapi import FastAPI, File, UploadFile, Request, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uvicorn
import os
import shutil
from ultralytics import YOLO
import logging
import numpy as np
from supabase import create_client, Client
from dotenv import load_dotenv
from postgrest.exceptions import APIError
import cv2
from urllib.parse import urljoin  # 이것도 상단으로 이동

# .env 파일 로드
load_dotenv()

# --- 1. Supabase 클라이언트 설정 ---
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Supabase URL 또는 Service Key가 .env 파일에 설정되지 않았습니다.")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# FastAPI 앱 생성
app = FastAPI()

# CORS 미들웨어 추가
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 경로 설정 (단순화 및 명시적) ---
# Docker 컨테이너 내부의 절대 경로
BASE_DIR = "/code"
PROCESSED_DIR = os.path.join(BASE_DIR, "processed")
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
MODEL_PATH = os.path.join(BASE_DIR, "models", "best.pt")

# URL로 노출될 경로 이름
STATIC_ROUTE = "/processed"

# 폴더 생성
os.makedirs(PROCESSED_DIR, exist_ok=True)
os.makedirs(UPLOAD_DIR, exist_ok=True)

# 정적 파일 서빙: URL 경로를 실제 파일 시스템 경로에 매핑
app.mount(STATIC_ROUTE, StaticFiles(directory=PROCESSED_DIR), name="processed-videos")
logger.info(f"✅ 정적 파일 마운트: URL '{STATIC_ROUTE}' -> 디렉토리 '{PROCESSED_DIR}'")

# YOLO 모델 로드
model = YOLO(MODEL_PATH)

# --- 2. 핵심 지표 계산 함수 (시뮬레이션) ---
def calculate_metrics_from_keypoints(keypoints):
    stability = round(np.random.uniform(80.0, 95.0), 2)
    symmetry = round(np.random.uniform(85.0, 98.0), 2)
    stride_length = round(np.random.uniform(30.0, 50.0), 2)
    return {
        "stability": stability,
        "symmetry": symmetry,
        "stride_length": stride_length
    }

@app.get("/")
def read_root():
    return {"message": "AI 관절 추적 API 서버 V3에 오신 것을 환영합니다!"}

@app.post("/api/process-video")
async def process_video(
    request: Request,
    file: UploadFile = File(...),
    user_id: str = Form(...),
    dog_id: str = Form(...)
):
    upload_path = ""
    processed_avi_path = ""
    final_mp4_path = ""
    try:
        # 1. 업로드 파일 저장
        upload_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(upload_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # 2. 모델 예측 실행
        yolo_save_dir = os.path.join(PROCESSED_DIR, "results")
        logger.info(f"YOLO 결과를 '{yolo_save_dir}'에 저장합니다.")
        
        results = model.predict(
            source=upload_path,
            save=True,
            project=yolo_save_dir,
            name="video",
            exist_ok=True
        )
        
        # 실제 저장된 폴더 경로 확인
        actual_save_dir = results[0].save_dir
        logger.info(f"실제 저장 경로: {actual_save_dir}")
        
        # YOLO가 생성한 파일 경로 (video 폴더 안에 있음)
        processed_avi_path = os.path.join(actual_save_dir, file.filename)
        
        # 3. MP4로 변환
        base_filename = os.path.splitext(file.filename)[0]
        final_mp4_filename = f"{base_filename}.mp4"
        final_mp4_path = os.path.join(actual_save_dir, final_mp4_filename)
    
        cap = cv2.VideoCapture(processed_avi_path)
        fourcc = cv2.VideoWriter_fourcc(*'avc1') 
        fps = cap.get(cv2.CAP_PROP_FPS)
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    
        out = cv2.VideoWriter(final_mp4_path, fourcc, fps, (width, height))
    
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            out.write(frame)
    
        cap.release()
        out.release()

        # 4. 핵심 지표 계산
        analysis_results = calculate_metrics_from_keypoints(results)

        # 5. 완전한 URL 생성 (수정된 버전)
        base_url = str(request.base_url).rstrip('/')
        # PROCESSED_DIR 기준으로 상대 경로 계산
        relative_path = os.path.relpath(final_mp4_path, PROCESSED_DIR)
        # Windows 경로(\)를 URL 경로(/)로 변경
        relative_path_for_url = relative_path.replace(os.path.sep, '/')
        
        # 올바른 URL 조합
        processed_video_url = f"{base_url}{STATIC_ROUTE}/{relative_path_for_url}"
        
        logger.info(f"영상 처리 완료. 최종 결과 URL: {processed_video_url}")
        logger.info(f"파일 실제 경로: {final_mp4_path}")
        logger.info(f"상대 경로: {relative_path_for_url}")
        
        # 6. DB 저장 로직
        try:
            baseline_check = supabase.table('joint_analysis_records').select('id', count='exact').eq('dog_id', dog_id).eq('is_baseline', True).execute()
            is_first_analysis = baseline_check.count == 0
            
            db_record = {
                'user_id': user_id,
                'dog_id': dog_id,
                'original_video_filename': file.filename,
                'processed_video_url': processed_video_url,
                'analysis_results': analysis_results,
                'is_baseline': is_first_analysis
            }
            supabase.table('joint_analysis_records').insert(db_record).execute()

        except APIError as db_error:
            logger.error(f"DB 저장 실패: {db_error.message}")
            raise Exception(f"DB 저장 실패: {db_error.message}")

        # 7. 응답 반환
        return JSONResponse(
            status_code=200,
            content={
                "message": "영상 처리 및 DB 저장 성공", 
                "processed_video_url": processed_video_url,
                "analysis_results": analysis_results,
                "is_baseline": is_first_analysis
            }
        )

    except Exception as e:
        logger.error(f"오류 발생: {e}", exc_info=True)
        return JSONResponse(
            status_code=500,
            content={"message": f"서버 내부 오류 발생: {str(e)}"}
        )
    finally:
        # 임시 파일들 정리
        if upload_path and os.path.exists(upload_path):
            os.remove(upload_path)
        if processed_avi_path and os.path.exists(processed_avi_path):
            os.remove(processed_avi_path)

# if __name__ == "__main__":
#     uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)