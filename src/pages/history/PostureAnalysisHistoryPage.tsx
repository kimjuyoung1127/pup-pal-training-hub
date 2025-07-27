
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { History, BarChart, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useUserDogs } from './useUserDogs';
import { useJointAnalysisHistory } from '@/hooks/useJointAnalysisHistory';
import JointAnalysisHistorySkeleton from '@/components/posture-analysis-history/JointAnalysisHistorySkeleton';
import EmptyJointAnalysisHistory from '@/components/posture-analysis-history/EmptyJointAnalysisHistory';
import JointAnalysisHistoryList from '@/components/posture-analysis-history/JointAnalysisHistoryList';

const PostureAnalysisHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: dogs, isLoading: isLoadingDogs, isError: isErrorDogs } = useUserDogs();
  
  // activeDogId의 초기 상태를 null로 변경
  const [activeDogId, setActiveDogId] = useState<string | null>(null);

  // dogs 데이터가 로드되면, activeDogId를 첫 번째 강아지로 설정
  useEffect(() => {
    if (dogs && dogs.length > 0 && !activeDogId) {
      setActiveDogId(dogs[0].id);
    }
  }, [dogs, activeDogId]);

  // activeDogId가 유효할 때만 쿼리를 실행하도록 함
  const { data: historyData, isLoading: isLoadingHistory, isError: isErrorHistory } = useJointAnalysisHistory(activeDogId || undefined);

  const renderContent = () => {
    // activeDogId가 아직 설정되지 않았거나, 히스토리 로딩 중일 때 스켈레톤 표시
    if (!activeDogId || isLoadingHistory) {
      return <JointAnalysisHistorySkeleton />;
    }

    if (isErrorHistory) {
      return (
        <Alert variant="destructive" className="mt-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>오류 발생</AlertTitle>
          <AlertDescription>
            분석 기록을 불러오는 데 실패했습니다.
          </AlertDescription>
        </Alert>
      );
    }

    if (!historyData || historyData.length === 0) {
      return <EmptyJointAnalysisHistory />;
    }

    return <JointAnalysisHistoryList records={historyData} />;
  };

  if (isLoadingDogs) {
    return (
      <div className="container mx-auto p-4 md:p-8 max-w-4xl">
        <JointAnalysisHistorySkeleton />
      </div>
    );
  }

  if (isErrorDogs) {
    return (
      <div className="container mx-auto p-4 md:p-8 max-w-4xl">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>오류 발생</AlertTitle>
          <AlertDescription>
            강아지 목록을 불러오는 데 실패했습니다.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!dogs || dogs.length === 0) {
    return (
        <div className="container mx-auto p-4 md:p-8 max-w-4xl">
            <EmptyJointAnalysisHistory />
        </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto p-4 md:p-8 max-w-4xl"
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
        <Button onClick={() => navigate('/app/posture-analysis')} className="w-full sm:w-auto">
            <BarChart className="w-4 h-4 mr-2" />
            새 분석 시작하기
        </Button>
      </div>

      {/* activeDogId가 null이 아닐 때만 Tabs를 렌더링 */}
      {activeDogId && (
        <Tabs value={activeDogId} onValueChange={setActiveDogId} className="w-full">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {dogs.map(dog => (
              <TabsTrigger key={dog.id} value={dog.id}>{dog.name}</TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value={activeDogId}>
            <div className="mt-6">
              {renderContent()}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </motion.div>
  );
};

export default PostureAnalysisHistoryPage;
