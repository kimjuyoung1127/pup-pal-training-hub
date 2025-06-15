
import React, { useState } from 'react';
import OnboardingPage from '@/components/OnboardingPage';
import LoginPage from '@/components/LoginPage';
import DashboardPage from '@/components/DashboardPage';

const Index = () => {
  const [currentPage, setCurrentPage] = useState<'onboarding' | 'login' | 'dashboard' | 'dog-info' | 'training' | 'history' | 'settings'>('onboarding');

  const handleOnboardingComplete = () => {
    setCurrentPage('login');
  };

  const handleLogin = () => {
    setCurrentPage('dashboard');
  };

  const handleNavigate = (page: string) => {
    console.log(`Navigating to: ${page}`);
    // TODO: 각 페이지별 상태 관리 및 네비게이션 구현
  };

  switch (currentPage) {
    case 'onboarding':
      return <OnboardingPage onComplete={handleOnboardingComplete} />;
    case 'login':
      return <LoginPage onLogin={handleLogin} />;
    case 'dashboard':
      return <DashboardPage onNavigate={handleNavigate} />;
    default:
      return <DashboardPage onNavigate={handleNavigate} />;
  }
};

export default Index;
