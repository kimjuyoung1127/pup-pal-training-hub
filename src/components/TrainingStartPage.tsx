import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Play, Clock } from 'lucide-react';
import { useTodaysTrainingStats } from '@/hooks/useTodaysTrainingStats';
import { Skeleton } from '@/components/ui/skeleton';
import TrainingProgressPage from './TrainingProgressPage';
const TrainingStartPage = ({
  onNavigate
}: {
  onNavigate: (page: string) => void;
}) => {
  const [selectedTraining, setSelectedTraining] = useState<string | null>(null);
  const [isTrainingActive, setIsTrainingActive] = useState(false);
  const {
    data: stats,
    isLoading
  } = useTodaysTrainingStats();
  const trainingTypes = [{
    id: 'basic',
    title: '기본 명령어',
    description: '앉아, 기다려, 이리와 등 기본적인 명령어를 배워요',
    duration: '10-15분',
    difficulty: '초급',
    icon: '🎯',
    color: 'bg-gradient-to-br from-blue-50 to-blue-100'
  }, {
    id: 'toilet',
    title: '배변 훈련',
    description: '올바른 배변 습관을 기르는 훈련이에요',
    duration: '5-10분',
    difficulty: '초급',
    icon: '🏠',
    color: 'bg-gradient-to-br from-green-50 to-green-100'
  }, {
    id: 'walk',
    title: '산책 예절',
    description: '줄 당기지 않기, 다른 강아지와의 만남 등을 배워요',
    duration: '15-20분',
    difficulty: '중급',
    icon: '🚶‍♂️',
    color: 'bg-gradient-to-br from-emerald-50 to-emerald-100'
  }, {
    id: 'social',
    title: '사회화 훈련',
    description: '다양한 상황과 사람들에게 익숙해지는 훈련이에요',
    duration: '20-25분',
    difficulty: '중급',
    icon: '🤝',
    color: 'bg-gradient-to-br from-indigo-50 to-indigo-100'
  }];
  const quickTips = ['간식을 미리 준비해주세요 🦴', '조용한 환경에서 훈련하세요 🤫', '긍정적인 보상을 잊지 마세요 ❤️', '강아지의 컨디션을 확인하세요 😊'];
  const handleStartTraining = () => {
    if (selectedTraining) {
      setIsTrainingActive(true);
    }
  };
  const handleExitTraining = () => {
    setIsTrainingActive(false);
    setSelectedTraining(null);
  };
  if (isTrainingActive && selectedTraining) {
    return <TrainingProgressPage trainingId={selectedTraining} onNavigate={onNavigate} onExit={handleExitTraining} />;
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
        {/* Today's Progress */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5
      }}>
          <Card className="card-soft p-6 bg-gradient-to-br from-blue-50 to-sky-100 border-blue-200/50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">오늘의 진행상황</h2>
              <div className="text-2xl">📊</div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {isLoading ? <>
                  <div className="text-center space-y-2">
                    <Skeleton className="h-7 w-1/2 mx-auto" />
                    <Skeleton className="h-4 w-full mx-auto" />
                  </div>
                  <div className="text-center space-y-2">
                    <Skeleton className="h-7 w-1/2 mx-auto" />
                    <Skeleton className="h-4 w-full mx-auto" />
                  </div>
                  <div className="text-center space-y-2">
                    <Skeleton className="h-7 w-1/2 mx-auto" />
                    <Skeleton className="h-4 w-full mx-auto" />
                  </div>
                </> : <>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{stats?.completedTrainings ?? 0}</div>
                    <p className="text-sm text-gray-600">완료한 훈련</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{stats?.totalDuration ?? 0}분</div>
                    <p className="text-sm text-gray-600">훈련 시간</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{stats?.averageSuccessRate ?? 0}%</div>
                    <p className="text-sm text-gray-600">성공률</p>
                  </div>
                </>}
            </div>
          </Card>
        </motion.div>

        {/* Training Types */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5,
        delay: 0.1
      }} className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl p-4 border border-gray-200/50">
          <h2 className="text-xl font-bold text-gray-800 mb-4">훈련 선택하기</h2>
          <div className="space-y-4">
            {trainingTypes.map((training, index) => <motion.div key={training.id} initial={{
            opacity: 0,
            x: -20
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.3,
            delay: index * 0.1
          }}>
                <Card onClick={() => setSelectedTraining(training.id)} className="bg-amber-300">
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
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${training.difficulty === '초급' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                          {training.difficulty}
                        </span>
                        {selectedTraining === training.id && <motion.div initial={{
                      scale: 0
                    }} animate={{
                      scale: 1
                    }} className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </motion.div>}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>)}
          </div>
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

      {/* Fixed Bottom Button - positioned above bottom navigation */}
      <div className="fixed bottom-16 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-gray-200 p-6">
        <Button onClick={handleStartTraining} disabled={!selectedTraining} className={`w-full py-4 text-lg font-bold transition-all duration-200 ${selectedTraining ? 'btn-primary' : 'bg-gray-300 text-gray-600 cursor-not-allowed hover:bg-gray-300 hover:scale-100'}`}>
          <div className="flex items-center justify-center space-x-2">
            <Play className="w-5 h-5" />
            <span>훈련 시작하기</span>
          </div>
        </Button>
      </div>
    </div>;
};
export default TrainingStartPage;