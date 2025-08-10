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
      dynamicRoutes: [
        '/',
        '/chat',
        '/pricing',
        '/PrivacyPolicyPage',
        '/TermsOfServicePage',
        '/AboutUsPage',
      ],
      exclude: ['/success', '/fail', '/*.html'],
      generateRobotsTxt: false,
    }),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      },
      manifest: {
        name: 'Mung-AI',
        short_name: 'Mung-AI',
        description: 'AI 훈련 코치를 담은 지능형 펫 플랫폼',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        start_url: '/',
        display: 'standalone',
        icons: [
          {
            src: '/logo/pwa-192x192.png', // 경로 수정
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/logo/pwa-512x512.png', // 경로 수정
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/logo/pwa-512x512.png', // 경로 수정
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
        // 안정성을 위해 모든 서드파티 라이브러리를 단일 'vendor' 청크로 그룹화합니다.
        // 이는 'createContext'와 같은 라이브러리 로딩 순서 문제를 방지합니다.
        manualChunks(id: string) {
          if (id.includes('node_modules')) {
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
