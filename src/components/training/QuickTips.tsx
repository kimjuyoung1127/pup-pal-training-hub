
import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

const quickTips = [
  '간식을 미리 준비해주세요 🦴',
  '조용한 환경에서 훈련하세요 🤫',
  '긍정적인 보상을 잊지 마세요 ❤️',
  '강아지의 컨디션을 확인하세요 😊'
];

const QuickTips = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="card-soft p-6 bg-gradient-to-r from-slate-100 to-gray-100">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="text-2xl">💡</div>
          <h3 className="font-bold text-gray-800">훈련 전 체크리스트</h3>
        </div>
        <div className="space-y-2">
          {quickTips.map((tip, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
              className="flex items-center justify-center space-x-2"
            >
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <p className="text-sm text-gray-700">{tip}</p>
            </motion.div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
};

export default QuickTips;
