🤖 AI 스마트 훈련기 "Linker" MVP 개발 계획서
Version: 2.1
Last Updated: 2025-09-01

1. 프로젝트 개요
1.1. 핵심 컨셉
**'수동 원격 훈련'**과 **'자동 목표 유도 훈련'**이 모두 가능한 듀얼 모드 스마트 훈련 시스템.

1.2. MVP 목표
보호자가 사용하는 웨어러블 클리커와 원격 디스펜서의 훈련 효과성 검증.

특정 지점(디스펜서)으로 접근하는 행동을 자동 보상 시스템이 강화시킬 수 있는지 검증.

2. 개발 로드맵 (총 5주)
Phase 1: 환경 설정 및 기본 UI 골격 (1주)
React Native 개발 환경 설정 및 프로젝트 생성

React Navigation을 이용한 기본 화면(메인, 설정) 구조 설계

기능 없는 기본 UI 컴포넌트 제작 (영상 영역, 버튼, 스위치 등)

Phase 2: 핵심 통신 기능 구현 (2주)
디스펜서 ↔ 서버 통신: MQTT 라이브러리 연동 및 통신 테스트

클리커 ↔ 앱 통신: BLE 라이브러리 연동, 클리커 스캔 및 페어링 기능 구현

최초 기기 Wi-Fi 설정 기능 구현

Phase 3: 기능 활성화 및 로직 연결 (1주)
UI 컴포넌트와 통신 로직 연결 (상태 관리 적용)

ESP32-CAM 영상 스트리밍 연동

'자동/수동 모드' 전환 기능 및 설정 값 전송 기능 구현

Phase 4: 최종 마감 및 테스트 (1주)
사용자 피드백(로딩, 에러 메시지) 및 푸시 알림 기능 추가

실제 하드웨어와 통합하여 전체 시나리오 테스트 및 디버깅

최종 빌드 파일 생성

3. 기술 구현 계획
3.1. 앱 기술 스택
프레임워크: React Native

BLE 통신: react-native-ble-plx

실시간 통신: react-native-mqtt (MQTT 프로토콜 사용)

네비게이션: React Navigation

상태 관리: Zustand 또는 React Context API

푸시 알림: @react-native-firebase/messaging

3.2. 앱 파일 구조
src/
├── api/              // MQTT, BLE 등 통신 서비스 로직
│   ├── MqttService.ts
│   └── BleService.ts
├── components/       // 재사용 가능한 UI 컴포넌트
│   ├── ModeToggle.tsx
│   ├── ManualRewardButton.tsx
│   └── LiveVideoStream.tsx
├── hooks/            // 상태 관리 및 비즈니스 로직 커스텀 훅
│   ├── useDeviceConnection.ts
│   └── useTrainingMode.ts
├── navigation/       // 화면 네비게이션 설정
│   └── AppNavigator.tsx
├── screens/          // 개별 페이지 화면
│   ├── DeviceSetupScreen.tsx
│   ├── TrainerDashboardScreen.tsx
│   └── SettingsScreen.tsx
└── App.tsx           // 앱 진입점
4. 통신 아키텍처 및 API
4.1. 통신 프로토콜
클리커 ↔ 디스펜서: ESP-NOW (초저지연 직접 통신)

디스펜서 ↔ 서버 ↔ 앱: MQTT (상태 및 이벤트 실시간 동기화)

4.2. MQTT Topic 구조 (예시)
명령 발행 (앱 → 디스펜서):

linker/{deviceId}/command/setMode (Payload: {"mode": "auto"})

linker/{deviceId}/command/setDistance (Payload: {"distance": 30})

linker/{deviceId}/command/reward (Payload: {"source": "app"})

상태 구독 (디스펜서 → 앱):

linker/{deviceId}/status/rewarded (Payload: {"source": "clicker" | "auto"})

linker/{deviceId}/status/connection (Payload: {"online": true})

5. UI/UX 설계
5.1. 디자인 원칙
직관성: 현재 어떤 모드인지, 기기가 연결되었는지 명확하게 표시.

단순함: 불필요한 기능을 숨기고, 가장 중요한 제어 버튼을 크게 배치.

즉각적 피드백: 사용자의 조작에 대해 즉각적인 시각적/촉각적 피드백 제공.

5.2. 주요 화면 구성
기기 설정 화면:

Wi-Fi 정보 입력 폼, 클리커 페어링 시작 버튼, 각 기기별 연결 상태 아이콘.

메인 대시보드 화면:

실시간 영상 스트림, 모드 전환 토글, 수동 보상 버튼, 현재 설정된 거리 값 표시.

세부 설정 화면:

거리 조절 슬라이더, 클릭 소리 On/Off 토글, 푸시 알림 On/Off 토글.

6. 개발 우선순위
1순위 (필수 MVP 기능)
디스펜서 Wi-Fi 연결 및 서버(MQTT) 접속 기능

웨어러블 클리커 페어링 및 ESP-NOW 통신

수동 훈련 모드 (앱 버튼 + 웨어러블 클리커)

자동 접근 보상 모드 (초음파 센서 연동)

기본 모드 전환 기능

2순위 (고도화 기능)
실시간 영상 스트리밍 연동

세부 설정 페이지 (거리, 사운드 조절)

푸시 알림 시스템

3순위 (후순위 기능)
훈련 기록 통계 표시

사용자 계정 시스템 (향후 확장)

7. 테스트 계획
7.1. 단위 테스트
BLE 연결 및 ESP-NOW 신호 수신 로직 테스트

MQTT 메시지 발행/구독 로직 테스트

모드 전환 상태 관리 로직 테스트

7.2. 통합 테스트
End-to-End 시나리오: 클리커 버튼 클릭 → 디스펜서 보상 → 앱에 알림 표시까지 전체 흐름 테스트

네트워크 전환 테스트: Wi-Fi 연결이 끊겼다 다시 연결될 때의 안정성 테스트

저전력 테스트: 클리커의 배터리 수명 실사용 테스트

7.3. 사용자 테스트 (UT)
실제 반려인을 대상으로 초기 설정 과정의 UX 테스트

'수동 모드'와 '자동 모드'를 실제 훈련 시나리오에 적용하여 사용성 피드백 수집

8. 향후 확장 가능성
8.1. AI 기능 고도화
라즈베리 파이 등 고성능 보드로 업그레이드 후, MediaPipe를 이용한 행동(앉아, 엎드려) 인식 및 자동 보상 기능 추가

8.2. 다중 기기 및 사용자 지원
하나의 앱에서 여러 디스펜서와 클리커를 관리하는 기능

가족 구성원 간 훈련 데이터 공유 기능