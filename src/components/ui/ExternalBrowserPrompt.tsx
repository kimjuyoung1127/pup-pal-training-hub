import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from './button';

const ExternalBrowserPrompt = () => {
  const handleOpenInBrowser = () => {
    window.location.href = `intent://${window.location.host}${window.location.pathname}#Intent;scheme=https;package=com.android.chrome;end`;
  };

  return (
    <Alert className="mt-4 bg-yellow-100 border-yellow-300 text-yellow-900">
      <AlertTitle className="text-sm font-bold">📢 외부 브라우저로 열어주세요</AlertTitle>
      <AlertDescription className="text-xs mt-1">
        구글 로그인 시, Chrome이나 Safari와 같은 외부 브라우저에서 접속해주세요.
      </AlertDescription>
      {navigator.userAgent.match(/android/i) && (
        <Button onClick={handleOpenInBrowser} className="mt-2 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 text-xs py-1">
          Chrome으로 열기
        </Button>
      )}
    </Alert>
  );
};

export default ExternalBrowserPrompt;