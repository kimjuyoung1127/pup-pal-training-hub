
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
      <Icon className="w-24 h-24 text-sky-500 mb-6" />
      <h1 className="text-4xl font-bold text-sky-900">{title}</h1>
      <p className="text-gray-600 mt-4 mb-6 text-lg">{description}</p>
      <div className="flex space-x-4 text-gray-500 mb-10">
        <span className="font-semibold">{difficulty}</span>
        <span>·</span>
        <span className="font-semibold">{duration}</span>
      </div>
      <Button onClick={onStart} size="lg" className="bg-sky-600 hover:bg-sky-700 text-white w-full py-6 text-xl font-bold rounded-full">
        <Play className="mr-3 h-6 w-6" />
        훈련 시작하기
      </Button>
    </motion.div>
  );
};
export default TrainingIntro;
