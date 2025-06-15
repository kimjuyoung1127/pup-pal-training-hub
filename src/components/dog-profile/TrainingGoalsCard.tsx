
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target } from 'lucide-react';

interface TrainingGoalsCardProps {
  trainingGoalNames: string[];
}

const TrainingGoalsCard = ({ trainingGoalNames }: TrainingGoalsCardProps) => {
  return (
    <Card className="card-soft bg-green-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-cream-800 font-pretendard">
          <Target className="w-5 h-5 text-green-600" />
          <span>훈련 목표</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3">
          {trainingGoalNames.length > 0 ? (
            trainingGoalNames.map((goal, index) => (
              <div 
                key={index}
                className="flex items-center space-x-3 p-3 bg-green-100 rounded-lg border border-green-200"
              >
                <Target className="w-4 h-4 text-green-600" />
                <span className="text-cream-700 font-pretendard">{goal}</span>
              </div>
            ))
          ) : (
            <p className="text-sm text-cream-600 font-pretendard">등록된 훈련 목표가 없습니다.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TrainingGoalsCard;
