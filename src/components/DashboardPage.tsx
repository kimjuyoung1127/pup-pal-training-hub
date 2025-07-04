
import React, { useState, useEffect } from 'react';
import { Settings, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DashboardContent from './DashboardContent';

const DashboardPage = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  const [runTour, setRunTour] = useState(false);

  useEffect(() => {
    const isFirstLogin = !localStorage.getItem('hasVisited');
    if (isFirstLogin) {
      setRunTour(true);
      localStorage.setItem('hasVisited', 'true');
    }
  }, []);

  const startTour = () => {
    setRunTour(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-sky-200 px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-xl">🐾</div>
            <div>
              <h1 className="text-lg font-bold text-sky-900">멍멍트레이너</h1>
              <p className="text-sm text-sky-700">반려견과 함께 성장해요</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              onClick={startTour}
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
