
import React from 'react';
import { Settings, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DashboardContent from './DashboardContent';

interface DashboardPageProps {
  onNavigate: (page: string, params?: any) => void;
  runTour: boolean;
  setRunTour: (run: boolean) => void;
  startTour: () => void;
}

const DashboardPage = ({ onNavigate, runTour, setRunTour, startTour }: DashboardPageProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-sky-200 px-6 py-4 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-xl">🐾</div>
            <div>
              <h1 className="text-lg font-bold text-sky-900">멍멍트레이너 AI</h1>
              <p className="text-sm text-sky-700">반려견과 함께 성장해요</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              onClick={startTour} // Index.tsx에서 받은 startTour 함수를 연결합니다.
              className="text-sky-600 hover:text-sky-800 bg-transparent hover:bg-sky-100 focus:ring-0"
            >
              <HelpCircle className="w-5 h-5" />
            </Button>
            <Button
              size="sm"
              onClick={() => onNavigate('settings')}
              className="text-sky-600 hover:text-sky-800 bg-transparent hover:bg-sky-100 focus:ring-0"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <DashboardContent onNavigate={onNavigate} runTour={runTour} setRunTour={setRunTour} />
    </div>
  );
};

export default DashboardPage;
