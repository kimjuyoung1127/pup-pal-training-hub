
import React from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const LoginPage = ({ onLogin }: { onLogin: () => void }) => {
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      console.error('구글 로그인 중 오류 발생:', error);
      toast.error('로그인 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  const handleKakaoLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      console.error('카카오 로그인 중 오류 발생:', error);
      toast.error('로그인 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-cream-50 to-orange-50">
      {/* Header */}
      <div className="flex items-center justify-center pt-12 pb-8">
        <div className="flex items-center space-x-2">
          <div className="text-2xl">🐾</div>
          <h1 className="text-xl font-bold text-cream-800">멍멍트레이너</h1>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col justify-center items-center px-8">
        <div className="w-full max-w-md">
          {/* Illustration area */}
          <div className="text-center mb-12">
            <div className="text-6xl mb-6 animate-bounce-gentle">🐕‍🦺</div>
            <h2 className="text-2xl font-bold text-cream-800 mb-4">
              환영합니다!
            </h2>
            <p className="text-cream-700 leading-relaxed">
              우리 강아지와 함께하는<br />
              특별한 훈련 여정을 시작해보세요
            </p>
          </div>

          {/* Login options */}
          <div className="space-y-4">
            <Button
              onClick={handleGoogleLogin}
              className="w-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 font-medium py-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md flex items-center justify-center space-x-3"
            >
              <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">G</span>
              </div>
              <span>구글로 시작하기</span>
            </Button>

            <Button
              onClick={handleKakaoLogin}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-medium py-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md flex items-center justify-center space-x-3"
            >
              <div className="w-5 h-5 bg-yellow-900 rounded-full flex items-center justify-center">
                <span className="text-yellow-400 text-xs font-bold">K</span>
              </div>
              <span>카카오로 시작하기</span>
            </Button>
          </div>

          {/* Terms */}
          <div className="mt-8 text-center">
            <p className="text-xs text-cream-600 leading-relaxed">
              계속 진행하시면 <span className="underline">서비스 이용약관</span> 및 <span className="underline">개인정보처리방침</span>에<br />
              동의하는 것으로 간주됩니다.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-8 text-center">
        <p className="text-sm text-cream-600">
          멍멍트레이너와 함께 행복한 반려생활을 🐾
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
