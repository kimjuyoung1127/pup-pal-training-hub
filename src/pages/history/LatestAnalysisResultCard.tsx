// src/pages/history/LatestAnalysisResultCard.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { Award, Calendar, Video, Heart, Sparkles } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { JointAnalysisRecord } from '@/types/analysis';
import { Badge } from '@/components/ui/badge';

interface LatestAnalysisResultCardProps {
  record: JointAnalysisRecord;
  onViewDetail: (record: JointAnalysisRecord) => void;
}

const LatestAnalysisResultCard: React.FC<LatestAnalysisResultCardProps> = ({ record, onViewDetail }) => {
  const navigate = useNavigate();

  const handleViewDetail = () => {
    onViewDetail(record);
  };

  const formattedDate = new Date(record.created_at).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const stabilityScore = record.analysis_results?.scores?.stability;

  // 점수별 이모지와 메시지
  const getScoreInfo = (score: number) => {
    if (score >= 80) return { emoji: '🌟', message: '완벽한 자세!', color: 'text-green-600', bgColor: 'bg-green-50' };
    if (score >= 60) return { emoji: '👍', message: '좋은 자세!', color: 'text-blue-600', bgColor: 'bg-blue-50' };
    if (score >= 40) return { emoji: '💪', message: '개선 중!', color: 'text-yellow-600', bgColor: 'bg-yellow-50' };
    return { emoji: '🤗', message: '관리 필요', color: 'text-orange-600', bgColor: 'bg-orange-50' };
  };

  const scoreInfo = stabilityScore ? getScoreInfo(stabilityScore) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-gradient-to-r from-orange-200 to-pink-200 bg-white/90 backdrop-blur-md">
        <CardHeader className="p-0">
          <div className="relative">
            {/* TODO: 실제 영상 썸네일로 교체 예정 */}
            <div className="w-full h-48 bg-gradient-to-br from-orange-100 via-pink-100 to-purple-100 flex items-center justify-center">
              <div className="text-center">
                <Video className="h-16 w-16 text-purple-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">영상 썸네일</p>
                <p className="text-xs text-gray-500">(곧 실제 썸네일로 업데이트 예정)</p>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Badge className="bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold">
                  <Sparkles className="mr-1 h-3 w-3" />
                  최신 분석
                </Badge>
                {scoreInfo && (
                  <Badge className={`${scoreInfo.bgColor} ${scoreInfo.color} border-0`}>
                    {scoreInfo.emoji} {scoreInfo.message}
                  </Badge>
                )}
              </div>
              <CardTitle className="text-white text-2xl font-bold flex items-center">
                <Heart className="mr-2 h-6 w-6 text-pink-300" />
                {record.dog_name || '우리 강아지'}
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center text-gray-600 mb-4">
            <Calendar className="w-5 h-5 mr-2 text-purple-500" />
            <span className="font-medium">{formattedDate}</span>
          </div>
          {stabilityScore !== undefined && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-200 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Award className="w-8 h-8 mr-3 text-amber-500" />
                  <div>
                    <p className="text-lg font-semibold text-gray-800">자세 안정성</p>
                    <p className="text-xs text-gray-600">AI가 분석한 결과예요</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                    {stabilityScore.toFixed(1)}
                  </p>
                  <p className="text-sm text-gray-500">/ 100점</p>
                </div>
              </div>
            </div>
          )}
          <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
            <p className="text-sm text-purple-700 flex items-center">
              <Sparkles className="mr-2 h-4 w-4" />
              상세한 분석 결과와 개선 팁을 확인해보세요!
            </p>
          </div>
        </CardContent>
        <CardFooter className="bg-gradient-to-r from-gray-50 to-purple-50 p-4">
          <Button 
            onClick={handleViewDetail}
            className="w-full bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-lg"
          >
            <Video className="mr-2 h-4 w-4" />
            📊 상세 분석 결과 보기
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default LatestAnalysisResultCard;
