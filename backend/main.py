from fastapi import FastAPI, File, UploadFile, Request, Form
from fastapi.responses import JSONResponse, FileResponse
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
from urllib.parse import urljoin
from pathlib import Path

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

# 기존 정적 파일 마운트 제거 (또는 주석 처리)
# app.mount(STATIC_ROUTE, StaticFiles(directory=PROCESSED_DIR), name="processed-videos")
# logger.info(f"✅ 정적 파일 마운트: URL '{STATIC_ROUTE}' -> 디렉토리 '{PROCESSED_DIR}'")

# YOLO 모델 로드
model = YOLO(MODEL_PATH)

# 직접 파일 서빙 엔드포인트 추가
@app.get("/video/{filename}")
async def serve_video(filename: str):
    """직접 비디오 파일 서빙"""
    try:
        # 파일명 검증 (보안을 위해)
        if not filename.endswith('.mp4'):
            return JSONResponse(status_code=400, content={"message": "Invalid file format"})
        
        # 디렉토리 탈출 공격 방지
        safe_filename = os.path.basename(filename)
        
        # 파일 경로 구성
        file_path = os.path.join(PROCESSED_DIR, "results", safe_filename)
        
        # 파일 존재 여부 확인
        if not os.path.exists(file_path):
            logger.error(f"파일을 찾을 수 없습니다: {file_path}")
            return JSONResponse(status_code=404, content={"message": "File not found"})
        
        logger.info(f"비디오 파일 서빙: {file_path}")
        
        # FileResponse로 파일 반환
        return FileResponse(
            path=file_path,
            media_type="video/mp4",
            filename=safe_filename
        )
        
    except Exception as e:
        logger.error(f"파일 서빙 오류: {e}")
        return JSONResponse(status_code=500, content={"message": "Internal server error"})

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
        
        # 수정된 코드만 사용
        results = model.predict(
            source=upload_path,
            save=True,
            project=PROCESSED_DIR,  # /code/processed
            name="results",  # results 폴더에 직접 저장
            exist_ok=True,
            verbose=False  # 로그 출력 줄이기
        )
        
        # 실제 저장된 폴더 경로 확인
        actual_save_dir = results[0].save_dir
        logger.info(f"실제 저장 경로: {actual_save_dir}")
        
        # 디렉토리 내용 확인 및 실제 파일 찾기
        if os.path.exists(actual_save_dir):
            dir_contents = os.listdir(actual_save_dir)
            logger.info(f"YOLO 결과 디렉토리 내용: {dir_contents}")
            
            # 실제 생성된 파일 찾기
            avi_files = [f for f in dir_contents if f.endswith('.avi')]
            if avi_files:
                actual_avi_filename = avi_files[0]
                processed_avi_path = os.path.join(actual_save_dir, actual_avi_filename)
                logger.info(f"실제 AVI 파일: {processed_avi_path}")
            else:
                logger.error(f"AVI 파일을 찾을 수 없습니다. 디렉토리 내용: {dir_contents}")
                raise Exception("YOLO 처리 결과 파일이 생성되지 않았습니다")
        else:
            logger.error(f"결과 디렉토리가 존재하지 않습니다: {actual_save_dir}")
            raise Exception("YOLO 결과 디렉토리가 생성되지 않았습니다")
        
        # 3. MP4로 변환 (오류 처리 강화)
        base_filename = os.path.splitext(actual_avi_filename)[0]  # 실제 파일명 사용
        final_mp4_filename = f"{base_filename}.mp4"
        final_mp4_path = os.path.join(actual_save_dir, final_mp4_filename)
        
        try:
            # 원본 AVI 파일 존재 확인
            if not os.path.exists(processed_avi_path):
                logger.error(f"YOLO 처리된 AVI 파일을 찾을 수 없습니다: {processed_avi_path}")
                raise Exception("YOLO 처리 파일이 생성되지 않았습니다")
            
            cap = cv2.VideoCapture(processed_avi_path)
            if not cap.isOpened():
                logger.error(f"비디오 파일을 열 수 없습니다: {processed_avi_path}")
                raise Exception("비디오 파일 읽기 실패")
                
            fourcc = cv2.VideoWriter_fourcc(*'avc1') 
            fps = cap.get(cv2.CAP_PROP_FPS)
            width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
            height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        
            out = cv2.VideoWriter(final_mp4_path, fourcc, fps, (width, height))
            if not out.isOpened():
                logger.error(f"MP4 파일 생성 실패: {final_mp4_path}")
                cap.release()
                raise Exception("MP4 파일 생성 실패")
        
            frame_count = 0
            while True:
                ret, frame = cap.read()
                if not ret:
                    break
                out.write(frame)
                frame_count += 1
        
            cap.release()
            out.release()
            
            # MP4 파일 생성 확인
            if not os.path.exists(final_mp4_path):
                logger.error(f"MP4 파일이 생성되지 않았습니다: {final_mp4_path}")
                raise Exception("MP4 변환 실패")
                
            file_size = os.path.getsize(final_mp4_path)
            if file_size == 0:
                logger.error(f"MP4 파일이 비어있습니다: {final_mp4_path}")
                raise Exception("MP4 파일이 비어있음")
                
            logger.info(f"MP4 변환 성공: {final_mp4_path} (크기: {file_size} bytes, 프레임: {frame_count})")
            
        except Exception as e:
            logger.error(f"MP4 변환 중 오류 발생: {e}")
            # 임시 파일 정리 (upload_path 사용)
            if upload_path and os.path.exists(upload_path):
                os.remove(upload_path)
            raise Exception(f"비디오 변환 실패: {e}")

        # 4. 핵심 지표 계산
        analysis_results = calculate_metrics_from_keypoints(results)

        # 5. 완전한 URL 생성 (직접 파일 서빙 방식으로 수정)
        base_url = str(request.base_url).rstrip('/')
        
        # 직접 파일 서빙 엔드포인트 사용
        processed_video_url = f"{base_url}/video/{final_mp4_filename}"
        
        logger.info(f"영상 처리 완료. 최종 결과 URL: {processed_video_url}")
        logger.info(f"파일 실제 경로: {final_mp4_path}")
        logger.info(f"파일명: {final_mp4_filename}")
        
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
        # 디버깅 정보 추가
        logger.info(f"YOLO 결과 디렉토리 내용: {os.listdir(actual_save_dir) if os.path.exists(actual_save_dir) else '디렉토리 없음'}")
        logger.info(f"AVI 파일 존재 여부: {os.path.exists(processed_avi_path)}")
        if os.path.exists(processed_avi_path):
            logger.info(f"AVI 파일 크기: {os.path.getsize(processed_avi_path)} bytes")
        if upload_path and os.path.exists(upload_path):
            os.remove(upload_path)
        if processed_avi_path and os.path.exists(processed_avi_path):
            os.remove(processed_avi_path)

# if __name__ == "__main__":
#     uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
