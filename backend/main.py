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
import cv2  # ✅ 추가!


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

# 정적 파일 서빙 설정
PROCESSED_DIR = "processed"
os.makedirs(PROCESSED_DIR, exist_ok=True)
app.mount(f"/{PROCESSED_DIR}", StaticFiles(directory=PROCESSED_DIR), name="processed-videos")

# YOLO 모델 로드
MODEL_PATH = "best.pt"
model = YOLO(MODEL_PATH)

# 업로드 폴더 생성
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


# --- 2. 핵심 지표 계산 함수 (시뮬레이션) ---
def calculate_metrics_from_keypoints(keypoints):
    """
    YOLO에서 추출된 키포인트 데이터로부터 핵심 지표를 계산합니다.
    (실제 구현에서는 복잡한 계산이 필요하지만, 여기서는 시뮬레이션 값을 반환합니다)
    """
    # 예시: 척추 중심의 흔들림(안정성), 좌우 무릎 각도 비교(대칭성) 등
    # 지금은 임의의 더미 데이터를 생성하여 반환
    stability = round(np.random.uniform(80.0, 95.0), 2)
    symmetry = round(np.random.uniform(85.0, 98.0), 2)
    stride_length = round(np.random.uniform(30.0, 50.0), 2)
    
    logger.info(f"계산된 지표: 안정성={stability}, 대칭성={symmetry}, 보폭={stride_length}")
    
    return {
        "stability": stability,
        "symmetry": symmetry,
        "stride_length": stride_length
    }

@app.get("/")
def read_root():
    return {"message": "AI 관절 추적 API 서버 V2에 오신 것을 환영합니다!"}


# --- 3. API 엔드포인트 수정 ---
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
        logger.info(f"'{upload_path}' 영상 처리를 시작합니다...")
        results = model.predict(
            source=upload_path,
            save=True,
            project=PROCESSED_DIR,
            name="results",
            exist_ok=True
        )
        
        # YOLO 결과물 경로 (대부분 .avi)
        processed_avi_path = os.path.join(results[0].save_dir, file.filename)
        
        # 3. MP4로 변환 (OpenCV 사용)
        logger.info(f"'{processed_avi_path}'를 MP4로 변환 시작...")
        base_filename = os.path.splitext(file.filename)[0]
        final_mp4_filename = f"{base_filename}.mp4"
        final_mp4_path = os.path.join(results[0].save_dir, final_mp4_filename)
    
        # OpenCV로 변환
        cap = cv2.VideoCapture(processed_avi_path)
        # 💡 코덱을 웹 표준인 H.264(avc1)으로 변경
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
        logger.info(f"MP4 변환 완료: '{final_mp4_path}'")

        # 4. 핵심 지표 계산
        analysis_results = calculate_metrics_from_keypoints(results)

        # 5. 완전한 URL로 최종 결과 경로 생성
        base_url = str(request.base_url)
        processed_video_url = f"{base_url}{PROCESSED_DIR}/results/{final_mp4_filename}"
        logger.info(f"영상 처리 완료. 최종 결과 URL: {processed_video_url}")

        # 6. 기준점 확인 및 DB 저장 로직
        try:
            baseline_check = supabase.table('joint_analysis_records').select('id', count='exact').eq('dog_id', dog_id).eq('is_baseline', True).execute()
            is_first_analysis = baseline_check.count == 0
            
            if is_first_analysis:
                logger.info(f"{dog_id}의 첫 분석입니다. 기준점으로 저장합니다.")
            
            db_record = {
                'user_id': user_id,
                'dog_id': dog_id,
                'original_video_filename': file.filename,
                'processed_video_url': processed_video_url,
                'analysis_results': analysis_results,
                'is_baseline': is_first_analysis
            }

            insert_response = supabase.table('joint_analysis_records').insert(db_record).execute()
            logger.info(f"DB 저장 성공. Record: {insert_response.data}")

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


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)