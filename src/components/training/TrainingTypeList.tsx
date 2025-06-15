
import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Clock } from 'lucide-react';

const trainingTypes = [
  {
    id: 'basic',
    title: '기본 명령어',
    description: '앉아, 기다려, 이리와 등 기본적인 명령어를 배워요',
    duration: '10-15분',
    difficulty: '초급',
    icon: '🎯',
    color: 'bg-gradient-to-br from-blue-50 to-blue-100'
  },
  {
    id: 'toilet',
    title: '배변 훈련',
    description: '올바른 배변 습관을 기르는 훈련이에요',
    duration: '5-10분',
    difficulty: '초급',
    icon: '🏠',
    color: 'bg-gradient-to-br from-green-50 to-green-100'
  },
  {
    id: 'walk',
    title: '산책 예절',
    description: '줄 당기지 않기, 다른 강아지와의 만남 등을 배워요',
    duration: '15-20분',
    difficulty: '중급',
    icon: '🚶‍♂️',
    color: 'bg-gradient-to-br from-emerald-50 to-emerald-100'
  },
  {
    id: 'social',
    title: '사회화 훈련',
    description: '다양한 상황과 사람들에게 익숙해지는 훈련이에요',
    duration: '20-25분',
    difficulty: '중급',
    icon: '🤝',
    color: 'bg-gradient-to-br from-indigo-50 to-indigo-100'
  }
];

interface TrainingTypeListProps {
  selectedTraining: string | null;
  setSelectedTraining: (id: string) => void;
}

const TrainingTypeList = ({ selectedTraining, setSelectedTraining }: TrainingTypeListProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl p-4 border border-gray-200/50"
    >
      <h2 className="text-xl font-bold text-gray-800 mb-4">훈련 선택하기</h2>
      <div className="space-y-4">
        {trainingTypes.map((training, index) => (
          <motion.div
            key={training.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card
              className={`p-4 cursor-pointer transition-all duration-200 ${
                selectedTraining === training.id
                  ? 'ring-2 ring-blue-400 bg-blue-50 border-blue-200'
                  : 'card-soft hover:shadow-md'
              }`}
              onClick={() => setSelectedTraining(training.id)}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-xl ${training.color}`}>
                  <div className="text-2xl">{training.icon}</div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-gray-800">{training.title}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{training.duration}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{training.description}</p>
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      training.difficulty === '초급'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {training.difficulty}
                    </span>
                    {selectedTraining === training.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
                      >
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default TrainingTypeList;
