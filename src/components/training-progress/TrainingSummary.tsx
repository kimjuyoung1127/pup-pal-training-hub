
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Award } from 'lucide-react';

interface Badge {
  id: number;
  name: string;
  description: string;
  icon_url: string;
}

interface TrainingSummaryProps {
  onNavigate: (page: string) => void;
  onExit: () => void;
  newlyAwardedBadges?: Badge[];
}

const completionMessages = [
  "수고했어요! 오늘도 한 걸음 성장했네요.",
  "오늘의 훈련이 미래의 건강을 만들어요!",
  "정말 대단해요! 꾸준함이 중요해요.",
  "최고의 파트너와 함께하는 즐거운 시간!",
  "오늘도 목표 달성! 정말 자랑스러워요.",
  "훈련은 사랑의 또 다른 표현이에요.",
  "지치지 않는 열정, 정말 멋져요!",
  "함께 성장하는 모습이 아름다워요.",
  "오늘의 노력이 내일의 행복을 가져올 거예요.",
  "참 잘했어요! 다음 훈련도 기대되네요.",
];

const TrainingSummary = ({ onNavigate, onExit, newlyAwardedBadges = [] }: TrainingSummaryProps) => {
  const [completionMessage, setCompletionMessage] = useState('');

  useEffect(() => {
    if (!newlyAwardedBadges || newlyAwardedBadges.length === 0) {
      const randomIndex = Math.floor(Math.random() * completionMessages.length);
      setCompletionMessage(completionMessages[randomIndex]);
    }
  }, [newlyAwardedBadges]);

  return (
    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="p-6 text-center flex flex-col items-center justify-center h-full">
      <Award className="w-20 h-20 text-yellow-500 mb-4 animate-bounce-gentle" />
      <h1 className="text-3xl font-bold text-gray-800">훈련 완료!</h1>
      <p className="text-cream-700 mt-2 mb-6">
        {newlyAwardedBadges.length === 0 && completionMessage}
      </p>
      
      <Card className="card-soft p-4 mb-8 w-full">
        {newlyAwardedBadges.length > 0 ? (
          newlyAwardedBadges.map(badge => (
            <p key={badge.id} className="font-bold text-lg text-orange-600">🏅 '{badge.name}' 뱃지를 획득했어요!</p>
          ))
        ) : (
          <p className="font-bold text-lg text-gray-600">새로 획득한 뱃지가 없어요.</p>
        )}
      </Card>

      <div className="space-y-4 w-full">
        <Button onClick={() => onNavigate('history')} size="lg" className="w-full btn-secondary">
          기록 페이지로 이동
        </Button>
        <Button onClick={onExit} size="lg" variant="ghost" className="w-full text-cream-600">
          홈으로 돌아가기
        </Button>
      </div>
    </motion.div>
  );
};
export default TrainingSummary;
