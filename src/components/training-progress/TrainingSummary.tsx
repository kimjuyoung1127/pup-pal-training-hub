
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Award } from 'lucide-react';

interface TrainingSummaryProps {
  onNavigate: (page: string) => void;
  onExit: () => void;
}

const TrainingSummary = ({ onNavigate, onExit }: TrainingSummaryProps) => {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="p-6 text-center flex flex-col items-center justify-center h-full">
      <Award className="w-20 h-20 text-yellow-500 mb-4 animate-bounce-gentle" />
      <h1 className="text-3xl font-bold text-gray-800">훈련 완료!</h1>
      <p className="text-cream-700 mt-2 mb-6">수고했어요! 오늘도 한 걸음 성장했네요.</p>
      
      <Card className="card-soft p-4 mb-8 w-full">
        <p className="font-bold text-lg text-orange-600">🏅 '첫 훈련 파트너' 뱃지를 획득했어요!</p>
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
