
import React from 'react';
import { Button } from '@/components/ui/button';
import { Home, User, BarChart3, Settings, ClipboardList } from 'lucide-react';

interface BottomNavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const BottomNavigation = ({ currentPage, onNavigate }: BottomNavigationProps) => {
  const navItems = [
    {
      id: 'dashboard',
      label: '홈',
      icon: Home,
      page: 'dashboard'
    },
    {
      id: 'dog-profile',
      label: '강아지',
      icon: User,
      page: 'dog-profile'
    },
    {
      id: 'training',
      label: '훈련',
      icon: BarChart3,
      page: 'training'
    },
    {
      id: 'history',
      label: '기록',
      icon: ClipboardList,
      page: 'history'
    },
    {
      id: 'settings',
      label: '설정',
      icon: Settings,
      page: 'settings'
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-cream-50/95 backdrop-blur-sm border-t border-cream-200 px-4 py-2 z-50"> {/* 배경색 변경 */}
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.page;
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              onClick={() => onNavigate(item.page)}
              className={`flex flex-col items-center space-y-1 px-3 py-2 h-auto rounded-md ${ // rounded-md 추가
                isActive 
                  ? 'text-orange-600 bg-orange-100' // 활성 시 색상 변경
                  : 'text-brown-700 hover:text-orange-600 hover:bg-orange-50' // 기본 및 호버 시 색상 변경
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
