
import React, { useState } from 'react';
import TrainingHeader from './training/TrainingHeader';
import TodayProgress from './training/TodayProgress';
import TrainingTypeList from './training/TrainingTypeList';
import QuickTips from './training/QuickTips';
import StartTrainingButton from './training/StartTrainingButton';

const TrainingStartPage = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  const [selectedTraining, setSelectedTraining] = useState<string | null>(null);

  const handleStartTraining = () => {
    if (selectedTraining) {
      console.log(`Starting training: ${selectedTraining}`);
      // TODO: 실제 훈련 진행 페이지로 이동
      onNavigate('training-progress');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 pb-32">
      <TrainingHeader onNavigate={onNavigate} />

      <div className="p-6 space-y-6">
        <TodayProgress />
        <TrainingTypeList 
          selectedTraining={selectedTraining}
          setSelectedTraining={setSelectedTraining}
        />
        <QuickTips />
      </div>

      <StartTrainingButton
        selectedTraining={selectedTraining}
        onStartTraining={handleStartTraining}
      />
    </div>
  );
};

export default TrainingStartPage;
