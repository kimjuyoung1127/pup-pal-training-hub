
import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import useDailyStatsStore from '@/store/dailyStatsStore';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface TrainingStatsProps {
  stats: {
    consecutiveDays: number;
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

  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [editingType, setEditingType] = useState<'walk' | 'poop' | null>(null);
  const [newCountInput, setNewCountInput] = useState('');

  useEffect(() => {
    checkAndResetCounts();
  }, [checkAndResetCounts]);

  const handleLongPress = (type: 'walk' | 'poop') => {
    setEditingType(type);
    const currentCount = type === 'walk' ? walkCount : poopCount;
    setNewCountInput(currentCount.toString());
    setIsAlertOpen(true);
  };

  const handleCountSubmit = () => {
    const newCount = parseInt(newCountInput, 10);
    if (editingType && !isNaN(newCount) && newCount >= 0) {
      if (editingType === 'walk') {
        setWalk(newCount);
      } else {
        setPoop(newCount);
      }
      toast.success('횟수가 성공적으로 수정되었습니다.', { icon: '✅' });
    } else {
      toast.error('유효한 숫자를 입력해주세요.', { icon: '🚨' });
    }
    setIsAlertOpen(false);
    setEditingType(null);
  };

  return (
    <>
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

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>횟수 수정</AlertDialogTitle>
            <AlertDialogDescription>
              새로운 {editingType === 'walk' ? '산책' : '응가'} 횟수를 입력하세요.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Input
            type="number"
            value={newCountInput}
            onChange={(e) => setNewCountInput(e.target.value)}
            className="mt-4"
          />
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setEditingType(null)}>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleCountSubmit}>저장</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TrainingStats;
