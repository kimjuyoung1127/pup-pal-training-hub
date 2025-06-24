
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
      <Card className="card-soft bg-pink-50 text-center p-4 shadow-md"> {/* 배경 및 섀도우 변경 */}
        <div className="text-3xl mb-2 text-pink-500">📅</div> {/* 아이콘 색상 및 크기 변경 */}
        <p className="text-lg font-bold text-pink-600">{stats.consecutiveDays}일</p> {/* 스탯 값 색상 변경 */}
        <p className="text-xs text-muted-foreground font-pretendard">연속 훈련</p> {/* 라벨 색상 변경 */}
      </Card>
      <Card className="card-soft bg-pink-50 text-center p-4 shadow-md"> {/* 배경 및 섀도우 변경 */}
        <div className="text-3xl mb-2 text-pink-500">🏆</div> {/* 아이콘 색상 및 크기 변경 */}
        <p className="text-lg font-bold text-pink-600">{stats.averageSuccessRate}%</p> {/* 스탯 값 색상 변경 */}
        <p className="text-xs text-muted-foreground font-pretendard">성공률</p> {/* 라벨 색상 변경 */}
      </Card>
      <Card className="card-soft bg-pink-50 text-center p-4 shadow-md"> {/* 배경 및 섀도우 변경 */}
        <div className="text-3xl mb-2 text-pink-500">⭐</div> {/* 아이콘 색상 및 크기 변경 */}
        <p className="text-lg font-bold text-pink-600">{stats.badgesCount}</p> {/* 스탯 값 색상 변경 */}
        <p className="text-xs text-muted-foreground font-pretendard">획득 뱃지</p> {/* 라벨 색상 변경 */}
      </Card>
    </div>
  );
};

export default TrainingStats;
