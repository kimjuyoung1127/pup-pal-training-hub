
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BookOpen, Calendar, BarChart3, Settings } from 'lucide-react';

const DashboardPage = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 to-orange-50 pb-20">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-cream-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-xl">🐾</div>
            <div>
              <h1 className="text-lg font-bold text-cream-800">멍멍트레이너</h1>
              <p className="text-sm text-cream-600">댕댕이와 함께 성장해요</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('settings')}
            className="text-cream-600 hover:text-cream-800"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="p-6 space-y-6">
        {/* Welcome card */}
        <Card className="card-soft p-6">
          <div className="flex items-center space-x-4">
            <div className="text-4xl">🐕</div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-cream-800 mb-1">
                안녕하세요!
              </h2>
              <p className="text-cream-600">
                오늘도 우리 강아지와 함께 훈련해볼까요?
              </p>
            </div>
          </div>
        </Card>

        {/* Quick stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="card-soft p-4 text-center">
            <div className="text-2xl mb-2">📅</div>
            <p className="text-2xl font-bold text-orange-600">7</p>
            <p className="text-sm text-cream-600">연속 훈련일</p>
          </Card>
          <Card className="card-soft p-4 text-center">
            <div className="text-2xl mb-2">🏆</div>
            <p className="text-2xl font-bold text-orange-600">85%</p>
            <p className="text-sm text-cream-600">성공률</p>
          </Card>
        </div>

        {/* Action buttons */}
        <div className="space-y-4">
          <Button
            onClick={() => onNavigate('dog-info')}
            className="w-full btn-primary justify-between py-6"
          >
            <div className="flex items-center space-x-3">
              <BookOpen className="w-5 h-5" />
              <span className="text-lg">강아지 정보 입력하기</span>
            </div>
            <div className="text-2xl">🐕</div>
          </Button>

          <Button
            onClick={() => onNavigate('training')}
            className="w-full btn-secondary justify-between py-6"
          >
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5" />
              <span className="text-lg">오늘의 훈련 시작</span>
            </div>
            <div className="text-2xl">📚</div>
          </Button>

          <Button
            onClick={() => onNavigate('history')}
            className="w-full btn-secondary justify-between py-6"
          >
            <div className="flex items-center space-x-3">
              <BarChart3 className="w-5 h-5" />
              <span className="text-lg">훈련 기록 보기</span>
            </div>
            <div className="text-2xl">📊</div>
          </Button>
        </div>

        {/* Today's tip */}
        <Card className="card-soft p-6 bg-gradient-to-r from-orange-100 to-cream-200">
          <div className="flex items-start space-x-3">
            <div className="text-2xl">💡</div>
            <div>
              <h3 className="font-bold text-cream-800 mb-2">오늘의 팁</h3>
              <p className="text-sm text-cream-700 leading-relaxed">
                간식을 줄 때는 강아지가 성공한 즉시 주는 것이 중요해요. 
                타이밍이 훈련 효과를 크게 좌우합니다! 🦴
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
