
import React from 'react';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DashboardContent from './DashboardContent';

const DashboardPage = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
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
          <Button
            size="sm"
            onClick={() => onNavigate('settings')}
            className="text-sky-600 hover:text-sky-800 bg-transparent hover:bg-sky-100 focus:ring-0"
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
