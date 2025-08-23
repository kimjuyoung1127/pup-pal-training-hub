# ✅ 실시간 자세 가이드와 분석 기능 통합 전략 (완료)

이 문서는 `RealtimePostureGuide.tsx`와 `PostureAnalysisPage.tsx`의 기능을 통합하여, 사용자가 실시간 가이드를 받고 15초 영상을 녹화하여 즉시 분석 결과를 받을 수 있도록 하는 전략을 설명합니다.

## ✅ 최종 목표

사용자는 다음과 같은 흐름을 경험합니다:

1.  **카메라 및 AI 로딩 & 서버 깨우기** ("준비하기" 버튼)
2.  **실시간 자세 가이드** (서버가 백그라운드에서 깨어나는 동안 사용자는 자세를 조정)
3.  **15초 녹화 시작** ("녹화하기" 버튼)
4.  **서버 분석 및 결과 표시** (서버는 이미 깨어있으므로 빠른 분석)

## ✅ 개선된 사용자 흐름 (UX)

- [x] **[버튼] "준비하기" 클릭**
  - 사용자는 이 버튼을 누르면 "카메라를 준비하고 AI 서버를 활성화하는 중"이라고 생각합니다.
  - **실제 동작**:
    - [x] 웹캠 켜기
    - [x] MediaPipe 모델 로딩
    - [x] **백그라운드에서 서버 깨우기 시작** (`pollServerHealth` 시작)
    - [x] UI에 "카메라 세팅 중...", "AI 서버 깨우는 중..." 등의 메시지와 함께 **로딩 인디케이터** 표시

- [x] **[상태] "준비 완료"**
  - [x] MediaPipe 로딩 및 서버 깨어짐 확인
  - [x] UI 상태가 "준비 완료"로 변경
  - [x] 버튼이 "녹화 시작"으로 변경
  - [x] 이 시간이 서버 대기 시간이지만, 사용자는 "설정 시간"으로 인식

- [x] **[버튼] "녹화 시작" 클릭**
  - [x] 사용자가 버튼을 누르면 **즉시 녹화가 시작**
  - [x] 15초 후 자동으로 녹화가 중지
  - [x] 녹화된 `Blob`을 `File` 객체로 변환

- [x] **[상태] "분석 중"**
  - [x] 녹화가 완료되면, 녹화된 파일을 서버에 업로드
  - [x] 서버는 이미 깨어난 상태이므로, 바로 분석 작업이 시작
  - [x] 기존의 분석 진행률 폴링 (`pollJobStatus`) 로직을 사용하여 진행 상황 표시

## ✅ 통합 전략 (새로 추가)

### 1. 컴포넌트 재구성

- [x] **`src/pages/tools/RealtimeRecorder.tsx` 생성**
  - `RealtimePostureGuide.tsx`의 핵심 녹화 및 서버 통신 로직을 이 컴포넌트로 이동.
  - 부모 컴포넌트(`PostureAnalysisPage`)로부터 `onRecordingComplete` 콜백을 props로 받음.
  - 녹화 완료 시, 생성된 `File` 객체를 콜백으로 전달.
  - 자체적인 상태(`setupStatus`, `isCameraOn` 등)를 관리.

- [x] **`PostureAnalysisPage.tsx` 수정**
  - 기존 "분석 준비하기" 섹션의 내용을 **대체**.
  - **강아지 선택** UI는 유지.
  - 새로운 **옵션 선택 UI** 추가: "갤러리에서 선택" vs "실시간 녹화".
  - 조건부 렌더링:
    - "갤러리에서 선택": 기존 `<input type="file" ... />` 표시.
    - "실시간 녹화": `<RealtimeRecorder />` 컴포넌트 표시.
  - **책임 한계 조항**은 항상 표시.
  - `handleRecordingComplete` 콜백 함수 정의 및 `RealtimeRecorder`에 전달.
  - 콜백에서 `setFile` 호출 후 `handleAnalyzeClick` 실행.

### 2. 기능 흐름

1.  사용자는 `PostureAnalysisPage`에 접속.
2.  강아지 선택.
3.  "갤러리에서 선택" 또는 "실시간 녹화" 옵션 선택.
4.  선택한 옵션에 따라 파일을 선택하거나 녹화를 진행.
5.  파일이 준비되면 (업로드 선택 시 또는 녹화 완료 시) `handleAnalyzeClick`이 트리거되어 분석 시작.
6.  분석 결과 표시.

### 3. 최종 정리

- [x] **`RealtimePostureGuide.tsx` 삭제**
- [x] **라우팅에서 `/posture-guide-test` 경로 제거**

## ✅ 구현 전략 및 코드 구조 변경

### 1. 상태(State) 추가

- [x] `RealtimePostureGuide.tsx`에 다음 상태 추가:
  ```tsx
  const [setupStatus, setSetupStatus] = useState<'idle' | 'setting_up' | 'ready' | 'recording' | 'processing'>('idle');
  ```

### 2. "준비하기" 버튼 핸들러

- [x] `handlePrepare` 함수 생성 및 버튼에 연결
- [x] 기능:
  - [x] `setSetupStatus('setting_up')`
  - [x] `startWebcam()`
  - [x] `wakeUpServer()` (훅 사용)
  - [x] 성공 시 `setSetupStatus('ready')`

### 3. "녹화 시작" 버튼 핸들러

- [x] `handleStartRecording` 함수 생성 및 버튼에 연결
- [x] 기능:
  - [x] `setSetupStatus('recording')`
  - [x] `startRecording()` (MediaRecorder 로직)

### 4. MediaRecorder 로직

- [x] `startRecording` 함수 정의
- [x] 기능:
  - [x] `MediaRecorder` 인스턴스 생성 (`video/mp4` 우선 시도)
  - [x] `ondataavailable` 이벤트 핸들러
  - [x] `onstop` 이벤트 핸들러:
    - [x] `Blob` 생성
    - [x] `File` 객체로 변환
    - [x] `setSetupStatus('processing')`
    - [x] `submitForAnalysis(recordedFile)` (훅 사용)

### 5. 서버 통신 로직 분리 (훅)

#### 5.1. 훅 생성

- [x] `src/pages/tools/hooks/usePostureAnalysis.ts` 파일 생성
- [x] `usePostureAnalysis` 훅 정의
  - [x] `wakeUpServer`: 서버 깨우기 로직 (`pollServerHealth` 재사용)
  - [x] `submitForAnalysis`: 파일 업로드 및 분석 로직 (`uploadFileAndStartJob`, `pollJobStatus` 재사용)

#### 5.2. 훅 사용

- [x] `RealtimePostureGuide.tsx`에서 훅 import 및 사용
  ```tsx
  import { usePostureAnalysis } from '../hooks/usePostureAnalysis';
  const { wakeUpServer, submitForAnalysis } = usePostureAnalysis();
  ```

## ✅ 파일 형식 및 호환성

- [x] `MediaRecorder` MIME 타입을 `video/mp4`로 우선 시도
- [x] 지원하지 않으면 `video/webm`으로 폴백
- [x] 녹화된 파일은 사용자의 갤러리에 저장되는 형식과 동일

## ✅ 폴더 구조 개선

- [x] `src/pages/tools/hooks/` 폴더 생성
- [x] 분리된 훅 파일들을 해당 폴더에 저장
  - [x] `usePostureAnalysis.ts`
  - [x] (추후 추가 가능한 다른 훅들)