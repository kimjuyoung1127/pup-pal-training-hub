import { Loader2 } from 'lucide-react';

export const LoadingSpinner = () => (
  <div className="p-4 bg-white min-h-screen flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
  </div>
);