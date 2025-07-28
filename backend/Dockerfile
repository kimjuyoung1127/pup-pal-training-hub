# Python 3.9 버전을 기반으로 환경을 구성합니다.
FROM python:3.9

# OpenCV 및 비디오 처리에 필요한 시스템 라이브러리를 설치합니다.
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    ffmpeg \
    libx264-dev

# 작업 디렉토리를 /code 로 설정합니다.
WORKDIR /code

# requirements.txt 파일을 먼저 복사하여 라이브러리를 설치합니다.
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade -r requirements.txt

# 나머지 모든 파일들을 /code 디렉토리로 복사합니다.
COPY . .

# 
RUN mkdir -p /code/processed /code/uploads && \
    chmod -R 777 /code/processed /code/uploads

# Hugging Face Spaces는 기본적으로 7860 포트를 외부에 노출합니다.
EXPOSE 7860

# 서버를 실행하는 명령어입니다.
CMD ["gunicorn", "-w", "1", "-k", "uvicorn.workers.UvicornWorker", "main:app", "--bind", "0.0.0.0:7860"]
