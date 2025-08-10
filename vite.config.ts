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
  // build.rollupOptions.output.manualChunks 설정을 제거하여 Vite의 기본 최적화 사용
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
