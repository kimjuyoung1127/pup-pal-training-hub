import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Target, Home, Footprints, Users, LucideIcon } from 'lucide-react';
import { trainingPrograms, TrainingProgram } from '@/lib/trainingData';
import { TrainingLog } from '@/hooks/useTrainingHistory';
import TrainingIntro from './training-progress/TrainingIntro';
import TrainingSteps from './training-progress/TrainingSteps';
import TrainingSummary from './training-progress/TrainingSummary';

// 아이콘 이름과 컴포넌트를 매핑하는 객체
const iconMap: { [key: string]: LucideIcon } = {
  Target,
  Home,
  Footprints,
  Users,
};

interface TrainingReplayPageProps {
  trainingLog: TrainingLog;
  onExit: () => void;
}

const TrainingReplayPage = ({ trainingLog, onExit }: TrainingReplayPageProps) => {
  const [flowStep, setFlowStep] = useState(1); // 1: intro, 2: steps, 3: summary
  const [program, setProgram] = useState<TrainingProgram | null>(null);

  useEffect(() => {
    let trainingProgram: TrainingProgram | null = null;
    if (trainingLog.is_ai_training && typeof trainingLog.ai_training_details === 'object' && trainingLog.ai_training_details) {
        const details = trainingLog.ai_training_details as Omit<TrainingProgram, 'Icon'> & { iconName: string };
        const IconComponent = iconMap[details.iconName] || Target; // 기본 아이콘 설정
        trainingProgram = { ...details, Icon: IconComponent };
    } else if (trainingLog.training_program_id) {
        trainingProgram = Object.values(trainingPrograms).flat().find(p => p.id === trainingLog.training_program_id) || null;
    }
    setProgram(trainingProgram);
  }, [trainingLog]);

  if (!program) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-cream-50">
        <p className="text-lg text-cream-700">훈련 프로그램을 찾을 수 없습니다.</p>
        <Button onClick={onExit} className="mt-4">돌아가기</Button>
      </div>
    );
  }

  const handleStart = () => {
    setFlowStep(2);
  };

  const handleFinishSteps = () => {
    setFlowStep(3);
  }

  const renderContent = () => {
    switch (flowStep) {
      case 1: return <TrainingIntro program={program} onStart={handleStart} />;
      case 2: return <TrainingSteps steps={program.steps} onFinishSteps={handleFinishSteps} />;
      case 3: return <TrainingSummary onNavigate={() => {}} onExit={onExit} />;
      default: return <TrainingIntro program={program} onStart={handleStart} />;
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="p-4">
        <Button variant="ghost" size="icon" onClick={flowStep === 1 ? onExit : () => setFlowStep(prev => prev - 1)}>
          <ArrowLeft />
        </Button>
      </header>
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default TrainingReplayPage;