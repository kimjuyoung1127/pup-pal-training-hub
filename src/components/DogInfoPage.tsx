
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { DogInfo } from '@/types/dog';
import Step1_BasicInfo from './dog-info-steps/Step1_BasicInfo';
import Step2_DogFeatures from './dog-info-steps/Step2_DogFeatures';
import Step3_TrainingGoals from './dog-info-steps/Step3_TrainingGoals';

const DogInfoPage = ({ onComplete }: { onComplete: (dogInfo: DogInfo) => void }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [breedOpen, setBreedOpen] = useState(false);
  const [dogInfo, setDogInfo] = useState<DogInfo>({
    name: '',
    age: '',
    gender: '',
    breed: '',
    weight: '',
    healthStatus: [],
    trainingGoals: []
  });

  const healthOptions = [
    { id: '건강함', label: '건강함', icon: '💚' },
    { id: '관절 문제', label: '관절 문제', icon: '🦴' },
    { id: '알레르기', label: '알레르기', icon: '🤧' },
    { id: '소화 문제', label: '소화 문제', icon: '🤱' },
    { id: '피부 질환', label: '피부 질환', icon: '🐕' },
    { id: '과체중', label: '과체중', icon: '⚖️' },
    { id: '저체중', label: '저체중', icon: '📏' },
    { id: '기타', label: '기타', icon: '🏥' }
  ];

  const trainingGoalOptions = [
    { id: '기본 예절 훈련', label: '기본 예절 훈련', icon: '🎓' },
    { id: '배변 훈련', label: '배변 훈련', icon: '🚽' },
    { id: '짖음 줄이기', label: '짖음 줄이기', icon: '🤫' },
    { id: '산책 훈련', label: '산책 훈련', icon: '🚶' },
    { id: '사회성 훈련', label: '사회성 훈련', icon: '👥' },
    { id: '분리불안 해결', label: '분리불안 해결', icon: '💔' },
    { id: '물어뜯기 교정', label: '물어뜯기 교정', icon: '🚫' },
    { id: '손 올리기/앉기', label: '손 올리기/앉기', icon: '✋' },
    { id: '기다려', label: '기다려', icon: '⏱️' },
    { id: '이리와', label: '이리와', icon: '🤗' }
  ];

  const handleHealthStatusChange = (status: string, checked: boolean) => {
    setDogInfo(prev => ({
      ...prev,
      healthStatus: checked 
        ? [...prev.healthStatus, status]
        : prev.healthStatus.filter(s => s !== status)
    }));
  };

  const handleTrainingGoalChange = (goal: string, checked: boolean) => {
    setDogInfo(prev => ({
      ...prev,
      trainingGoals: checked 
        ? [...prev.trainingGoals, goal]
        : prev.trainingGoals.filter(g => g !== goal)
    }));
  };

  const nextStep = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(dogInfo);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return dogInfo.name && dogInfo.age && dogInfo.gender;
      case 1:
        return dogInfo.breed && dogInfo.weight;
      case 2:
        return dogInfo.healthStatus.length > 0 && dogInfo.trainingGoals.length > 0;
      default:
        return false;
    }
  };

  const stepTitles = [
    '기본 정보를 알려주세요 🐕',
    '우리 아이 특징이 궁금해요 📏',
    '어떤 훈련을 원하시나요? 🎯'
  ];

  const stepDescriptions = [
    '소중한 우리 아이의 이름과 기본 정보부터 시작해볼까요?',
    '견종과 체중 정보로 더 정확한 훈련을 추천해드릴게요!',
    '건강 상태와 훈련 목표를 선택하면 맞춤 플랜을 만들어드려요!'
  ];

  const renderStep = () => {
    switch(currentStep) {
      case 0:
        return <Step1_BasicInfo dogInfo={dogInfo} setDogInfo={setDogInfo} />;
      case 1:
        return <Step2_DogFeatures dogInfo={dogInfo} setDogInfo={setDogInfo} breedOpen={breedOpen} setBreedOpen={setBreedOpen} />;
      case 2:
        return <Step3_TrainingGoals 
          dogInfo={dogInfo} 
          healthOptions={healthOptions}
          trainingGoalOptions={trainingGoalOptions}
          handleHealthStatusChange={handleHealthStatusChange} 
          handleTrainingGoalChange={handleTrainingGoalChange} 
        />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-cream-50 to-orange-50 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <div className="text-xl">🐾</div>
          <h1 className="text-lg font-bold text-cream-800 font-pretendard">멍멍트레이너</h1>
        </div>
        <div className="text-sm text-cream-600 font-pretendard">
          {currentStep + 1} / 3
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-cream-200 rounded-full h-2 mb-8">
        <motion.div 
          className="bg-orange-500 h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${((currentStep + 1) / 3) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-cream-800 mb-2 font-pretendard">
            {stepTitles[currentStep]}
          </h2>
          <p className="text-cream-700 font-pretendard">
            {stepDescriptions[currentStep]}
          </p>
        </motion.div>

        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="flex-1 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              {renderStep()}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Navigation Buttons */}
      <motion.div 
        className="mt-auto pt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="flex justify-between items-center max-w-md mx-auto">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center space-x-2 bg-cream-200 hover:bg-cream-300 text-cream-800 border-2 border-cream-300 font-pretendard"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>이전</span>
          </Button>

          <Button
            onClick={nextStep}
            disabled={!canProceed()}
            className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white font-pretendard"
          >
            <span>{currentStep === 2 ? '완료' : '다음'}</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default DogInfoPage;
