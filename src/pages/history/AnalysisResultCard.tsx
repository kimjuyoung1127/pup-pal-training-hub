import React from 'react';
import { JointAnalysisRecord } from '@/types/analysis';
import { Dog } from 'lucide-react';

// 관절 분석 결과용 공유 카드 컴포넌트
const AnalysisResultCard = React.forwardRef<HTMLDivElement, {
  record: JointAnalysisRecord,
  petName: string,
  petImage: string | null
}>(({ record, petName, petImage }, ref) => {
  // 안정성 점수 추출 (새로운 구조와 기존 구조 모두 지원)
  const stabilityScore = record.analysis_results?.scores?.stability || record.stability_score || 0;
  
  return (
    <div ref={ref} className="w-[320px] bg-gradient-to-br from-blue-100 via-green-100 to-purple-100 p-4 font-sans">
      <div className="bg-white rounded-lg shadow-lg p-4">
        {/* 반려견 사진 */}
        <div className="flex justify-center -mt-10">
          {petImage ? (
            <img 
              src={petImage} 
              className="w-20 h-20 rounded-full border-4 border-white object-cover" 
              alt={petName} 
            />
          ) : (
            <div className="w-20 h-20 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center">
              <Dog className="w-10 h-10 text-gray-400" />
            </div>
          )}
        </div>
        
        {/* 반려견 이름 */}
        <div className="text-center mt-2">
          <h2 className="text-xl font-bold text-gray-800">{petName || '우리 강아지'}</h2>
          <p className="text-sm text-gray-500">AI 자세 분석 결과</p>
        </div>
        
        {/* 안정성 점수 */}
        <div className="text-center my-4">
          <p className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 via-green-500 to-purple-500 bg-clip-text text-transparent">
            {stabilityScore.toFixed(1)}점
          </p>
          <p className="text-lg font-semibold text-gray-700 mt-1">안정성 점수</p>
        </div>
        
        {/* 분석 날짜 */}
        <p className="text-center text-xs text-gray-500 px-2">
          {new Date(record.created_at).toLocaleDateString('ko-KR')} 분석
        </p>
        
        {/* 서비스 로고 */}
        <div className="text-center mt-4 text-xs font-bold text-blue-600">
          mungai.co.kr
        </div>
      </div>
    </div>
  );
});

AnalysisResultCard.displayName = 'AnalysisResultCard';

export default AnalysisResultCard;