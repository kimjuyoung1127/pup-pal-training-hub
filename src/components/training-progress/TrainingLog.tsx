
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
      <h2 className="text-2xl font-bold text-center text-gray-800">훈련은 어땠나요?</h2>
      <div className="grid grid-cols-2 gap-4">
        <Button
          onClick={() => setTrainingResult(prev => ({...prev, success: true}))}
          variant={trainingResult.success === true ? 'default' : 'outline'}
          className={`py-8 text-lg ${trainingResult.success === true ? 'btn-primary' : ''}`}
        >
          <ThumbsUp className="mr-2" /> 성공했어요!
        </Button>
        <Button
          onClick={() => setTrainingResult(prev => ({...prev, success: false}))}
          variant={trainingResult.success === false ? 'destructive' : 'outline'}
          className="py-8 text-lg"
        >
          <ThumbsDown className="mr-2" /> 어려웠어요
        </Button>
      </div>
      <div>
        <label htmlFor="notes" className="font-bold text-gray-800">오늘의 기록</label>
        <Textarea
          id="notes"
          placeholder="딩딩이가 집중을 잘했어요!"
          className="mt-2 min-h-[120px] input-soft"
          value={trainingResult.notes}
          onChange={(e) => setTrainingResult(prev => ({...prev, notes: e.target.value}))}
        />
      </div>
      <Button onClick={handleSaveClick} disabled={trainingResult.success === null || isSaving} size="lg" className="btn-primary w-full py-4">
        {isSaving ? "저장 중..." : "훈련 완료 기록하기"}
      </Button>
    </motion.div>
  );
};
export default TrainingLog;
