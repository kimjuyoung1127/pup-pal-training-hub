
import { useState, useEffect } from 'react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useDashboardStore } from '@/store/dashboardStore';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { BookOpen, BarChart3, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Video {
  youtube_video_id: string;
  title: string;
  description: string;
  trainingTopic: string;
  trainingStyle: string;
  origin: 'korean' | 'english' | 'japanese';
}

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
  const [originFilter, setOriginFilter] = useState('all');
  const { dog, tip, videos, mission, isLoading } = useDashboardData(originFilter);
  const { missionCompleted, toggleMissionCompleted, resetMissionIfNeeded } = useDashboardStore();
  const navigate = useNavigate();

  const [randomWelcome, setRandomWelcome] = useState('');
  const [randomTip, setRandomTip] = useState('');
  const [originalVideos, setOriginalVideos] = useState<Video[] | undefined>([]);
  const [filteredVideos, setFilteredVideos] = useState<Video[] | undefined>([]);
  const [showVideos, setShowVideos] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

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

  useEffect(() => {
    if (videos) {
      setOriginalVideos(videos as Video[]);
    }
  }, [videos]);

  useEffect(() => {
    if (hasSearched) {
      handleSearchVideos();
    }
  }, [originFilter]);

  const handleSearchVideos = () => {
    if (originalVideos) {
      let newFilteredVideos: Video[] = [...originalVideos];

      if (originFilter !== 'all') {
        newFilteredVideos = newFilteredVideos.filter(video => video.origin === originFilter);
      }

      setFilteredVideos(newFilteredVideos.slice(0, 2));
      setShowVideos(true);
      if (!hasSearched) setHasSearched(true);
    }
  };

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

      {/* Training tip */}
      <motion.div variants={itemVariants}>
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

      {/* Recommended video filter */}
      <motion.div variants={itemVariants} className="space-y-4">
        <Card className="card-soft p-6 bg-sky-50">
          <h3 className="font-bold text-sky-900 mb-4">추천 영상 필터</h3>
          <div className="flex flex-col sm:flex-row gap-4 text-sky-900">
            <Select value={originFilter} onValueChange={setOriginFilter}>
              <SelectTrigger className="bg-white text-sky-900 border-sky-300">
                <SelectValue placeholder="국가/언어" />
              </SelectTrigger>
              <SelectContent className="bg-white text-sky-900">
                <SelectItem value="all">모든 국가</SelectItem>
                <SelectItem value="korean">한국어</SelectItem>
                <SelectItem value="english">영어</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleSearchVideos} className="w-full btn-primary mt-4 bg-sky-600 hover:bg-sky-700 text-white">
            훈련 영상 찾아보기
          </Button>
        </Card>
      </motion.div>

      {/* Recommended video List */}
      {showVideos && filteredVideos.map((video) => (
        <motion.div variants={itemVariants} key={video.youtube_video_id}>
          <Card className="card-soft overflow-hidden bg-sky-50">
            <div className="w-full aspect-video">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${video.youtube_video_id}`}
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <CardContent className="p-4">
              <h3 className="font-bold text-sky-900 mb-2 truncate">{video.title}</h3>
              <p className="text-sm text-sky-700 line-clamp-2">
                {video.description}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}

      {/* Dog reminder */}
      {reminder && (
        <motion.div variants={itemVariants}>
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

      {/* Daily mission */}
      {mission && (
        <motion.div variants={itemVariants}>
          <Card className="card-soft p-6 bg-blue-100">
            <div className="flex items-start space-x-3">
              <div className="text-2xl">🎯</div>
              <div className="flex-1">
                <h3 className="font-bold text-sky-900 mb-2">오늘의 미션</h3>
                <p className="text-sm text-sky-800 leading-relaxed">{mission.mission}</p>
              </div>
              <Checkbox
                checked={missionCompleted}
                onCheckedChange={toggleMissionCompleted}
                className="w-6 h-6 border-sky-400 data-[state=checked]:bg-sky-600"
                id="daily-mission"
              />
            </div>
          </Card>
        </motion.div>
      )}

      {/* Action buttons */}
      <motion.div className="space-y-4" variants={itemVariants}>
        <Button onClick={() => navigate('/chat')} className="w-full btn-primary justify-between py-6 bg-blue-500 hover:bg-blue-600 text-white">
          <div className="flex items-center space-x-3">
            <Sparkles className="w-5 h-5" />
            <span className="text-lg">AI 훈련 코치와 대화하기</span>
          </div>
          <div className="text-2xl">🤖</div>
        </Button>

        <Button onClick={() => onNavigate('dog-info')} className="w-full btn-secondary justify-between py-6 bg-teal-500 hover:bg-teal-600 text-white">
          <div className="flex items-center space-x-3">
            <BookOpen className="w-5 h-5" />
            <span className="text-lg">강아지 정보 새로 입력하기</span>
          </div>
          <div className="text-2xl">🐕</div>
        </Button>

        <Button onClick={() => onNavigate('history')} className="w-full btn-secondary justify-between py-6 bg-indigo-500 hover:bg-indigo-600 text-white">
          <div className="flex items-center space-x-3">
            <BarChart3 className="w-5 h-5" />
            <span className="text-lg">훈련 기록 보기</span>
          </div>
          <div className="text-2xl">📊</div>
        </Button>
        <Button onClick={() => window.open('https://puppyvill.com/jason', '_blank')} className="w-full btn-secondary justify-between py-6 bg-purple-500 hover:bg-purple-600 text-white">
          <div className="flex items-center space-x-3">
            <Sparkles className="fas fa-handshake w-5 h-5"></Sparkles>
            <span className="text-lg">오프라인 훈련 받기</span>
          </div>
          <div className="text-2xl">🤝</div>
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default DashboardContent;
