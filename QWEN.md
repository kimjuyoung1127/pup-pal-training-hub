# QWEN 개발 지침

이 문서는 Qwen Code가 이 프로젝트에서 효과적으로 개발을 지원하기 위한 지침입니다.

## 프로젝트 개요

이 프로젝트는 Vite 기반의 React 애플리케이션으로, 강아지 관련 정보 제공, AI 훈련 추천, 커뮤니티 기능을 중심으로 구축된 펫 플랫폼입니다.

## 기술 스택

- **프레임워크/라이브러리**: React (v18)
- **개발 도구**: Vite
- **언어**: TypeScript
- **UI 컴포넌트**: shadcn/ui (Radix UI + Tailwind CSS)
- **스타일링**: Tailwind CSS
- **라우팅**: React Router (v6)
- **상태 관리**: Zustand
- **데이터 페칭/캐싱**: Tanstack Query (React Query)
- **폼 관리**: React Hook Form & Zod
- **백엔드 (BaaS)**: Supabase
- **결제 연동**: 구현예정
- **애니메이션/UX**: Framer Motion, React Joyride
- **배포**: Netlify
- **패키지 매니저**: npm / bun

## 프로젝트 구조

```
C:/Users/gmdqn/AI/
├── src/
│   ├── components/      # 재사용 가능한 React 컴포넌트
│   ├── hooks/           # 커스텀 React 훅
│   ├── integrations/    # 외부 서비스 연동 (Supabase)
│   ├── lib/             # 유틸리티, Supabase 클라이언트 등
│   ├── pages/           # React Router가 렌더링하는 페이지 컴포넌트
│   │   ├── main_features/ # 사용자향 핵심 기능 (홈, 아티클, MBTI 등)
│   │   ├── app_core/      # AI 분석 앱 (로그인 후)
│   │   ├── admin_panel/   # 관리자 CMS
│   │   └── legal_and_info/  # 법률 및 기타 정보 페이지
│   ├── store/           # Zustand를 사용한 전역 상태 저장소
│   ├── types/           # 공용 TypeScript 타입 정의
│   ├── App.tsx          # 메인 앱 컴포넌트 (라우터 설정)
│   └── main.tsx         # 애플리케이션 진입점
├── supabase/            # Supabase 관련 설정 및 마이그레이션
├── public/              # 정적 에셋 (이미지, 폰트 등)
├── .env.local           # 로컬 환경 변수
├── netlify.toml         # Netlify 배포 및 빌드 설정
├── vite.config.ts       # Vite 빌드 및 플러그인 설정
├── tailwind.config.ts   # Tailwind CSS 테마 및 플러그인 설정
└── package.json         # 프로젝트 의존성 및 스크립트 정의
```

## 핵심 기능

- 견종 백과 (Woofpedia)
- AI 훈련 추천 (AI Training Recommender)
- 훈련 관리
- 강아지 MBTI 테스트
- Gemini 채팅
- 대시보드
- 사용자 인증 및 프로필
- 콘텐츠 피드


## 개발 지침

1. 모든 개발 관련 질문에 대해 한국어로 답변해주세요.
2. 코드 작성 시 TypeScript와 React의 모던한 기능들을 적극적으로 활용해주세요.
3. UI 컴포넌트 작성 시 shadcn/ui와 Tailwind CSS를 사용해주세요.
4. 상태 관리는 Zustand를, 서버 상태 관리는 Tanstack Query를 사용해주세요.
5. 폼 관리는 React Hook Form과 Zod를 사용하여 타입 안전성을 확보해주세요.
13. 앞으로 개발할 새로운 파일들은 가독성을 위해 관련 기능별로 한 폴더에 몰아서 개발해주세요. 예를 들어, 새로운 기능을 개발할 때 해당 기능과 관련된 컴포넌트, 훅, 유틸리티 함수 등을 하나의 폴더에 함께 구성하여 해당 기능의 모든 요소를 쉽게 찾을 수 있도록 해주세요.

## 주요 스크립트

- 개발 서버 실행: `npm run dev`
- 프로덕션 빌드: `npm run build`

