import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';

interface FloatingActionButtonProps {
  onClick: () => void;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onClick }) => {
  return (
    <div className="fixed bottom-6 right-6">
      <Button 
        className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-colors hover:bg-blue-700"
        onClick={onClick}
      >
        <Edit className="w-8 h-8" />
      </Button>
    </div>
  );
};

export default FloatingActionButton;