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
      className="px-2 sm:px-4 pt-4 pb-4 space-y-4" // 모바일에서 패딩 축소
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

      {/* Welcome Card - 모바일 최적화 */}
      <motion.div variants={itemVariants} className="welcome-card mb-4">
        <Card className="card-soft p-3 sm:p-6 bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="text-3xl sm:text-4xl bg-sky-100 p-2 sm:p-3 rounded-full">👋</div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg sm:text-xl font-bold text-sky-900 mb-1 sm:mb-2 leading-tight break-keep word-break-keep">
                {randomWelcome}
              </h2>
              <p className="text-xs sm:text-sm text-sky-700 flex items-center space-x-2">
                <span>{today.toLocaleDateString('ko-KR')}</span>
                <span className="text-base sm:text-lg">{weatherIcon}</span>
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Action Buttons - 모바일 최적화 */}
      <motion.div className="space-y-3 action-buttons" variants={itemVariants}>
        <Button 
          onClick={() => onNavigate('dog-info')} 
          className="w-full justify-between py-4 sm:py-6 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] dog-info-button"
        >
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            <div className="bg-white/20 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="text-sm sm:text-lg font-semibold truncate">강아지 정보 입력하기</span>
          </div>
          <div className="text-xl sm:text-2xl flex-shrink-0">🐕</div>
        </Button>

        <Button 
          onClick={() => navigate('/app/training-recommender')} 
          className="w-full justify-between py-4 sm:py-6 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] ai-recommender-button"
        >
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            <div className="bg-white/20 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="text-sm sm:text-lg font-semibold truncate">AI 훈련 추천</span>
          </div>
          <div className="text-xl sm:text-2xl flex-shrink-0">✨</div>
        </Button>

        <Button 
          onClick={() => navigate('/chat')} 
          className="w-full justify-between py-4 sm:py-6 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] ai-coach-button"
        >
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            <div className="bg-white/20 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="text-sm sm:text-lg font-semibold truncate">AI 훈련 코치와 대화하기</span>
          </div>
          <div className="text-xl sm:text-2xl flex-shrink-0">🤖</div>
        </Button>

        <Button 
          onClick={() => navigate('/app/posture-analysis')} 
          className="w-full justify-between py-4 sm:py-6 bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] joint-analysis-button"
        >
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            <div className="bg-white/20 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
              <HeartPulse className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="text-sm sm:text-lg font-semibold truncate">AI 자세 분석</span>
          </div>
          <div className="text-xl sm:text-2xl flex-shrink-0">🔬</div>
        </Button>

        <Button 
          onClick={() => onNavigate('history')} 
          className="w-full justify-between py-4 sm:py-6 bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-700 hover:to-orange-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] training-history-button"
        >
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            <div className="bg-white/20 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="text-sm sm:text-lg font-semibold truncate">훈련 기록 보기</span>
          </div>
          <div className="text-xl sm:text-2xl flex-shrink-0">📊</div>
        </Button>
        
        <Button 
          onClick={() => window.open('https://puppyvill.com/jason', '_blank')} 
          className="w-full justify-between py-4 sm:py-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] offline-training-button"
        >
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            <div className="bg-white/20 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="text-sm sm:text-lg font-semibold truncate">오프라인 훈련 받아보기</span>
          </div>
          <div className="text-xl sm:text-2xl flex-shrink-0">🎓</div>
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default DashboardContent;
