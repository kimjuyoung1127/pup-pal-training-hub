
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
  isReplay?: boolean;
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

const TrainingSummary = ({ onNavigate, onExit, newlyAwardedBadges = [], isReplay = false }: TrainingSummaryProps) => {
  const [completionMessage, setCompletionMessage] = useState('');

  useEffect(() => {
    if (!newlyAwardedBadges || newlyAwardedBadges.length === 0) {
      const randomIndex = Math.floor(Math.random() * completionMessages.length);
      setCompletionMessage(completionMessages[randomIndex]);
    }
  }, [newlyAwardedBadges]);

  return (
    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="p-6 text-center flex flex-col items-center justify-center h-full">
      <Award className="w-20 h-20 text-training-yellow-dark mb-4 animate-bounce-gentle" /> {/* 아이콘 색상 변경 */}
      <h1 className="text-3xl font-bold text-foreground">훈련 완료!</h1> {/* 타이틀 색상 변경 */}
      <p className="text-muted-foreground mt-2 mb-6"> {/* 설명 색상 변경 */}
        {newlyAwardedBadges.length === 0 && completionMessage}
      </p>
      
      <Card className="card-soft p-4 mb-8 w-full bg-training-yellow-light shadow-md"> {/* 카드 배경 및 섀도우 변경 */}
        {newlyAwardedBadges.length > 0 ? (
          newlyAwardedBadges.map(badge => (
            <p key={badge.id} className="font-bold text-lg text-training-yellow-dark">🏅 '{badge.name}' 뱃지를 획득했어요!</p> /* 텍스트 색상 변경 */
          ))
        ) : (
          <p className="font-bold text-lg text-muted-foreground">새로 획득한 뱃지가 없어요.</p> /* 텍스트 색상 변경 */
        )}
      </Card>

      <div className="space-y-4 w-full">
        {isReplay ? (
          <Button
            onClick={onExit}
            size="lg"
            className="w-full bg-training-yellow hover:bg-training-yellow/90 text-training-yellow-text shadow-md" /* 버튼 스타일 변경 */
          >
            기록 목록으로 돌아가기
          </Button>
        ) : (
          <>
           
            <Button onClick={onExit} size="lg" variant="ghost" className="w-full text-muted-foreground hover:bg-muted hover:text-foreground shadow"> {/* 버튼 스타일 변경 */}
              완료
            </Button>
          </>
        )}
      </div>
    </motion.div>
  );
};
export default TrainingSummary;
