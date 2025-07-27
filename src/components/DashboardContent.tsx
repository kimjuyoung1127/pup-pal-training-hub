
import { useEffect, useState } from 'react';
import { useDashboardStore } from '@/store/dashboardStore';
import { welcomeMessages } from '@/lib/welcomeMessages';
import { trainingTips } from '@/lib/trainingTips';
import { breedData, DogInfo, AgeGroup, GenderKey } from '@/types/dog';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { BookOpen, BarChart3, Sparkles, HeartPulse } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Joyride, { Step, CallBackProps } from 'react-joyride';
import { useDashboardData } from '@/hooks/useDashboardData';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
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
}

const DashboardContent = ({ onNavigate }: DashboardContentProps) => {
  const { dog, tip, mission, isLoading } = useDashboardData();
  const { missionCompleted, toggleMissionCompleted, resetMissionIfNeeded } = useDashboardStore();
  const navigate = useNavigate();

  const [runTour, setRunTour] = useState(false);

  useEffect(() => {
    const isFirstVisit = localStorage.getItem('hasVisitedDashboard') !== 'true';
    if (isFirstVisit) {
      setRunTour(true);
      localStorage.setItem('hasVisitedDashboard', 'true');
    }
  }, []);

  const [randomWelcome, setRandomWelcome] = useState('');
  const [randomTip, setRandomTip] = useState('');
  const [showMission, setShowMission] = useState(true);

  const tourSteps: Step[] = [
    {
      target: '.ai-coach-button',
      title: 'AI 훈련 코치',
      content: 'AI 훈련 코치와 대화하며 강아지 훈련에 대한 도움을 받을 수 있습니다.',
      disableBeacon: true,
      disableScrolling: false,
    },
    {
      target: '.dog-info-button',
      title: '강아지 정보 입력',
      content: '강아지의 정보를 입력하고 맞춤형 서비스를 받아보세요.',
      disableScrolling: false,
    },
    {
      target: '.training-history-button',
      title: '훈련 기록 보기',
      content: '이곳에서 강아지의 훈련 진행 상황을 확인할 수 있습니다.',
      disableScrolling: false,
    },
    {
      target: '.offline-training-button',
      title: '오프라인 훈련소 가기',
      content: '전문가의 도움이 필요하다면 오프라인 훈련소 정보를 찾아보세요.',
      disableScrolling: false,
    },
  ];

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
    resetMissionIfNeeded();
    const lastCompletionDate = localStorage.getItem('missionCompletionDate');
    const todayStr = new Date().toISOString().split('T')[0];
    if (lastCompletionDate === todayStr) {
      setShowMission(false);
    } else {
      setShowMission(true);
    }
  }, [resetMissionIfNeeded]);

  useEffect(() => {
    const welcomeIndex = Math.floor(Math.random() * welcomeMessages.length);
    setRandomWelcome(welcomeMessages[welcomeIndex].replace('{dogName}', dogName));

    const tipIndex = Math.floor(Math.random() * trainingTips.length);
    setRandomTip(trainingTips[tipIndex]);
  }, [dogName]);

  const handleMissionComplete = () => {
    toggleMissionCompleted();
    toast.success('오늘의 미션 완료! 멋져요! 🎉');
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
    setShowMission(false);
    const todayStr = new Date().toISOString().split('T')[0];
    localStorage.setItem('missionCompletionDate', todayStr);
  };

  const getDogReminder = (dogInfo: DogInfo | null) => {
    if (!dogInfo || dogInfo.weight === null || !dogInfo.age || dogInfo.age.years === null) return null;

    const { weight, age, breed, gender } = dogInfo;
    const totalMonths = age.years * 12 + (age.months || 0);

    const ageGroup: AgeGroup = totalMonths < 12 ? 'puppy' : (age.years < 8 ? 'adult' : 'senior');
    const genderKey: GenderKey = gender === '수컷' ? 'male' : 'female';

    const currentBreedData = breedData[breed] || breedData['믹스견'];
    const idealWeight = currentBreedData.idealWeight[ageGroup][genderKey];
    const [idealWeightLower, idealWeightUpper] = idealWeight;

    if (weight > idealWeightUpper * 1.2) {
      return `현재 체중(${weight}kg)이 적정 범위(${idealWeightLower}~${idealWeightUpper}kg)보다 많이 나가요. 관절 보호에 신경 써주세요. 🦴`;
    } else if (weight > idealWeightUpper) {
      return `현재 체중(${weight}kg)이 적정 범위(${idealWeightLower}~${idealWeightUpper}kg)를 살짝 넘었어요. 꾸준한 산책으로 관리해주세요. 🏃‍♂️`;
    } else if (weight < idealWeightLower) {
      return `현재 체중(${weight}kg)이 적정 범위(${idealWeightLower}~${idealWeightUpper}kg)보다 조금 미달이에요. 영양 균형을 확인하고 체력을 보충해주세요. 🍚`;
    } else {
      return `현재 적정 체중(${weight}kg)을 잘 유지하고 있어요! 👍`;
    }
  };

  const reminder = getDogReminder(dog);

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
      className="p-6 space-y-6 relative"
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

      <motion.div className="space-y-4 action-buttons" variants={itemVariants}>
        <Button onClick={() => onNavigate('dog-info')} className="w-full btn-secondary justify-between py-6 bg-teal-500 hover:bg-teal-600 text-white dog-info-button">
          <div className="flex items-center space-x-3">
            <BookOpen className="w-5 h-5" />
            <span className="text-lg">강아지 정보 입력하기</span>
          </div>
          <div className="text-2xl">🐕</div>
        </Button>

        <Button onClick={() => navigate('/chat')} className="w-full btn-primary justify-between py-6 bg-blue-500 hover:bg-blue-600 text-white ai-coach-button">
          <div className="flex items-center space-x-3">
            <Sparkles className="w-5 h-5" />
            <span className="text-lg">AI 훈련 코치와 대화하기</span>
          </div>
          <div className="text-2xl">🤖</div>
        </Button>

        <Button onClick={() => navigate('/tools/joint-analysis')} className="w-full btn-primary justify-between py-6 bg-orange-500 hover:bg-orange-600 text-white joint-analysis-button">
          <div className="flex items-center space-x-3">
            <HeartPulse className="w-5 h-5" />
            <span className="text-lg">AI 관절 움직임 분석</span>
          </div>
          <div className="text-2xl">🔬</div>
        </Button>

        <Button onClick={() => onNavigate('history')} className="w-full btn-secondary justify-between py-6 bg-indigo-500 hover:bg-indigo-600 text-white training-history-button">
          <div className="flex items-center space-x-3">
            <BarChart3 className="w-5 h-5" />
            <span className="text-lg">훈련 기록 보기</span>
          </div>
          <div className="text-2xl">📊</div>
        </Button>
        
        <Button onClick={() => window.open('https://puppyvill.com/jason', '_blank')} className="w-full btn-secondary justify-between py-6 bg-purple-500 hover:bg-purple-600 text-white offline-training-button">
          <div className="flex items-center space-x-3">
            <BookOpen className="w-5 h-5" />
            <span className="text-lg">오프라인 훈련 받아보기</span>
          </div>
          <div className="text-2xl">🎓</div>
        </Button>
      </motion.div>

      <motion.div variants={itemVariants} className="welcome-card">
        <Card className="card-soft p-6 bg-sky-100">
          <div className="flex items-center space-x-4">
            <div className="text-4xl">👋</div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-sky-900 mb-1">
                {randomWelcome}
              </h2>
              <p className="text-sky-700">
                {today.toLocaleDateString('ko-KR')} {weatherIcon}
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {reminder && (
        <motion.div variants={itemVariants} className="dog-reminder-card">
          <Card className="card-soft p-6 bg-blue-100">
            <div className="flex items-start space-x-3">
              <div className="text-2xl">🐶</div>
              <div>
                <h3 className="font-bold text-sky-900 mb-2">{dogName} 리마인드</h3>
                <p className="text-sm text-sky-800 leading-relaxed">{reminder}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      <motion.div variants={itemVariants} className="training-tip-card">
        <Card className="card-soft p-6 bg-gradient-to-r from-sky-100 to-blue-200">
          <div className="flex items-start space-x-3">
            <div className="text-2xl">💡</div>
            <div>
              <h3 className="font-bold text-sky-900 mb-2">오늘의 팁</h3>
              <p className="text-sm text-sky-800 leading-relaxed">
                {randomTip}
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      <AnimatePresence>
        {mission && showMission && !missionCompleted && (
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -20, transition: { duration: 0.5 } }}
            className="daily-mission-card"
          >
            <Card className="card-soft p-6 bg-blue-100">
              <div className="flex items-start space-x-3">
                <div className="text-2xl">🎯</div>
                <div className="flex-1">
                  <h3 className="font-bold text-sky-900 mb-2">오늘의 미션</h3>
                  <p className="text-sm text-sky-800 leading-relaxed">{mission.mission}</p>
                </div>
                <Checkbox
                  checked={missionCompleted}
                  onCheckedChange={handleMissionComplete}
                  className="w-6 h-6 border-sky-400 data-[state=checked]:bg-sky-600"
                  id="daily-mission"
                />
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default DashboardContent;
