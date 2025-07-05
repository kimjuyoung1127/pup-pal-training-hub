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
import Joyride, { Step, CallBackProps } from 'react-joyride';

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
    setCurrentPage('dashboard');
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

  const handleDogInfoComplete = (completedDogInfo: any) => {
    console.log('Dog info completed:', completedDogInfo);
    setDogInfo(completedDogInfo);
    setEditingDogInfo(null);
    setCurrentPage('dog-profile'); // 페이지를 즉시 전환합니다.

    // 튜토리얼을 본 적 없는 경우에만 실행하도록 설정합니다.
    const tourShown = localStorage.getItem('missionBoardTourShown');
    if (!tourShown) {
      const newTourSteps: Step[] = [
        {
          target: '.mission-board-section',
          content: '강아지 정보 입력이 완료되었습니다! 🎉 이제 우리 강아지만을 위한 맞춤형 훈련 미션 보드를 확인해보세요.',
          disableBeacon: true,
          title: '미션 보드 도착!',
        },
      ];
      setTourSteps(newTourSteps);
      setRunTour(true);
      localStorage.setItem('missionBoardTourShown', 'true'); // 튜토리얼을 봤다고 기록합니다.
    }
  };

  // useEffect 훅은 더 이상 필요 없으므로 삭제하거나 주석 처리합니다.
  /*
  useEffect(() => {
    if (currentPage === 'dog-profile' && dogInfo) {
      console.log('Current page is dog-profile, starting tour.');
      const tourShown = localStorage.getItem('missionBoardTourShown');
      if (!tourShown) {
        const newTourSteps: Step[] = [
          {
            target: '.mission-board-section',
            content: '강아지 정보 입력이 완료되었습니다! 🎉 이제 우리 강아지만을 위한 맞춤형 훈련 미션 보드를 확인해보세요.',
            disableBeacon: true,
            title: '미션 보드 도착!',
          },
        ];
        setTourSteps(newTourSteps);
        setRunTour(true);
        localStorage.setItem('missionBoardTourShown', 'true');
      }
    }
  }, [currentPage, dogInfo]);
  */

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    if (['finished', 'skipped'].includes(status)) {
      setRunTour(false);
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
        return <DashboardPage onNavigate={handleNavigate} />;
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
        return <DashboardPage onNavigate={handleNavigate} />;
      case 'training-replay':
        if (replayParams) {
          return <TrainingReplayPage 
            trainingLog={replayParams.trainingLog}
            onExit={() => handleNavigate('history')}
          />;
        }
        return <DashboardPage onNavigate={handleNavigate} />;
      default:
        return <DashboardPage onNavigate={handleNavigate} />;
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
        steps={tourSteps}
        run={runTour}
        callback={handleJoyrideCallback}
        continuous
        showProgress
        showSkipButton
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
        <BottomNavigation 
          currentPage={currentPage}
          onNavigate={handleNavigate}
        />
      )}
    </div>
  );
};

export default Index;
