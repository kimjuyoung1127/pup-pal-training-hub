# 실시간 자세 가이드와 분석 기능 통합 전략

이 문서는 `RealtimePostureGuide.tsx`와 `PostureAnalysisPage.tsx`의 기능을 통합하여, 사용자가 실시간 가이드를 받고 15초 영상을 녹화하여 즉시 분석 결과를 받을 수 있도록 하는 전략을 설명합니다.

## ✅ 최종 목표

사용자는 다음과 같은 흐름을 경험합니다:

1.  **카메라 및 AI 로딩 & 서버 깨우기** ("준비하기" 버튼)
2.  **실시간 자세 가이드** (서버가 백그라운드에서 깨어나는 동안 사용자는 자세를 조정)
3.  **15초 녹화 시작** ("녹화하기" 버튼)
4.  **서버 분석 및 결과 표시** (서버는 이미 깨어있으므로 빠른 분석)

## ✅ 개선된 사용자 흐름 (UX)

- [ ] **[버튼] "준비하기" 클릭**
  - 사용자는 이 버튼을 누르면 "카메라를 준비하고 AI 서버를 활성화하는 중"이라고 생각합니다.
  - **실제 동작**:
    - [ ] 웹캠 켜기
    - [ ] MediaPipe 모델 로딩
    - [ ] **백그라운드에서 서버 깨우기 시작** (`pollServerHealth` 시작)
    - [ ] UI에 "카메라 세팅 중...", "AI 서버 깨우는 중..." 등의 메시지와 함께 **로딩 인디케이터** 표시

- [ ] **[상태] "준비 완료"**
  - [ ] MediaPipe 로딩 및 서버 깨어짐 확인
  - [ ] UI 상태가 "준비 완료"로 변경
  - [ ] 버튼이 "녹화 시작"으로 변경
  - [ ] 이 시간이 서버 대기 시간이지만, 사용자는 "설정 시간"으로 인식

- [ ] **[버튼] "녹화 시작" 클릭**
  - [ ] 사용자가 버튼을 누르면 **즉시 녹화가 시작**
  - [ ] 15초 후 자동으로 녹화가 중지
  - [ ] 녹화된 `Blob`을 `File` 객체로 변환

- [ ] **[상태] "분석 중"**
  - [ ] 녹화가 완료되면, 녹화된 파일을 서버에 업로드
  - [ ] 서버는 이미 깨어난 상태이므로, 바로 분석 작업이 시작
  - [ ] 기존의 분석 진행률 폴링 (`pollJobStatus`) 로직을 사용하여 진행 상황 표시

## 🛠️ 구현 전략 및 코드 구조 변경

### 1. 상태(State) 추가

- [ ] `RealtimePostureGuide.tsx`에 다음 상태 추가:
  ```tsx
  const [setupStatus, setSetupStatus] = useState<'idle' | 'setting_up' | 'ready' | 'recording' | 'processing'>('idle');
  ```

### 2. "준비하기" 버튼 핸들러

- [ ] `handlePrepare` 함수 생성 및 버튼에 연결
- [ ] 기능:
  - [ ] `setSetupStatus('setting_up')`
  - [ ] `startWebcam()`
  - [ ] `wakeUpServer()` (훅 사용)
  - [ ] 성공 시 `setSetupStatus('ready')`

### 3. "녹화 시작" 버튼 핸들러

- [ ] `handleStartRecording` 함수 생성 및 버튼에 연결
- [ ] 기능:
  - [ ] `setSetupStatus('recording')`
  - [ ] `startRecording()` (MediaRecorder 로직)

### 4. MediaRecorder 로직

- [ ] `startRecording` 함수 정의
- [ ] 기능:
  - [ ] `MediaRecorder` 인스턴스 생성 (`video/mp4` 우선 시도)
  - [ ] `ondataavailable` 이벤트 핸들러
  - [ ] `onstop` 이벤트 핸들러:
    - [ ] `Blob` 생성
    - [ ] `File` 객체로 변환
    - [ ] `setSetupStatus('processing')`
    - [ ] `submitForAnalysis(recordedFile)` (훅 사용)

### 5. 서버 통신 로직 분리 (훅)

#### 5.1. 훅 생성

- [ ] `src/pages/tools/hooks/usePostureAnalysis.ts` 파일 생성
- [ ] `usePostureAnalysis` 훅 정의
  - [ ] `wakeUpServer`: 서버 깨우기 로직 (`pollServerHealth` 재사용)
  - [ ] `submitForAnalysis`: 파일 업로드 및 분석 로직 (`uploadFileAndStartJob`, `pollJobStatus` 재사용)

#### 5.2. 훅 사용

- [ ] `RealtimePostureGuide.tsx`에서 훅 import 및 사용
  ```tsx
  import { usePostureAnalysis } from '../hooks/usePostureAnalysis';
  const { wakeUpServer, submitForAnalysis } = usePostureAnalysis();
  ```

## ✅ 파일 형식 및 호환성

- [ ] `MediaRecorder` MIME 타입을 `video/mp4`로 우선 시도
- [ ] 지원하지 않으면 `video/webm`으로 폴백
- [ ] 녹화된 파일은 사용자의 갤러리에 저장되는 형식과 동일

## ✅ 폴더 구조 개선

- [ ] `src/pages/tools/hooks/` 폴더 생성
- [ ] 분리된 훅 파일들을 해당 폴더에 저장
  - [ ] `usePostureAnalysis.ts`
  - [ ] (추후 추가 가능한 다른 훅들)
