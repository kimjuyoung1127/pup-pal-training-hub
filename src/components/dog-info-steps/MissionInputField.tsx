import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DogInfo } from '@/types/dog';
import { Mission } from '@/lib/missionData';

interface Props {
  mission: Mission;
  value: any;
  onChange: (value: any) => void;
}

const MissionInputField: React.FC<Props> = ({ mission, value, onChange }) => {
  // For boolean type, we need to handle the conversion properly
  const displayValue = mission.type === 'boolean' 
    ? (value === true ? '예' : value === false ? '아니오' : '')
    : Array.isArray(value) ? value.join(', ') : value?.toString() || '';

  const handleArrayChange = (value: string) => {
    const arrayValue = value.split(',').map(s => s.trim()).filter(Boolean);
    onChange(arrayValue);
  };

  const handleBooleanChange = (boolValue: boolean) => {
    onChange(boolValue);
  };

  const handleRadioChange = (value: string) => {
    onChange(value);
  };

  const handleTextChange = (value: string) => {
    onChange(value);
  };

  switch (mission.type) {
    case 'boolean':
      return (
        <div className="flex space-x-4 mt-2">
          {['예', '아니오'].map(option => (
            <Button
              key={option}
              type="button"
              variant={displayValue === option ? 'default' : 'outline'}
              onClick={() => handleBooleanChange(option === '예')}
              className={`flex-1 h-12 ${displayValue === option 
                ? 'bg-sky-600 hover:bg-sky-700 text-white border-0' 
                : 'bg-white hover:bg-sky-100 text-sky-800 border-2 border-sky-200'}`}
            >
              {option}
            </Button>
          ))}
        </div>
      );
      
    case 'radio':
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
          {mission.options?.map((option: string) => (
            <button
              key={option}
              type="button"
              onClick={() => handleRadioChange(option)}
              className={`flex items-center p-4 rounded-xl border-2 text-left transition-all ${
                displayValue === option
                  ? 'bg-sky-100 border-sky-500 ring-2 ring-sky-200'
                  : 'bg-white border-sky-200 hover:border-sky-300 hover:bg-sky-50'
              }`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 flex-shrink-0 ${
                displayValue === option 
                  ? 'border-sky-500 bg-sky-500' 
                  : 'border-sky-300'
              }`}>
                {displayValue === option && (
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                )}
              </div>
              <span className="font-medium text-gray-800">{option}</span>
            </button>
          ))}
        </div>
      );
      
    case 'array':
      return (
        <Textarea
          value={displayValue}
          onChange={(e) => handleArrayChange(e.target.value)}
          placeholder={mission.placeholder || "쉼표(,)로 구분하여 입력해주세요."}
          className="mt-2 bg-white border-2 border-sky-200 focus:border-sky-300 focus:ring-2 focus:ring-sky-100 rounded-xl text-gray-900 placeholder:text-gray-500 min-h-[100px]"
        />
      );
      
    default:
      return (
        <Textarea
          value={displayValue}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder="자세하게 알려주세요."
          className="mt-2 bg-white border-2 border-sky-200 focus:border-sky-300 focus:ring-2 focus:ring-sky-100 rounded-xl text-gray-900 placeholder:text-gray-500 min-h-[100px]"
        />
      );
  }
};

export default MissionInputField;