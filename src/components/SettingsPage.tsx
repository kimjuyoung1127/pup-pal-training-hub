import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { type User as SupabaseUser } from '@supabase/supabase-js';
import { Card, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, Loader2 } from 'lucide-react';
import { MediaGallery } from './settings/MediaGallery';
import { DarkModeToggle } from './settings/DarkModeToggle';

// 로딩 상태를 표시하는 스피너 컴포넌트
const LoadingSpinner = () => (
  <div className="p-4 bg-background min-h-screen flex items-center justify-center"> {/* 배경 변경 */}
    <Loader2 className="h-8 w-8 animate-spin text-primary" /> {/* 스피너 색상 변경 */}
  </div>
);

// 사용자 프로필 정보를 표시하는 컴포넌트
const UserProfile = ({ user }: { user: SupabaseUser | null }) => {
  const userName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email;
  const userEmail = user?.email;
  const userAvatar = user?.user_metadata?.avatar_url;

  return (
    <Card className="card-soft bg-card shadow-md"> {/* 카드 스타일 변경 (card-soft는 이미 테마색 따름) */}
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={userAvatar} alt={userName || ''} />
            <AvatarFallback className="bg-muted text-muted-foreground">{userName ? userName.charAt(0).toUpperCase() : 'U'}</AvatarFallback> {/* Fallback 스타일 변경 */}
          </Avatar>
          <div>
            <p className="text-lg font-semibold text-foreground">{userName || '사용자'}</p> {/* 텍스트 색상 변경 */}
            <p className="text-sm text-muted-foreground"> {/* 텍스트 색상 변경 */}
              {userEmail || '이메일을 찾을 수 없습니다.'}
            </p>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

// 설정 페이지의 주요 액션 버튼들을 그룹화한 컴포넌트
const SettingsActions = () => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="mt-8 space-y-4"> {/* space-y 추가 */}
      <DarkModeToggle /> {/* DarkModeToggle 내부 스타일 확인 필요 */}
      <Button
        variant="ghost"
        className="w-full justify-start text-destructive hover:text-destructive/90 hover:bg-destructive/10 p-4 rounded-lg" /* 로그아웃 버튼 스타일 변경 */
        onClick={handleLogout}
      >
        <LogOut className="w-5 h-5 mr-3" />
        로그아웃
      </Button>
    </div>
  );
};

// 헤더 컴포넌트 추가
const Header = () => (
  <div className="bg-background/80 backdrop-blur-sm border-b border-border px-6 py-4 sticky top-0 z-10"> {/* 헤더 스타일 변경 */}
    <div className="flex items-center justify-between">
      <h1 className="text-lg font-bold text-foreground font-pretendard">설정</h1> {/* 타이틀 색상 변경 */}
    </div>
  </div>
);

// 메인 설정 페이지 컴포넌트
const SettingsPage = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    fetchUser();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="bg-background text-foreground min-h-screen"> {/* 배경 변경 */}
      <Header />
      <div className="p-6 space-y-6">
        <UserProfile user={user} />
        <MediaGallery />
        <SettingsActions />
      </div>
    </div>
  );
};

export default SettingsPage;