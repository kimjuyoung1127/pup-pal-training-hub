
import React from 'react';
import { Card } from '@/components/ui/card';

interface TrainingStatsProps {
  stats: {
    consecutiveDays: number;
    averageSuccessRate: number;
    badgesCount: number;
  };
}

const TrainingStats = ({ stats }: TrainingStatsProps) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      <Card className="card-soft bg-green-50 text-center p-4">
        <div className="text-2xl mb-2">📅</div>
        <p className="text-lg font-bold text-green-600">{stats.consecutiveDays}일</p>
        <p className="text-xs text-cream-600 font-pretendard">연속 훈련</p>
      </Card>
      <Card className="card-soft bg-green-50 text-center p-4">
        <div className="text-2xl mb-2">🏆</div>
        <p className="text-lg font-bold text-green-600">{stats.averageSuccessRate}%</p>
        <p className="text-xs text-cream-600 font-pretendard">성공률</p>
      </Card>
      <Card className="card-soft bg-green-50 text-center p-4">
        <div className="text-2xl mb-2">⭐</div>
        <p className="text-lg font-bold text-green-600">{stats.badgesCount}</p>
        <p className="text-xs text-cream-600 font-pretendard">획득 뱃지</p>
      </Card>
    </div>
  );
};

export default TrainingStats;
