
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { History, BarChart, AlertCircle, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useUserDogs } from './useUserDogs';
import { useJointAnalysisHistory } from '@/hooks/useJointAnalysisHistory';
import JointAnalysisHistorySkeleton from '@/components/posture-analysis-history/JointAnalysisHistorySkeleton';
import EmptyJointAnalysisHistory from '@/components/posture-analysis-history/EmptyJointAnalysisHistory';
import JointAnalysisHistoryList from '@/components/posture-analysis-history/JointAnalysisHistoryList';
import LatestAnalysisResultCard from './LatestAnalysisResultCard';
import { JointAnalysisRecord } from '@/types/analysis';
import AnalysisDetailModal from './AnalysisDetailModal';

const PostureAnalysisHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: dogs, isLoading: isLoadingDogs, isError: isErrorDogs } = useUserDogs();
  
  const [activeDogId, setActiveDogId] = useState<string | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<JointAnalysisRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectRecord = (record: JointAnalysisRecord) => {
    setSelectedRecord(JSON.parse(JSON.stringify(record)));
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRecord(null);
  };

  useEffect(() => {
    if (dogs && dogs.length > 0 && !activeDogId) {
      setActiveDogId(dogs[0].id);
    }
  }, [dogs, activeDogId]);

  const { data: historyData, isLoading: isLoadingHistory, isError: isErrorHistory, refetch } = useJointAnalysisHistory(activeDogId || undefined);

  useEffect(() => {
    refetch();
  }, [refetch, activeDogId]);

  const baselineAnalysisId = useMemo(() => {
    if (!dogs || !activeDogId) return null;
    const activeDog = dogs.find(d => d.id === activeDogId);
    return activeDog?.baseline_analysis_id || null;
  }, [dogs, activeDogId]);

  // ★★★ 기준 기록(baselineRecord) 찾기 추가 ★★★
  const baselineRecord = useMemo(() => {
    if (!baselineAnalysisId || !historyData) return null;
    return historyData.find(record => record.id === baselineAnalysisId) || null;
  }, [baselineAnalysisId, historyData]);

  const { latestResult, pastHistory } = useMemo(() => {
    if (!historyData || historyData.length === 0 || !dogs) {
      return { latestResult: null, pastHistory: [] };
    }

    const historyWithDogNames = historyData.map(record => {
      const dog = dogs.find(d => d.id === record.dog_id);
      return {
        ...record,
        dog_name: dog ? dog.name : '알 수 없는 강아지',
      };
    });

    const sortedHistory = [...historyWithDogNames].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    const latest = sortedHistory[0];
    const past = sortedHistory.slice(1);
    return { latestResult: latest, pastHistory: past };
  }, [historyData, dogs]);

  const renderHistoryList = () => {
    if (!activeDogId || isLoadingHistory) {
      return <JointAnalysisHistorySkeleton />;
    }
    if (isErrorHistory) {
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>오류 발생</AlertTitle>
          <AlertDescription>분석 기록을 불러오는 데 실패했습니다.</AlertDescription>
        </Alert>
      );
    }
    if (!latestResult && pastHistory.length === 0) {
      return <EmptyJointAnalysisHistory />;
    }
    return (
      <div className="space-y-8">
        {latestResult && (
          <div>
            <h3 className="text-xl font-bold text-gray-800 flex items-center mb-3">
              <Sparkles className="w-5 h-5 mr-2 text-yellow-500" />
              최신 분석 결과
            </h3>
            <LatestAnalysisResultCard record={latestResult} onViewDetail={handleSelectRecord} />
          </div>
        )}
        {pastHistory.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-gray-800 flex items-center mb-3">
              <History className="w-5 h-5 mr-2 text-gray-500" />
              과거 기록
            </h3>
            <JointAnalysisHistoryList 
              records={pastHistory} 
              onDetailView={handleSelectRecord} 
              baselineAnalysisId={baselineAnalysisId}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto p-4 md:p-8"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div className="text-left">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <History className="w-8 h-8 mr-3 text-orange-500" />
              자세 분석 기록
            </h1>
            <p className="text-gray-600 mt-2">
              과거에 분석했던 기록들을 확인하고 자세의 변화를 추적해보세요.
            </p>
        </div>
        <Button onClick={() => navigate('/app/posture-analysis')} className="w-full sm:w-auto flex-shrink-0">
            <BarChart className="w-4 h-4 mr-2" />
            새 분석 시작하기
        </Button>
      </div>

      {isLoadingDogs && <JointAnalysisHistorySkeleton />}
      
      {isErrorDogs && (
          <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>오류 발생</AlertTitle>
          <AlertDescription>강아지 목록을 불러오는 데 실패했습니다.</AlertDescription>
        </Alert>
      )}

      {!isLoadingDogs && !isErrorDogs && (!dogs || dogs.length === 0) && (
        <EmptyJointAnalysisHistory />
      )}

      {activeDogId && dogs && dogs.length > 0 && (
        <Tabs value={activeDogId} onValueChange={setActiveDogId} className="w-full">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {dogs.map(dog => (
              <TabsTrigger key={dog.id} value={dog.id}>{dog.name}</TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value={activeDogId} forceMount>
            <div className="mt-6">
              {renderHistoryList()}
            </div>
          </TabsContent>
        </Tabs>
      )}

      {/* ★★★ baselineRecord 전달 추가 ★★★ */}
      <AnalysisDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        record={selectedRecord}
        baselineAnalysisId={baselineAnalysisId}
        baselineRecord={baselineRecord}
        onBaselineUpdate={() => refetch()}
      />
    </motion.div>
  );
};

export default PostureAnalysisHistoryPage;
