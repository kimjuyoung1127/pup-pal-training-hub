import React from 'react';
import { useDogProfile } from '@/hooks/useDogProfile';

const DogProfileSummary: React.FC = () => {
  const { dogInfo } = useDogProfile();

  if (!dogInfo) {
    return null;
  }

  return (
    <div className="flex flex-col items-center text-center">
      <div 
        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-32 h-32 mb-4"
        style={{ backgroundImage: `url(${dogInfo.image_url || 'https://placehold.co/200x200?text=No+Image'})` }}
      />
      <h2 className="text-zinc-900 text-2xl font-bold leading-tight tracking-[-0.015em]">{dogInfo.name}</h2>
      <p className="text-zinc-500 text-base font-normal leading-normal">
        {dogInfo.breed}, {dogInfo.age.years}년 {dogInfo.age.months}개월, {dogInfo.weight}kg
      </p>
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700 mt-2">
        <span className="size-2 rounded-full bg-emerald-500"></span>
        건강하고 활동적
      </span>
    </div>
  );
};

export default DogProfileSummary;