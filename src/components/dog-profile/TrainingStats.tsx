
import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import useDailyStatsStore from '@/store/dailyStatsStore';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface TrainingStatsProps {
  stats: {
    consecutiveDays: number;
    badgesCount: number;
  };
}

const TrainingStats = ({ stats }: TrainingStatsProps) => {
  const {
    walkCount,
    poopCount,
    incrementWalk,
    incrementPoop,
    checkAndResetCounts,
    setWalk,
    setPoop,
  } = useDailyStatsStore();

  useEffect(() => {
    checkAndResetCounts();
  }, [checkAndResetCounts]);

  const handleLongPress = (type: 'walk' | 'poop') => {
    const newCountStr = prompt(`새로운 ${type === 'walk' ? '산책' : '응가'} 횟수를 입력하세요:`);
    if (newCountStr !== null) {
      const newCount = parseInt(newCountStr, 10);
      if (!isNaN(newCount) && newCount >= 0) {
        if (type === 'walk') {
          setWalk(newCount);
        } else {
          setPoop(newCount);
        }
        toast.success('횟수가 성공적으로 수정되었습니다.');
      } else {
        toast.error('유효한 숫자를 입력해주세요.');
      }
    }
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      <Card className="card-soft bg-sky-50 text-center p-4">
        <div className="text-2xl mb-2">📅</div>
        <p className="text-lg font-bold text-sky-600">{stats.consecutiveDays}일</p>
        <p className="text-xs text-gray-500 font-pretendard">연속 훈련</p>
      </Card>
      <Card 
        className="card-soft bg-sky-50 text-center p-4 cursor-pointer"
        onClick={incrementWalk}
        onContextMenu={(e) => { e.preventDefault(); handleLongPress('walk'); }}
      >
        <div className="text-2xl mb-2">🐾</div>
        <p className="text-lg font-bold text-sky-600">{walkCount}회</p>
        <p className="text-xs text-gray-500 font-pretendard">산책</p>
      </Card>
      <Card 
        className="card-soft bg-sky-50 text-center p-4 cursor-pointer"
        onClick={incrementPoop}
        onContextMenu={(e) => { e.preventDefault(); handleLongPress('poop'); }}
      >
        <div className="text-2xl mb-2">💩</div>
        <p className="text-lg font-bold text-sky-600">{poopCount}회</p>
        <p className="text-xs text-gray-500 font-pretendard">응가</p>
      </Card>
    </div>
  );
};

export default TrainingStats;
