## 실시간 분석을 위한 웹 모델 변환 전략

### 1. 목표 (Goal)
서버 비용 없이, 브라우저 환경에서 강아지 특화 모델(`best.pt`)을 실행하여 정확하고 빠른 실시간 자세 분석 기능 구현.

### 2. 핵심 전략 (Core Strategy)
PyTorch 기반의 `best.pt` 모델을 웹 친화적인 **ONNX** 형식으로 변환합니다. 이후 React 프론트엔드에서 변환된 모델을 직접 로드하여 추론을 수행합니다.

### 3. 실행 단계 (Execution Steps)

#### 3.1. 모델 변환 (Export)
`yolo export model=best.pt format=onnx` 명령어를 사용하여 `best.onnx` 모델을 생성합니다.

#### 3.2. 프론트엔드 구현 (Implementation)
*   `onnxruntime-web` 라이브러리를 설치합니다.
*   `RealtimePostureGuide.tsx` 파일에서 `best.onnx`을 로드합니다.
*   **전처리 (Preprocessing):** 웹캠에서 받은 비디오 프레임을 모델이 요구하는 입력 형식(예: 640x640 크기, 정규화된 텐서)으로 변환하는 로직을 직접 구현합니다.
*   **추론 (Inference):** 로드된 모델의 `session.run()` 메서드를 호출하여 모델 추론을 수행합니다.
*   **후처리 (Postprocessing):** 모델의 복잡한 출력 텐서(Tensor)를 파싱하여, 의미 있는 관절 좌표(x, y)와 신뢰도 점수를 추출하는 로직을 직접 구현합니다.

### 4. 기대 효과 (Expected Benefits)
*   **비용:** 서버 추론 비용 제로.
*   **성능:** 네트워크 지연 없는 실시간 반응 속도.
*   **정확도:** 강아지에게 특화된 모델 사용으로 높은 신뢰도 확보.

---

## ONNX 모델 기반 실시간 자세 추정 리팩토링 계획

### 1단계: ONNX Runtime Web 라이브러리 도입
- [x] `@mediapipe/tasks-vision` 라이브러리 제거
- [x] `onnxruntime-web` 라이브러리 설치
- [x] `best.onnx` 모델을 프론트엔드 `public` 폴더에 복사
- [x] `RealtimePostureGuide.tsx`에서 `ort.InferenceSession.create()`를 사용하여 ONNX 모델 로드

### 2단계: 추론 루프 수정
- [x] `predictWebcam` 함수 내 전처리 로직 구현 (이미지 캡처, 텐서 변환, 리사이즈 및 정규화)
- [x] `session.run()`을 호출하여 ONNX 모델 추론 실행
- [x] 후처리 로직 구현 (ONNX 출력 텐서를 파싱하여 키포인트 및 신뢰도 점수 추출)

### 3단계: 렌더링 및 피드백 로직 업데이트
- [x] MediaPipe의 `DrawingUtils`를 대체할 자체 캔버스 드로잉 함수 구현 (키포인트 및 연결선)
- [x] `updateFeedback` 함수를 새로운 ONNX 키포인트 데이터 구조에 맞게 수정

### 5. 오류 해결 및 안정화 계획 (Error Resolution & Stabilization Plan)
- [x] **WASM 파일 경로 수정:** `onnxruntime-web`의 `.wasm` 파일들을 `node_modules`에서 `public` 폴더로 복사하여 브라우저가 정상적으로 로드할 수 있도록 경로를 수정합니다.
- [ ] **MediaPipe 잔여 코드 제거:** `RealtimePostureGuide.tsx`에서 더 이상 사용되지 않는 `@mediapipe/tasks-vision` 관련 코드를 완전히 제거하여 잠재적인 충돌을 방지합니다.
- [x] **`best.onnx` 모델 위치 확인:** `best.onnx` 모델이 `public` 폴더에 올바르게 위치해 있는지 확인하고, 없다면 이동시킵니다.
- [ ] **최종 확인:** 개발 서버를 재시작하여 모든 오류가 해결되었는지 확인합니다.