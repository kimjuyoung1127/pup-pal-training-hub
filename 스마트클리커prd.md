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
- **결제 연동**: Bootpay, Toss Payments
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
- 구독 및 결제
- AI 스마트 훈련기 (웨어러블 클리커와 디스펜서를 활용한 듀얼 모드 훈련 시스템)

## 개발 지침

1. 모든 개발 관련 질문에 대해 한국어로 답변해주세요.
2. 코드 작성 시 TypeScript와 React의 모던한 기능들을 적극적으로 활용해주세요.
3. UI 컴포넌트 작성 시 shadcn/ui와 Tailwind CSS를 사용해주세요.
4. 상태 관리는 Zustand를, 서버 상태 관리는 Tanstack Query를 사용해주세요.
5. 폼 관리는 React Hook Form과 Zod를 사용하여 타입 안전성을 확보해주세요.
6. 외부 API 연동은 src/integrations 디렉토리에 작성해주세요.
7. 재사용 가능한 컴포넌트는 src/components 디렉토리에 작성해주세요.
8. 페이지 컴포넌트는 src/pages 디렉토리에 기능별로 분류하여 작성해주세요.
9. 타입 정의는 src/types 디렉토리에 작성해주세요.
10. 유틸리티 함수는 src/lib 디렉토리에 작성해주세요.
11. 모든 코드는 코드 린팅 규칙을 준수해주세요. (`npm run lint`)
12. 필요한 경우 적절한 테스트 코드를 작성해주세요.
13. 앞으로 개발할 새로운 파일들은 가독성을 위해 관련 기능별로 한 폴더에 몰아서 개발해주세요. 예를 들어, 새로운 기능을 개발할 때 해당 기능과 관련된 컴포넌트, 훅, 유틸리티 함수 등을 하나의 폴더에 함께 구성하여 해당 기능의 모든 요소를 쉽게 찾을 수 있도록 해주세요.
14. AI 스마트 훈련기 기능은 sw.md 파일을 기준으로 개발하며, 기존의 자세 추적 기능과는 완전히 분리된 독립적인 기능으로 구현합니다.
15. AI 스마트 훈련기 기능은 다음의 3단계로 개발합니다: 1) 기기 연결 및 설정, 2) 메인 제어 화면, 3) 세부 설정 화면.

## 주요 스크립트

- 개발 서버 실행: `npm run dev`
- 프로덕션 빌드: `npm run build`
- 코드 린팅: `npm run lint`
- 빌드 결과 미리보기: `npm run preview`

## AI 스마트 훈련기 기능 개발

### 기능 개요
AI 스마트 훈련기는 '수동 원격 훈련'과 '자동 목표 유도 훈련'이 모두 가능한 듀얼 모드 스마트 훈련 시스템입니다. 이 기능은 sw.md 파일에 명시된 대로 다음의 주요 기능으로 구성됩니다:

1. **기기 연결 및 설정**
   - 디스펜서 Wi-Fi 연결
   - 웨어러블 클리커 페어링

2. **메인 제어 화면**
   - 실시간 영상 스트리밍
   - 듀얼 모드 전환 스위치
   - 수동 보상 버튼
   - 기기 연결 상태 표시

3. **세부 설정 화면**
   - 자동 모드 거리 설정
   - 클릭 소리 On/Off
   - 알림 설정

### 기술 구현 방향
- **웹캠 스트리밍**: WebRTC 또는 HTML5 video API 사용
- **블루투스 통신**: Web Bluetooth API 사용
- **Wi-Fi 설정**: REST API 연동
- **실시간 통신**: WebSocket 또는 Server-Sent Events 사용
- **상태 관리**: Zustand를 활용한 전역 상태 관리

### 개발 구조
```
src/
└── pages/
    └── smart_trainer/
        ├── DeviceSetupPage.tsx
        ├── TrainerDashboardPage.tsx
        ├── SettingsPage.tsx
        ├── components/
        │   ├── WiFiSetupForm.tsx
        │   ├── PairingButton.tsx
        │   ├── ModeToggle.tsx
        │   ├── ManualRewardButton.tsx
        │   ├── DistanceSlider.tsx
        │   └── LiveVideoStream.tsx
        └── hooks/
            ├── useDeviceConnection.ts
            ├── useTrainingMode.ts
            └── useRewardSystem.ts
```