import React, { useState, useMemo, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { useTrainingHistory, TrainingLog } from '@/hooks/useTrainingHistory';
import { useAiRecommendations, AiRecommendation } from '@/hooks/useAiRecommendations';
import { useDogProfile } from '@/hooks/useDogProfile';
import { useDogBadges } from '@/hooks/useDogBadges';
import DogBadges from './DogBadges';
import DeleteTrainingLogDialog from './DeleteTrainingLogDialog';
import EditTrainingLogDialog from './EditTrainingLogDialog';
import TrainingHistorySkeleton from './training-history/TrainingHistorySkeleton';
import EmptyTrainingHistory from './training-history/EmptyTrainingHistory';
import TrainingHistoryList from './training-history/TrainingHistoryList';
import { motion } from 'framer-motion';
import { trainingPrograms, TrainingProgram, TrainingStep } from '@/lib/trainingData';
import { Star } from 'lucide-react';

// EnrichedTrainingLog 타입을 명시적으로 정의합니다.
export interface EnrichedTrainingLog extends TrainingLog {
  isAiTraining: boolean;
  steps?: TrainingStep[];
  difficulty?: '초급' | '중급' | '고급';
  // 'duration' 필드는 'duration_minutes'와 중복되므로 제거하고 'duration_minutes'를 사용합니다.
}

interface TrainingHistoryPageProps {
  onNavigate: (page: string, params?: any) => void;
}

const TrainingHistoryPage = ({ onNavigate }: TrainingHistoryPageProps) => {
  const { dogInfo, isLoading: isLoadingDogProfile } = useDogProfile();
  const { data: trainingHistory, isLoading: isLoadingHistory, isError: isErrorHistory } = useTrainingHistory(dogInfo?.id);
  const { data: aiRecommendations, isLoading: isLoadingAi, isError: isErrorAi } = useAiRecommendations(dogInfo?.id);
  const { data: badges, isLoading: isLoadingBadges } = useDogBadges(dogInfo?.id);
  const [logToDelete, setLogToDelete] = useState<TrainingLog | null>(null);
  const [logToEdit, setLogToEdit] = useState<TrainingLog | null>(null);

  const combinedHistory: EnrichedTrainingLog[] = useMemo(() => {
    const historyLogs = (trainingHistory || []).map(log => {
      const details = log.ai_training_details as any;
      return {
        ...log,
        isAiTraining: log.is_ai_training || false,
        steps: log.is_ai_training ? details?.steps : undefined,
        difficulty: log.is_ai_training ? details?.difficulty : undefined,
      };
    });

    return historyLogs.sort((a, b) => new Date(b.session_date).getTime() - new Date(a.session_date).getTime());
  }, [trainingHistory]);

  const handleRetryTraining = (item: EnrichedTrainingLog) => {
    let programSteps: TrainingStep[] = [];
    let programTitle = item.training_type || 'Unknown Training';

    if (item.isAiTraining && item.steps) {
      programSteps = item.steps;
    } else {
      const staticProgram = Object.values(trainingPrograms).find(p => p.title === item.training_type);
      if (staticProgram) {
        programSteps = staticProgram.steps;
      }
    }

    const program: TrainingProgram = {
      id: item.id,
      title: programTitle,
      description: item.notes || '',
      Icon: Star, // 기본 아이콘
      color: 'purple', // 기본 색상
      difficulty: item.difficulty || "중급",
      duration: item.duration_minutes ? `${item.duration_minutes}분` : '15분',
      steps: programSteps,
      isAiTraining: item.isAiTraining, // AI 훈련 여부 전달
    };
    onNavigate('training-progress', { trainingProgram: program, dogId: dogInfo?.id });
  };

  const renderContent = () => {
    if (isLoadingHistory || isLoadingDogProfile) {
      return <TrainingHistorySkeleton />;
    }

    if (isErrorHistory) {
      return <div className="text-center text-red-500 p-8">훈련 기록을 불러오는 데 실패했습니다.</div>;
    }

    if (!combinedHistory || combinedHistory.length === 0) {
      return <EmptyTrainingHistory onNavigate={() => onNavigate('dashboard')} />;
    }

    return (
      <TrainingHistoryList
        trainingHistory={combinedHistory}
        onEdit={(log) => setLogToEdit(log as TrainingLog)}
        onDelete={(log) => setLogToDelete(log as TrainingLog)}
        onRetry={(trainingType: string) => handleRetryTraining(combinedHistory.find(item => item.training_type === trainingType) as EnrichedTrainingLog)}
      />
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="mx-auto bg-white min-h-screen"
    >
      <div className="bg-white/80 backdrop-blur-sm border-b border-cream-200 px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={() => onNavigate('dashboard')}>
            <ArrowLeft className="h-6 w-6 text-gray-700" />
          </Button>
          <h1 className="text-lg font-bold text-cream-800 ml-2 font-pretendard">훈련 기록</h1>
        </div>
      </div>
      
      <div className="p-4 space-y-6">
        <DogBadges badges={badges || []} isLoading={isLoadingBadges} />

        {renderContent()}
      </div>

      {dogInfo?.id && (
        <>
          <DeleteTrainingLogDialog 
            log={logToDelete}
            dogId={dogInfo.id}
            onOpenChange={(open) => !open && setLogToDelete(null)}
          />
          <EditTrainingLogDialog
            log={logToEdit}
            dogId={dogInfo.id}
            onOpenChange={(open) => !open && setLogToEdit(null)}
          />
        </>
      )}
    </motion.div>
  );
};

export default TrainingHistoryPage;
