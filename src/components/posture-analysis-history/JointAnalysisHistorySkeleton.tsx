
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const JointAnalysisHistorySkeleton = () => {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, index) => (
        <Card key={index}>
          <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-grow w-full">
              <div className="flex items-center mb-2">
                <Skeleton className="h-6 w-40" />
              </div>
              <Skeleton className="h-4 w-60 mb-2" />
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
            <Skeleton className="h-10 w-full sm:w-36" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default JointAnalysisHistorySkeleton;
