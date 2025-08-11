import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useDogProfile } from '@/hooks/useDogProfile'; // dogInfo를 가져오기 위해 추가
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerTrigger,
  DrawerClose,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Separator } from '@/components/ui/separator';
import { Home, Users, Sparkles, UserCircle, BookOpen, Compass, HeartHandshake, Bone, MessageSquare, Bot, Film, BarChart3 } from 'lucide-react';

// --- 데이터 정의 ---
const aiSolutions = [
  { name: '견종 백과', icon: BookOpen, path: '/breeds' },
  { name: '견종 MBTI', icon: Compass, path: '/mbti-test' },
  { name: '맞춤 견종 추천', icon: HeartHandshake, path: '/filter-wizard' },
  { name: '전문가 영상 골라보기', icon: Film, path: '/training/videos' },
];

const trainingTools = [
  { name: '훈련 챗봇에게 물어보기', icon: MessageSquare, path: '/chat', isProtected: true, requiresDogProfile: true },
  { name: '맞춤 훈련 계획 추천', icon: Bot, path: '/app/training-recommender', isProtected: true, requiresDogProfile: true },
  { name: 'AI 관절 추적', icon: Bone, path: '/app/posture-analysis', isProtected: true, requiresDogProfile: true },
];

const navItems = [
  { id: 'home', label: '홈', icon: Home, path: '/' },
  { id: 'community', label: '커뮤니티', icon: Users, path: '/community' },
  { id: 'ai-hub', label: 'AI 기능', icon: Sparkles, isDrawer: true },
  { id: 'my-page', label: '마이페이지', icon: UserCircle, path: '/app/my-page', isProtected: true },
];

// --- 서랍 내부 섹션 컴포넌트 ---
const DrawerSection: React.FC<{
  title: string;
  description?: string;
  items: any[];
  icon: React.ElementType;
  onClick: (item: any) => void;
}> = ({ title, description, items, icon: SectionIcon, onClick }) => (
  <div>
    <div className="flex items-center px-4 pt-4 pb-2">
      <SectionIcon className="w-5 h-5 mr-2 text-gray-500" />
      <h3 className="font-semibold text-gray-600">{title}</h3>
    </div>
    {description && <p className="px-4 pb-2 text-xs text-gray-500">{description}</p>}
    <div className="p-4 grid grid-cols-2 gap-3">
      {items.map((item) => (
        <DrawerClose asChild key={item.name}>
          <div onClick={() => onClick(item)} className="block cursor-pointer">
            <div className="flex flex-col items-center justify-center p-3 border rounded-lg hover:bg-rose-50 transition-colors text-center h-full">
              <item.icon className="w-7 h-7 mb-2 text-rose-500" />
              <p className="font-semibold text-sm">{item.name}</p>
            </div>
          </div>
        </DrawerClose>
      ))}
    </div>
  </div>
);

// --- 메인 컴포넌트 ---
const WoofpediaBottomNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { session } = useAuth();
  const { dogInfo, isLoading: isDogProfileLoading } = useDogProfile(); // DB 기반 강아지 프로필 확인
  const currentPath = location.pathname;

  const handleLinkClick = (item: any) => {
    const { path, isProtected, requiresDogProfile } = item;

    // 데이터 로딩 중에는 클릭 반응을 막아 오류 방지
    if (isDogProfileLoading) {
      return; 
    }

    if (requiresDogProfile) {
      if (!session) {
        if (window.confirm('로그인이 필요한 기능입니다. 로그인 페이지로 이동하시겠습니까?')) {
          navigate('/app/login', { state: { from: path } });
        }
        return;
      }
      // dogInfo가 없는 경우 (강아지 정보가 등록되지 않음)
      if (!dogInfo) {
        if (window.confirm('이 기능을 사용하기 전에, 먼저 강아지의 기본 정보를 등록해야 해요. 정보 등록 페이지로 이동할까요?')) {
          navigate('/app/dog-info', { state: { from: path } });
        }
        return;
      }
    }

    if (isProtected && !session) {
      if (window.confirm('로그인이 필요한 기능입니다. 로그인 페이지로 이동하시겠습니까?')) {
        navigate('/app/login', { state: { from: path } });
      }
    } else {
      navigate(path);
    }
  };

  return (
    <Drawer>
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-gray-200 px-4 py-2 z-50">
        <div className="flex justify-between items-center max-w-md mx-auto">
          {navItems.map((item) => {
            if (item.isDrawer) {
              return (
                <div key={item.id} className="flex-1 text-center cursor-pointer">
                  <DrawerTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="w-full flex flex-col items-center space-y-1 px-3 py-2 h-auto transition-colors bg-transparent text-gray-500 hover:text-rose-500 focus:ring-0 focus:ring-offset-0"
                    >
                      <Sparkles className="w-5 h-5" />
                      <span className="text-xs font-medium">{item.label}</span>
                    </Button>
                  </DrawerTrigger>
                </div>
              );
            }

            const Icon = item.icon;
            const isActive = currentPath === item.path;

            return (
              <div onClick={() => handleLinkClick(item)} key={item.id} className="flex-1 text-center cursor-pointer">
                <Button
                  size="sm"
                  variant="ghost"
                  className={`w-full flex flex-col items-center space-y-1 px-3 py-2 h-auto transition-colors bg-transparent hover:bg-rose-50 focus:ring-0 focus:ring-offset-0 ${
                    isActive ? 'text-rose-500 font-bold' : 'text-gray-500 hover:text-rose-500'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{item.label}</span>
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      <DrawerContent className="bg-white">
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader className="text-center">
            <DrawerTitle>✨ Mung-AI 기능 모아보기</DrawerTitle>
            <DrawerDescription>댕댕이 라이프를 스마트하게!</DrawerDescription>
          </DrawerHeader>
          
          <DrawerSection title="스마트 기능" items={aiSolutions} icon={Sparkles} onClick={handleLinkClick} />
          <Separator className="my-2" />
          <DrawerSection title="AI 솔루션" items={trainingTools} icon={Bot} onClick={handleLinkClick} description="AI 추천, 분석 등 개인화 기능은 로그인이 필요해요!" />

          <DrawerFooter className="mt-4">
            <DrawerClose asChild>
              <Button variant="outline">닫기</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default WoofpediaBottomNav;