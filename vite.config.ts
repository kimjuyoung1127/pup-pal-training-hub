import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import sitemap from 'vite-plugin-sitemap';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    sitemap({
      hostname: 'https://mungai.co.kr',
      lastmod: new Date(),
      // sitemap에 포함할 경로 목록
      dynamicRoutes: [
        '/',
        '/chat',
        '/pricing',
        '/PrivacyPolicyPage',
        '/TermsOfServicePage',
        '/AboutUsPage',
      ],
      // sitemap에서 제외할 경로 목록
      exclude: ['/success', '/fail', '/*.html'],
      // robots.txt 자동 생성 비활성화
      generateRobotsTxt: false,
    }),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      workbox: {
        // 서비스 워커가 캐시할 수 있는 파일의 최대 크기를 5MB로 설정합니다.
        // Netlify 빌드 시 기본값(2MB)을 초과하는 청크 파일로 인해 빌드가 실패하는 문제를 해결합니다.
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      },
      manifest: {
        name: 'Pet-Life',
        short_name: 'Pet-Life',
        description: 'AI 훈련 코치를 담은 지능형 펫 플랫폼',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        start_url: '/',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        // 코드 분할(Code Splitting) 설정을 통해 번들 크기를 최적화합니다.
        // 라이브러리 코드를 별도의 청크 파일로 분리하여 초기 로딩 성능을 개선하고,
        // 브라우저 캐싱 효율을 높입니다.
        manualChunks(id: string) {
          if (id.includes('node_modules')) {
            // React 관련 라이브러리는 'vendor-react' 청크로 그룹화합니다.
            // 런타임 오류를 방지하기 위해 다른 라이브러리보다 먼저 로드되도록 보장합니다.
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            // 나머지 서드파티 라이브러리는 'vendor' 청크로 그룹화합니다.
            return 'vendor';
          }
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
