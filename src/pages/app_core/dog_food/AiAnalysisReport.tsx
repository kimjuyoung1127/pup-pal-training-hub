import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDogProfile } from '@/hooks/useDogProfile';
import { Heart, Leaf } from 'lucide-react';

const AiAnalysisReport: React.FC = () => {
  const { dogInfo } = useDogProfile();

  return (
    <Card className="rounded-2xl shadow-md border border-[#E7EBE4] bg-white">
      <CardHeader>
        <CardTitle className="flex items-center text-[#3D405B]">
          <Heart className="mr-2 text-[#E07A5F]" />
          AI 분석 리포트
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-[#FDEDE8] rounded-xl p-4 mb-4 border border-[#F7D1C8]">
          <p className="text-[#3D405B] font-medium">
            "{dogInfo?.name || '반려견'}은 최근 활동량이 줄고 자세 분석 결과 오른쪽 뒷다리 관절 부하가 높게 나타나,
            관절 건강에 좋은 여주산 고구마의 함량을 높여 염증 완화에 도움을 주도록 설계했어요."
          </p>
        </div>
        <div className="flex items-center text-sm text-[#5B5F7A]">
          <Leaf className="mr-1 w-4 h-4 text-[#A3B899]" />
          <span>이 식단은 경기도 지역 농산물을 80% 이상 사용합니다</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default AiAnalysisReport;