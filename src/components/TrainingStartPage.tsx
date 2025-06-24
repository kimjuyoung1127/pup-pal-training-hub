import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Play } from 'lucide-react';
import TrainingProgressPage from './TrainingProgressPage';
import AiTrainingRecommender from './AiTrainingRecommender';
import { TrainingProgram } from '@/lib/trainingData';
import { useDogProfile } from '@/hooks/useDogProfile'; // useDogProfile 훅 임포트

const TrainingStartPage = ({
  onNavigate
}: {
  onNavigate: (page: string) => void;
}) => {
  const [selectedAiTraining, setSelectedAiTraining] = useState<TrainingProgram | null>(null);
  const [isTrainingActive, setIsTrainingActive] = useState(false);
  const { dogInfo } = useDogProfile(); // useDogProfile 훅 사용

  const quickTips = ['간식을 미리 준비해주세요 🦴', '조용한 환경에서 훈련하세요 🤫', '긍정적인 보상을 잊지 마세요 ❤️', '강아지의 컨디션을 확인하세요 😊'];
  
  const handleExitTraining = () => {
    setIsTrainingActive(false);
    setSelectedAiTraining(null);
  };

  const handleSelectAiTraining = (training: TrainingProgram) => {
    setSelectedAiTraining(training);
    setIsTrainingActive(true); // 훈련 선택 시 바로 활성화
  };

  if (isTrainingActive && selectedAiTraining && dogInfo?.id) {
    return <TrainingProgressPage 
      trainingProgram={{...selectedAiTraining, isAiTraining: true}} 
      onNavigate={onNavigate} 
      onExit={handleExitTraining} 
      dogId={dogInfo.id} // dogId 전달
    />;
  }

  return <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 pb-32">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={() => onNavigate('dashboard')} className="text-gray-600 hover:text-gray-800">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center space-x-3">
            <div className="text-xl">🎓</div>
            <div>
              <h1 className="text-lg font-bold text-gray-800">오늘의 훈련</h1>
              <p className="text-sm text-gray-600">함께 성장해봐요!</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* AI Training Recommender */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <AiTrainingRecommender 
            onSelectTraining={handleSelectAiTraining} 
            selectedTrainingTitle={selectedAiTraining?.title || null}
          />
        </motion.div>

        {/* Quick Tips */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5,
        delay: 0.2
      }}>
          <Card className="card-soft p-6 bg-gradient-to-r from-slate-100 to-gray-100">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="text-2xl">💡</div>
              <h3 className="font-bold text-gray-800">훈련 전 체크리스트</h3>
            </div>
            <div className="space-y-2">
              {quickTips.map((tip, index) => <motion.div key={index} initial={{
              opacity: 0,
              x: -10
            }} animate={{
              opacity: 1,
              x: 0
            }} transition={{
              duration: 0.3,
              delay: 0.3 + index * 0.1
            }} className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <p className="text-sm text-gray-700">{tip}</p>
                </motion.div>)}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>;
};
export default TrainingStartPage;
