
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

interface TrainingLogProps {
  onSave: (result: { success: boolean; notes: string }) => void;
  isSaving: boolean;
}

const TrainingLog = ({ onSave, isSaving }: TrainingLogProps) => {
  const [trainingResult, setTrainingResult] = useState<{ success: boolean | null, notes: string }>({ success: null, notes: '' });

  const handleSaveClick = () => {
    if (trainingResult.success !== null) {
      onSave({ success: trainingResult.success, notes: trainingResult.notes });
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6 flex flex-col h-full space-y-6">
      <h2 className="text-2xl font-bold text-center text-foreground">훈련은 어땠나요?</h2> {/* 타이틀 색상 변경 */}
      <div className="grid grid-cols-2 gap-4">
        <Button
          onClick={() => setTrainingResult(prev => ({...prev, success: true}))}
          variant={trainingResult.success === true ? 'default' : 'outline'}
          className={`py-8 text-lg shadow-md ${
            trainingResult.success === true
              ? 'bg-training-green hover:bg-training-green/90 text-training-green-text'
              : 'border-training-green-dark text-training-green-dark hover:bg-training-green-light hover:text-training-green-dark'
          }`}
        >
          <ThumbsUp className="mr-2" /> 성공했어요!
        </Button>
        <Button
          onClick={() => setTrainingResult(prev => ({...prev, success: false}))}
          variant={trainingResult.success === false ? 'default' : 'outline'} /* 'destructive' 대신 'default' + custom class */
          className={`py-8 text-lg shadow-md ${
            trainingResult.success === false
            ? 'bg-amber-500 hover:bg-amber-500/90 text-white'
            : 'border-amber-600 text-amber-600 hover:bg-amber-100 hover:text-amber-700'
          }`}
        >
          <ThumbsDown className="mr-2" /> 어려웠어요
        </Button>
      </div>
      <div>
        <label htmlFor="notes" className="font-bold text-foreground">오늘의 기록</label> {/* 라벨 색상 변경 */}
        <Textarea
          id="notes"
          placeholder="댕댕이가 집중을 잘했어요!"
          className="mt-2 min-h-[120px] bg-background border-border focus:border-ring text-foreground placeholder:text-muted-foreground shadow-sm" /* Textarea 스타일 변경 */
          value={trainingResult.notes}
          onChange={(e) => setTrainingResult(prev => ({...prev, notes: e.target.value}))}
        />
      </div>
      <Button
        onClick={handleSaveClick}
        disabled={trainingResult.success === null || isSaving}
        size="lg"
        className="bg-training-yellow hover:bg-training-yellow/90 text-training-yellow-text w-full py-4 shadow-md" /* 버튼 스타일 변경 */
      >
        {isSaving ? "저장 중..." : "훈련 완료 기록하기"}
      </Button>
    </motion.div>
  );
};
export default TrainingLog;
