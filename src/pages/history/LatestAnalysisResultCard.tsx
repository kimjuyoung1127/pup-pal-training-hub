// src/pages/history/LatestAnalysisResultCard.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { Award, Calendar, Video } from 'lucide-react';
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border-2 border-orange-400">
        <CardHeader className="p-0">
          <div className="relative">
            {/* 임시 썸네일. 실제로는 record.thumbnail_url 등을 사용 */}
            <img 
              src={`https://i.pravatar.cc/500?u=${record.id}`} 
              alt={record.dog_name || '분석 영상'} 
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 p-4">
              <Badge variant="destructive" className="text-sm font-bold">NEW</Badge>
              <CardTitle className="text-white text-2xl font-bold mt-2">{record.dog_name || '최근 분석'}</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center text-gray-600 mb-4">
            <Calendar className="w-5 h-5 mr-2 text-orange-500" />
            <span>{formattedDate}</span>
          </div>
          {stabilityScore !== undefined && (
            <div className="flex items-center text-gray-800 mb-6">
              <Award className="w-8 h-8 mr-3 text-orange-500" />
              <div>
                <p className="text-lg font-semibold">자세 안정성 점수</p>
                <p className="text-3xl font-bold text-orange-600">{stabilityScore.toFixed(1)}점</p>
              </div>
            </div>
          )}
          <p className="text-gray-600 text-sm">
            {record.notes || '분석에 대한 특별한 노트가 없습니다.'}
          </p>
        </CardContent>
        <CardFooter className="bg-gray-50 p-4 flex justify-end">
          <Button onClick={handleViewDetail}>
            <Video className="w-4 h-4 mr-2" />
            자세히 보기
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default LatestAnalysisResultCard;
