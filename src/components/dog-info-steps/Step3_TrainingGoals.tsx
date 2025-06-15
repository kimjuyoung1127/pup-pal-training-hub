
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Heart, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { DogInfo } from '@/types/dog';

type Option = {
  id: string;
  label: string;
  icon: string;
};

interface Props {
  dogInfo: DogInfo;
  healthOptions: Option[];
  trainingGoalOptions: Option[];
  handleHealthStatusChange: (status: string, checked: boolean) => void;
  handleTrainingGoalChange: (goal: string, checked: boolean) => void;
}

const Step3_TrainingGoals: React.FC<Props> = ({ 
  dogInfo, 
  healthOptions,
  trainingGoalOptions,
  handleHealthStatusChange, 
  handleTrainingGoalChange 
}) => {
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
              <Label className="text-cream-800 font-semibold text-lg font-pretendard">건강 상태</Label>
            </div>
            <p className="text-sm text-cream-600 mb-4 font-pretendard">우리 아이의 현재 건강 상태를 알려주세요 (복수 선택 가능)</p>
            <div className="grid grid-cols-2 gap-3">
              {healthOptions.map((option, index) => (
                <motion.div
                  key={option.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`flex items-center space-x-3 p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer hover:scale-105 ${
                    dogInfo.healthStatus.includes(option.id)
                      ? 'bg-orange-100 border-orange-300 shadow-md'
                      : 'bg-white border-cream-200 hover:border-orange-200 hover:bg-orange-50'
                  }`}
                  onClick={() => handleHealthStatusChange(option.id, !dogInfo.healthStatus.includes(option.id))}
                >
                  <Checkbox
                    id={`health-${option.id}`}
                    checked={dogInfo.healthStatus.includes(option.id)}
                    onCheckedChange={(checked) => handleHealthStatusChange(option.id, checked as boolean)}
                    className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                  />
                  <span className="text-lg">{option.icon}</span>
                  <Label
                    htmlFor={`health-${option.id}`}
                    className="text-sm text-cream-700 cursor-pointer font-pretendard flex-1"
                  >
                    {option.label}
                  </Label>
                </motion.div>
              ))}
            </div>
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
              <Label className="text-cream-800 font-semibold text-lg font-pretendard">훈련 목표</Label>
            </div>
            <p className="text-sm text-cream-600 mb-4 font-pretendard">어떤 훈련을 원하시나요? (복수 선택 가능)</p>
            <div className="grid grid-cols-1 gap-3">
              {trainingGoalOptions.map((option, index) => (
                <motion.div
                  key={option.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`flex items-center space-x-3 p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer hover:scale-105 ${
                    dogInfo.trainingGoals.includes(option.id)
                      ? 'bg-orange-100 border-orange-300 shadow-md'
                      : 'bg-white border-cream-200 hover:border-orange-200 hover:bg-orange-50'
                  }`}
                  onClick={() => handleTrainingGoalChange(option.id, !dogInfo.trainingGoals.includes(option.id))}
                >
                  <Checkbox
                    id={`goal-${option.id}`}
                    checked={dogInfo.trainingGoals.includes(option.id)}
                    onCheckedChange={(checked) => handleTrainingGoalChange(option.id, checked as boolean)}
                    className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                  />
                  <span className="text-lg">{option.icon}</span>
                  <Label
                    htmlFor={`goal-${option.id}`}
                    className="text-sm text-cream-700 cursor-pointer font-pretendard flex-1"
                  >
                    {option.label}
                  </Label>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Step3_TrainingGoals;
