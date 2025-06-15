
import React, { useState } from 'react';
import OnboardingPage from '@/components/OnboardingPage';
import LoginPage from '@/components/LoginPage';
import DashboardPage from '@/components/DashboardPage';
import DogInfoPage from '@/components/DogInfoPage';
import TrainingStartPage from '@/components/TrainingStartPage';
import BottomNavigation from '@/components/BottomNavigation';

const Index = () => {
  const [currentPage, setCurrentPage] = useState<'onboarding' | 'login' | 'dashboard' | 'dog-info' | 'training' | 'training-progress' | 'history' | 'settings'>('onboarding');

  const handleOnboardingComplete = () => {
    setCurrentPage('login');
  };

  const handleLogin = () => {
    setCurrentPage('dashboard');
  };

  const handleNavigate = (page: string) => {
    console.log(`Navigating to: ${page}`);
    if (page === 'dog-info') {
      setCurrentPage('dog-info');
    } else if (page === 'training') {
      setCurrentPage('training');
    } else if (page === 'dashboard') {
      setCurrentPage('dashboard');
    } else if (page === 'settings') {
      setCurrentPage('settings');
    }
    // TODO: 각 페이지별 상태 관리 및 네비게이션 구현
  };

  const handleDogInfoComplete = (dogInfo: any) => {
    console.log('Dog info completed:', dogInfo);
    // TODO: 강아지 정보를 저장하고 추천 페이지로 이동
    setCurrentPage('dashboard');
  };

  // 하단 네비게이션을 보여줄 페이지들
  const showBottomNav = ['dashboard', 'dog-info', 'training', 'settings'].includes(currentPage);

  const renderPage = () => {
    switch (currentPage) {
      case 'onboarding':
        return <OnboardingPage onComplete={handleOnboardingComplete} />;
      case 'login':
        return <LoginPage onLogin={handleLogin} />;
      case 'dashboard':
        return <DashboardPage onNavigate={handleNavigate} />;
      case 'dog-info':
        return <DogInfoPage onComplete={handleDogInfoComplete} />;
      case 'training':
        return <TrainingStartPage onNavigate={handleNavigate} />;
      default:
        return <DashboardPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="relative min-h-screen">
      {renderPage()}
      {showBottomNav && (
        <BottomNavigation 
          currentPage={currentPage}
          onNavigate={handleNavigate}
        />
      )}
    </div>
  );
};

export default Index;
