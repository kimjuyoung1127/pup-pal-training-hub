
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { FullDogInfo } from '@/hooks/useDogProfile';

interface ProfileHeaderProps {
  dogInfo: FullDogInfo;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onImageDelete: () => void;
}

const formatAge = (age: { years: number | null; months: number | null; }) => {
  if (typeof age !== 'object' || age === null) {
    return '나이 정보 없음';
  }

  const { years, months } = age;

  if ((years === null || years === 0) && (months === null || months === 0)) {
    return '0개월';
  }

  let ageString = '';
  if (years !== null && years > 0) {
    ageString += `${years}년 `;
  }
  if (months !== null && months > 0) {
    ageString += `${months}개월`;
  }
  return ageString.trim() || '나이 정보 없음';
};

const getGenderEmoji = (gender: string) => {
  return gender === 'male' ? '🐕' : '🐕‍🦺';
};

const ProfileHeader = ({ dogInfo, onImageUpload, onImageDelete }: ProfileHeaderProps) => {
  return (
    <Card className="overflow-hidden bg-sky-50 shadow-md border border-sky-100">
      <CardContent className="p-6">
        <div className="flex items-center space-x-6">
          <div className="relative group">
            <Avatar className="w-24 h-24 border-4 border-white shadow-lg transition-transform duration-300 group-hover:scale-105">
              {dogInfo.image_url ? (
                <AvatarImage src={dogInfo.image_url} alt={dogInfo.name} className="object-cover" />
              ) : (
                <AvatarFallback className="bg-sky-200 text-4xl">
                  {getGenderEmoji(dogInfo.gender)}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="absolute bottom-0 right-0 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <label htmlFor="dog-image-upload" className="bg-white/80 backdrop-blur-sm rounded-full p-2 cursor-pointer shadow-md hover:bg-white transition-colors">
                <Edit className="w-4 h-4 text-sky-600" />
                <input id="dog-image-upload" type="file" className="hidden" accept="image/*" onChange={onImageUpload} />
              </label>
              {dogInfo.image_url && (
                <Button variant="ghost" size="icon" className="bg-white/80 backdrop-blur-sm rounded-full p-2 cursor-pointer shadow-md hover:bg-white transition-colors w-8 h-8" onClick={onImageDelete}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              )}
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-extrabold text-gray-800 mb-1 font-pretendard tracking-tight">
              {dogInfo.name}
            </h2>
            <p className="text-gray-600 mb-3 font-pretendard">
              {dogInfo.breed} • {dogInfo.gender === 'male' ? '남아' : '여아'}
            </p>
            <div className="flex space-x-2">
              <Badge variant="outline" className="border-sky-300 bg-sky-100 text-sky-800 font-semibold px-3 py-1">
                {formatAge(dogInfo.age)}
              </Badge>
              <Badge variant="outline" className="border-blue-300 bg-blue-100 text-blue-800 font-semibold px-3 py-1">
                {dogInfo.weight}kg
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
export default ProfileHeader;
