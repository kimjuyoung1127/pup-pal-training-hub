import React from 'react';
import { Home, Users, Sparkles, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';

// 하단 네비게이션 아이템 정의
const navItems = [
  { id: 'home', label: '홈', icon: Home, path: '/app' },
  { id: 'community', label: '커뮤니티', icon: Users, path: '/community' },
  { id: 'ai-solutions', label: 'AI 기능', icon: Sparkles, path: '/ai-solutions' },
  { id: 'my-page', label: '마이페이지', icon: UserCircle, path: '/my-page' },
];

const BottomNavigation: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-gray-200 px-4 py-2 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;

          return (
            <Link to={item.path} key={item.id} className="flex-1 text-center">
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
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
