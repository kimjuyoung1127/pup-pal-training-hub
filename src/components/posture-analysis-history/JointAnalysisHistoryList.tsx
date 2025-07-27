
import React from 'react';
import { motion } from 'framer-motion';
import { AnalysisRecord } from '@/hooks/useJointAnalysisHistory';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Video, BadgeCheck } from 'lucide-react';

interface JointAnalysisHistoryListProps {
  records: AnalysisRecord[];
}

const JointAnalysisHistoryList: React.FC<JointAnalysisHistoryListProps> = ({ records }) => {
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
          <Card>
            <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-grow">
                <div className="flex items-center mb-2">
                  <p className="font-semibold text-lg">{new Date(record.created_at).toLocaleString('ko-KR')}</p>
                  {record.is_baseline && (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <BadgeCheck className="w-3 h-3 mr-1" />
                      기준점
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 truncate" title={record.original_video_filename}>
                  원본 영상: {record.original_video_filename}
                </p>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                  <span><strong>안정성:</strong> {record.analysis_results.stability}점</span>
                  <span><strong>대칭성:</strong> {record.analysis_results.symmetry}%</span>
                  <span><strong>보폭:</strong> {record.analysis_results.stride_length}cm</span>
                </div>
              </div>
              <a href={record.processed_video_url} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full">
                  <Video className="w-4 h-4 mr-2" />
                  결과 영상 보기
                </Button>
              </a>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default JointAnalysisHistoryList;
