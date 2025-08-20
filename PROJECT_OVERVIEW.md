# Mung-AI: 프로젝트 개요 및 코드베이스 분석

## 1. 프로젝트 비전

"정보 탐색에서 라이프사이클 관리까지, 반려견 양육의 모든 여정을 함께하는 All-in-One Super App"을 목표로 합니다. AI 기술을 통해 사용자에게 최적화된 맞춤 솔루션을 제공하여, 인간과 반려동물의 깊은 교감을 돕습니다.

## 2. 디렉토리 구조

-   **/src**: React 프론트엔드 소스 코드. 컴포넌트, 페이지, 훅, 라이브러리 등이 위치.
-   **/backend**: Python 기반의 AI 모델 서빙 서버. (현재는 자세 분석 YOLOv8 모델 관련)
-   **/supabase**: Supabase BaaS 관련 파일. Edge Functions, 데이터베이스 스키마, 마이그레이션 파일 위치.
-   **/scripts**: 주기적으로 실행되는 외부 데이터 수집 스크립트 (예: 아티클 크롤링).
-   **/public**: 정적 에셋 (이미지, 폰트 등).

## 3. 기능별 코드 분석

### 3.1. 견종 정보 및 추천

견종 정보, MBTI, 맞춤 추천 기능은 모두 Supabase DB의 `breeds` 테이블을 기반으로 작동합니다.

-   **견종백과 (정보 조회)**
    -   **`src/pages/main_features/BreedListPage.tsx`**: 전체 견종 목록을 DB에서 조회하여 그리드 형태로 표시.
    -   **`src/pages/main_features/BreedDetailPage.tsx`**: 특정 견종의 상세 정보(역사, 성격, 특징 등)를 보여주는 페이지.

-   **견종 MBTI (성격 기반 매칭)**
    -   **`src/pages/main_features/MbtiTestPage.tsx`**: 사용자의 라이프스타일 관련 질문을 표시하고 답변을 수집.
    -   **`src/lib/mbtiLogic.ts`**: (가상) 답변을 바탕으로 MBTI 유형을 계산하고, 사전에 정의된 견종별 MBTI 타입과 매칭하는 로직 포함.

-   **견종 추천 (조건 기반 필터링)**
    -   **`src/pages/main_features/FilterWizardPage.tsx`**: 아파트 거주 여부, 훈련 시간 등 현실적인 조건을 질문하는 UI.
    -   **`supabase/functions/breed-recommender/index.ts`**: 사용자의 답변을 받아 가중치 기반의 점수 계산을 수행하는 핵심 Edge Function. 각 견종의 적합도 점수를 계산하여 최적의 견종 리스트를 반환.

### 3.2. AI 코칭 솔루션

-   **AI 훈련 추천 (단기/장기)**
    -   **`src/components/AiTrainingRecommender.tsx`**: 단기 훈련 추천 UI. 사용자의 '훈련 목표'와 강아지 프로필을 조합하여 Gemini API에 전송할 프롬프트를 생성하고, 추천 결과를 표시.
    -   **`src/components/training-history/AiTrainingPlanModal.tsx`**: '14일 챌린지' 기능 UI. 사용자의 전체 훈련 기록을 `useTrainingHistory` 훅으로 가져와, 장기 계획을 요청하는 프롬프트를 생성하여 Gemini API에 전송.
    -   **`src/hooks/useTrainingHistory.ts`**: `training_history` 테이블에 대한 모든 CRUD(생성, 읽기, 수정, 삭제) 로직을 담고 있는 핵심 훅. React Query를 통해 데이터 상태를 관리.

-   **AI Gemini 챗봇**
    -   **`src/components/GeminiChatPage.tsx`**: 채팅 UI를 구성. 강아지 프로필 정보를 요약하여 대화의 초기 컨텍스트를 설정.
    -   **`supabase/functions/gemini-plaintext-chat/index.ts`**: "친절한 강아지 훈련 코치"라는 역할을 Gemini API에 부여(시스템 프롬프트)하고, 사용자의 질문과 대화 기록을 함께 전달하여 맥락에 맞는 답변을 생성하도록 하는 Edge Function.

-   **AI 자세 분석**
    -   **`backend/main.py`**: (추정) 업로드된 영상을 받아 프레임 단위로 분해하고, 자체 훈련된 `best.pt` (YOLOv8) 모델을 통해 17개 주요 관절의 좌표를 추출하는 Python FastAPI 서버.
    -   **`src/pages/posture-analysis/UploadPage.tsx`**: (가상) 사용자가 영상을 업로드하는 페이지.
    -   **`src/pages/posture-analysis/ResultPage.tsx`**: (가상) 백엔드에서 받은 분석 결과(대칭성, 관절 각도 등)를 스켈레톤 영상 및 그래프로 시각화하여 표시.

### 3.3. 콘텐츠 큐레이션

-   **YouTube 훈련 영상**
    -   **`src/hooks/useTrainingVideos.ts`**: YouTube Data API v3를 호출하는 로직. 사용자 언어 설정에 맞춰 '강아지 훈련' 등의 검색어를 생성하고, API 요청을 보내 영상 목록을 받아오는 훅.
    -   **`src/pages/main_features/TrainingVideosPage.tsx`**: `useTrainingVideos` 훅을 사용하여 가져온 영상 목록을 썸네일 그리드 형태로 보여주는 페이지.

-   **외부 아티클 크롤링**
    -   **`scripts/fetch-articles.ts`**: 외부 웹의 유용한 아티클을 수집하는 Node.js 스크립트. 주제별 검색어로 웹을 검색, 페이지 HTML에서 본문을 추출(스크레이핑)하여 Supabase DB에 저장. GitHub Actions 등을 통해 주기적으로 실행.
    -   **`src/pages/articles/ArticleListPage.tsx`**: (가상) DB에 저장된 아티클 목록을 보여주는 페이지.

## 4. 데이터베이스 스키마

-   **`supabase/schema.sql`**: 전체 데이터베이스의 테이블 구조, 관계, 정책(Policy)을 정의하는 가장 중요한 파일.
-   **주요 테이블**:
    -   `dogs`, `dog_profiles`: 사용자 및 반려견 정보.
    -   `breeds`: 모든 견종의 상세 속성을 담은 원천 데이터.
    -   `training_history`: 모든 훈련 활동 기록. `ai_training_details` (JSONB 타입) 컬럼에 AI 추천 내용 저장.
    -   `articles`, `training_tips`: 크롤링을 통해 수집된 콘텐츠 저장.