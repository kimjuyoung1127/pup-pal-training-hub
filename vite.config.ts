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
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
