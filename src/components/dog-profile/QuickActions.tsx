import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bone, History } from 'lucide-react';
interface QuickActionsProps {
  onNavigate: (page: string) => void;
}
const QuickActions = ({
  onNavigate
}: QuickActionsProps) => {
  return <Card className="card-soft bg-sky-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sky-800 font-pretendard">빠른 액션</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Button onClick={() => onNavigate('training')} className="w-full bg-sky-500 hover:bg-sky-600 text-white justify-between py-3">
            <div className="flex items-center space-x-2">
              <Bone className="w-4 h-4" />
              <span className="font-pretendard text-slate-950">오늘의 훈련 시작</span>
            </div>
            <span>🎯</span>
          </Button>
          <Button onClick={() => onNavigate('history')} variant="outline" className="w-full border-sky-300 text-sky-700 justify-between py-3 bg-sky-100 hover:bg-sky-200">
            <div className="flex items-center space-x-2">
              <History className="w-4 h-4" />
              <span className="font-pretendard text-slate-950">훈련 기록 보기</span>
            </div>
            <span>📊</span>
          </Button>
        </div>
      </CardContent>
    </Card>;
};
export default QuickActions;