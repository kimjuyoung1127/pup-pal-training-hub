# 프로젝트 개요: AI 강아지 자세 분석 시스템 (V2)

## 1. 목표

YOLOv8 모델을 활용하여 사용자가 업로드한 동영상 속 강아지의 관절 움직임을 분석하고, 그 결과를 시각적으로 제공하는 웹 애플리케이션입니다. 이를 통해 반려견의 잠재적인 자세 문제를 조기에 발견하고 지속적으로 추적 관리할 수 있도록 돕는 것을 목표로 합니다.

---

## 2. 아키텍처의 진화: 문제 해결의 여정

이 프로젝트는 안정성과 확장성을 확보하기 위해 여러 번의 중요한 아키텍처 변경 및 개선을 거쳤습니다.

### V1: 초기 접근 - 서버 사이드 렌더링

-   **개념:** 백엔드 서버가 동영상 분석, 스켈레톤 렌더링, 최종 비디오 파일 인코딩까지 모든 것을 처리하고, 프론트엔드는 완성된 비디오를 재생만 하는 방식.
-   **문제점:** 코덱 의존성, 서버 과부하, 치명적인 타임아웃 문제 발생.

### V2: 클라이언트 렌더링 + 비동기 작업 큐

-   **개념:** 서버는 분석(좌표 데이터 추출)에만 집중하고, 프론트엔드가 원본 영상 위에 실시간으로 스켈레톤을 렌더링하는 방식으로 전환하여 V1의 문제를 해결.
-   **문제점:** 분석 결과를 페이지 간에 전달하는 과정(`localStorage`, URL 쿼리 파라미터)에서 데이터 불일치 및 UI 미반영 문제가 발생.

### V4 (현재): 영구 저장을 통한 아키텍처 안정화

-   **개념:** V3의 DB 중심 아키텍처를 유지하면서, 허깅페이스의 가장 큰 약점이었던 **임시 저장소(Ephemeral Storage) 문제를 해결**했습니다. 영상 분석 결과물(처리된 비디오)을 허깅페이스가 아닌, **Supabase의 영구 파일 저장소(Supabase Storage)에 직접 업로드**하도록 백엔드 로직을 변경했습니다.
-   **기대효과 (달성):**
    -   **데이터 영속성 확보:** 허깅페이스 Space가 Sleep 모드로 전환되거나 재시작되어도, Supabase Storage에 저장된 영상 파일은 안전하게 보존됩니다.
    -   **완전한 상태 분리:** 허깅페이스는 이제 순수한 '계산 자원'으로만 기능하며, 데이터 저장 및 상태 관리는 전적으로 Supabase가 담당하게 되어 아키텍처가 더 명확하고 안정적으로 개선되었습니다.

---

## 3. 핵심 기술 스택

-   **백엔드:** FastAPI, YOLOv8, OpenCV-Python, Supabase
-   **프론트엔드:** React, Vite, TypeScript, Tailwind CSS, shadcn/ui (특히 `Dialog` 컴포넌트), React Query, `html-to-image`
-   **배포:** Hugging Face Spaces (백엔드), Vercel / Netlify (프론트엔드)

---

## 4. 현재 상태 및 향후 개발 계획

### 4.1. 현재 상태 (Phase 2 - 상세 뷰 및 공유 기능 구현)

-   **(완료) 아키텍처 피봇 (DB 중심 + 모달):**
    -   분석 결과를 `localStorage`나 URL 파라미터로 전달하는 대신, 항상 DB에서 직접 조회하도록 로직을 변경하여 데이터 정합성 문제를 해결했습니다.
    -   사용자 경험과 개발 효율성을 고려하여, 별도의 상세 페이지 대신 모달(`Dialog`)을 사용하여 분석 결과를 보여주는 방식으로 전환했습니다.

-   **(완료) 상세 정보 모달 컴포넌트 생성:**
    -   **`AnalysisDetailModal.tsx`** 를 `src/pages/history/` 경로에 생성했습니다.
    -   이 모달은 `PostureAnalysisPage`의 영상-캔버스 렌더링 로직을 재활용하여, 특정 분석 기록의 모든 상세 정보(점수, 날짜, 파일명 등)와 함께 스켈레톤이 오버레이된 영상을 완벽하게 재현합니다.

