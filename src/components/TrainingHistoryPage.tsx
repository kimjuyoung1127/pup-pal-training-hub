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

  useEffect(() => {
    console.log('🐶 Dog Profile:', dogInfo);
    console.log('📜 Training History:', trainingHistory);
    console.log('🤖 AI Recommendations:', aiRecommendations);
  }, [dogInfo, trainingHistory, aiRecommendations]);

  const combinedHistory = useMemo(() => {
    console.log('🔄 Combining history and recommendations...');
    const processedAiRecs = (aiRecommendations || []).flatMap(rec => 
      (rec.recommendations as any[])
        .map((r: any, index: number) => ({
          id: `ai-${rec.id}-${index}`,
          session_date: rec.created_at,
          training_type: r.program,
          notes: r.description,
          isAiTraining: true,
          duration_minutes: null,
          success_rate: null,
        } as TrainingLog & { isAiTraining: boolean }))
        .filter(item => item.training_type) // training_type이 있는 항목만 필터링
    );
    const combined = [...processedAiRecs, ...(trainingHistory || [])];
    console.log('✅ Combined Data:', combined);
    return combined;
  }, [aiRecommendations, trainingHistory]);

  const handleRetryTraining = (trainingType: string) => {
    onNavigate('training', { trainingType });
  };

  const renderContent = () => {
    if (isLoadingHistory || isLoadingAi || isLoadingDogProfile) {
      console.log('⏳ Loading data...');
      return <TrainingHistorySkeleton />;
    }

    if (isErrorHistory || isErrorAi) {
      console.error('❌ Error loading data. History Error:', isErrorHistory, 'AI Recs Error:', isErrorAi);
      return <div className="text-center text-red-500 p-8">훈련 기록을 불러오는 데 실패했습니다.</div>;
    }

    if (!combinedHistory || combinedHistory.length === 0) {
      console.log('텅 비었음! Empty data, showing empty component.');
      return <EmptyTrainingHistory onNavigate={() => onNavigate('dashboard')} />;
    }

    console.log('렌더링될 데이터:', combinedHistory);
    return (
      <TrainingHistoryList
        trainingHistory={combinedHistory}
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

      <DeleteTrainingLogDialog 
        log={logToDelete}
        onOpenChange={(open) => !open && setLogToDelete(null)}
      />
      <EditTrainingLogDialog
        log={logToEdit}
        onOpenChange={(open) => !open && setLogToEdit(null)}
      />
    </motion.div>
  );
};

export default TrainingHistoryPage;
