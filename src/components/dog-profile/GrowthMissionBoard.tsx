
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FullDogExtendedProfile } from '@/hooks/useDogProfile';
import { motion } from 'framer-motion';
import { Accordion } from '@/components/ui/accordion';
import ProfileCategoryForm from './ProfileCategoryForm';
import { Mission, missionCategories } from '../../lib/missionData';
import { Trophy, Star, Target } from 'lucide-react';

interface GrowthMissionBoardProps {
    extendedProfile: FullDogExtendedProfile | null;
    dogId: string;
    onUpdate: () => void;
}

const GrowthMissionBoard = ({ extendedProfile, dogId, onUpdate }: GrowthMissionBoardProps) => {
    const [openCategory, setOpenCategory] = useState<string | undefined>(undefined);

    const handleCategoryUpdateAndAdvance = (updatedCategoryKey: string) => {
        onUpdate();
        const currentIndex = missionCategories.findIndex(c => c.key === updatedCategoryKey);
        if (currentIndex > -1 && currentIndex < missionCategories.length - 1) {
            const nextCategoryKey = missionCategories[currentIndex + 1].key;
            setOpenCategory(nextCategoryKey);
        } else {
            setOpenCategory(undefined);
        }
    };

    const allMissions = missionCategories.flatMap(c => c.missions);
    
    const completionCount = allMissions.filter(m => {
        const value = extendedProfile?.[m.key];
        if (Array.isArray(value)) {
            return value.length > 0;
        }
        return value !== null && value !== undefined && value !== '';
    }).length;

    const completionPercent = extendedProfile ? Math.round((completionCount / allMissions.length) * 100) : 0;

    // 완성도에 따른 동적 스타일링
    const getProgressColor = () => {
        if (completionPercent >= 80) return 'from-green-400 to-emerald-500';
        if (completionPercent >= 60) return 'from-blue-400 to-sky-500';
        if (completionPercent >= 40) return 'from-yellow-400 to-orange-500';
        return 'from-gray-400 to-gray-500';
    };

    const getProgressIcon = () => {
        if (completionPercent >= 80) return <Trophy className="w-5 h-5 text-yellow-500" />;
        if (completionPercent >= 60) return <Star className="w-5 h-5 text-blue-500" />;
        return <Target className="w-5 h-5 text-gray-500" />;
    };

    return (
        <>
            <Card className="bg-gradient-to-br from-sky-50 to-blue-50 shadow-lg border-0 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-sky-100 to-blue-100 border-b border-sky-200">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-full shadow-sm">
                            🌱
                        </div>
                        <div className="flex-1">
                            <CardTitle className="text-gray-800 font-bold text-lg">
                                강아지 성장 미션 보드
                            </CardTitle>
                            <p className="text-sm text-gray-600 mt-1">
                                프로필을 완성하고 더 정확한 훈련법을 추천받으세요!
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            {getProgressIcon()}
                            <span className="text-lg font-bold text-gray-700">
                                {completionPercent}%
                            </span>
                        </div>
                    </div>
                    
                    {/* 개선된 프로그레스 바 */}
                    <div className="mt-4">
                        <div className="w-full bg-white/50 rounded-full h-4 shadow-inner border border-white/30">
                            <motion.div
                                className={`bg-gradient-to-r ${getProgressColor()} h-4 rounded-full shadow-sm relative overflow-hidden`}
                                initial={{ width: 0 }}
                                animate={{ width: `${completionPercent}%` }}
                                transition={{ duration: 1.2, ease: "easeOut" }}
                            >
                                {/* 반짝이는 효과 */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                            </motion.div>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                            <span className="text-xs text-gray-500">
                                {completionCount}/{allMissions.length} 완료
                            </span>
                            <span className="text-xs text-gray-500">
                                {completionPercent >= 100 ? '🎉 모든 미션 완료!' : 
                                 completionPercent >= 80 ? '거의 다 왔어요!' :
                                 completionPercent >= 50 ? '절반 이상 완료!' : '화이팅!'}
                            </span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Accordion type="single" collapsible className="w-full" value={openCategory} onValueChange={setOpenCategory}>
                        {missionCategories.map((category, index) => (
                            <ProfileCategoryForm
                                key={category.key}
                                category={category}
                                dogId={dogId}
                                extendedProfile={extendedProfile}
                                onUpdate={() => handleCategoryUpdateAndAdvance(category.key)}
                                index={index}
                            />
                        ))}
                    </Accordion>
                </CardContent>
            </Card>
        </>
    );
};

export default GrowthMissionBoard;
