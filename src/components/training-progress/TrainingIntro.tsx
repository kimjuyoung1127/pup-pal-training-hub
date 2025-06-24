
import React from 'react';
import { TrainingProgram } from '@/lib/trainingData';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { motion } from 'framer-motion';

interface TrainingIntroProps {
  program: TrainingProgram;
  onStart: () => void;
}

const TrainingIntro = ({ program, onStart }: TrainingIntroProps) => {
  const { Icon, title, description, difficulty, duration } = program;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6 text-center flex flex-col items-center justify-center h-full">
      <Icon className="w-20 h-20 text-training-yellow-dark mb-4" /> {/* 아이콘 색상 변경 */}
      <h1 className="text-3xl font-bold text-foreground">{title}</h1> {/* 타이틀 색상 변경 */}
      <p className="text-muted-foreground mt-2 mb-4">{description}</p> {/* 설명 색상 변경 */}
      <div className="flex space-x-4 text-muted-foreground mb-8"> {/* 난이도/시간 색상 변경 */}
        <span>{difficulty}</span>
        <span>·</span>
        <span>{duration}</span>
      </div>
      <Button
        onClick={onStart}
        size="lg"
        className="bg-training-yellow hover:bg-training-yellow/90 text-training-yellow-text w-full py-4 text-lg shadow-md" /* 버튼 스타일 변경 */
      >
        <Play className="mr-2" />
        훈련 시작하기
      </Button>
    </motion.div>
  );
};
export default TrainingIntro;
