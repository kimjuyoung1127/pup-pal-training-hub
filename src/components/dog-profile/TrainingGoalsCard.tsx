
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target } from 'lucide-react';

interface TrainingGoalsCardProps {
  trainingGoalNames: string[];
}

const TrainingGoalsCard = ({ trainingGoalNames }: TrainingGoalsCardProps) => {
  return (
    <Card className="card-soft bg-pink-50 shadow-md"> {/* 배경 및 섀도우 변경 */}
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-pink-700 font-pretendard"> {/* 타이틀 색상 변경 */}
          <Target className="w-5 h-5 text-pink-500" /> {/* 아이콘 색상 변경 */}
          <span>훈련 목표</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3">
          {trainingGoalNames.length > 0 ? (
            trainingGoalNames.map((goal, index) => (
              <div 
                key={index}
                className="flex items-center space-x-3 p-3 bg-pink-100 rounded-lg border border-pink-200 shadow-sm" /* 아이템 스타일 변경 */
              >
                <Target className="w-4 h-4 text-pink-500" /> {/* 아이콘 색상 변경 */}
                <span className="text-pink-700 font-pretendard">{goal}</span> {/* 텍스트 색상 변경 */}
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground font-pretendard">등록된 훈련 목표가 없습니다.</p> {/* 텍스트 색상 변경 */}
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TrainingGoalsCard;
