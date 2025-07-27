
import React from 'react';
import { Button } from '@/components/ui/button';
import { History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EmptyJointAnalysisHistory = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center py-16 px-6 bg-gray-50 rounded-lg">
      <History className="mx-auto h-16 w-16 text-gray-400 mb-4" />
      <h2 className="text-xl font-semibold text-gray-700">아직 분석 기록이 없어요</h2>
      <p className="text-gray-500 mt-2 mb-6">
        AI 관절 움직임 분석을 시작하여<br />우리 아이의 건강 변화를 추적해보세요.
      </p>
      <Button onClick={() => navigate('/tools/joint-analysis')}>
        첫 분석 시작하기
      </Button>
    </div>
  );
};

export default EmptyJointAnalysisHistory;
