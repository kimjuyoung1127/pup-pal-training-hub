import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDogProfile } from '@/hooks/useDogProfile';
import { User } from 'lucide-react';

const DogProfileSummary: React.FC = () => {
  const { dogInfo } = useDogProfile();

  if (!dogInfo) {
    return null;
  }

  return (
    <Card className="rounded-2xl shadow-md border border-[#E7EBE4] bg-white">
      <CardHeader>
        <CardTitle className="flex items-center text-[#3D405B]">
          <User className="mr-2 text-[#A3B899]" />
          {dogInfo.name}의 프로필
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-[#6B7280]">품종</p>
            <p className="font-medium text-[#3D405B]">{dogInfo.breed}</p>
          </div>
          <div>
            <p className="text-sm text-[#6B7280]">나이</p>
            <p className="font-medium text-[#3D405B]">{`${dogInfo.age.years}년 ${dogInfo.age.months}개월`}</p>
          </div>
          <div>
            <p className="text-sm text-[#6B7280]">체중</p>
            <p className="font-medium text-[#3D405B]">{dogInfo.weight}kg</p>
          </div>
          <div>
            <p className="text-sm text-[#6B7280]">건강 상태</p>
            <p className="font-medium text-[#3D405B]">양호</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DogProfileSummary;