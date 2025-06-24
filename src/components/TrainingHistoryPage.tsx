import React, { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { TrainingLog, useTrainingHistory } from '@/hooks/useTrainingHistory';
import { useDogProfile } from '@/hooks/useDogProfile';
import { useDogBadges } from '@/hooks/useDogBadges';
import DogBadges from './DogBadges';
import DeleteTrainingLogDialog from './DeleteTrainingLogDialog';
import EditTrainingLogDialog from './EditTrainingLogDialog';
import TrainingHistorySkeleton from './training-history/TrainingHistorySkeleton';
import EmptyTrainingHistory from './training-history/EmptyTrainingHistory';
import TrainingHistoryList from './training-history/TrainingHistoryList';
import { motion } from 'framer-motion';
import { useToast } from './ui/use-toast';

interface TrainingHistoryPageProps {
  onNavigate: (page: string, params?: any) => void;
}

const TrainingHistoryPage = ({ onNavigate }: TrainingHistoryPageProps) => {
  const { dogInfo, isLoading: isLoadingDogProfile } = useDogProfile();
  const { data: trainingHistory, isLoading: isLoadingHistory, isError: isErrorHistory } = useTrainingHistory(dogInfo?.id);
  const { data: badges, isLoading: isLoadingBadges } = useDogBadges(dogInfo?.id);
  const [logToDelete, setLogToDelete] = useState<TrainingLog | null>(null);
  const [logToEdit, setLogToEdit] = useState<TrainingLog | null>(null);
  const { toast } = useToast();

  const combinedHistory: TrainingLog[] = useMemo(() => {
    const historyLogs = (trainingHistory || []).map(log => ({ ...log }));
    return historyLogs.sort((a, b) => new Date(b.session_date).getTime() - new Date(a.session_date).getTime());
  }, [trainingHistory]);

  const handleRetryTraining = (log: TrainingLog) => {
    onNavigate('training-replay', { trainingLog: log });
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
        trainingHistory={combinedHistory.map(log => ({
          ...log,
          isAiTraining: log.is_ai_training ?? false,
        }))}
        onEdit={setLogToEdit}
        onDelete={setLogToDelete}
        onRetry={handleRetryTraining}
      />
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="mx-auto bg-background min-h-screen" // 배경 변경
    >
      <div className="bg-background/80 backdrop-blur-sm border-b border-border px-4 py-4 sticky top-0 z-10"> {/* 헤더 스타일 변경 */}
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={() => onNavigate('dashboard')} className="hover:bg-muted"> {/* 버튼 호버 색상 변경 */}
            <ArrowLeft className="h-6 w-6 text-foreground" /> {/* 아이콘 색상 변경 */}
          </Button>
          <h1 className="text-lg font-bold text-foreground ml-2 font-pretendard">훈련 기록</h1> {/* 텍스트 색상 변경 */}
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
