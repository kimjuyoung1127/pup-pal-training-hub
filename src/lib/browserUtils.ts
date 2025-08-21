// src/lib/browserUtils.ts

export const isIOS = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
};

export const isAndroid = () => {
  return /Android/.test(navigator.userAgent);
};

export const isWebView = () => {
  const userAgent = navigator.userAgent;
  // 일반적인 웹뷰 사용자 에이전트 패턴
  const webviewPatterns = [
    /wv/, // 일반적인 Android WebView
    /inapp/, // 많은 인앱 브라우저에서 공통
    /naver/i, // 네이버 앱
    /daum/i, // 다음 앱
    /kakaotalk/i, // 카카오톡 앱
    /line/i, // 라인 앱
    /instagram/i, // 인스타그램 앱
    /facebook/i, // 페이스북 앱
    /fbav/i, // 페이스북 앱
    /fban/i, // 페이스북 앱
    /twitter/i, // 트위터 앱
    /linkedin/i, // 링크드인 앱
  ];

  return webviewPatterns.some(pattern => pattern.test(userAgent));
};

export const openInChromeOnAndroid = (url: string) => {
  if (isAndroid() && isWebView()) {
    // 인텐트 URL을 사용하여 Chrome에서 열기 시도
    const intentUrl = `intent://${window.location.host}${window.location.pathname}#Intent;scheme=https;package=com.android.chrome;end`;
    window.location.href = intentUrl;
    return true; // 시도했음을 알림
  }
  return false; // Android 웹뷰가 아니거나 시도하지 않음
};

// beforeinstallprompt 지원 여부 확인 함수
export const isBeforeInstallPromptSupported = () => {
  return 'BeforeInstallPromptEvent' in window;
};
