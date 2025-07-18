import React, { useState, useEffect } from 'react';
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
import TrainingProgressPage from '@/components/TrainingProgressPage';
import TrainingReplayPage from '@/components/TrainingReplayPage';
import { TrainingProgram } from '@/lib/trainingData';
import { TrainingLog } from '@/hooks/useTrainingHistory';
import AppSwitcher from '@/components/AppSwitcher';
import Joyride, { Step, CallBackProps } from 'react-joyride';
import { useDogProfile } from '@/hooks/useDogProfile';

const Index = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<'onboarding' | 'login' | 'dashboard' | 'dog-info' | 'dog-profile' | 'training' | 'training-progress' | 'training-replay' | 'history' | 'settings'>('onboarding');
  const [dogInfo, setDogInfo] = useState<any>(null);
  const [editingDogInfo, setEditingDogInfo] = useState<any>(null);
  const [trainingParams, setTrainingParams] = useState<{ trainingProgram: TrainingProgram, dogId: string } | null>(null);
  const [replayParams, setReplayParams] = useState<{ trainingLog: TrainingLog } | null>(null);
  const [runTour, setRunTour] = useState(false);
  const [tourSteps, setTourSteps] = useState<Step[]>([]);
  const { dogInfo: profileDogInfo, isLoading: isDogInfoLoading, refetchDogProfile } = useDogProfile();
  const [justCompletedProfile, setJustCompletedProfile] = useState(false);
  const [activeTour, setActiveTour] = useState<'dashboard' | 'profile' | null>(null);

  const startTour = () => {
    const tourShown = localStorage.getItem('dashboardTourShown');
    if (tourShown) return;

    const newTourSteps: Step[] = [
      {
        target: '.dashboard-welcome-message',
        content: '멍멍트레이너 AI에 오신 것을 환영합니다! 간단한 둘러보기를 시작할게요.',
        disableBeacon: true,
        title: '환영합니다!',
      },
      {
        target: '.mission-board-section',
        content: '이곳에서 강아지를 위한 맞춤형 훈련 미션을 확인하고 완료할 수 있어요.',
        disableBeacon: true,
        title: '오늘의 미션 보드',
      },
      {
        target: '.training-videos-section',
        content: '다양한 훈련 영상을 보며 따라 해보세요. 원하는 영상을 검색할 수도 있답니다.',
        disableBeacon: true,
        title: '훈련 영상 라이브러리',
      },
      {
        target: '.ai-recommendation-section',
        content: 'AI가 강아지의 특성에 맞는 훈련을 추천해 드려요.',
        disableBeacon: true,
        title: 'AI 훈련 추천',
      },
      {
        target: '.bottom-navigation-bar',
        content: '하단 메뉴를 통해 프로필, 훈련 기록 등 다른 페이지로 쉽게 이동할 수 있습니다.',
        disableBeacon: true,
        title: '간편한 이동',
      },
    ];
    setTourSteps(newTourSteps);
    setRunTour(true);
    setActiveTour('dashboard');
  };

  const startProfileTour = React.useCallback(() => {
    const profileTourShown = localStorage.getItem('profileTourShown');
    if (!profileTourShown) {
      window.scrollTo(0, 0);
      const newTourSteps = [
        {
          target: '.dog-profile-card',
          title: '강아지 프로필',
          content: '이곳에서 강아지의 기본 정보를 확인하고 수정할 수 있습니다.',
          disableBeacon: true,
        },
        {
          target: '.health-metrics-card',
          title: '건강 상태',
          content: '강아지의 건강 상태와 병원 방문 기록을 추적하고 관리하세요.',
        },
        {
          target: '.training-goals-card',
          title: '훈련 목표',
          content: '설정된 훈련 목표를 확인하고 달성 현황을 관리할 수 있습니다.',
        },
        {
          target: '.achievements-card',
          title: '일일 통계',
          content: '연속 훈련일, 산책, 배변 횟수 등 일일 통계를 확인하세요.',
        },
        {
          target: '.mission-board-section',
          title: '성장 미션 보드',
          content: '강아지의 성장 과정을 확인하고 다음 목표를 설정하여 동기를 부여하세요.',
        },
        {
          target: '.quick-actions-card',
          title: '빠른 액션',
          content: '정보 수정이나 훈련 시작 등 자주 사용하는 기능을 빠르게 이용할 수 있습니다.',
        },
      ];
      setTourSteps(newTourSteps);
      setRunTour(true);
      setActiveTour('profile');
    }
  }, []);

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
    if (loading || isDogInfoLoading) return;

    if (session) {
      if (profileDogInfo) {
        setCurrentPage('dashboard');
        const tourShown = localStorage.getItem('dashboardTourShown');
        if (!tourShown) {
          startTour();
        }
      } else {
        setCurrentPage('dog-info');
      }
    } else {
      const onboardingComplete = localStorage.getItem('onboardingComplete');
      setCurrentPage(onboardingComplete ? 'login' : 'onboarding');
    }
  }, [session, loading, profileDogInfo, isDogInfoLoading]);

  const handleOnboardingComplete = () => {
    localStorage.setItem('onboardingComplete', 'true');
    setCurrentPage('login');
  };

  const handleLogin = () => {
    // The main useEffect will handle navigation based on profileDogInfo
    // This function can be used for other login-specific logic if needed
    const isFirstLogin = !localStorage.getItem('hasVisited');
    if (isFirstLogin) {
      // The tour will start on the dashboard if profile exists
      localStorage.setItem('hasVisited', 'true');
    }
  };

  const handleNavigate = (page: string, params?: any) => {
    if (page === 'training-progress' && params) {
      setTrainingParams(params);
      setCurrentPage('training-progress');
    } else if (page === 'training-replay' && params) {
      setReplayParams(params);
      setCurrentPage('training-replay');
    } else if (page === 'dog-info') {
      setEditingDogInfo(params?.dogInfo || null);
      setCurrentPage('dog-info');
    } else if (page === 'dog-profile') {
      setCurrentPage('dog-profile');
      startProfileTour();
    } else if (page === 'training') {
      setCurrentPage('training');
    } else if (page === 'dashboard') {
      setCurrentPage('dashboard');
    } else if (page === 'settings') {
      setCurrentPage('settings');
    } else if (page === 'history') {
      setCurrentPage('history');
    }
    console.log(`Navigating to: ${page}`, params); // 페이지 전환 로그 추가
  };

  const handleDogInfoComplete = async (completedDogInfo: any) => {
    console.log('Dog info completed:', completedDogInfo);
    setDogInfo(completedDogInfo);
    setEditingDogInfo(null);
    await refetchDogProfile(); // Refetch profile to trigger useEffect
    setCurrentPage('dashboard'); // Navigate to dashboard
  };

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    if (['finished', 'skipped'].includes(status)) {
      setRunTour(false);
      if (activeTour === 'dashboard') {
        localStorage.setItem('dashboardTourShown', 'true');
      } else if (activeTour === 'profile') {
        localStorage.setItem('profileTourShown', 'true');
      }
      setActiveTour(null);
    }
  };

  const showBottomNav = ['dashboard', 'dog-info', 'dog-profile', 'training', 'settings', 'history', 'training-progress'].includes(currentPage);

  const renderPage = () => {
    switch (currentPage) {
      case 'onboarding':
        return <OnboardingPage onComplete={handleOnboardingComplete} />;
      case 'login':
        return <LoginPage onLogin={handleLogin} />;
      case 'dashboard':
        return <DashboardPage onNavigate={handleNavigate} runTour={runTour} setRunTour={setRunTour} startTour={startTour} />;
      case 'dog-info':
        return <DogInfoPage onComplete={handleDogInfoComplete} dogInfoToEdit={editingDogInfo} />;
      case 'dog-profile':
        return <DogProfilePage onNavigate={handleNavigate} />;
      case 'training':
        return <TrainingStartPage onNavigate={handleNavigate} />;
      case 'settings':
        return <SettingsPage />;
      case 'history':
        return <TrainingHistoryPage onNavigate={handleNavigate} />;
      case 'training-progress':
        if (trainingParams) {
          return <TrainingProgressPage 
            trainingProgram={trainingParams.trainingProgram} 
            dogId={trainingParams.dogId} 
            onNavigate={handleNavigate} 
            onExit={() => handleNavigate('dashboard')} 
          />;
        }
        return <DashboardPage 
          onNavigate={handleNavigate}
          runTour={runTour}
          setRunTour={setRunTour}
          startTour={startTour}
        />;
      case 'training-replay':
        if (replayParams) {
          return <TrainingReplayPage 
            trainingLog={replayParams.trainingLog}
            onExit={() => handleNavigate('history')}
          />;
        }
        return <DashboardPage 
          onNavigate={handleNavigate}
          runTour={runTour}
          setRunTour={setRunTour}
          startTour={startTour}
        />;
      default:
        return <DashboardPage 
          onNavigate={handleNavigate}
          runTour={runTour}
          setRunTour={setRunTour}
          startTour={startTour}
        />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-2xl font-bold text-sky-800">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className={`relative min-h-screen ${showBottomNav ? 'pb-20' : ''}`}>
      <Joyride
        run={runTour}
        steps={tourSteps}
        continuous
        showSkipButton
        callback={handleJoyrideCallback}
        locale={{
          back: '이전',
          close: '닫기',
          last: '마지막',
          next: '다음',
          skip: '건너뛰기',
        }}
        styles={{
          options: {
            zIndex: 10000,
            primaryColor: '#0ea5e9',
          },
          tooltip: {
            borderRadius: '0.5rem',
          },
          buttonNext: {
            backgroundColor: '#0ea5e9',
            borderRadius: '0.375rem',
          },
        }}
      />
      {renderPage()}
      {showBottomNav && (
        <>
          <BottomNavigation 
            currentPage={currentPage}
            onNavigate={handleNavigate}
          />
          <AppSwitcher />
        </>
      )}
    </div>
  );
};

export default Index;