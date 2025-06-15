import React, { useState } from 'react';
import OnboardingPage from '@/components/OnboardingPage';
import LoginPage from '@/components/LoginPage';
import DashboardPage from '@/components/DashboardPage';
import DogInfoPage from '@/components/DogInfoPage';
import DogProfilePage from '@/components/DogProfilePage';
import TrainingStartPage from '@/components/TrainingStartPage';
import BottomNavigation from '@/components/BottomNavigation';

const Index = () => {
  const [currentPage, setCurrentPage] = useState<'onboarding' | 'login' | 'dashboard' | 'dog-info' | 'dog-profile' | 'training' | 'training-progress' | 'history' | 'settings'>('onboarding');
  const [dogInfo, setDogInfo] = useState<any>(null);

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
    } else if (page === 'dog-profile') {
      setCurrentPage('dog-profile');
    } else if (page === 'training') {
      setCurrentPage('training');
    } else if (page === 'dashboard') {
      setCurrentPage('dashboard');
    } else if (page === 'settings') {
      setCurrentPage('settings');
    }
  };

  const handleDogInfoComplete = (completedDogInfo: any) => {
    console.log('Dog info completed:', completedDogInfo);
    setDogInfo(completedDogInfo);
    // 강아지 정보 입력 완료 후 훈련 페이지로 이동
    setCurrentPage('training');
  };

  // 하단 네비게이션을 보여줄 페이지들
  const showBottomNav = ['dashboard', 'dog-profile', 'training', 'settings'].includes(currentPage);

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
      case 'dog-profile':
        return <DogProfilePage onNavigate={handleNavigate} dogInfo={dogInfo} />;
      case 'training':
        return <TrainingStartPage onNavigate={handleNavigate} />;
      default:
        return <DashboardPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className={`relative min-h-screen ${showBottomNav ? 'pb-20' : ''}`}>
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
