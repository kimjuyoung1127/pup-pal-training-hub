// src/pages/history/AnalysisResultShareCard.tsx
import React from 'react';
import { JointAnalysisRecord } from '@/types/analysis';
import { Dog } from 'lucide-react';

// 점수 구간에 따른 정보 (AnalysisDetailView에서 가져옴)
const getScoreInfo = (score: number) => {
    if (score >= 80) return { message: '일관된 안정성', color: 'text-green-600' };
    if (score >= 60) return { message: '약간의 변동성 관찰', color: 'text-yellow-600' };
    if (score >= 40) return { message: '불안정성 감지', color: 'text-orange-600' };
    return { message: '지속적인 관찰 필요', color: 'text-red-600' };
};

interface AnalysisResultShareCardProps {
  record: JointAnalysisRecord;
  stabilityScore: number | undefined;
  petName: string;
  petImage: string | null;
}

export const AnalysisResultShareCard = React.forwardRef<HTMLDivElement, AnalysisResultShareCardProps>(
  ({ record, stabilityScore, petName, petImage }, ref) => {
    const scoreInfo = stabilityScore ? getScoreInfo(stabilityScore) : null;

    return (
      <div ref={ref} className="w-[320px] bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 p-4 font-sans">
        <div className="bg-white rounded-lg shadow-lg p-4">
          <div className="flex justify-center -mt-10">
            {petImage ? (
              <img src={petImage} className="w-20 h-20 rounded-full border-4 border-white object-cover" alt={petName} />
            ) : (
              <div className="w-20 h-20 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center">
                <Dog className="w-10 h-10 text-gray-400" />
              </div>
            )}
          </div>
          <div className="text-center mt-2">
            <h2 className="text-xl font-bold text-gray-800">{petName || record.dog_name || '우리 강아지'}</h2>
            <p className="text-sm text-gray-500">AI 자세 분석 결과</p>
          </div>
          <div className="text-center my-3">
            <p className="text-5xl font-extrabold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
              {stabilityScore?.toFixed(1)}
              <span className="text-2xl text-gray-500 align-middle">점</span>
            </p>
            {scoreInfo && <p className={`text-base font-semibold ${scoreInfo.color} mt-1`}>{scoreInfo.message}</p>}
          </div>
          <p className="text-center text-xs text-gray-600 px-2 h-10">
            AI가 분석한 자세 안정성 점수입니다. 이 결과는 참고용 보조 지표이며, 의료적 진단을 대체할 수 없습니다.
          </p>
          <div className="text-center mt-4 text-xs font-bold text-purple-600">
            mungai.co.kr
          </div>
        </div>
      </div>
    );
  }
);
