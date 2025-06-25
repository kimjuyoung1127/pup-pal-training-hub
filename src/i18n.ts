import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslation from './locales/en/translation.json';
import koTranslation from './locales/ko/translation.json';

// 빈 리소스 객체로 시작합니다. 실제 번역은 아래에서 추가됩니다.
const resources = {
  en: {
    translation: enTranslation
  },
  ko: {
    translation: koTranslation
  }
};

i18n
  .use(LanguageDetector) // 브라우저 언어 감지 기능을 사용합니다.
  .use(initReactI18next) // react-i18next를 초기화합니다.
  .init({
    resources,
    fallbackLng: 'en', // 기본 언어를 영어로 설정합니다.
    debug: true, // 개발 중 디버깅을 위해 true로 설정합니다.
    interpolation: {
      escapeValue: false, // React는 이미 XSS를 방지하므로 false로 설정합니다.
    },
  });

export default i18n;
