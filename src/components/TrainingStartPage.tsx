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

  return <div className="min-h-screen bg-gradient-to-br from-beige-50 to-cream-100 pb-32"> {/* 배경 변경 */}
      {/* Header */}
      <div className="bg-background/80 backdrop-blur-sm border-b border-border px-6 py-4 sticky top-0 z-10"> {/* 헤더 스타일 변경 */}
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={() => onNavigate('dashboard')} className="text-foreground hover:bg-muted"> {/* 버튼 색상 변경 */}
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center space-x-3">
            <div className="text-2xl text-training-yellow-dark">🎓</div> {/* 아이콘 색상 변경 */}
            <div>
              <h1 className="text-lg font-bold text-foreground">오늘의 훈련</h1> {/* 텍스트 색상 변경 */}
              <p className="text-sm text-muted-foreground">함께 성장해봐요!</p> {/* 텍스트 색상 변경 */}
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
          {/* AiTrainingRecommender 내부에서 training-yellow 계열 사용하도록 수정 필요 */}
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
          <Card className="card-soft p-6 bg-training-yellow-light"> {/* 카드 배경 변경 */}
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="text-2xl text-training-yellow-dark">💡</div> {/* 아이콘 색상 변경 */}
              <h3 className="font-bold text-training-yellow-text">훈련 전 체크리스트</h3> {/* 텍스트 색상 변경 */}
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
                  <div className="w-2 h-2 bg-training-yellow rounded-full"></div> {/* 점 색상 변경 */}
                  <p className="text-sm text-muted-foreground">{tip}</p> {/* 텍스트 색상 변경 */}
                </motion.div>)}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>;
};
export default TrainingStartPage;
