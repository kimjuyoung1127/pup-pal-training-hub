import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { type User as SupabaseUser } from '@supabase/supabase-js';
import { Card, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, Loader2, FileText, Info, Shield } from 'lucide-react';
import { MediaGallery } from './settings/MediaGallery';
import { Link } from 'react-router-dom';

// 로딩 상태를 표시하는 스피너 컴포넌트
const LoadingSpinner = () => (
  <div className="p-4 bg-white min-h-screen flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
  </div>
);

// 사용자 프로필 정보를 표시하는 컴포넌트
const UserProfile = ({ user }: { user: SupabaseUser | null }) => {
  const userName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email;
  const userEmail = user?.email;
  const userAvatar = user?.user_metadata?.avatar_url;

  return (
    <Card className="shadow-sm bg-white">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={userAvatar} alt={userName || ''} />
            <AvatarFallback>{userName ? userName.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-lg font-semibold">{userName || '사용자'}</p>
            <p className="text-sm text-slate-950">
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
    <div className="mt-8 space-y-4">
      <div className="space-y-2 pt-4 border-t border-gray-200">
        <h3 className="px-4 text-sm font-semibold text-gray-500">정보</h3>
        <Link to="/AboutUsPage">
          <Button className="w-full justify-start p-4 bg-transparent hover:bg-gray-100 focus:ring-0 text-gray-800">
            <Info className="w-5 h-5 mr-3" />
            서비스 소개
          </Button>
        </Link>
        <Link to="/TermsOfServicePage">
          <Button className="w-full justify-start p-4 bg-transparent hover:bg-gray-100 focus:ring-0 text-gray-800">
            <FileText className="w-5 h-5 mr-3" />
            서비스 이용약관
          </Button>
        </Link>
        <Link to="/PrivacyPolicyPage">
          <Button className="w-full justify-start p-4 bg-transparent hover:bg-gray-100 focus:ring-0 text-gray-800">
            <Shield className="w-5 h-5 mr-3" />
            개인정보처리방침
          </Button>
        </Link>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <Button
          className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 p-4 bg-transparent focus:ring-0"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 mr-3" />
          로그아웃
        </Button>
      </div>
    </div>
  );
};

// 헤더 컴포넌트 추가
const Header = () => (
  <div className="bg-gray-50/80 backdrop-blur-sm border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
    <div className="flex items-center justify-between">
      <h1 className="text-lg font-bold text-gray-800 font-pretendard">설정</h1>
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
    <div className="bg-gray-50 text-gray-900 min-h-screen">
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