"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react"; // shadcn/ui와 함께 사용되는 아이콘 라이브러리

// beforeinstallprompt 이벤트 타입을 위한 인터페이스 정의
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const InstallPwaButton = () => {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault(); // 기본 설치 배너가 나타나지 않도록 함
      setPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (!prompt) {
      return;
    }
    // 설치 프롬프트 표시
    prompt.prompt();
    // 사용자의 선택 결과 처리
    prompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      setPrompt(null); // 한 번 사용한 프롬프트는 다시 사용하지 않도록 버튼 숨김
    });
  };

  // 설치 프롬프트가 없으면 버튼을 렌더링하지 않음
  if (!prompt) {
    return null;
  }

  return (
    <Button
      onClick={handleInstallClick}
      className="absolute top-4 right-4 z-50"
      aria-label="Install App"
    >
      <Download className="mr-2 h-4 w-4" />
      앱 설치
    </Button>
  );
};

export default InstallPwaButton;