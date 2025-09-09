import React from 'react';
import { useDogProfile } from '@/hooks/useDogProfile';

const AiAnalysisReport: React.FC = () => {
  const { dogInfo } = useDogProfile();

  return (
    <div className="bg-white p-6 rounded-lg border border-stone-200">
      <h3 className="text-zinc-900 text-xl font-bold leading-tight tracking-[-0.015em] mb-3">AI 분석 리포트</h3>
      <p className="text-zinc-600 text-base font-normal leading-relaxed">
        "{dogInfo?.name || '반려견'}은 최근 활동량이 줄고 자세 분석 결과 오른쪽 뒷다리 관절 부하가 높게 나타나,
        관절 건강에 좋은 여주산 고구마의 함량을 높여 염증 완화에 도움을 주도록 설계했습니다.
        이 식단은 경기도 지역 농산물을 80% 이상 사용하여 신선하고 고품질의 식재료를 제공합니다."
      </p>
    </div>
  );
};

export default AiAnalysisReport;