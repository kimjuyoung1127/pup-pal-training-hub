
import React, { useEffect } from 'react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useDashboardStore } from '@/store/dashboardStore';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { BookOpen, BarChart3 } from 'lucide-react';

const DashboardContent = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  const { dog, tip, video, mission, isLoading } = useDashboardData();
  const { missionCompleted, toggleMissionCompleted, resetMissionIfNeeded } = useDashboardStore();

  useEffect(() => {
    resetMissionIfNeeded();
  }, [resetMissionIfNeeded]);
  
  const today = new Date();
  const weatherIcon = '☀️'; // Simple emoji weather

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Card className="card-soft p-6">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-cream-200 h-12 w-12"></div>
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-cream-200 rounded w-3/4"></div>
              <div className="h-4 bg-cream-200 rounded w-1/2"></div>
            </div>
          </div>
        </Card>
        {[...Array(4)].map((_, i) => (
            <Card key={i} className="card-soft p-6 h-24 animate-pulse"></Card>
        ))}
      </div>
    )
  }

  const dogName = dog?.name || '친구';

  const getDogReminder = () => {
    if (!dog?.weight) return null;
    const weight = parseInt(dog.weight, 10);
    if (weight >= 7) {
      return `현재 체중 ${dog.weight}kg. 관절 보호에 신경 써주세요 🦴`;
    }
    return `현재 체중 ${dog.weight}kg. 적정 체중을 잘 유지하고 있어요! 👍`;
  };
  const reminder = getDogReminder();

  return (
    <motion.div
      className="p-6 space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Welcome card */}
      <motion.div variants={itemVariants}>
        <Card className="card-soft p-6">
          <div className="flex items-center space-x-4">
            <div className="text-4xl">💬</div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-cream-800 mb-1">
                {dogName}, 오늘도 훈련할 준비 됐니?
              </h2>
              <p className="text-cream-600">
                {today.toLocaleDateString('ko-KR')} {weatherIcon}
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Training tip */}
      {tip && (
        <motion.div variants={itemVariants}>
          <Card className="card-soft p-6 bg-gradient-to-r from-orange-100 to-cream-200">
            <div className="flex items-start space-x-3">
              <div className="text-2xl">💡</div>
              <div>
                <h3 className="font-bold text-cream-800 mb-2">오늘의 팁</h3>
                <p className="text-sm text-cream-700 leading-relaxed">
                  {tip.tip}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Recommended video */}
      {video && (
        <motion.div variants={itemVariants}>
          <Card className="card-soft overflow-hidden">
            <img
              src={`https://i.ytimg.com/vi/${video.youtube_video_id}/hqdefault.jpg`}
              alt={video.title}
              className="w-full h-40 object-cover"
            />
            <CardContent className="p-4">
              <h3 className="font-bold text-cream-800 mb-2">{video.title}</h3>
              <p className="text-sm text-cream-600 mb-4 h-10 overflow-hidden">{video.description}</p>
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
          <Card className="card-soft p-6">
            <div className="flex items-start space-x-3">
              <div className="text-2xl">🐶</div>
              <div>
                <h3 className="font-bold text-cream-800 mb-2">{dogName} 리마인드</h3>
                <p className="text-sm text-cream-700 leading-relaxed">
                  {reminder}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Daily mission */}
      {mission && (
        <motion.div variants={itemVariants}>
          <Card className="card-soft p-6">
            <div className="flex items-start space-x-3">
              <div className="text-2xl">🎯</div>
              <div className="flex-1">
                <h3 className="font-bold text-cream-800 mb-2">오늘의 미션</h3>
                <p className="text-sm text-cream-700 leading-relaxed">
                  {mission.mission}
                </p>
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
        <Button
          onClick={() => onNavigate('dog-info')}
          className="w-full btn-secondary justify-between py-6"
        >
          <div className="flex items-center space-x-3">
            <BookOpen className="w-5 h-5" />
            <span className="text-lg">강아지 정보 관리</span>
          </div>
          <div className="text-2xl">🐕</div>
        </Button>

        <Button
          onClick={() => onNavigate('history')}
          className="w-full btn-secondary justify-between py-6"
        >
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
