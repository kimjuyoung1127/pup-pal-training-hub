
import React from 'react';
import { motion } from 'framer-motion';
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTodaysTrainingStats } from '@/hooks/useTodaysTrainingStats';

const TodaysProgressCard = () => {
    const { data: stats, isLoading: isLoadingStats } = useTodaysTrainingStats();

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="card-soft p-6 bg-gradient-to-br from-blue-50 to-sky-100 border-blue-200/50 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-800">오늘의 진행상황</h2>
                    <div className="text-2xl">📊</div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    {isLoadingStats ? (
                        <>
                            <div className="text-center space-y-2">
                                <Skeleton className="h-7 w-1/2 mx-auto" />
                                <Skeleton className="h-4 w-full mx-auto" />
                            </div>
                            <div className="text-center space-y-2">
                                <Skeleton className="h-7 w-1/2 mx-auto" />
                                <Skeleton className="h-4 w-full mx-auto" />
                            </div>
                            <div className="text-center space-y-2">
                                <Skeleton className="h-7 w-1/2 mx-auto" />
                                <Skeleton className="h-4 w-full mx-auto" />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">{stats?.completedTrainings ?? 0}</div>
                                <p className="text-sm text-gray-600">완료한 훈련</p>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">{stats?.totalDuration ?? 0}분</div>
                                <p className="text-sm text-gray-600">훈련 시간</p>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">{stats?.averageSuccessRate ?? 0}%</div>
                                <p className="text-sm text-gray-600">성공률</p>
                            </div>
                        </>
                    )}
                </div>
            </Card>
        </motion.div>
    );
};

export default TodaysProgressCard;
