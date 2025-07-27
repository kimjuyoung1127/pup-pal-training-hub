
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DashboardContent from './DashboardContent';
import AdSense from './ads/AdSense';
import { useDogProfile } from '@/hooks/useDogProfile';

interface DashboardPageProps {
  runTour: boolean;
  setRunTour: (run: boolean) => void;
  startTour: () => void;
}

const DashboardPage = ({ runTour, setRunTour, startTour }: DashboardPageProps) => {
  const navigate = useNavigate();
  const { plan } = useDogProfile();

  const handleNavigate = (page: string, params?: any) => {
    switch (page) {
      case 'settings':
        navigate('/app/settings');
        break;
      case 'dog-info':
        navigate('/app/dog-info');
        break;
      case 'history':
        navigate('/app/history');
        break;
      default:
        console.warn(`Unhandled navigation to: ${page}`);
        break;
    }
  };

  return (
    <div className="h-full "> {/* pb-24 추가 */}
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-3 sticky top-0 z-10 shadow-sm">
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
              onClick={startTour}
              className="text-sky-600 hover:text-sky-800 bg-transparent hover:bg-sky-100 focus:ring-0"
            >
              <HelpCircle className="w-5 h-5" />
            </Button>
            <Button
              size="sm"
              onClick={() => navigate('/app/settings')}
              className="text-sky-600 hover:text-sky-800 bg-transparent hover:bg-sky-100 focus:ring-0"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠를 컴팩트한 카드로 감싸기 */}
      <div className="p-4">
        <div className="max-w-md mx-auto bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-4">
          <DashboardContent onNavigate={handleNavigate} runTour={runTour} setRunTour={setRunTour} />
        </div>
      </div>
      
      {plan === 'free' && (
        <div className="p-4">
          <AdSense />
        </div>
      )}
    </div>
  );
};

export default DashboardPage;

