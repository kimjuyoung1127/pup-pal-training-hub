
import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

const TodayProgress = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="card-soft p-6 bg-gradient-to-br from-blue-50 to-sky-100 border-blue-200/50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">오늘의 진행상황</h2>
          <div className="text-2xl">📊</div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">2</div>
            <p className="text-sm text-gray-600">완료한 훈련</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">25분</div>
            <p className="text-sm text-gray-600">훈련 시간</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">85%</div>
            <p className="text-sm text-gray-600">성공률</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default TodayProgress;
