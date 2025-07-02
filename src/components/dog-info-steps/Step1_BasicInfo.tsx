
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DogInfo } from '@/types/dog';

interface Props {
  dogInfo: DogInfo;
  setDogInfo: React.Dispatch<React.SetStateAction<DogInfo>>;
}

const Step1_BasicInfo: React.FC<Props> = ({ dogInfo, setDogInfo }) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="text-4xl mb-2">🐕‍🦺</div>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="name" className="text-gray-800 font-medium">우리 아이 이름</Label>
          <Input
            id="name"
            value={dogInfo.name}
            onChange={(e) => setDogInfo(prev => ({ ...prev, name: e.target.value }))}
            placeholder="예: 바둑이"
            className="mt-2 bg-white border-2 border-cream-200 focus:border-orange-300 focus:ring-2 focus:ring-orange-100 rounded-xl text-gray-900 placeholder:text-gray-500"
          />
        </div>

        <div>
          <Label htmlFor="age" className="text-gray-800 font-medium">나이</Label>
          <div className="flex space-x-2 mt-2">
            <div className="w-1/2">
              <Select onValueChange={(value) => setDogInfo(prev => ({ ...prev, age: { ...prev.age, years: parseInt(value) } }))} value={dogInfo.age?.years?.toString() || undefined}>
                <SelectTrigger className="bg-white border-2 border-cream-200 focus:border-orange-300 rounded-xl text-gray-900">
                  <SelectValue placeholder="년" />
                </SelectTrigger>
                <SelectContent className="bg-white border-cream-200 z-50">
                  {[...Array(21).keys()].map(year => (
                    <SelectItem key={year} value={year.toString()} className="text-gray-800 hover:bg-orange-100 focus:bg-orange-100">{year}년</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-1/2">
              <Select onValueChange={(value) => setDogInfo(prev => ({ ...prev, age: { ...prev.age, months: parseInt(value) } }))} value={dogInfo.age?.months?.toString() || undefined}>
                <SelectTrigger className="bg-white border-2 border-cream-200 focus:border-orange-300 rounded-xl text-gray-900">
                  <SelectValue placeholder="개월" />
                </SelectTrigger>
                <SelectContent className="bg-white border-cream-200 z-50">
                  {[...Array(12).keys()].map(month => (
                    <SelectItem key={month} value={month.toString()} className="text-gray-800 hover:bg-orange-100 focus:bg-orange-100">{month}개월</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div>
          <Label className="text-gray-800 font-medium">성별</Label>
          <div className="flex space-x-4 mt-2">
            <Button
              variant={dogInfo.gender === 'male' ? 'default' : 'outline'}
              onClick={() => setDogInfo(prev => ({ ...prev, gender: 'male' }))}
              className={`flex-1 ${
                dogInfo.gender === 'male' 
                  ? 'bg-sky-600 hover:bg-sky-700 text-white border-0' 
                  : 'bg-white hover:bg-sky-100 text-sky-800 border-2 border-sky-200'
              }`}
            >
              🐕 남아
            </Button>
            <Button
              variant={dogInfo.gender === 'female' ? 'default' : 'outline'}
              onClick={() => setDogInfo(prev => ({ ...prev, gender: 'female' }))}
              className={`flex-1 ${
                dogInfo.gender === 'female' 
                  ? 'bg-sky-600 hover:bg-sky-700 text-white border-0' 
                  : 'bg-white hover:bg-sky-100 text-sky-800 border-2 border-sky-200'
              }`}
            >
              🐕‍🦺 여아
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step1_BasicInfo;
