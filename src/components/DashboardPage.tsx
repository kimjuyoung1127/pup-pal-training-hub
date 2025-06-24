
import React from 'react';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DashboardContent from './DashboardContent';

const DashboardPage = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-beige-100 to-training-green-light"> {/* 배경 변경: via-cream-100 제거 */}
      {/* Header */}
      <div className="bg-background/80 backdrop-blur-sm border-b border-border px-6 py-4 sticky top-0 z-10"> {/* 헤더 스타일 변경 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-xl text-primary">🐾</div> {/* 아이콘 색상 변경 */}
            <div>
              <h1 className="text-lg font-bold text-foreground">멍멍트레이너</h1> {/* 텍스트 색상 변경 */}
              <p className="text-sm text-muted-foreground">댕댕이와 함께 성장해요</p> {/* 텍스트 색상 변경 */}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('settings')}
            className="text-muted-foreground hover:text-training-green-dark" /* 버튼 색상 변경 */
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <DashboardContent onNavigate={onNavigate} />
    </div>
  );
};

export default DashboardPage;
