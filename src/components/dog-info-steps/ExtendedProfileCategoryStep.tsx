import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { DogInfo } from '@/types/dog';
import { MissionCategory } from '@/lib/missionData';
import MissionInputField from './MissionInputField';

interface Props {
  category: MissionCategory;
  dogInfo: DogInfo;
  setDogInfo: React.Dispatch<React.SetStateAction<DogInfo>>;
}

const ExtendedProfileCategoryStep: React.FC<Props> = ({ category, dogInfo, setDogInfo }) => {
  // Get extended profile data or initialize empty object
  const extendedProfile = dogInfo.extendedProfile || {};

  // Handle value changes for each mission
  const handleMissionChange = (missionKey: string, value: any) => {
    setDogInfo(prev => ({
      ...prev,
      extendedProfile: {
        ...prev.extendedProfile,
        [missionKey]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="text-4xl mb-2">{category.icon}</div>
        <h3 className="text-xl font-bold text-gray-800">{category.title}</h3>
        <p className="text-gray-600 mt-2">
          우리 아이의 {category.title.toLowerCase()}에 대해 알려주세요.
        </p>
      </div>

      <div className="space-y-6">
        {category.missions.map((mission, index) => {
          const value = extendedProfile[mission.key];
          
          return (
            <Card key={mission.key} className="border-2 border-sky-200 bg-white">
              <CardContent className="p-6">
                <div className="space-y-2">
                  <Label className="text-gray-800 font-medium text-base">
                    {mission.question}
                  </Label>
                  <MissionInputField 
                    mission={mission}
                    value={value}
                    onChange={(value) => handleMissionChange(mission.key, value)}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
        <div className="flex items-start space-x-3">
          <span className="text-xl">💡</span>
          <div>
            <h4 className="font-bold text-blue-800">도움말</h4>
            <p className="text-sm text-blue-700 mt-1">
              이 정보는 {category.title.toLowerCase()}에 기반한 맞춤형 훈련을 제공하기 위해 사용됩니다. 
              정확한 정보를 입력할수록 더 효과적인 훈련을 받을 수 있어요!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExtendedProfileCategoryStep;