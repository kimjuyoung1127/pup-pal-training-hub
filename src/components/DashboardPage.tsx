
import React from 'react';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DashboardContent from './DashboardContent';

const DashboardPage = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 to-orange-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-cream-200 px-6 py-4 sticky top-0 z-10">
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

      <DashboardContent onNavigate={onNavigate} />
    </div>
  );
};

export default DashboardPage;
