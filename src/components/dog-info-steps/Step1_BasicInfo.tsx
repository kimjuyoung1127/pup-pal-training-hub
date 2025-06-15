
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
          <Label htmlFor="name" className="text-cream-800 font-medium">우리 아이 이름</Label>
          <Input
            id="name"
            value={dogInfo.name}
            onChange={(e) => setDogInfo(prev => ({ ...prev, name: e.target.value }))}
            placeholder="예: 바둑이"
            className="mt-2 bg-white border-2 border-cream-200 focus:border-orange-300 focus:ring-2 focus:ring-orange-100 rounded-xl text-cream-800 placeholder:text-cream-500"
          />
        </div>

        <div>
          <Label htmlFor="age" className="text-cream-800 font-medium">나이</Label>
          <Select onValueChange={(value) => setDogInfo(prev => ({ ...prev, age: value }))} value={dogInfo.age || undefined}>
            <SelectTrigger className="mt-2 bg-white border-2 border-cream-200 focus:border-orange-300 rounded-xl text-cream-800">
              <SelectValue placeholder="나이를 선택해주세요" className="text-cream-500" />
            </SelectTrigger>
            <SelectContent className="bg-white border-cream-200 z-50">
              <SelectItem value="puppy" className="text-cream-800 hover:bg-orange-100 focus:bg-orange-100">강아지 (6개월 미만)</SelectItem>
              <SelectItem value="young" className="text-cream-800 hover:bg-orange-100 focus:bg-orange-100">어린 개 (6개월 ~ 2년)</SelectItem>
              <SelectItem value="adult" className="text-cream-800 hover:bg-orange-100 focus:bg-orange-100">성견 (2년 ~ 7년)</SelectItem>
              <SelectItem value="senior" className="text-cream-800 hover:bg-orange-100 focus:bg-orange-100">노견 (7년 이상)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-cream-800 font-medium">성별</Label>
          <div className="flex space-x-4 mt-2">
            <Button
              variant={dogInfo.gender === 'male' ? 'default' : 'outline'}
              onClick={() => setDogInfo(prev => ({ ...prev, gender: 'male' }))}
              className={`flex-1 ${
                dogInfo.gender === 'male' 
                  ? 'bg-cream-400 hover:bg-cream-500 text-cream-800 border-0' 
                  : 'bg-white hover:bg-cream-100 text-cream-700 border-2 border-cream-200'
              }`}
            >
              🐕 남아
            </Button>
            <Button
              variant={dogInfo.gender === 'female' ? 'default' : 'outline'}
              onClick={() => setDogInfo(prev => ({ ...prev, gender: 'female' }))}
              className={`flex-1 ${
                dogInfo.gender === 'female' 
                  ? 'bg-cream-400 hover:bg-cream-500 text-cream-800 border-0' 
                  : 'bg-white hover:bg-cream-100 text-cream-700 border-2 border-cream-200'
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
