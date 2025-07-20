
import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  // 테스트 파일이 있는 디렉토리
  testDir: './scripts',
  
  // 타임아웃 설정 (전체 테스트)
  timeout: 60 * 1000, // 60초

  expect: {
    // expect 함수의 타임아웃 설정
    timeout: 5000
  },

  // 실패한 테스트를 CI에서만 재시도하도록 설정
  retries: process.env.CI ? 2 : 0,

  // 병렬 실행 워커 수 (CI에서는 1개로 제한)
  workers: process.env.CI ? 1 : undefined,

  // 리포터 설정
  reporter: 'html',

  // 모든 프로젝트에서 공통으로 사용할 설정
  use: {
    // 모든 액션(클릭, 이동 등)의 타임아웃
    actionTimeout: 0,
    // 페이지 로딩 전략
    trace: 'on-first-retry',
  },

  /* 각 브라우저 프로젝트 설정 */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
