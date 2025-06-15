
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import OnboardingPage from '@/components/OnboardingPage';
import LoginPage from '@/components/LoginPage';
import DashboardPage from '@/components/DashboardPage';
import DogInfoPage from '@/components/DogInfoPage';
import DogProfilePage from '@/components/DogProfilePage';
import TrainingStartPage from '@/components/TrainingStartPage';
import SettingsPage from '@/components/SettingsPage';
import BottomNavigation from '@/components/BottomNavigation';
import TrainingHistoryPage from '@/components/TrainingHistoryPage';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';

const Index = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<'onboarding' | 'login' | 'dashboard' | 'dog-info' | 'dog-profile' | 'training' | 'training-progress' | 'history' | 'settings'>('onboarding');
  const [dogInfo, setDogInfo] = useState<any>(null);

  useEffect(() => {
    setLoading(true);
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) return;

    if (session) {
      setCurrentPage('dashboard');
    } else {
      const onboardingComplete = localStorage.getItem('onboardingComplete');
      setCurrentPage(onboardingComplete ? 'login' : 'onboarding');
    }
  }, [session, loading]);

  const handleOnboardingComplete = () => {
    localStorage.setItem('onboardingComplete', 'true');
    setCurrentPage('login');
  };

  const handleLogin = () => {
    // This is now mainly handled by onAuthStateChange.
    // It can be kept for non-OAuth login methods if any are added in the future.
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
    } else if (page === 'history') {
      setCurrentPage('history');
    }
  };

  const handleDogInfoComplete = (completedDogInfo: any) => {
    console.log('Dog info completed:', completedDogInfo);
    setDogInfo(completedDogInfo);
    // 강아지 정보 입력 완료 후 훈련 페이지로 이동
    setCurrentPage('training');
  };

  // 하단 네비게이션을 보여줄 페이지들
  const showBottomNav = ['dashboard', 'dog-info', 'dog-profile', 'training', 'settings', 'history'].includes(currentPage);

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
        return <DogProfilePage onNavigate={handleNavigate} />;
      case 'training':
        return <TrainingStartPage onNavigate={handleNavigate} />;
      case 'settings':
        return <SettingsPage />;
      case 'history':
        return <TrainingHistoryPage onNavigate={handleNavigate} />;
      default:
        return <DashboardPage onNavigate={handleNavigate} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cream-50 to-orange-50">
        <div className="text-2xl font-bold text-cream-800">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className={`relative min-h-screen ${showBottomNav ? 'pb-20' : ''}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          {renderPage()}
        </motion.div>
      </AnimatePresence>
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
