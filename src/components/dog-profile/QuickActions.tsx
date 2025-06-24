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
  return <Card className="card-soft bg-pink-50 shadow-md"> {/* 배경 및 섀도우 변경 */}
      <CardHeader className="pb-3">
        <CardTitle className="text-pink-700 font-pretendard">빠른 액션</CardTitle> {/* 타이틀 색상 변경 */}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Button
            onClick={() => onNavigate('training')}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white justify-between py-3 shadow hover:shadow-lg transition-all" /* 버튼 스타일 변경 */
          >
            <div className="flex items-center space-x-2">
              <Bone className="w-5 h-5" /> {/* 아이콘 크기 살짝 키움 */}
              <span className="font-pretendard font-semibold">오늘의 훈련 시작</span> {/* 텍스트 색상 기본 white, 폰트 두께 변경 */}
            </div>
            <span className="text-xl">🎯</span>
          </Button>
          <Button
            onClick={() => onNavigate('history')}
            variant="outline"
            className="w-full border-pink-300 hover:border-pink-400 text-pink-700 hover:text-pink-800 justify-between py-3 bg-white hover:bg-pink-50 shadow hover:shadow-lg transition-all" /* 버튼 스타일 변경 */
          >
            <div className="flex items-center space-x-2">
              <History className="w-5 h-5" /> {/* 아이콘 크기 살짝 키움 */}
              <span className="font-pretendard font-semibold">훈련 기록 보기</span> {/* 폰트 두께 변경 */}
            </div>
            <span className="text-xl">📊</span>
          </Button>
        </div>
      </CardContent>
    </Card>;
};
export default QuickActions;