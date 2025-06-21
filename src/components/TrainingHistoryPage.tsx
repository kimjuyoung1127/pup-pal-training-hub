import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { useTrainingHistory, TrainingLog } from '@/hooks/useTrainingHistory';
import { useDogBadges } from '@/hooks/useDogBadges';
import DogBadges from './DogBadges';
import DeleteTrainingLogDialog from './DeleteTrainingLogDialog';
import EditTrainingLogDialog from './EditTrainingLogDialog';
import TrainingHistorySkeleton from './training-history/TrainingHistorySkeleton';
import EmptyTrainingHistory from './training-history/EmptyTrainingHistory';
import TrainingHistoryList from './training-history/TrainingHistoryList';

interface TrainingHistoryPageProps {
  onNavigate: (page: string) => void;
}

const TrainingHistoryPage = ({ onNavigate }: TrainingHistoryPageProps) => {
  const { data: trainingHistory, isLoading, isError } = useTrainingHistory();
  const { data: badges, isLoading: isLoadingBadges } = useDogBadges();
  const [logToDelete, setLogToDelete] = useState<TrainingLog | null>(null);
  const [logToEdit, setLogToEdit] = useState<TrainingLog | null>(null);

  const renderContent = () => {
    if (isLoading) {
      return <TrainingHistorySkeleton />;
    }

    if (isError) {
      return <div className="text-center text-red-500 p-8">훈련 기록을 불러오는 데 실패했습니다.</div>;
    }

    if (!trainingHistory || trainingHistory.length === 0) {
      return <EmptyTrainingHistory onNavigate={onNavigate} />;
    }

    return (
      <TrainingHistoryList
        trainingHistory={trainingHistory}
        onEdit={setLogToEdit}
        onDelete={setLogToDelete}
      />
    );
  };

  return (
    <div className="p-4 bg-white min-h-screen">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={() => onNavigate('dashboard')}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-800 ml-2">훈련 기록</h1>
      </div>
      
      <DogBadges badges={badges || []} isLoading={isLoadingBadges} />

      {renderContent()}

      <DeleteTrainingLogDialog 
        log={logToDelete}
        onOpenChange={(open) => !open && setLogToDelete(null)}
      />
      <EditTrainingLogDialog
        log={logToEdit}
        onOpenChange={(open) => !open && setLogToEdit(null)}
      />
    </div>
  );
};

export default TrainingHistoryPage;
