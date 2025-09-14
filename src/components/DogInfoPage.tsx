
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { DogInfo } from '@/types/dog';
import Step1_BasicInfo from './dog-info-steps/Step1_BasicInfo';
import Step2_DogFeatures from './dog-info-steps/Step2_DogFeatures';
import Step3_TrainingGoals from './dog-info-steps/Step3_TrainingGoals';
import ExtendedProfileCategoryStep from './dog-info-steps/ExtendedProfileCategoryStep';
import { useDogInfoOptions } from '@/hooks/useDogInfoOptions';
import { useSaveDogInfo } from '@/hooks/useSaveDogInfo';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { missionCategories } from '@/lib/missionData';

interface DogInfoPageProps {
  onComplete: (dogInfo: DogInfo) => void;
  dogInfoToEdit?: DogInfo | null;
}

const DogInfoPage = ({ onComplete, dogInfoToEdit }: DogInfoPageProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [breedOpen, setBreedOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();

  const [dogInfo, setDogInfo] = useState<DogInfo>({
    name: '',
    age: { years: 0, months: 0 },
    gender: '',
    breed: '',
    weight: 0,
    healthStatus: [],
    trainingGoals: [],
    extendedProfile: {}
  });

  useEffect(() => {
    if (dogInfoToEdit) {
      let ageObject = dogInfoToEdit.age;
      if (typeof ageObject === 'string') {
        const parts = (ageObject as string).split('년');
        const years = parseInt(parts[0]) || 0;
        const months = parts[1] ? parseInt(parts[1].replace('개월', '')) || 0 : 0;
        ageObject = { years, months };
      }
      setDogInfo({ 
        ...dogInfoToEdit, 
        age: ageObject,
        extendedProfile: dogInfoToEdit.extendedProfile || {}
      });
    }
  }, [dogInfoToEdit]);

  const { healthOptions, trainingGoalOptions, isLoading: optionsLoading } = useDogInfoOptions();

  const { mutate: saveDog, isPending: isSaving } = useSaveDogInfo({
    onSuccess: (savedDogInfo) => {
      setShowConfetti(true);
      // setTimeout을 제거하고 즉시 onComplete를 호출하도록 변경
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
    if (currentStep < 2 + missionCategories.length) {
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
        // Extended profile steps are optional, so always allow proceeding
        return true;
    }
  };

  const stepTitles = [
    '기본 정보를 알려주세요 🐕',
    '우리 아이 특징이 궁금해요 📏',
    '어떤 훈련을 원하시나요? 🎯',
    ...missionCategories.map(category => `${category.title}을 알려주세요 ${category.icon}`)
  ];

  const stepDescriptions = [
    '소중한 우리 아이의 이름과 기본 정보부터 시작해볼까요?',
    '견종과 체중 정보로 더 정확한 훈련을 추천해드릴게요!',
    '건강 상태와 훈련 목표를 선택하면 맞춤 플랜을 만들어드려요!',
    ...missionCategories.map(category => `${category.title}에 대한 정보를 입력해주세요. 더 정확한 훈련을 제공해드릴게요!`)
  ];

  const renderStep = () => {
    if (currentStep === 0) {
      return <Step1_BasicInfo dogInfo={dogInfo} setDogInfo={setDogInfo} />;
    } else if (currentStep === 1) {
      return <Step2_DogFeatures dogInfo={dogInfo} setDogInfo={setDogInfo} breedOpen={breedOpen} setBreedOpen={setBreedOpen} />;
    } else if (currentStep === 2) {
      return <Step3_TrainingGoals 
        dogInfo={dogInfo} 
        healthOptions={healthOptions}
        trainingGoalOptions={trainingGoalOptions}
        handleHealthStatusChange={handleHealthStatusChange} 
        handleTrainingGoalChange={handleTrainingGoalChange}
        isLoading={optionsLoading}
      />;
    } else if (currentStep >= 3 && currentStep < 3 + missionCategories.length) {
      const categoryIndex = currentStep - 3;
      return (
        <ExtendedProfileCategoryStep 
          category={missionCategories[categoryIndex]}
          dogInfo={dogInfo}
          setDogInfo={setDogInfo}
        />
      );
    }
    return null;
  };

  if (showConfetti) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-sky-50 to-sky-100 p-4">
        <Confetti width={width} height={height} />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-sky-800 mb-4 font-pretendard">🎉 등록 완료! 🎉</h2>
          <p className="text-lg text-sky-700 font-pretendard">우리 아이를 위한 맞춤 플랜을 준비 중이에요!</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-sky-50 to-sky-100 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <div className="text-xl">🐾</div>
          <h1 className="text-lg font-bold text-sky-800 font-pretendard">Mung-AI</h1>
        </div>
        <div className="text-sm text-sky-600 font-pretendard">
          {currentStep + 1} / {3 + missionCategories.length}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-sky-200 rounded-full h-2 mb-8">
        <motion.div 
          className="bg-sky-500 h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${((currentStep + 1) / (3 + missionCategories.length)) * 100}%` }}
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
          <h2 className="text-2xl font-bold text-sky-800 mb-2 font-pretendard">
            {stepTitles[currentStep]}
          </h2>
          <p className="text-sky-700 font-pretendard">
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
            <span>
              {currentStep === 2 + missionCategories.length ? (isSaving ? '저장 중...' : '완료') : 
               currentStep >= 3 ? '다음 카테고리' : '다음'}
            </span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default DogInfoPage;
