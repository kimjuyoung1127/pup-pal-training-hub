import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import OnboardingPage from '@/components/OnboardingPage';
import LoginPage from '@/components/LoginPage';
import DashboardPage from '@/components/DashboardPage';
import DogInfoPage from '@/components/DogInfoPage';
import DogProfilePage from '@/components/DogProfilePage';
import SettingsPage from '@/components/SettingsPage';
import TrainingHistoryPage from '@/components/TrainingHistoryPage';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { useDogProfile } from '@/hooks/useDogProfile';
import TestNavPage from './TestNavPage';
import AiTrainingRecommender from '@/components/AiTrainingRecommender';
import AppCoreHeader from '@/components/AppCoreHeader';
import PostureAnalysisPage from '@/pages/tools/PostureAnalysisPage';
import PostureAnalysisHistoryPage from '@/pages/history/PostureAnalysisHistoryPage';

const AppCore: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { dogInfo: profileDogInfo, isLoading: isDogInfoLoading } = useDogProfile();
  const location = useLocation();

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

  if (loading || isDogInfoLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-2xl font-bold text-rose-800">로딩 중...</div>
      </div>
    );
  }

  if (session) {
    if (!profileDogInfo && !location.pathname.startsWith('/app/dog-info') && !location.pathname.startsWith('/app/test-nav')) {
      return <DogInfoPage onComplete={() => window.location.reload()} dogInfoToEdit={null} />;
    }
  } else {
    if (!location.pathname.startsWith('/app/login') && !location.pathname.startsWith('/app/onboarding') && !location.pathname.startsWith('/app/test-nav')) {
      const onboardingComplete = localStorage.getItem('onboardingComplete');
      return onboardingComplete ? <LoginPage onLogin={() => {}} /> : <OnboardingPage onComplete={() => {}} />;
    }
  }

  return (
    <div className="relative min-h-screen">
      <AppCoreHeader />
      <main className="p-4">
        <Routes>
          <Route index element={<DashboardPage />} />
          <Route path="dog-info" element={<DogInfoPage onComplete={() => window.location.reload()} dogInfoToEdit={null} />} />
          <Route path="my-page" element={<DogProfilePage />} />
          <Route path="history" element={<TrainingHistoryPage />} />
          <Route path="settings" element={<SettingsPage />} />
          
          {/* Extra pages, not in header but accessible */}
          <Route path="training-recommender" element={<AiTrainingRecommender />} />
          <Route path="posture-analysis" element={<PostureAnalysisPage />} />
          <Route path="posture-analysis-history" element={<PostureAnalysisHistoryPage />} />
          <Route path="test-nav" element={<TestNavPage />} />

          {/* Auth routes */}
          <Route path="onboarding" element={<OnboardingPage onComplete={() => {}} />} />
          <Route path="login" element={<LoginPage onLogin={() => {}} />} />

          {/* Fallback Route */}
          <Route path="*" element={<DashboardPage />} />
        </Routes>
      </main>
    </div>
  );
};

export default AppCore;
