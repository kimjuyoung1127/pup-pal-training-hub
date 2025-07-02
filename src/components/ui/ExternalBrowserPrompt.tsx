import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from './button';

const ExternalBrowserPrompt = () => {
  const handleOpenInBrowser = () => {
    // 현재 URL을 외부 브라우저에서 열도록 유도
    window.location.href = `intent://${window.location.host}${window.location.pathname}#Intent;scheme=https;package=com.android.chrome;end`;
  };

  return (
    <Alert className="fixed bottom-20 left-2 right-2 z-50 bg-yellow-100 border-yellow-300 text-yellow-900 max-w-md mx-auto shadow-lg text-sm">
      <AlertTitle className="font-bold text-base">📢 외부 브라우저로 열어주세요</AlertTitle>
      <AlertDescription className="text-xs">
        구글 로그인 시, Chrome이나 Safari와 같은 외부 브라우저에서 접속해주세요.
      </AlertDescription>
      {navigator.userAgent.match(/android/i) && (
        <Button onClick={handleOpenInBrowser} className="mt-2 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 w-full text-xs py-1">
          Chrome으로 열기
        </Button>
      )}
    </Alert>
  );
};

export default ExternalBrowserPrompt;