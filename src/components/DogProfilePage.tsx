
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
import GrowthMissionBoard from './dog-profile/GrowthMissionBoard';

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
    extendedProfile,
    fetchDogProfile,
    handleImageUpload,
    handleImageDelete,
    handleDeleteDogProfile,
  } = useDogProfile();

  const Header = () => (
    <div className="bg-background/80 backdrop-blur-sm border-b border-border px-6 py-4 sticky top-0 z-20"> {/* 배경, 테두리, z-index 변경 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="text-xl text-primary">🐾</div> {/* 아이콘 색상 변경 */}
          <div>
            <h1 className="text-lg font-bold text-foreground font-pretendard">우리 아이 프로필</h1> {/* 텍스트 색상 변경 */}
            <p className="text-sm text-muted-foreground font-pretendard">소중한 가족을 소개합니다</p> {/* 텍스트 색상 변경 */}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('dog-info')}
            className="text-muted-foreground hover:text-pink-500 border-border hover:border-pink-300" /* 버튼 스타일 변경 */
          >
            <Edit className="w-4 h-4 mr-1" />
            편집
          </Button>
          <DeleteProfileDialog isDeleting={isDeleting} onDelete={handleDeleteDogProfile} />
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6 space-y-6"> {/* 배경 변경 */}
        <Header />
        {/* Skeleton 기본 색상이 bg-muted를 따르도록 tailwind.config.ts 또는 global css에서 설정되어 있다고 가정 */}
        <Skeleton className="h-32 w-full mt-6 rounded-lg" /> {/* 라운딩 추가 */}
        <Skeleton className="h-24 w-full rounded-lg" /> {/* 라운딩 추가 */}
        <Skeleton className="h-24 w-full rounded-lg" /> {/* 라운딩 추가 */}
      </div>
    );
  }

  if (!dogInfo) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6 text-center"> {/* 배경 변경 */}
        <Header />
        <div className="flex-grow flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold text-foreground mb-2 font-pretendard">프로필이 없어요!</h2> {/* 텍스트 색상 변경 */}
          <p className="text-muted-foreground mb-6 font-pretendard">먼저 우리 아이 정보를 등록해주세요.</p> {/* 텍스트 색상 변경 */}
          <Button
            onClick={() => onNavigate('dog-info')}
            className="bg-pink-500 hover:bg-pink-600 text-white shadow-md" /* 버튼 스타일 변경 */
          >
              강아지 정보 등록하기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24"> {/* 배경 변경 */}
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
          <GrowthMissionBoard extendedProfile={extendedProfile} dogId={dogInfo.id} onUpdate={fetchDogProfile} />
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
