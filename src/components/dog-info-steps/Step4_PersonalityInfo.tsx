
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';

const Step4_PersonalityInfo = ({ formData, setFormData }) => {
  const handleInputChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleCheckboxChange = (key, value) => {
    const currentValues = formData[key] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(item => item !== value)
      : [...currentValues, value];
    setFormData(prev => ({ ...prev, [key]: newValues }));
  };

  const knownBehaviorOptions = [
    { id: 'barking', label: '짖음' },
    { id: 'separation_anxiety', label: '분리불안' },
    { id: 'aggression', label: '공격성' },
    { id: 'marking', label: '마킹' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-lg font-semibold text-gray-800">어떤 것에 민감하��� 반응하나요?</Label>
        <p className="text-sm text-gray-500 mb-2">예: 천둥번개, 특정 소리, 낯선 사람 등</p>
        <Textarea
          value={formData.sensitive_factors}
          onChange={(e) => handleInputChange('sensitive_factors', e.target.value)}
          placeholder="우리 아이는 초인종 소리에 유독 크게 짖어요."
        />
      </div>

      <div>
        <Label className="text-lg font-semibold text-gray-800">과거에 특별한 경험이 있나요?</Label>
        <p className="text-sm text-gray-500 mb-2">예: 유기 경험, 파양 경험, 수술 경험 등</p>
        <Textarea
          value={formData.past_history}
          onChange={(e) => handleInputChange('past_history', e.target.value)}
          placeholder="유기견 보호소에서 데려왔어요."
        />
      </div>

      <div>
        <Label className="text-lg font-semibold text-gray-800">이미 알고 있는 문제 행동이 있나요?</Label>
        <p className="text-sm text-gray-500 mb-2">가장 우려되는 문제 행동을 모두 선택해주세요.</p>
        <div className="grid grid-cols-2 gap-4">
          {knownBehaviorOptions.map(option => (
            <div key={option.id} className="flex items-center space-x-2">
              <Checkbox
                id={option.id}
                checked={formData.known_behaviors.includes(option.id)}
                onCheckedChange={() => handleCheckboxChange('known_behaviors', option.id)}
              />
              <Label htmlFor={option.id}>{option.label}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-lg font-semibold text-gray-800">사회성 수준은 어느 정도인가요?</Label>
        <p className="text-sm text-gray-500 mb-2">다른 강아지나 사람을 만났을 때의 반응을 선택해주세요.</p>
        <RadioGroup
          value={formData.social_level}
          onValueChange={(value) => handleInputChange('social_level', value)}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="friendly" id="friendly" />
            <Label htmlFor="friendly">매우 친화적</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="cautious" id="cautious" />
            <Label htmlFor="cautious">조심스러움</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="fearful" id="fearful" />
            <Label htmlFor="fearful">두려워함</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="aggressive" id="aggressive" />
            <Label htmlFor="aggressive">공격적</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label className="text-lg font-semibold text-gray-800">평소 활동량은 어느 정도인가요?</Label>
        <p className="text-sm text-gray-500 mb-2">하루 평균 산책 및 놀이 시간을 기준으로 선택해주세요.</p>
        <RadioGroup
          value={formData.activity_level}
          onValueChange={(value) => handleInputChange('activity_level', value)}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="low" id="low" />
            <Label htmlFor="low">낮음 (30분 미만)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="medium" id="medium" />
            <Label htmlFor="medium">보통 (30분 ~ 1시간)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="high" id="high" />
            <Label htmlFor="high">높음 (1시간 이상)</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};

export default Step4_PersonalityInfo;
