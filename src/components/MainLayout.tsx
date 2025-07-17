
import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNavigation from './BottomNavigation';

const MainLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <Outlet /> {/* 여기에 각 페이지의 내용이 렌더링됩니다. */}
      </main>
      <BottomNavigation onNavigate={() => {}} /> {/* onNavigate는 App.tsx에서 실제 함수를 전달해야 합니다. */}
    </div>
  );
};

export default MainLayout;
