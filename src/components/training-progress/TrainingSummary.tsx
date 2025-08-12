
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Award } from 'lucide-react';
import { TrainingLog } from '@/hooks/useTrainingHistory';
import confetti from 'canvas-confetti';

interface Badge {
  id: number;
  name: string;
  description: string;
  icon_url: string;
}

interface TrainingSummaryProps {
  onNavigate: (page: string, params?: any) => void;
  onExit: () => void;
  newlyAwardedBadges?: Badge[];
  isReplay?: boolean;
  trainingLog?: TrainingLog | null;
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

const TrainingSummary = ({ onNavigate, onExit, newlyAwardedBadges = [], isReplay = false, trainingLog = null }: TrainingSummaryProps) => {
  const [completionMessage, setCompletionMessage] = useState('');

  useEffect(() => {
    if (!newlyAwardedBadges || newlyAwardedBadges.length === 0) {
      const randomIndex = Math.floor(Math.random() * completionMessages.length);
      setCompletionMessage(completionMessages[randomIndex]);
    } else {
      // 뱃지 획득 시 메시지 설정
      const badgeNames = newlyAwardedBadges.map(b => b.name).join(', ');
      setCompletionMessage(`대단해요! ${badgeNames} 뱃지를 획득했어요!`);
    }
  }, [newlyAwardedBadges]);

  useEffect(() => {
    if (isReplay) return;

    const triggerConfetti = () => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      if (newlyAwardedBadges.length > 0) {
        // 뱃지 획득 시 더 화려한 효과
        setTimeout(() => {
          confetti({
            particleCount: 150,
            spread: 120,
            origin: { y: 0.5, x: 0.5 },
            angle: 90,
            startVelocity: 30,
            ticks: 400,
          });
        }, 300);
      }
    };

    triggerConfetti();
  }, [isReplay]); // 의존성 배열에서 newlyAwardedBadges 제거

  return (
    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="p-6 text-center flex flex-col items-center justify-center h-full">
      <Award className="w-20 h-20 text-sky-500 mb-4 animate-bounce-gentle" />
      <h1 className="text-3xl font-bold text-sky-800">훈련 완료!</h1>
      <p className="text-gray-600 mt-2 mb-6">
        {completionMessage}
      </p>
      
      <Card className="bg-sky-50 border-sky-200 p-4 mb-8 w-full">
        {newlyAwardedBadges.length > 0 ? (
          newlyAwardedBadges.map(badge => (
            <p key={badge.id} className="font-bold text-lg text-sky-700">🏅 '{badge.name}' 뱃지를 획득했어요!</p>
          ))
        ) : (
          <p className="font-bold text-lg text-gray-600">새로 획득한 뱃지가 없어요.</p>
        )}
      </Card>

      <div className="space-y-4 w-full">
        {isReplay ? (
          <Button onClick={onExit} size="lg" className="w-full bg-sky-600 hover:bg-sky-700 text-white">
            기록 목록으로 돌아가기
          </Button>
        ) : (
          <>
            <div className="space-y-4 w-full">
              <Button onClick={onExit} size="lg" className="w-full bg-sky-600 hover:bg-sky-700 text-white">
                돌아가기
              </Button>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};
export default TrainingSummary;
