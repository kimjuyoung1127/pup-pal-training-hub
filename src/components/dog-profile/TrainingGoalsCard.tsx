
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TrainingGoalsCardProps {
  trainingGoalNames: string[];
}

const TrainingGoalsCard = ({ trainingGoalNames }: TrainingGoalsCardProps) => {
  return (
    <Card className="bg-sky-50 shadow-md border border-sky-100">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-gray-800 font-pretendard">
          <Target className="w-5 h-5 text-sky-500" />
          <span className="font-bold">훈련 목표</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {trainingGoalNames.length > 0 ? (
            trainingGoalNames.map((goal, index) => (
              <Badge
                key={index}
                variant="outline"
                className="border-sky-200 bg-sky-50 text-sky-800 font-semibold px-3 py-1"
              >
                {goal}
              </Badge>
            ))
          ) : (
            <p className="text-sm text-gray-500 font-pretendard">등록된 훈련 목표가 없습니다.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TrainingGoalsCard;
