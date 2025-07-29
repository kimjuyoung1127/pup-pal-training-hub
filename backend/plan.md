index-BV9ntO96.js:15358 
 API Error: 
Ye {message: 'Request failed with status code 500', name: 'AxiosError', code: 'ERR_BAD_RESPONSE', config: {…}, request: XMLHttpRequest, …}
code
: 
"ERR_BAD_RESPONSE"
config
: 
{transitional: {…}, adapter: Array(3), transformRequest: Array(1), transformResponse: Array(1), timeout: 0, …}
message
: 
"Request failed with status code 500"
name
: 
"AxiosError"
request
: 
XMLHttpRequest {onreadystatechange: null, readyState: 4, timeout: 0, withCredentials: false, upload: XMLHttpRequestUpload, …}
response
: 
{data: {…}, status: 500, statusText: '', headers: Gr, config: {…}, …}
status
: 
500
stack
: 
"AxiosError: Request failed with status code 500\n    at M9 (https://mungai.co.kr/assets/index-BV9ntO96.js:15350:1083)\n    at XMLHttpRequest.w (https://mungai.co.kr/assets/index-BV9ntO96.js:15350:5734)\n    at Tl.request (https://mungai.co.kr/assets/index-BV9ntO96.js:15352:2067)\n    at async E (https://mungai.co.kr/assets/index-BV9ntO96.js:15358:1262)"
[[Prototype]]
: 
Error  여기까지 콘솔로그 



Logs

build
container



===== Application Startup at 2025-07-29 00:24:35 =====

[2025-07-29 00:26:14 +0000] [1] [INFO] Starting gunicorn 23.0.0
[2025-07-29 00:26:14 +0000] [1] [INFO] Listening at: http://0.0.0.0:7860 (1)
[2025-07-29 00:26:14 +0000] [1] [INFO] Using worker: uvicorn.workers.UvicornWorker
[2025-07-29 00:26:14 +0000] [7] [INFO] Booting worker with pid: 7
WARNING ⚠️ user config directory '/.config/Ultralytics' is not writeable, defaulting to '/tmp' or CWD.Alternatively you can define a YOLO_CONFIG_DIR environment variable for this path.
Creating new Ultralytics Settings v0.0.6 file ✅ 
View Ultralytics Settings with 'yolo settings' or at '/tmp/Ultralytics/settings.json'
Update Settings with 'yolo settings key=value', i.e. 'yolo settings runs_dir=path/to/dir'. For help see https://docs.ultralytics.com/quickstart/#ultralytics-settings.
[2025-07-29 00:26:17 +0000] [7] [INFO] Started server process [7]
[2025-07-29 00:26:17 +0000] [7] [INFO] Waiting for application startup.
[2025-07-29 00:26:17 +0000] [7] [INFO] Application startup complete.
INFO:main:YOLO 결과를 '/code/processed/results'에 저장합니다.
WARNING ⚠️ 
inference results will accumulate in RAM unless `stream=True` is passed, causing potential out-of-memory
errors for large sources or long-running streams and videos. See https://docs.ultralytics.com/modes/predict/ for help.

Example:
    results = model(source=..., stream=True)  # generator of Results objects
    for r in results:
        boxes = r.boxes  # Boxes object for bbox outputs
        masks = r.masks  # Masks object for segment masks outputs
        probs = r.probs  # Class probabilities for classification outputs

Results saved to /code/processed/results
INFO:main:실제 저장 경로: /code/processed/results
INFO:main:YOLO 결과 디렉토리 내용: ['1.avi']
INFO:main:실제 AVI 파일: /code/processed/results/1.avi
[ERROR:0@26.574] global cap_ffmpeg_impl.hpp:3207 open Could not find encoder for codec_id=27, error: Encoder not found
[ERROR:0@26.574] global cap_ffmpeg_impl.hpp:3285 open VIDEOIO/FFMPEG: Failed to initialize VideoWriter
ERROR:main:MP4 파일 생성 실패: /code/processed/results/1.mp4
ERROR:main:MP4 변환 중 오류 발생: MP4 파일 생성 실패
ERROR:main:오류 발생: 비디오 변환 실패: MP4 파일 생성 실패
Traceback (most recent call last):
  File "/code/main.py", line 192, in process_video
    raise Exception("MP4 파일 생성 실패")
Exception: MP4 파일 생성 실패

During handling of the above exception, another exception occurred:

Traceback (most recent call last):
  File "/code/main.py", line 222, in process_video
    raise Exception(f"비디오 변환 실패: {e}")
Exception: 비디오 변환 실패: MP4 파일 생성 실패
INFO:main:YOLO 결과 디렉토리 내용: ['1.avi']
INFO:main:AVI 파일 존재 여부: True
INFO:main:AVI 파일 크기: 78812674 bytes  이건 허깅페이스 로그