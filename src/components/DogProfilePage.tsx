
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

interface DogProfilePageProps {
  onNavigate: (page: string) => void;
}

const DogProfilePage = ({ onNavigate }: DogProfilePageProps) => {
  const {
    dogInfo,
    healthStatusNames,
    trainingGoalNames,
    trainingStats,
    isLoading,
    isDeleting,
    handleImageUpload,
    handleImageDelete,
    handleDeleteDogProfile,
  } = useDogProfile();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream-50 to-orange-50 p-6 space-y-6">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (!dogInfo) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-cream-50 to-orange-50 p-6 text-center">
        <h2 className="text-2xl font-bold text-cream-800 mb-2 font-pretendard">프로필이 없어요!</h2>
        <p className="text-cream-700 mb-6 font-pretendard">먼저 우리 아이 정보를 등록해주세요.</p>
        <Button onClick={() => onNavigate('dog-info')}>
            강아지 정보 등록하기
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 to-orange-50 pb-24">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-cream-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-xl">🐾</div>
            <div>
              <h1 className="text-lg font-bold text-cream-800 font-pretendard">우리 아이 프로필</h1>
              <p className="text-sm text-cream-600 font-pretendard">소중한 가족을 소개합니다</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('dog-info')}
              className="text-cream-600 hover:text-cream-800 border-cream-300"
            >
              <Edit className="w-4 h-4 mr-1" />
              편집
            </Button>
            <DeleteProfileDialog isDeleting={isDeleting} onDelete={handleDeleteDogProfile} />
          </div>
        </div>
      </div>

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
        >
          <TrainingStats stats={trainingStats} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <QuickActions onNavigate={onNavigate} />
        </motion.div>
      </div>
    </div>
  );
};

export default DogProfilePage;
