# AI 자세 추적 기능 배포 기록

## Phase 1: 로컬 백엔드 프로젝트 준비 (완료)

Hugging Face Spaces 배포를 위해 로컬 백엔드 프로젝트의 구조를 정리하고 필요한 설정 파일들을 준비했습니다.

- **1단계: 폴더 구조 정리 (완료)**
  - `C:\Users\gmdqn\AI\backend\models` 폴더를 생성했습니다.
  - AI 모델 파일인 `best.pt`를 `backend\models` 폴더로 이동하여 코드가 아닌 모델 자산을 분리했습니다.

- **2단계: `requirements.txt` 파일 생성 (완료)**
  - 기존 `requirements.txt` 파일을 확인하고, `moviepy`를 `opencv-python-headless`로 교체했습니다.
  - 프로덕션 서버 환경을 위해 `gunicorn`을 추가하여 최종 라이브러리 의존성을 확정했습니다.

- **3단계: `app.py` 코드 수정 (완료)**
  - `main.py` (FastAPI 앱) 파일을 확인했습니다.
  - 로컬 테스트용 `uvicorn.run(...)` 실행 코드를 주석 처리하여, 외부 서버 환경(Gunicorn)에서 앱을 실행할 수 있도록 수정했습니다.
