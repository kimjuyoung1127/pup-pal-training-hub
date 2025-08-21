# MediaPipe 자세 추정 기능 도입 계획

## 1. 목표

기존의 동영상 업로드 기반 자세 분석 기능(`PostureAnalysisPage.tsx`)을 개선하기에 앞서, **별도의 실험용 페이지**에서 **MediaPipe를 이용한 실시간 자세 추정 기능**의 기술적 타당성을 검증하고 프로토타입을 개발한다. 이 검증이 완료되면, 핵심 로직을 기존 기능에 통합하거나 고도화한다.

## 2. 개발 단계

### 1단계: 실험용 페이지 및 라우팅 설정

1.  **새 페이지 컴포넌트 생성:**
    *   `src/pages/tools/` 디렉토리에 `RealtimePostureGuide.tsx` 라는 이름의 새 파일을 생성한다.
    *   이 파일은 실시간 카메라 피드와 MediaPipe 분석 결과를 렌더링하는 역할을 담당한다.

2.  **라우팅 추가:**
    *   메인 라우터 파일(예: `App.tsx` 또는 `src/App.tsx` 내의 라우팅 설정)에 새로운 경로를 추가한다.
    *   `/app/tools/realtime-posture-guide` 경로로 접속했을 때 `RealtimePostureGuide.tsx` 컴포넌트가 렌더링되도록 설정한다.
    *   개발 중 쉽게 접근할 수 있도록, 임시로 네비게이션 메뉴에 링크를 추가할 수 있다.

### 2단계: 실시간 카메라 및 MediaPipe 연동

1.  **필요 라이브러리 설치:**
    *   MediaPipe의 Pose 솔루션을 사용하기 위한 패키지를 설치한다.
        ```bash
        npm install @mediapipe/pose @mediapipe/camera_utils @mediapipe/drawing_utils
        ```

2.  **카메라 연동 구현 (`RealtimePostureGuide.tsx`):**
    *   `useRef`를 사용하여 `<video>` 엘리먼트와 `<canvas>` 엘리먼트에 대한 참조를 생성한다.
    *   `useEffect` 훅을 사용하여 컴포넌트가 마운트될 때 사용자의 카메라에 접근 (`navigator.mediaDevices.getUserMedia`) 하고, 비디오 스트림을 `<video>` 엘리먼트에 연결한다.

3.  **MediaPipe Pose 초기화 및 실행:**
    *   `@mediapipe/pose`에서 `Pose` 객체를 초기화한다. 모델 복잡도, 신뢰도 임계값 등 필요한 옵션을 설정한다.
    *   `@mediapipe/camera_utils`의 `Camera` 유틸리티를 사용하여 `<video>` 엘리먼트를 MediaPipe `Pose` 인스턴스에 연결한다.
    *   `pose.onResults()` 콜백 함수를 정의한다. 이 함수는 MediaPipe가 매 프레임 분석을 완료할 때마다 호출된다.

### 3단계: 분석 결과 시각화 및 피드백 구현

1.  **결과 시각화 (`onResults` 콜백 내부):**
    *   `@mediapipe/drawing_utils`를 사용하여 `<canvas>` 위에 분석 결과를 그린다.
    *   `drawConnectors` 함수로 감지된 관절들을 연결하여 스켈레톤을 그린다.
    *   `drawLandmarks` 함수로 감지된 주요 관절 포인트를 그린다.

2.  **실시간 피드백 로직 구현:**
    *   `onResults` 콜백에서 반환되는 `poseLandmarks` (주요 관절 좌표) 데이터를 분석한다.
    *   **화면 내 객체 크기/위치 판단:**
        *   강아지의 스켈레톤이 차지하는 영역을 계산하여 "더 가까이 오세요" 또는 "너무 가깝습니다" 와 같은 피드백을 화면에 텍스트로 표시한다.
        *   스켈레톤이 화면 중앙에 위치하도록 "왼쪽으로 이동하세요" 와 같은 가이드를 제공한다.
    *   **자세 판단 (예: 옆모습):**
        *   왼쪽 어깨/엉덩이와 오른쪽 어깨/엉덩이의 x좌표를 비교하여 강아지가 옆을 보고 있는지 대략적으로 판단하고, "옆모습을 보여주세요" 와 같은 안내를 표시한다.
    *   모든 조건이 충족되면 "자세가 좋습니다! 이대로 촬영을 진행하세요." 와 같은 긍정적 피드백을 표시한다.

## 3. 검증 및 향후 계획

*   **검증:** 위 3단계가 완료되면, `RealtimePostureGuide.tsx` 페이지가 스마트폰 및 데스크탑 브라우저에서 의도대로 작동하는지 확인한다. (성능, 정확도, 사용자 경험)
*   **향후 계획:**
    *   프로토타입이 성공적으로 검증되면, 이 페이지에서 구현된 핵심 로직(`MediaPipe` 연동, 결과 분석 및 피드백)을 기존 `PostureAnalysisPage.tsx`에 통합하는 작업을 계획한다.
    *   통합 시에는, 동영상 업로드 방식과 실시간 분석 방식을 사용자가 선택할 수 있도록 UI를 개선하거나, 업로드 전에 실시간 가이드를 먼저 보여주는 흐름으로 UX를 개선할 수 있다.
