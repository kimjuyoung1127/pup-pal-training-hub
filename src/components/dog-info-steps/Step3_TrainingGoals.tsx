
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Heart, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { DogInfo } from '@/types/dog';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Skeleton } from '@/components/ui/skeleton';

// Option 타입을 useDogInfoOptions에서 직접 가져오지 않으므로, 여기서 정의합니다.
interface Option {
  id: number;
  label: string;
  icon: string;
}

interface Props {
  dogInfo: DogInfo;
  healthOptions: Option[];
  trainingGoalOptions: Option[];
  handleHealthStatusChange: (statusIds: string[]) => void;
  handleTrainingGoalChange: (goalIds: string[]) => void;
  isLoading: boolean;
}

const Step3_TrainingGoals: React.FC<Props> = ({ 
  dogInfo, 
  healthOptions,
  trainingGoalOptions,
  handleHealthStatusChange, 
  handleTrainingGoalChange,
  isLoading
}) => {
  const renderSkeletons = (count: number, gridClass: string) => (
    <div className={gridClass}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-[60px] rounded-xl" />
      ))}
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="text-center mb-6">
        <div className="text-4xl mb-2">🎯</div>
      </div>

      {/* 건강 상태 카드 */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-2 border-cream-200 bg-gradient-to-r from-cream-50 to-orange-50">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Heart className="w-6 h-6 text-orange-500 mr-2" />
              <Label className="text-gray-800 font-semibold text-lg font-pretendard">건강 상태</Label>
            </div>
            <p className="text-sm text-gray-600 mb-4 font-pretendard">우리 아이의 현재 건강 상태를 알려주세요 (복수 선택 가능)</p>
            
            {isLoading ? (
              renderSkeletons(4, "grid grid-cols-2 gap-3")
            ) : healthOptions.length > 0 ? (
              <ToggleGroup
                type="multiple"
                value={dogInfo.healthStatus.map(String)}
                onValueChange={handleHealthStatusChange}
                className="grid grid-cols-2 gap-3"
              >
                {healthOptions.map((option) => (
                  <ToggleGroupItem
                    key={option.id}
                    value={String(option.id)}
                    className="flex items-center justify-start text-left space-x-3 p-3 h-auto rounded-xl border-2 transition-all duration-200 data-[state=on]:bg-sky-100 data-[state=on]:border-sky-400 data-[state=on]:shadow-md bg-white border-cream-200 hover:border-sky-300 hover:bg-sky-50 data-[state=on]:text-sky-900 text-gray-800"
                  >
                    <span className="text-lg">{option.icon}</span>
                    <span className="text-sm font-pretendard flex-1">
                      {option.label}
                    </span>
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            ) : (
              <p className="text-center text-gray-600 font-pretendard py-4">
                건강 상태 옵션을 불러오지 못했습니다.
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* 훈련 목표 카드 */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="border-2 border-cream-200 bg-gradient-to-r from-orange-50 to-cream-50">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Target className="w-6 h-6 text-orange-500 mr-2" />
              <Label className="text-gray-800 font-semibold text-lg font-pretendard">훈련 목표</Label>
            </div>
            <p className="text-sm text-gray-600 mb-4 font-pretendard">어떤 훈련을 원하시나요? (복수 선택 가능)</p>
            
            {isLoading ? (
              renderSkeletons(6, "grid grid-cols-1 gap-3")
            ) : trainingGoalOptions.length > 0 ? (
              <ToggleGroup
                type="multiple"
                value={dogInfo.trainingGoals.map(String)}
                onValueChange={handleTrainingGoalChange}
                className="grid grid-cols-1 gap-3"
              >
                {trainingGoalOptions.map((option) => (
                  <ToggleGroupItem
                    key={option.id}
                    value={String(option.id)}
                    className="flex items-center justify-start text-left space-x-3 p-3 h-auto rounded-xl border-2 transition-all duration-200 data-[state=on]:bg-sky-100 data-[state=on]:border-sky-400 data-[state=on]:shadow-md bg-white border-cream-200 hover:border-sky-300 hover:bg-sky-50 data-[state=on]:text-sky-900 text-gray-800"
                  >
                    <span className="text-lg">{option.icon}</span>
                    <span className="text-sm font-pretendard flex-1">
                      {option.label}
                    </span>
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            ) : (
              <p className="text-center text-gray-600 font-pretendard py-4">
                훈련 목표 옵션을 불러오지 못했습니다.
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Step3_TrainingGoals;
