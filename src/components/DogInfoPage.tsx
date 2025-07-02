
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { DogInfo } from '@/types/dog';
import Step1_BasicInfo from './dog-info-steps/Step1_BasicInfo';
import Step2_DogFeatures from './dog-info-steps/Step2_DogFeatures';
import Step3_TrainingGoals from './dog-info-steps/Step3_TrainingGoals';
import { useDogInfoOptions } from '@/hooks/useDogInfoOptions';
import { useSaveDogInfo } from '@/hooks/useSaveDogInfo';

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

  const { healthOptions, trainingGoalOptions, isLoading: optionsLoading } = useDogInfoOptions();

  const { mutate: saveDog, isPending: isSaving } = useSaveDogInfo({
    onSuccess: (savedDogInfo) => {
      onComplete(savedDogInfo);
    },
  });

  const handleHealthStatusChange = (statusIds: string[]) => {
    setDogInfo(prev => ({
      ...prev,
      healthStatus: statusIds.map(Number)
    }));
  };

  const handleTrainingGoalChange = (goalIds: string[]) => {
    setDogInfo(prev => ({
      ...prev,
      trainingGoals: goalIds.map(Number)
    }));
  };

  const nextStep = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      saveDog(dogInfo);
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
          isLoading={optionsLoading}
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
          <h1 className="text-lg font-bold text-gray-800 font-pretendard">멍멍트레이너</h1>
        </div>
        <div className="text-sm text-gray-600 font-pretendard">
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
          <h2 className="text-2xl font-bold text-gray-800 mb-2 font-pretendard">
            {stepTitles[currentStep]}
          </h2>
          <p className="text-gray-700 font-pretendard">
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
            className="flex items-center space-x-2 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 font-pretendard focus:ring-0 focus:ring-offset-0"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>이전</span>
          </Button>

          <Button
            onClick={nextStep}
            disabled={!canProceed() || isSaving}
            className="flex items-center space-x-2 bg-sky-600 hover:bg-sky-700 text-white font-pretendard focus:ring-0 focus:ring-offset-0"
          >
            <span>{currentStep === 2 ? (isSaving ? '저장 중...' : '완료') : '다음'}</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default DogInfoPage;
