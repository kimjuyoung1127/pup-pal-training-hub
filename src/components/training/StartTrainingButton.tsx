
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

interface StartTrainingButtonProps {
  selectedTraining: string | null;
  onStartTraining: () => void;
}

const StartTrainingButton = ({ selectedTraining, onStartTraining }: StartTrainingButtonProps) => {
  return (
    <div className="fixed bottom-16 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-gray-200 p-6">
      <Button
        onClick={onStartTraining}
        disabled={!selectedTraining}
        className={`w-full py-4 text-lg font-bold transition-all duration-200 ${
          selectedTraining
            ? 'btn-primary'
            : 'bg-gray-300 text-gray-600 cursor-not-allowed hover:bg-gray-300 hover:scale-100'
        }`}
      >
        <div className="flex items-center justify-center space-x-2">
          <Play className="w-5 h-5" />
          <span>훈련 시작하기</span>
        </div>
      </Button>
    </div>
  );
};

export default StartTrainingButton;
