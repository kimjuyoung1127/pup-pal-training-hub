
import { useState, useEffect } from 'react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useDashboardStore } from '@/store/dashboardStore';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { BookOpen, BarChart3, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// 데이터 배열을 컴포넌트 외부로 분리
const welcomeMessages = [
  '오늘도 {dogName}와 함께 즐거운 훈련 시간을 보내세요!',
  '{dogName}의 새로운 재능을 발견할 준비가 되셨나요?',
  '꾸준한 훈련이 {dogName}와의 유대감을 더 깊게 만들어줍니다.',
  '오늘의 훈련 목표는 무엇인가요? {dogName}와 함께 달성해봐요!',
  '{dogName}와 함께하는 모든 순간이 소중한 추억입니다.',
  '새로운 훈련은 {dogName}에게 즐거운 자극이 될 거예요.',
];

const trainingTips = [
  '훈련은 짧고 재미있게, 하루 5분도 충분해요.',
  '긍정적인 강화(칭찬, 간식)는 최고의 동기부여 수단입니다.',
  '훈련 전 가벼운 산책은 집중력을 높이는 데 도움이 됩니다.',
  '새로운 환경에서의 훈련은 사회성을 길러주는 좋은 기회입니다.',
  '보호자의 일관된 지시는 강아지의 혼란을 줄여줍니다.',
  '훈련이 잘 되지 않을 땐, 잠시 쉬어가는 여유를 가지세요.',
];

// Props 타입 정의
interface DashboardContentProps {
  onNavigate: (page: string) => void;
}

const DashboardContent = ({ onNavigate }: DashboardContentProps) => {
  const { dog, tip, video, mission, isLoading } = useDashboardData();
  const { missionCompleted, toggleMissionCompleted, resetMissionIfNeeded } = useDashboardStore();
  const navigate = useNavigate();

  const [randomWelcome, setRandomWelcome] = useState('');
  const [randomTip, setRandomTip] = useState('');

  const dogName = dog?.name || '친구';
  const today = new Date();
  const weatherIcon = '☀️';

  useEffect(() => {
    resetMissionIfNeeded();
  }, [resetMissionIfNeeded]);

  useEffect(() => {
    const welcomeIndex = Math.floor(Math.random() * welcomeMessages.length);
    setRandomWelcome(welcomeMessages[welcomeIndex].replace('{dogName}', dogName));

    const tipIndex = Math.floor(Math.random() * trainingTips.length);
    setRandomTip(trainingTips[tipIndex]);
  }, [dogName]);

  const getDogReminder = () => {
    if (!dog?.weight) return null;
    const weight = parseInt(dog.weight, 10);
    const idealWeightLower = 5;
    const idealWeightUpper = 7;

    if (weight > idealWeightUpper + 1.5) {
      return `현재 체중이 평균보다 많이 나가요. 관절 보호에 신경 써주세요. 🦴`;
    } else if (weight > idealWeightUpper) {
      return `적정 체중을 살짝 넘었어요. 꾸준한 산책으로 관리해주세요. 🏃‍♂️`;
    } else if (weight < idealWeightLower) {
      return `조금 마른 편이네요. 영양 균형을 확인하고 체력을 보충해주세요. 🍚`;
    } else {
      return `현재 적정 체중을 잘 유지하고 있어요! 👍`;
    }
  };

  const reminder = getDogReminder();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  if (isLoading) {
    return <div>Loading...</div>; // 간단한 로딩 상태 표시
  }

  return (
    <motion.div
      className="p-6 space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Welcome card */}
      <motion.div variants={itemVariants}>
        <Card className="card-soft p-6 bg-orange-100">
          <div className="flex items-center space-x-4">
            <div className="text-4xl">👋</div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-cream-800 mb-1">
                {randomWelcome}
              </h2>
              <p className="text-cream-600">
                {today.toLocaleDateString('ko-KR')} {weatherIcon}
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Training tip */}
      <motion.div variants={itemVariants}>
        <Card className="card-soft p-6 bg-gradient-to-r from-orange-100 to-cream-200">
          <div className="flex items-start space-x-3">
            <div className="text-2xl">💡</div>
            <div>
              <h3 className="font-bold text-cream-800 mb-2">오늘의 팁</h3>
              <p className="text-sm text-cream-700 leading-relaxed">
                {randomTip}
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Recommended video */}
      {video && (
        <motion.div variants={itemVariants}>
          <Card className="card-soft overflow-hidden">
            <img
              src={`https://i.ytimg.com/vi/${video.youtube_video_id}/hqdefault.jpg`}
              alt={video.title}
              className="w-full h-40 object-cover"
            />
            <CardContent className="p-4 bg-orange-100">
              <h3 className="font-bold text-cream-800 mb-2">{video.title}</h3>
              <p className="text-sm text-cream-600 mb-4 h-10 overflow-hidden">
                {video.description}
              </p>
              <Button
                onClick={() => window.open(`https://www.youtube.com/watch?v=${video.youtube_video_id}`, '_blank')}
                className="w-full btn-primary"
              >
                영상 보기
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Dog reminder */}
      {reminder && (
        <motion.div variants={itemVariants}>
          <Card className="card-soft p-6 bg-orange-100">
            <div className="flex items-start space-x-3">
              <div className="text-2xl">🐶</div>
              <div>
                <h3 className="font-bold text-cream-800 mb-2">{dogName} 리마인드</h3>
                <p className="text-sm text-cream-700 leading-relaxed">{reminder}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Daily mission */}
      {mission && (
        <motion.div variants={itemVariants}>
          <Card className="card-soft p-6 bg-orange-100">
            <div className="flex items-start space-x-3">
              <div className="text-2xl">🎯</div>
              <div className="flex-1">
                <h3 className="font-bold text-cream-800 mb-2">오늘의 미션</h3>
                <p className="text-sm text-cream-700 leading-relaxed">{mission.mission}</p>
              </div>
              <Checkbox
                checked={missionCompleted}
                onCheckedChange={toggleMissionCompleted}
                className="w-6 h-6"
                id="daily-mission"
              />
            </div>
          </Card>
        </motion.div>
      )}

      {/* Action buttons */}
      <motion.div className="space-y-4" variants={itemVariants}>
        <Button onClick={() => navigate('/chat')} className="w-full btn-primary justify-between py-6">
          <div className="flex items-center space-x-3">
            <Sparkles className="w-5 h-5" />
            <span className="text-lg">AI 훈련 코치와 대화하기</span>
          </div>
          <div className="text-2xl">🤖</div>
        </Button>

        <Button onClick={() => onNavigate('dog-info')} className="w-full btn-secondary justify-between py-6">
          <div className="flex items-center space-x-3">
            <BookOpen className="w-5 h-5" />
            <span className="text-lg">강아지 정보 새로 입력하기</span>
          </div>
          <div className="text-2xl">🐕</div>
        </Button>

        <Button onClick={() => onNavigate('history')} className="w-full btn-secondary justify-between py-6">
          <div className="flex items-center space-x-3">
            <BarChart3 className="w-5 h-5" />
            <span className="text-lg">훈련 기록 보기</span>
          </div>
          <div className="text-2xl">📊</div>
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default DashboardContent;
