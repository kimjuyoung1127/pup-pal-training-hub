
import React from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Edit } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDogProfile } from '@/hooks/useDogProfile';
import ProfileHeader from './dog-profile/ProfileHeader';
import HealthStatusCard from './dog-profile/HealthStatusCard';
import TrainingGoalsCard from './dog-profile/TrainingGoalsCard';
import TrainingStats from './dog-profile/TrainingStats';
import QuickActions from './dog-profile/QuickActions';
import DeleteProfileDialog from './dog-profile/DeleteProfileDialog';
import { Card } from '@/components/ui/card'; // Card 컴포넌트 import 추가
import { DogInfo, AgeGroup, GenderKey, breedData } from '@/types/dog'; // 타입 및 데이터 import 추가

// getDogReminder 함수를 DogProfilePage 내부 또는 외부 유틸리티로 이동
const getDogReminder = (dogInfo: DogInfo | null) => {
  if (!dogInfo || dogInfo.weight === null || !dogInfo.age || dogInfo.age.years === null) return null;

  const { weight, age, breed, gender } = dogInfo;
  const totalMonths = age.years * 12 + (age.months || 0);

  const ageGroup: AgeGroup = totalMonths < 12 ? 'puppy' : (age.years < 8 ? 'adult' : 'senior');
  const genderKey: GenderKey = gender === '수컷' ? 'male' : 'female';

  const currentBreedData = breedData[breed] || breedData['믹스견'];
  const idealWeight = currentBreedData.idealWeight[ageGroup][genderKey];
  const [idealWeightLower, idealWeightUpper] = idealWeight;

  if (weight > idealWeightUpper * 1.2) {
    return `현재 체중(${weight}kg)이 적정 범위(${idealWeightLower}~${idealWeightUpper}kg)보다 많이 나가요. 관절 보호에 신경 써주세요. 🦴`;
  } else if (weight > idealWeightUpper) {
    return `현재 체중(${weight}kg)이 적정 범위(${idealWeightLower}~${idealWeightUpper}kg)를 살짝 넘었어요. 꾸준한 산책으로 관리해주세요. 🏃‍♂️`;
  } else if (weight < idealWeightLower) {
    return `현재 체중(${weight}kg)이 적정 범위(${idealWeightLower}~${idealWeightUpper}kg)보다 조금 미달이에요. 영양 균형을 확인하고 체력을 보충해주세요. 🍚`;
  } else {
    return `현재 적정 체중(${weight}kg)을 잘 유지하고 있어요! 👍`;
  }
};


interface DogProfilePageProps {
  onNavigate: (page: string, params?: any) => void;
}

const DogProfilePage = ({ onNavigate }: DogProfilePageProps) => {
  const {
    dogInfo,
    healthStatusNames,
    trainingGoalNames,
    trainingStats,
    isLoading,
    isDeleting,
    extendedProfile,
    refetchDogProfile,
    handleImageUpload,
    handleImageDelete,
    handleDeleteDogProfile,
  } = useDogProfile();

  const reminder = getDogReminder(dogInfo); // dogInfo를 사용하여 리마인더 메시지 생성

  const Header = () => (
    <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-3">
          <div className="text-xl">🐾</div>
          <div>
            <h1 className="text-lg font-bold text-sky-800 font-pretendard">우리 아이 프로필</h1>
            <p className="text-sm text-sky-600 font-pretendard">소중한 가족을 소개합니다</p>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2 justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onNavigate('dog-info', { dogInfo: { ...dogInfo, ...extendedProfile } })}
          className="bg-white text-sky-600 hover:bg-sky-100 hover:text-sky-800 border border-sky-300 focus:ring-0 focus:ring-offset-0"
        >
          <Edit className="w-4 h-4 mr-1" />
          편집
        </Button>
        <DeleteProfileDialog isDeleting={isDeleting} onDelete={handleDeleteDogProfile} />
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-grow flex flex-col items-center justify-center space-y-6 p-6">
          <div className="paw-loader flex space-x-2 text-4xl text-sky-500">
            <span>🐾</span>
            <span>🐾</span>
            <span>🐾</span>
            <span>🐾</span>
          </div>
          <p className="text-lg font-semibold text-sky-700 font-pretendard animate-pulse">
            프로필을 불러오는 중입니다...
          </p>
          <div className="w-full max-w-md space-y-4 mt-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!dogInfo) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
        <Header />
        <div className="flex-grow flex flex-col items-center justify-center">
          <h2 className="text-3xl font-bold text-sky-800 mb-4 font-pretendard">프로필이 없어요!</h2>
          <p className="text-lg text-sky-700 mb-8 font-pretendard">먼저 우리 아이 정보를 등록해주세요.</p>
          <Button 
            onClick={() => onNavigate('dog-info')}
            className="focus:ring-0 focus:ring-offset-0 bg-sky-600 text-white hover:bg-sky-700 px-8 py-4 text-lg"
          >
              강아지 정보 등록하기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-24">
      <Header />
      <div className="p-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <ProfileHeader dogInfo={dogInfo} onImageUpload={handleImageUpload} onImageDelete={handleImageDelete} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <HealthStatusCard healthStatusNames={healthStatusNames} />
        </motion.div>

        {reminder && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="dog-reminder-card"
          >
            <Card className="card-soft p-6 bg-blue-100">
              <div className="flex items-start space-x-3">
                <div className="text-2xl">🐶</div>
                <div>
                  <h3 className="font-bold text-sky-900 mb-2">{dogInfo.name} 리마인드</h3>
                  <p className="text-sm text-sky-800 leading-relaxed">{reminder}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <TrainingGoalsCard trainingGoalNames={trainingGoalNames} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="achievements-card" // 클래스 추가
        >
          <TrainingStats stats={trainingStats} />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <QuickActions onNavigate={onNavigate} />
        </motion.div>
      </div>
    </div>
  );
};

export default DogProfilePage;
