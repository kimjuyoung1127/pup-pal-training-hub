
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

const getAgeLabel = (age: string) => {
  switch (age) {
    case 'puppy': return '강아지 (6개월 미만)';
    case 'young': return '어린 개 (6개월 ~ 2년)';
    case 'adult': return '성견 (2년 ~ 7년)';
    case 'senior': return '노견 (7년 이상)';
    default: return age;
  }
};

const getWeightLabel = (weight: string) => {
  switch (weight) {
    case 'small': return '소형견 (7kg 미만)';
    case 'medium': return '중형견 (7kg ~ 25kg)';
    case 'large': return '대형견 (25kg 이상)';
    default: return weight;
  }
};

const getGenderEmoji = (gender: string) => {
  return gender === 'male' ? '🐕' : '🐕‍🦺';
};

const ProfileHeader = ({ dogInfo, onImageUpload, onImageDelete }: ProfileHeaderProps) => {
  return (
    <Card className="card-soft overflow-hidden bg-gradient-to-r from-orange-100 to-cream-200">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Avatar className="w-20 h-20 border-2 border-white shadow-lg">
              {dogInfo.image_url ? (
                <AvatarImage src={dogInfo.image_url} alt={dogInfo.name} className="object-cover" />
              ) : (
                <AvatarFallback className="bg-orange-200 text-2xl">
                  {getGenderEmoji(dogInfo.gender)}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="absolute -bottom-1 -right-1 flex items-center">
              <label htmlFor="dog-image-upload" className="bg-white rounded-full p-1.5 cursor-pointer shadow-md hover:bg-gray-100 transition-colors">
                <Edit className="w-4 h-4 text-cream-800" />
                <input id="dog-image-upload" type="file" className="hidden" accept="image/*" onChange={onImageUpload} />
              </label>
              {dogInfo.image_url && (
                <Button variant="ghost" size="icon" className="bg-white rounded-full p-1.5 cursor-pointer shadow-md hover:bg-gray-100 transition-colors ml-1 w-7 h-7" onClick={onImageDelete}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              )}
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-cream-800 mb-1 font-pretendard">
              {dogInfo.name}
            </h2>
            <p className="text-cream-700 mb-2 font-pretendard">
              {dogInfo.breed} • {dogInfo.gender === 'male' ? '남아' : '여아'}
            </p>
            <div className="flex space-x-2">
              <Badge variant="secondary" className="bg-cream-200 text-cream-800">
                {getAgeLabel(dogInfo.age)}
              </Badge>
              <Badge variant="secondary" className="bg-cream-200 text-cream-800">
                {getWeightLabel(dogInfo.weight)}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
export default ProfileHeader;
