
import React from 'react';
import { motion } from 'framer-motion';
import { JointAnalysisRecord } from '@/types/analysis';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Award, Share2, Eye, Heart, Sparkles, Dog } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface JointAnalysisHistoryListProps {
  records: JointAnalysisRecord[];
  onShare: (record: JointAnalysisRecord) => void;
  onDetailView: (record: JointAnalysisRecord) => void;
}

const JointAnalysisHistoryList: React.FC<JointAnalysisHistoryListProps> = ({ records, onShare, onDetailView }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  // 점수별 정보 가져오기
  const getScoreInfo = (score: number) => {
    if (score >= 80) return { emoji: '🌟', message: '완벽!', color: 'text-green-600', bgColor: 'bg-green-50' };
    if (score >= 60) return { emoji: '👍', message: '좋음', color: 'text-blue-600', bgColor: 'bg-blue-50' };
    if (score >= 40) return { emoji: '💪', message: '개선중', color: 'text-yellow-600', bgColor: 'bg-yellow-50' };
    return { emoji: '🤗', message: '관리필요', color: 'text-orange-600', bgColor: 'bg-orange-50' };
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      {records.map((record) => {
        const stabilityScore = record.analysis_results?.scores?.stability;
        const curvatureScore = record.analysis_results?.scores?.curvature;
        const scoreInfo = stabilityScore ? getScoreInfo(stabilityScore) : null;
        
        return (
          <motion.div key={record.id} variants={itemVariants}>
            <Card className="hover:shadow-lg transition-all duration-200 border border-purple-200 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex-grow">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <Calendar className="w-4 h-4 mr-2 text-purple-400" />
                      <span>{new Date(record.created_at).toLocaleString('ko-KR', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Heart className="w-5 h-5 mr-2 text-pink-500" />
                        <span className="font-bold text-lg text-gray-800">{record.dog_name || '강아지'}</span>
                      </div>
                      {scoreInfo && (
                        <Badge className={`${scoreInfo.bgColor} ${scoreInfo.color} border-0 ml-2`}>
                          {scoreInfo.emoji} {scoreInfo.message}
                        </Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                      {stabilityScore !== undefined && (
                        <div className="flex items-center bg-blue-50 p-2 rounded-lg">
                          <Award className="w-5 h-5 mr-2 text-blue-600" />
                          <span className="font-semibold text-sm text-gray-700">안정성:</span>
                          <span className="ml-2 text-lg font-bold text-blue-600">
                            {stabilityScore.toFixed(1)}점
                          </span>
                        </div>
                      )}
                      {curvatureScore !== undefined && (
                        <div className="flex items-center justify-center bg-green-100 text-green-800 px-3 py-1 rounded-full">
                  <Dog className="w-4 h-4 mr-2" />
                  <span className="font-semibold">자세 {record.analysis_results.scores.curvature.toFixed(1)}점</span>
                </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-gradient-to-r from-gray-50 to-purple-50 p-3 flex justify-end items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onShare(record)}
                  className="text-purple-600 hover:text-purple-700 hover:bg-purple-100"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  🚀 공유
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onDetailView(record)}
                  className="border-purple-200 text-purple-600 hover:bg-purple-50"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  📊 상세보기
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default JointAnalysisHistoryList;
