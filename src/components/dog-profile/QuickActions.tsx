
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bone, Calendar } from 'lucide-react';

interface QuickActionsProps {
  onNavigate: (page: string) => void;
}

const QuickActions = ({ onNavigate }: QuickActionsProps) => {
  return (
    <Card className="card-soft">
      <CardHeader className="pb-3">
        <CardTitle className="text-cream-800 font-pretendard">빠른 액션</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Button
            onClick={() => onNavigate('training')}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white justify-between py-3"
          >
            <div className="flex items-center space-x-2">
              <Bone className="w-4 h-4" />
              <span className="font-pretendard">오늘의 훈련 시작</span>
            </div>
            <span>🎯</span>
          </Button>
          <Button
            onClick={() => onNavigate('dashboard')}
            variant="outline"
            className="w-full border-cream-300 text-cream-700 hover:bg-cream-100 justify-between py-3"
          >
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span className="font-pretendard">훈련 기록 보기</span>
            </div>
            <span>📊</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
