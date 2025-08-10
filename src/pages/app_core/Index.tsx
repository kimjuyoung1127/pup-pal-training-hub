import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import OnboardingPage from '@/components/OnboardingPage';
import LoginPage from '@/components/LoginPage';
import DashboardPage from '@/components/DashboardPage';
import DogInfoPage from '@/components/DogInfoPage';
import DogProfilePage from '@/components/DogProfilePage';
import SettingsPage from '@/components/SettingsPage';
import TrainingHistoryPage from '@/components/TrainingHistoryPage';
import TrainingReplayPage from '@/components/TrainingReplayPage'; // 추가
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { useDogProfile } from '@/hooks/useDogProfile';
import AiTrainingRecommender from '@/components/AiTrainingRecommender';
import AppCoreHeader from '@/components/AppCoreHeader';
import PostureAnalysisPage from '@/pages/tools/PostureAnalysisPage';
import PostureAnalysisHistoryPage from '@/pages/history/PostureAnalysisHistoryPage';
import { TrainingProgram } from '@/lib/trainingData';
import TrainingStartPage from '@/components/TrainingStartPage';

const AppCore: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { dogInfo: profileDogInfo, isLoading: isDogInfoLoading, refetchDogProfile } = useDogProfile();
  const location = useLocation();
  const navigate = useNavigate(); // useNavigate 사용
  
  // 투어 관련 상태 추가
  const [runTour, setRunTour] = useState(false);
  
  const startTour = () => {
    setRunTour(true);
  };

  const handleProfileComplete = async () => {
    await refetchDogProfile();
    navigate('/app');
  };

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
  
  // 첫 방문 시 투어 시작 로직 추가
  useEffect(() => {
    const hasSeenTour = localStorage.getItem('hasSeenDashboardTour');
    if (!hasSeenTour && session && profileDogInfo) {
      setRunTour(true);
      localStorage.setItem('hasSeenDashboardTour', 'true');
    }
  }, [session, profileDogInfo]);

  if (loading || isDogInfoLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-2xl font-bold text-rose-800">로딩 중...</div>
      </div>
    );
  }

  if (session) {
    if (!profileDogInfo && !location.pathname.startsWith('/app/dog-info') && !location.pathname.startsWith('/app/test-nav')) {
      return <DogInfoPage onComplete={handleProfileComplete} dogInfoToEdit={null} />;
    }
  } else {
    if (!location.pathname.startsWith('/app/login') && !location.pathname.startsWith('/app/onboarding') && !location.pathname.startsWith('/app/test-nav')) {
      const onboardingComplete = localStorage.getItem('onboardingComplete');
      return onboardingComplete 
        ? <LoginPage onLogin={() => navigate('/app')} /> 
        : <OnboardingPage onComplete={() => {
            console.log('onComplete received in AppCore. Navigating to /app/login...');
            localStorage.setItem('onboardingComplete', 'true'); // 온보딩 완료 상태 저장
            navigate('/app/login');
          }} />;
    }
  }

  return (
    <div className="relative">
      <AppCoreHeader />
      <main className="p-4">
        <Routes>
          <Route index element={<DashboardPage runTour={runTour} setRunTour={setRunTour} startTour={startTour} />} />
          <Route path="dog-info" element={<DogInfoPage onComplete={handleProfileComplete} dogInfoToEdit={null} />} />
          <Route path="my-page" element={<DogProfilePage onNavigate={(page, params) => navigate(page, { state: params })} />} />
          <Route path="history" element={<TrainingHistoryPage onNavigate={(page, params) => navigate(page, { state: params })} />} />
          <Route path="settings" element={<SettingsPage />} />
          
          {/* 훈련 재생 페이지 라우트 추가 */}
          <Route path="training-replay" element={
            <TrainingReplayPage 
              trainingLog={location.state?.trainingLog} 
              onExit={() => navigate('/app/history')} 
            />
          } />
          
          {/* Extra pages, not in header but accessible */}
          <Route path="training-recommender" element={<AiTrainingRecommender onSelectTraining={(training) => navigate(`/app/training-start/${training.id}`)} selectedTrainingTitle={''} />} />
          <Route path="posture-analysis" element={<PostureAnalysisPage />} />
          <Route path="posture-analysis-history" element={<PostureAnalysisHistoryPage />} />
          
          {/* 훈련 시작 페이지 라우트 추가 */}
          <Route path="training-start/:trainingId" element={<TrainingStartPage onNavigate={(path) => navigate(path)} />} />

          {/* Auth routes */}
          <Route path="onboarding" element={<OnboardingPage onComplete={() => {
            console.log('onComplete received in AppCore Route. Navigating to /app/login...');
            localStorage.setItem('onboardingComplete', 'true');
            navigate('/app/login');
          }} />} />
          <Route path="login" element={<LoginPage onLogin={() => navigate('/app')} />} />

          {/* Fallback Route */}
          <Route path="*" element={<DashboardPage runTour={runTour} setRunTour={setRunTour} startTour={startTour} />} />
        </Routes>
      </main>
    </div>
  );
};

export default AppCore;
