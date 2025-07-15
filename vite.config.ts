import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import sitemap from 'vite-plugin-sitemap';

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
      robots: [
        {
          userAgent: '*',
          allow: '/',
        },
        {
          userAgent: 'Yeti',
          allow: '/',
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