-   **(완료) 최신 분석 카드 UI 개편:**
    -   **`LatestAnalysisResultCard.tsx`** 의 UI를 대폭 수정했습니다.
    -   혼란을 주던 임시 썸네일 이미지를 제거하고, DB에 저장된 모든 주요 데이터를 텍스트 기반으로 명확하게 표시하도록 개선했습니다.
    -   '자세히 보기' 버튼이 모달을 열도록 `onDetailView` 콜백 함수를 props로 받도록 구조를 변경했습니다.

-   **(완료) SNS 공유 기능 구현 및 리팩토링:**
    -   **목표:** 사용자가 분석 결과를 이미지로 저장하고 SNS에 공유할 수 있도록 합니다.
    -   **구현:**
        -   `AnalysisDetailView.tsx`에 분석 결과를 이미지로 변환하고 카카오톡으로 공유하는 기능을 추가했습니다.
        -   공유 관련 로직(`downloadImage`, `shareToKakao`)을 `src/lib/shareUtils.ts` 유틸리티 파일로 분리하여 재사용성을 높였습니다.
        -   공유될 카드 UI를 `src/pages/history/AnalysisResultCard.tsx` 컴포넌트로 분리했습니다.
    -   **오류 수정 및 리팩토링:**
        -   `AnalysisDetailView.tsx`의 JSX 코드가 컴포넌트 `return` 문 외부에 있어 발생하던 스코프 오류 (`showShareCard` is not defined)를 해결했습니다.
        -   모든 핸들러 함수를 컴포넌트 내부로 이동시키고 `useCallback`으로 최적화하여 코드 구조를 개선했습니다.

### 4.2. 향후 개발 계획 (Phase 2 마무리)

1.  **과거 기록 리스트 UI 개편:**
    -   **목표:** `JointAnalysisHistoryList.tsx` 컴포넌트의 UI를 `LatestAnalysisResultCard`와 유사한 디자인으로 개편하여, '자세히 보기'와 '공유하기' 버튼을 포함하도록 수정합니다.

2.  **모달 상태 관리 로직 구현:**
    -   **목표:** `PostureAnalysisHistoryPage.tsx`에 모달의 열림/닫힘 상태와 모달에 표시할 데이터를 관리하는 로직을 추가합니다.
    -   **구현:**
        -   `useState`를 사용하여 모달의 `isOpen` 상태와 `selectedRecord` (사용자가 '자세히 보기'를 클릭한 분석 기록) 상태를 관리합니다.
        -   `onDetailView` 함수를 구현하여, `selectedRecord`를 설정하고 모달을 열도록 합니다.
        -   이 함수를 `LatestAnalysisResultCard`와 `JointAnalysisHistoryList`에 props로 전달하여 연결합니다.

2.  **SNS 공유 카드 생성 기능:**
    -   **목표:** `html-to-image` 라이브러리를 사용하여 사용자가 분석 결과를 이미지로 저장하고 공유할 수 있게 합니다.
    -   **구현:**
        -   공유용 디���인을 담은 `ShareableCard.tsx` 컴포넌트를 생성합니다.
        -   '공유하기' 버튼 클릭 시, 선택된 기록을 `ShareableCard`로 렌더링하고 이미지로 변환하여 다운로드시키는 기능을 구현합니다.


    
프론트엔드 관련파일
* C:\Users\gmdqn\AI\src\pages\tools\PostureAnalysisPage.tsx (자세 분석 실행 페이지)
   * C:\Users\gmdqn\AI\src\pages\history\PostureAnalysisHistoryPage.tsx (과거 기록 조회 페이지)
   * C:\Users\gmdqn\AI\src\pages\history\AnalysisDetailModal.tsx (상세 결과 모달)
   * C:\Users\gmdqn\AI\src\pages\history\LatestAnalysisResultCard.tsx (최신 분석 결과 카드)
   * C:\Users\gmdqn\AI\src\components\posture-analysis-history\JointAnalysisHistoryList.tsx (과거 기록 리스트)
   * C:\Users\gmdqn\AI\src\lib\shareUtils.ts (공유 기능 유틸리티)
   * C:\Users\gmdqn\AI\src\types\analysis.ts (관련 타입 정의)
   * C:\Users\gmdqn\AI\src\hooks\useJointAnalysisHistory.ts (데이터 조회 훅)