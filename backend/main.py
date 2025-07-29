from fastapi import FastAPI, File, UploadFile, Request, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles # StaticFiles를 사용합니다.
import uvicorn
import os
import shutil
from ultralytics import YOLO
import logging
import uuid # 고유 ID 생성을 위해 추가
import cv2 # FPS 정보를 얻기 위해 필요
from pathlib import Path # 경로 관리를 위해 추가
from supabase import create_client, Client
from dotenv import load_dotenv

# .env 파일 로드
load_dotenv()

# --- Supabase 클라이언트 설정 ---
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

# --- 경로 설정 ---
# 스크립트가 실행되는 위치를 기준으로 경로를 설정하여 환경 독립적으로 만듭니다.
BASE_DIR = Path(__file__).resolve().parent
UPLOAD_DIR = BASE_DIR / "uploads"
MODEL_PATH = BASE_DIR / "models" / "best.pt"

# 폴더 생성
os.makedirs(UPLOAD_DIR, exist_ok=True)

# 'uploads' 디렉토리를 정적 파일로 제공하기 위한 설정
# 클라이언트가 원본 비디오에 접근할 수 있도록 URL 경로를 만들어줍니다.
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")
logger.info(f"✅ 정적 파일 마운트: URL '/uploads' -> 디렉토리 '{UPLOAD_DIR}'")


# YOLO 모델 로드
model = YOLO(MODEL_PATH)

@app.get("/")
def read_root():
    return {"message": "AI 관절 추적 API 서버 V4 (클라이언트 렌더링)에 오신 것을 환영합니다!"}


# 기존 process_video 엔드포인트는 비활성화하거나 삭제할 수 있습니다.
# 여기서는 새로운 엔드포인트를 추가합니다.
@app.post("/api/process-video-client-render")
async def process_video_client_render(
    request: Request,
    file: UploadFile = File(...),
    user_id: str = Form(...),
    dog_id: str = Form(...)
):
    # 1. 업로드된 비디오에 고유 이름 부여���고 저장
    # 파일명 충돌을 방지하고 URL을 예측 가능하게 만듭니다.
    unique_filename = f"{uuid.uuid4()}_{file.filename}"
    upload_path = os.path.join(UPLOAD_DIR, unique_filename)

    try:
        with open(upload_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        logger.info(f"파일 저장 완료: {upload_path}")

        # 2. 비디오의 FPS(초당 프레임 수) 정보 얻기
        cap = cv2.VideoCapture(upload_path)
        if not cap.isOpened():
            logger.error(f"업로드된 비디오 파일을 열 수 없습니다: {upload_path}")
            raise Exception("업로드된 비디오 파일을 열 수 없습니다.")
        fps = cap.get(cv2.CAP_PROP_FPS)
        cap.release()
        logger.info(f"비디오 정보 확인: FPS={fps}")

        # 3. 모델 예측 실행 (★★★★★ 중요: 비디오 저장 옵션 끄기)
        # save=False: 서버에 결과 비디오를 저장하지 않습니다.
        # stream=True: 큰 비디오 파일의 메모리 사용량을 최적화합니다.
        results = model.predict(source=upload_path, save=False, stream=True, verbose=False)
        logger.info("YOLO 모델 예측 실행 완료")

        # 4. 결과에서 관절 좌표 데이터 추출
        keypoints_data = []
        frame_count = 0
        for r in results:
            frame_count += 1
            # r.keypoints가 존재하고, 데이터가 있을 경우에만 처리
            if r.keypoints and r.keypoints.xy.numel() > 0:
                # .cpu().numpy()로 데이터를 파이썬 리스트로 변환
                keypoints_for_frame = r.keypoints.xy.cpu().numpy().tolist()
                keypoints_data.append(keypoints_for_frame)
            else:
                # 키포인트가 없는 프레임은 빈 리스트 추가
                keypoints_data.append([])
        logger.info(f"총 {frame_count} 프레임에서 키포인트 추출 완료")

        # 5. 클라이언트가 접근할 원본 비디오 URL 생성
        base_url = str(request.base_url).rstrip('/')
        original_video_url = f"{base_url}/uploads/{unique_filename}"
        logger.info(f"생성된 원본 비디오 URL: {original_video_url}")

        # 6. DB 저장 로직 (옵션, 여기서는 생략)
        # 필요하다면 여기에 Supabase 저장 로직을 추가할 수 있습니다.
        # 예: supabase.table('analysis_logs').insert({...}).execute()

        # 7. 최종 결과 반환
        return JSONResponse(
            status_code=200,
            content={
                "message": "분석 성공: 클라이언트 렌더링 데이터를 반환합니다.",
                "original_video_url": original_video_url,
                "keypoints_data": keypoints_data, # 모든 프레임의 관절 좌표
                "fps": fps # 비디오 FPS 정보
            }
        )

    except Exception as e:
        logger.error(f"클라이언트 렌더링 처리 중 오류 발생: {e}", exc_info=True)
        # 오류 발생 시 업로드된 파일 삭제
        if os.path.exists(upload_path):
            os.remove(upload_path)
        return JSONResponse(
            status_code=500,
            content={"message": f"서버 내부 오류 발생: {str(e)}"}
        )
    # finally 블록은 더 이상 복잡한 파일 정리가 필요 없으므로 제거합니다.

# 기존 /api/process-video 엔드포인트는 남겨두거나 삭제할 수 있습니다.
# 혼동을 피하기 위해 주석 처리하거나 삭제하는 것을 권장합니다.

# if __name__ == "__main__":
#     uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)