# 개발 진행 계획: "가이드 훈련 세션" 도입 (v3) - 최종 완료

**최종 목표:** 사용자가 AI 추천 훈련을 수행할 때, **각 단계별 타이머**를 통해 몰입감과 리듬감을 극대화하고, 좌절감 없는 목표 지향적 경험을 제공한다.

**핵심 철학:** 전체 훈련 시간은 가이드라인으로 유지하되, 훈련의 각 단계를 명확한 시간 제한이 있는 미니 게임처럼 구성한다. 이를 통해 사용자의 집중력을 높이고, 훈련을 더욱 재미있고 효과적으로 만든다.

---

### **완료된 개발 작업 상세 내역**

#### **1단계: AI 프롬프트 및 데이터 구조 변경 (완료)**

- **목표:** AI와 기본 훈련 데이터가 각 훈련 단계마다 개별 소요 시간을 제공하도록 구조를 변경.
- **작업 내용:**
    1.  **타입 정의 수정 (`/src/lib/trainingData.ts`):**
        - `TrainingStep` 인터페이스에 `duration_seconds: number;` 속성을 추가하여 단계별 시간 저장을 위한 기반을 마련함.
    2.  **기본 훈련 데이터 현실화 (`/src/lib/trainingData.ts`):**
        - `trainingPrograms` 객체에 포함된 모든 기본 훈련(`basic`, `toilet`, `walk`, `social`)의 각 단계에 `duration_seconds` 값을 추가하고, 각 훈련 내용에 맞는 현실적인 시간으로 조정함.
    3.  **AI 프롬프트 수정 (`/src/components/AiTrainingRecommender.tsx`):**
        - AI에게 훈련 계획을 요청하는 프롬프트의 `steps` 배열 구조 예시에 `"duration_seconds": 60`과 같은 항목을 추가함. 이를 통해 AI가 응답을 생성할 때 각 단계에 맞는 적절한 소요 시간을 포함하도록 유도함.

---

#### **2단계: `TrainingSteps.tsx` 로직 전면 리팩토링 (완료)**

- **목표:** 단일 전체 타이머 구조에서, 각 훈련 단계에 종속된 개별 타이머 구조로 변경하여 사용자 경험을 혁신.
- **작업 내용:**
    1.  **신규 타이머 컴포넌트 생성 (`/src/components/training-progress/TrainingTimer.tsx`):**
        - 재사용 가능한 타이머 UI 컴포넌트를 생성함. 이 컴포넌트는 `initialDuration`을 받아 시간을 시각적으로 표시하고, 시간 초과 시 UI를 변경하는 역할을 담당함.
    2.  **핵심 로직 리팩토링 (`/src/components/training-progress/TrainingSteps.tsx`):**
        - 컴포넌트의 상태 관리 로직을 수정하여, 더 이상 전체 훈련 시간을 관리하지 않고 **현재 활성화된 단계의 시간(`stepTimeLeft`)**을 관리하도록 변경함.
        - `useEffect`와 `useCallback`을 사용하여, 캐러셀의 `select` 이벤트가 발생할 때마다 현재 단계의 `duration_seconds` 값을 가져와 타이머를 리셋하는 로직을 구현함.
        - `TrainingTimer` 컴포넌트에 `key={currentStep}` 속성을 부여하여, 단계가 변경될 때마다 타이머가 강제로 리마운트(초기화)되도록 하여 명확한 리셋을 보장함.
        - 전체 훈련 시작 시간(`overallStartTime`)은 별도로 기록하여, 단계별 타이머와 무관하게 최종적인 총 소요 시간을 측정하는 기능은 유지함.

---

#### **3단계: 데이터 흐름 및 연동 (완료)**

- **목표:** 변경된 `TrainingSteps` 컴포넌트와 상위 컴포넌트(`TrainingProgressPage`) 간의 데이터 흐름을 원활하게 연결하고, 최종 데이터 저장 구조의 일관성을 유지.
- **작업 내용:**
    1.  **상위 컴포넌트 수정 (`/src/components/TrainingProgressPage.tsx`):**
        - `TrainingSteps`에 `program` 객체 전체를 props로 전달하도록 수정함.
        - `onFinish` 콜백 함수가 `TrainingSteps`로부터 **'전체 실제 소요 시간'**을 초 단위로 받도록 수정함.
        - `handleSave` 함수에서 이 `actualDuration` 값을 분 단위로 변환하여, `useTrainingHistory` 훅을 통해 데이터베이스에 저장하도록 로직을 업데이트함.
    2.  **데이터베이스 구조 일관성 확인:**
        - 단계별 타이머 도입은 순전히 프론트엔드의 사용자 경험 개선을 위한 것으로, 최종적으로 데이터베이스에 저장되는 `training_history` 테이블의 스키마는 **변경할 필요가 없음**을 확인함. 이로써 시스템의 안정성을 확보함.

