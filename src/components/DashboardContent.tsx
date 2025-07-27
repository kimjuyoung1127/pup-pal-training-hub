import { useEffect, useState } from 'react';
import { welcomeMessages } from '@/lib/welcomeMessages';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, BarChart3, Sparkles, HeartPulse } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Joyride, { CallBackProps } from 'react-joyride';
import { useDashboardData } from '@/hooks/useDashboardData';
import { tourSteps } from '@/lib/tourSteps'; // 분리된 투어 스텝 import
import '@/App.css';

const PawPrintLoading = () => (
  <div className="paw-loader">
    <span>🐾</span>
    <span>🐾</span>
    <span>🐾</span>
    <span>🐾</span>
  </div>
);

interface DashboardContentProps {
  onNavigate: (page: string) => void;
  runTour: boolean;
  setRunTour: (run: boolean) => void;
}

const DashboardContent = ({ onNavigate, runTour, setRunTour }: DashboardContentProps) => {
  const { dog, isLoading } = useDashboardData();
  const navigate = useNavigate();

  const [randomWelcome, setRandomWelcome] = useState('');

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    if (['finished', 'skipped'].includes(status)) {
      setRunTour(false);
    }
  };

  const dogName = dog?.name || '친구';
  const today = new Date();
  const weatherIcon = '☀️';

  useEffect(() => {
    const welcomeIndex = Math.floor(Math.random() * welcomeMessages.length);
    setRandomWelcome(welcomeMessages[welcomeIndex].replace('{dogName}', dogName));
  }, [dogName]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-white bg-opacity-80 z-50">
        <PawPrintLoading />
      </div>
    );
  }

  return (
    <motion.div
      className="px-6 pt-6 pb-6 space-y-6" // pt-24를 pt-6으로 변경하여 간격 최적화
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Joyride
        steps={tourSteps}
        run={runTour}
        continuous
        showProgress={false}
        showSkipButton
        callback={handleJoyrideCallback}
        scrollOffset={100}
        locale={{
          back: '이전',
          close: '닫기',
          last: '시작하기',
          next: '다음',
          skip: '건너뛰기',
        }}
        styles={{
          options: {
            primaryColor: '#0ea5e9',
            textColor: '#0c4a6e',
            arrowColor: '#ffffff',
            backgroundColor: '#ffffff',
            overlayColor: 'rgba(0, 0, 0, 0.5)',
          },
          buttonClose: {
            color: '#0c4a6e',
          },
          buttonNext: {
            backgroundColor: '#0ea5e9',
            color: 'white',
          },
          buttonBack: {
            color: '#0ea5e9',
            marginRight: 'auto',
          },
        }}
      />

      {/* Welcome Card - 개선된 스타일 */}
      <motion.div variants={itemVariants} className="welcome-card mb-6">
        <Card className="card-soft p-6 bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200 shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="text-4xl bg-sky-100 p-3 rounded-full">👋</div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-sky-900 mb-2">
                {randomWelcome}
              </h2>
              <p className="text-sm text-sky-700 flex items-center space-x-2">
                <span>{today.toLocaleDateString('ko-KR')}</span>
                <span className="text-lg">{weatherIcon}</span>
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Action Buttons - 강아지 정보입력과 오프라인훈련을 밝은 색으로 변경 */}
      <motion.div className="space-y-4 action-buttons" variants={itemVariants}>
        <Button 
          onClick={() => onNavigate('dog-info')} 
          className="w-full justify-between py-6 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] dog-info-button"
        >
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-lg font-semibold">강아지 정보 입력하기</span>
          </div>
          <div className="text-2xl">🐕</div>
        </Button>

        <Button 
          onClick={() => navigate('/app/training-recommender')} 
          className="w-full justify-between py-6 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] ai-recommender-button"
        >
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-lg font-semibold">AI 훈련 추천</span>
          </div>
          <div className="text-2xl">✨</div>
        </Button>

        <Button 
          onClick={() => navigate('/chat')} 
          className="w-full justify-between py-6 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] ai-coach-button"
        >
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-lg font-semibold">AI 훈련 코치와 대화하기</span>
          </div>
          <div className="text-2xl">🤖</div>
        </Button>

        <Button 
          onClick={() => navigate('/app/posture-analysis')} 
          className="w-full justify-between py-6 bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] joint-analysis-button"
        >
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <HeartPulse className="w-5 h-5" />
            </div>
            <span className="text-lg font-semibold">AI 자세 분석</span>
          </div>
          <div className="text-2xl">🔬</div>
        </Button>

        <Button 
          onClick={() => onNavigate('history')} 
          className="w-full justify-between py-6 bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-700 hover:to-orange-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] training-history-button"
        >
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <BarChart3 className="w-5 h-5" />
            </div>
            <span className="text-lg font-semibold">훈련 기록 보기</span>
          </div>
          <div className="text-2xl">📊</div>
        </Button>
        
        <Button 
          onClick={() => window.open('https://puppyvill.com/jason', '_blank')} 
          className="w-full justify-between py-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] offline-training-button"
        >
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-lg font-semibold">오프라인 훈련 받아보기</span>
          </div>
          <div className="text-2xl">🎓</div>
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default DashboardContent;
