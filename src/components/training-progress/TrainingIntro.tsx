
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
      <Icon className="w-20 h-20 text-orange-500 mb-4" />
      <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
      <p className="text-cream-700 mt-2 mb-4">{description}</p>
      <div className="flex space-x-4 text-cream-600 mb-8">
        <span>{difficulty}</span>
        <span>·</span>
        <span>{duration}</span>
      </div>
      <Button onClick={onStart} size="lg" className="btn-primary w-full py-4 text-lg">
        <Play className="mr-2" />
        훈련 시작하기
      </Button>
    </motion.div>
  );
};
export default TrainingIntro;
