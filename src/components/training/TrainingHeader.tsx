
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface TrainingHeaderProps {
  onNavigate: (page: string) => void;
}

const TrainingHeader = ({ onNavigate }: TrainingHeaderProps) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center space-x-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNavigate('dashboard')}
          className="text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex items-center space-x-3">
          <div className="text-xl">🎓</div>
          <div>
            <h1 className="text-lg font-bold text-gray-800">오늘의 훈련</h1>
            <p className="text-sm text-gray-600">함께 성장해봐요!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingHeader;