---

### **최종 결과**

모든 개발 작업이 성공적으로 완료됨. 이제 사용자는 기본 훈련 또는 AI 추천 훈련을 시작하면, 각 훈련 단계마다 내용에 맞게 설정된 개별 타이머와 함께 훈련을 진행하게 됨. 이를 통해 더욱 높은 몰입감과 성취감을 느낄 수 있는 기반이 마련됨.

---

## Feature Update: "AI Training Challenge" Implementation

**Goal:** To provide users with a personalized, long-term training plan based on their dog's actual training history, moving beyond single recommendations.

**Core Concept:** Instead of generic weekly plans, the AI analyzes the user's training history to identify a "Key Growth Target" and generates a focused, multi-phase "challenge" to help the user and their dog achieve that specific goal.

---

### **Phase 1: Ideation & Planning**

- **Initial Request:** User requested a feature for weekly/monthly training plans based on history.
- **Solution Design:**
    - **Plan A (Simple Weekly):** Rejected as too generic.
    - **Plan B (Thematic Weekly):** Considered a good improvement.
    - **Plan C (AI Goal Challenge):** Selected as the final direction. This approach best showcases the AI's analytical capabilities by having it diagnose a key issue from data and create a tailored plan, making it a true "AI Trainer" feature.
- **Technical Strategy:** Decided to use a single, comprehensive API call containing the recent training history to provide the AI with enough context to create a meaningful plan.

---

### **Phase 2: Frontend Implementation**

- **UI Scaffolding:**
    - Created a new button, "AI 훈련 챌린지 시작하기" (Start AI Training Challenge), on the training history page (`TrainingHistoryList.tsx`).
    - Created a new modal component, `AiTrainingPlanModal.tsx`, by adapting the existing `AnalysisDetailModal` for a familiar UX. The new modal was placed in `src/components/training-history/` for code co-location.
- **API Integration:**
    - Implemented a `useMutation` hook within the new modal to handle the API call lifecycle (loading, success, error).
    - Designed a new, detailed prompt for the `gemini-chat` Supabase function. The prompt instructs the AI to act as an expert trainer, analyze the provided history (JSON), identify a key goal, and return a structured 3-phase challenge plan (JSON).

---

### **Phase 3: Debugging & Refinement**

- **Initial Problem:** The "Start Challenge" button opened the modal, but the API call to generate the plan was never triggered.
- **Debugging Process:**
    1.  Added detailed `console.log` statements to `AiTrainingPlanModal.tsx` to trace the component's state and data flow.
    2.  **Log Analysis:** The logs revealed that `useTrainingHistory` hook was returning `trainingHistory: undefined` and `isLoading: false`.
    3.  **Root Cause Identification:** The component was misinterpreting this state. It assumed loading was complete and there was no data, while the real issue was that the `useTrainingHistory` hook hadn't started its fetch yet or was disabled due to a missing `dogId` initially. A type mismatch for `dogId` (`number | null` vs `string | null`) was also identified.
- **Resolution:**
    1.  **Refactored `AiTrainingPlanModal.tsx`:**
        - Corrected the `dogId` prop type to `string | null`.
        - Modified the component to use the `status` field (`'pending'`, `'success'`, `'error'`) from the `useQuery` result within `useTrainingHistory`.
        - This ensures the component can reliably distinguish between "loading", "load succeeded", and "load failed".
    2.  **Improved UX:** Added a specific message for the user when the `status` is `'success'` but the `trainingHistory` array is empty, informing them that at least one training record is needed.

---

### **Final Outcome**

The "AI Training Challenge" feature is now fully implemented and robust. It correctly fetches history, calls the AI with a detailed context, and displays a personalized, multi-step training plan. The debugging process led to more resilient code that gracefully handles edge cases like empty training histories.
