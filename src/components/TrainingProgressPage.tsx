
import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import TrainingIntro from './training-progress/TrainingIntro';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { trainingPrograms, TrainingProgram } from '@/lib/trainingData';
import { useTrainingHistory, TrainingLogCreate } from '@/hooks/useTrainingHistory';
import { useDogProfile } from '@/hooks/useDogProfile';
import TrainingSteps from './training-progress/TrainingSteps';
import TrainingLog from './training-progress/TrainingLog';
import TrainingSummary from './training-progress/TrainingSummary';

interface TrainingProgressPageProps {
  trainingProgram: TrainingProgram & { isAiTraining?: boolean };
  onNavigate: (page: string) => void;
  onExit: () => void;
  dogId: string; // dogId prop 추가
}

const TrainingProgressPage = ({ onNavigate, onExit, trainingProgram, dogId }: TrainingProgressPageProps) => {
  const [flowStep, setFlowStep] = useState(1); // 1: intro, 2: steps, 3: log, 4: summary
  const [startTime, setStartTime] = useState<number | null>(null);
  const { addMutation } = useTrainingHistory(dogId); // dogId를 useTrainingHistory에 전달
  
  const program = trainingProgram;

  if (!program) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-cream-50">
        <p className="text-lg text-cream-700">훈련 프로그램을 찾을 수 없습니다.</p>
        <Button onClick={onExit} className="mt-4">돌아가기</Button>
      </div>
    );
  }

  const handleStart = () => {
    setStartTime(Date.now());
    setFlowStep(2);
  };

  const handleFinishSteps = () => {
    setFlowStep(3);
  }

  const handleSave = (result: { success: boolean; notes: string }) => {
    if (result.success === null || !startTime) return;

    const durationMinutes = Math.round((Date.now() - startTime) / (1000 * 60));

    const newLog: TrainingLogCreate = {
      training_program_id: program.isAiTraining ? null : program.id,
      training_type: program.title,
      duration_minutes: durationMinutes,
      success_rate: result.success ? 100 : 50,
      notes: result.notes,
      is_ai_training: program.isAiTraining || false,
      ai_training_details: program.isAiTraining ? (({ Icon, ...rest }) => rest)(program) : null,
    };

    addMutation.mutate(newLog, {
      onSuccess: () => {
        setFlowStep(4);
      }
    });
  };

  const renderContent = () => {
    switch (flowStep) {
      case 1: return <TrainingIntro program={program} onStart={handleStart} />;
      case 2: return <TrainingSteps steps={program.steps} onFinishSteps={handleFinishSteps} />;
      case 3: return <TrainingLog onSave={handleSave} isSaving={addMutation.isPending} />;
      case 4: return <TrainingSummary onNavigate={onNavigate} onExit={onExit} />;
      default: return <TrainingIntro program={program} onStart={handleStart} />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col"> {/* 배경 변경 */}
      <header className="p-4 sticky top-0 bg-background/80 backdrop-blur-sm z-10 border-b border-border"> {/* 헤더 스타일 및 위치 변경 */}
        <Button variant="ghost" size="icon" onClick={flowStep === 1 ? onExit : () => setFlowStep(prev => prev - 1)}>
          <ArrowLeft className="text-foreground" /> {/* 아이콘 색상 변경 */}
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

export default TrainingProgressPage;
