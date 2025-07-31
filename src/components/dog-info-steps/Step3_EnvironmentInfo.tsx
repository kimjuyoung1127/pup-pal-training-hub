
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';

const Step3_EnvironmentInfo = ({ formData, setFormData }) => {
  const handleRadioChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleCheckboxChange = (key, checked) => {
    setFormData(prev => ({ ...prev, [key]: checked }));
  };

  return (
    <div className="space-y-6 p-4 max-w-2xl mx-auto">
      {/* 간단한 헤더 */}
      <div className="text-center mb-6">
        <div className="text-3xl mb-2">🏠</div>
        <h2 className="text-xl md:text-2xl font-bold text-sky-700 break-keep">
          생활 환경을 알려주세요!
        </h2>
        <p className="text-gray-600 text-sm mt-2 break-keep">
          환경에 맞는 훈련을 제공해드려요 🌟
        </p>
      </div>

      {/* 가벼운 카드 */}
      <div className="bg-white rounded-2xl shadow-md border border-sky-200 p-6">
        <div className="space-y-8">
          {/* 생활 환경 */}
          <div className="space-y-3">
            <Label className="text-sky-700 font-medium flex items-center">
              <span className="mr-2">🏠</span>
              <span className="break-keep">어떤 환경에서 주로 생활하나요?</span>
            </Label>
            <p className="text-sm text-gray-600 break-keep">
              생활 환경은 강아지의 활동량과 스트레스 수준에 영향을 줍니다.
            </p>
            <RadioGroup
              value={formData.living_environment}
              onValueChange={(value) => handleRadioChange('living_environment', value)}
              className="grid grid-cols-1 md:grid-cols-2 gap-3"
            >
              <div className="flex items-center space-x-3 p-3 rounded-xl border border-sky-200 bg-sky-50">
                <RadioGroupItem value="apartment" id="apartment" />
                <Label htmlFor="apartment" className="flex items-center cursor-pointer text-gray-800">
                  <span className="mr-2">🏢</span>
                  <span className="break-keep">아파트/빌라</span>
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-xl border border-sky-200 bg-sky-50">
                <RadioGroupItem value="house" id="house" />
                <Label htmlFor="house" className="flex items-center cursor-pointer text-gray-800">
                  <span className="mr-2">🏡</span>
                  <span className="break-keep">단독주택</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* 가족 구성원 */}
          <div className="space-y-3">
            <Label className="text-sky-700 font-medium flex items-center">
              <span className="mr-2">👨‍👩‍👧‍👦</span>
              <span className="break-keep">함께 사는 가족 구성원은?</span>
            </Label>
            <p className="text-sm text-gray-600 break-keep">
              가족 구성원에 따라 사회화 훈련의 방향이 달라집니다.
            </p>
            <RadioGroup
              value={formData.family_composition}
              onValueChange={(value) => handleRadioChange('family_composition', value)}
              className="grid grid-cols-1 md:grid-cols-2 gap-3"
            >
              <div className="flex items-center space-x-3 p-3 rounded-xl border border-sky-200 bg-sky-50">
                <RadioGroupItem value="single" id="single" />
                <Label htmlFor="single" className="flex items-center cursor-pointer text-gray-800">
                  <span className="mr-2">🧑</span>
                  <span className="break-keep text-sm">1인 가구</span>
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-xl border border-sky-200 bg-sky-50">
                <RadioGroupItem value="couple" id="couple" />
                <Label htmlFor="couple" className="flex items-center cursor-pointer text-gray-800">
                  <span className="mr-2">👫</span>
                  <span className="break-keep text-sm">부부/커플</span>
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-xl border border-sky-200 bg-sky-50">
                <RadioGroupItem value="family" id="family" />
                <Label htmlFor="family" className="flex items-center cursor-pointer text-gray-800">
                  <span className="mr-2">👨‍👩‍👧</span>
                  <span className="break-keep text-sm leading-tight">
                    자녀가 있는 가족
                  </span>
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-xl border border-sky-200 bg-sky-50">
                <RadioGroupItem value="multi-generation" id="multi-generation" />
                <Label htmlFor="multi-generation" className="flex items-center cursor-pointer text-gray-800">
                  <span className="mr-2">👨‍👩‍👧‍👦</span>
                  <span className="break-keep text-sm">대가족</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* 어린이 여부 */}
          <div className="space-y-3">
            <Label className="text-sky-700 font-medium flex items-center">
              <span className="mr-2">👶</span>
              <span className="break-keep">가족 중에 어린이가 있나요?</span>
            </Label>
            <p className="text-sm text-gray-600 break-keep">
              특별한 주의가 필요한 가족 구성원이 있는지 알려주세요.
            </p>
            <div className="p-3 rounded-xl border border-sky-200 bg-sky-50">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="family_kids"
                  checked={formData.family_kids}
                  onCheckedChange={(checked) => handleCheckboxChange('family_kids', checked)}
                />
                <Label htmlFor="family_kids" className="flex items-center cursor-pointer text-gray-800">
                  <span className="mr-2">👶</span>
                  <span className="break-keep text-sm">어린이 (10세 이하)</span>
                </Label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step3_EnvironmentInfo;
