
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { History, BarChart, AlertCircle, Sparkles, Share2 } from 'lucide-react';
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
import AnalysisDetailView from './AnalysisDetailView';

const PostureAnalysisHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: dogs, isLoading: isLoadingDogs, isError: isErrorDogs } = useUserDogs();
  
  const [activeDogId, setActiveDogId] = useState<string | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<JointAnalysisRecord | null>(null);

  const handleSelectRecord = (record: JointAnalysisRecord) => {
    setSelectedRecord(JSON.parse(JSON.stringify(record)));
  };

  const handleShare = (record: JointAnalysisRecord) => {
    alert(`공유 기능 구현 예정 (ID: ${record.id})`);
  };

  // dogs 데이터가 로드되면, activeDogId를 첫 번째 강아지로 설정
  useEffect(() => {
    if (dogs && dogs.length > 0 && !activeDogId) {
      setActiveDogId(dogs[0].id);
    }
  }, [dogs, activeDogId]);

  const { data: historyData, isLoading: isLoadingHistory, isError: isErrorHistory, refetch } = useJointAnalysisHistory(activeDogId || undefined);

  // 페이지에 들어올 때마다 데이터를 새로고침하여 최신 상태를 반영
  useEffect(() => {
    refetch();
  }, [refetch]);

  // 최신 결과와 과거 기록을 분리
  const { latestResult, pastHistory } = useMemo(() => {
    if (!historyData || historyData.length === 0) {
      return { latestResult: null, pastHistory: [] };
    }
    const sortedHistory = [...historyData].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    const latest = sortedHistory[0];
    const past = sortedHistory.slice(1);
    return { latestResult: latest, pastHistory: past };
  }, [historyData]);

  // 최초 로드 시 또는 activeDogId 변경 시, 최신 결과를 기본으로 선택
  useEffect(() => {
    if (latestResult) {
      setSelectedRecord(latestResult);
    } else {
      setSelectedRecord(null); // 기록이 없으면 선택 해제
    }
  }, [latestResult]);

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
            <JointAnalysisHistoryList records={pastHistory} onDetailView={handleSelectRecord} onShare={handleShare} />
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
              {/* Left Column: History List */}
              <div className="lg:max-h-[calc(100vh-200px)] lg:overflow-y-auto pr-4">
                {renderHistoryList()}
              </div>

              {/* Right Column: Detail View */}
              <div>
                {selectedRecord ? (
                  <AnalysisDetailView record={selectedRecord} />
                ) : (
                  <div className="sticky top-24 flex items-center justify-center h-full bg-gray-50 rounded-lg">
                    <p className="text-gray-500">목록에서 분석 기록을 선택하세요.</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </motion.div>
  );
};

export default PostureAnalysisHistoryPage;
