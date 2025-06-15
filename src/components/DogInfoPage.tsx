import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { DogInfo } from '@/types/dog';
import Step1_BasicInfo from './dog-info-steps/Step1_BasicInfo';
import Step2_DogFeatures from './dog-info-steps/Step2_DogFeatures';
import Step3_TrainingGoals from './dog-info-steps/Step3_TrainingGoals';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

type Option = {
  id: number;
  label: string;
  icon: string;
};

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
  const [isLoading, setIsLoading] = useState(false);

  const [healthOptions, setHealthOptions] = useState<Option[]>([]);
  const [trainingGoalOptions, setTrainingGoalOptions] = useState<Option[]>([]);

  const healthIcons: Record<string, string> = {
    '건강함': '💚', '관절 문제': '🦴', '알레르기': '🤧', '소화 문제': '🤱',
    '피부 질환': '🐕', '과체중': '⚖️', '저체중': '📏', '기타': '🏥'
  };

  const trainingGoalIcons: Record<string, string> = {
    '기본 예절 훈련': '🎓', '배변 훈련': '🚽', '짖음 줄이기': '🤫', '산책 훈련': '🚶',
    '사회성 훈련': '👥', '분리불안 해결': '💔', '물어뜯기 교정': '🚫',
    '손 올리기/앉기': '✋', '기다려': '⏱️', '이리와': '🤗'
  };

  useEffect(() => {
    const fetchOptions = async () => {
      const { data: healthData, error: healthError } = await supabase.from('health_status_options').select('id, name');
      if (healthError) {
        console.error('Error fetching health options:', healthError);
        toast.error("건강 상태 목록을 불러오는데 실패했습니다.");
      } else {
        setHealthOptions(healthData.map(o => ({ id: o.id, label: o.name, icon: healthIcons[o.name] || '❓' })));
      }

      const { data: trainingData, error: trainingError } = await supabase.from('behavior_options').select('id, name');
      if (trainingError) {
        console.error('Error fetching training options:', trainingError);
        toast.error("훈련 목표 목록을 불러오는데 실패했습니다.");
      } else {
        setTrainingGoalOptions(trainingData.map(o => ({ id: o.id, label: o.name, icon: trainingGoalIcons[o.name] || '❓' })));
      }
    };
    fetchOptions();
  }, []);

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

  const handleComplete = async () => {
    setIsLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast.error("로그인이 필요합니다. 로그인 후 다시 시도해주세요.");
      console.error("User not logged in. Cannot save dog info.");
      setIsLoading(false);
      return;
    }

    const { data: dogData, error: dogError } = await supabase
      .from('dogs')
      .insert({
        name: dogInfo.name,
        age: dogInfo.age,
        gender: dogInfo.gender,
        breed: dogInfo.breed,
        weight: dogInfo.weight,
        user_id: user.id
      })
      .select()
      .single();

    if (dogError || !dogData) {
      console.error('Error saving dog info:', dogError);
      toast.error("강아지 정보 저장에 실패했습니다.");
      setIsLoading(false);
      return;
    }

    const dogId = dogData.id;

    const healthStatusInserts = dogInfo.healthStatus.map(optionId => ({
      dog_id: dogId,
      health_status_option_id: optionId
    }));
    
    if (healthStatusInserts.length > 0) {
      const { error: healthStatusError } = await supabase.from('dog_health_status').insert(healthStatusInserts);
      if (healthStatusError) console.error('Error saving health status:', healthStatusError);
    }

    const trainingGoalsInserts = dogInfo.trainingGoals.map(optionId => ({
      dog_id: dogId,
      behavior_option_id: optionId
    }));

    if (trainingGoalsInserts.length > 0) {
      const { error: trainingGoalsError } = await supabase.from('dog_desired_behaviors').insert(trainingGoalsInserts);
      if (trainingGoalsError) console.error('Error saving training goals:', trainingGoalsError);
    }
    
    toast.success("강아지 정보가 성공적으로 저장되었습니다!");
    setIsLoading(false);
    onComplete(dogInfo);
  };

  const nextStep = async () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      await handleComplete();
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
            disabled={!canProceed() || isLoading}
            className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white font-pretendard"
          >
            <span>{currentStep === 2 ? (isLoading ? '저장 중...' : '완료') : '다음'}</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default DogInfoPage;
