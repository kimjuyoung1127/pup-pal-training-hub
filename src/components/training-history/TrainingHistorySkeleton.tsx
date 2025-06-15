
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const TrainingHistorySkeleton = () => {
    return (
        <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
                <Card key={i} className="shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex items-start space-x-4">
                            <Skeleton className="h-16 w-16 rounded-xl" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                                <Skeleton className="h-4 w-full" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default TrainingHistorySkeleton;
