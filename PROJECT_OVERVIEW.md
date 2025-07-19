# 🤖 AI 프로젝트 개요 (mungai.co.kr)

이 문서는 `C:\Users\gmdqn\AI` 프로젝트의 기술 스택, 구조, 핵심 기능 및 설정에 대한 개요를 제공합니다.
이 프로젝트는 Vite 기반의 React 애플리케이션으로, 강아지 관련 정보 제공, AI 훈련 추천, 커뮤니티 기능을 중심으로 구축되었습니다.

## 1. 🛠️ 기술 스택 (Tech Stack)

| 카테고리 | 기술 | 설명 |
| :--- | :--- | :--- |
| **프레임워크/라이브러리** | React (v18) | UI 구축을 위한 핵심 라이브러리 |
| **개발 도구** | Vite | SWC 컴파일러를 사용한 빠른 빌드 및 개발 서버 |
| **언어** | TypeScript | 코드 안정성과 가독성을 위한 정적 타입 지원 |
| **UI 컴포넌트** | shadcn/ui | Radix UI와 Tailwind CSS 기반의 재사용 가능한 컴포넌트 라이브러리 |
| **스타일링** | Tailwind CSS | 유틸리티 우선 CSS 프레임워크 |
| **라우팅** | React Router (v6) | 클라이언트 사이드 라우팅 관리 |
| **상태 관리** | Zustand | 가볍고 간편한 전역 상태 관리 라이브러리 |
| **데이터 페칭/캐싱** | Tanstack Query (React Query) | 서버 상태 관리, 캐싱, 비동기 데이터 동기화 |
| **폼 관리** | React Hook Form & Zod | 폼 상태 관리 및 스키마 기반 유효성 검사 |
| **백엔드 (BaaS)** | Supabase | 데이터베이스, 인증, 스토리지 등 백엔드 서비스 |
| **결제 연동** | Bootpay, Toss Payments | 국내 결제 서비스 연동 |
| **애니메이션/UX** | Framer Motion, React Joyride | 부드러운 애니메이션 및 사용자 온보딩/가이드 |
| **배포** | Netlify | CI/CD를 통한 정적 사이트 호스팅 및 배포 |
| **패키지 매니저** | npm / bun | 의존성 관리 (Netlify 빌드 시 `bun` 사용) |

## 2. 📂 프로젝트 구조

프로젝트는 기능별로 모듈화된 명확한 구조를 따릅니다.

```
C:/Users/gmdqn/AI/
├── src/
│   ├── components/    # 재사용 가능한 React 컴포넌트 (기능별, UI별)
│   ├── hooks/         # 커스텀 React 훅 (데이터 페칭, 로직 분리)
│   ├── integrations/  # 외부 서비스 연동 (Supabase)
│   ├── lib/           # 유틸리티, Supabase 클라이언트, API 헬퍼
│   ├── pages/         # React Router가 렌더링하는 페이지 컴포넌트
│   ├── store/         # Zustand를 사용한 전역 상태 저장소
│   ├── types/         # 공용 TypeScript 타입 정의
│   ├── App.tsx        # 메인 앱 컴포넌트 (라우터 설정)
│   └── main.tsx       # 애플리케이션 진입점
├── supabase/          # Supabase 관련 설정 및 마이그레이션
├── public/            # 정적 에셋 (이미지, 폰트 등)
├── .env.local         # 로컬 환경 변수
├── netlify.toml       # Netlify 배포 및 빌드 설정
├── vite.config.ts     # Vite 빌드 및 플러그인 설정
├── tailwind.config.ts # Tailwind CSS 테마 및 플러그인 설정
└── package.json       # 프로젝트 의존성 및 스크립트 정의
```

## 3. ✨ 핵심 기능

코드 분석을 통해 파악된 주요 기능은 다음과 같습니다.

*   **견종 백과 (Woofpedia)**: 견종 정보 조회, 필터링 및 상세 정보 제공.
*   **AI 훈련 추천 (AI Training Recommender)**: 강아지 프로필 기반의 맞춤형 훈련 프로그램 추천.
*   **훈련 관리**: 훈련 기록, 진행 상황 추적 및 리플레이 기능.
*   **강아지 MBTI 테스트**: 재미 요소를 가미한 강아지 성격 유형 검사.
*   **Gemini 채팅**: Google Gemini AI 모델을 연동한 대화형 서비스.
*   **대시보드**: 일일 통계, 강아지 뱃지 등 개인화된 정보 요약.
*   **사용자 인증 및 프로필**: Supabase Auth를 통한 회원가입, 로그인 및 강아지 프로필 관리.
*   **콘텐츠 피드**: ���로그/매거진 형태의 아티클 제공.
*   **구독 및 결제**: `UpgradeModal` 및 결제 연동을 통한 프리미엄 기능 제공.

## 4. ☁️ 백엔드 및 배포

*   **Supabase**:
    *   **인증**: 이메일/패스워드 기반 사용자 인증.
    *   **데이터베이스**: PostgreSQL을 사용하여 사용자 정보, 강아지 프로필, 훈련 데이터 등을 저장.
    *   **클라이언트**: `src/lib/supabaseClient.ts` 파일에서 Supabase 클라이언트를 초기화하고 앱 전체에서 사용합니다.
    *   **타입**: `src/integrations/supabase/types.ts` 에서 데이터베이스 테이블에 대한 TypeScript 타입을 관리합니다.

*   **Netlify**:
    *   **빌드 명령어**: `bun run build`
    *   **배포 디렉토리**: `dist`
    *   **설정**: `netlify.toml` 파일에 정의되어 있으며, SPA를 위한 리다이렉트 규칙이 포함되어 있습니다.
    *   **도메인**: `mungai.co.kr` (sitemap 설정 기준)

## 5. 🚀 빌드 및 스크립트

`package.json`에 정의된 주요 스크립트는 다음과 같습니다.

*   **개발 서버 실행**:
    ```bash
    npm run dev
    ```
*   **프로덕션 빌드**:
    ```bash
    npm run build
    ```
*   **코드 린팅**:
    ```bash
    npm run lint
    ```
*   **빌드 결과 미리보기**:
    ```bash
    npm run preview
    ```
