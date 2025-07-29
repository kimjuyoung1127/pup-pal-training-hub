
import React from 'react';
import { motion } from 'framer-motion';
import { JointAnalysisRecord } from '@/types/analysis';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Award, Share2, Eye } from 'lucide-react';

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

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      {records.map((record) => (
        <motion.div key={record.id} variants={itemVariants}>
          <Card className="hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-grow">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{new Date(record.created_at).toLocaleString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="flex items-center font-semibold text-lg">
                  <Award className="w-5 h-5 mr-2 text-amber-600" />
                  <span>안정��� 점수: {record.stability_score?.toFixed(1) ?? 'N/A'}점</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50/50 p-3 flex justify-end items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => onShare(record)}>
                <Share2 className="w-4 h-4 mr-2" />
                공유
              </Button>
              <Button variant="outline" size="sm" onClick={() => onDetailView(record)}>
                <Eye className="w-4 h-4 mr-2" />
                상세 보기
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default JointAnalysisHistoryList;
