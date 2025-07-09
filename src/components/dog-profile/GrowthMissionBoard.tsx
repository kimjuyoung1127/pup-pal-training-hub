
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FullDogExtendedProfile } from '@/hooks/useDogProfile';
import { motion } from 'framer-motion';
import { Accordion } from '@/components/ui/accordion';
import ProfileCategoryForm from './ProfileCategoryForm';
import { Mission, missionCategories } from '../../lib/missionData';

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
            setOpenCategory(undefined); // 마지막 카테고리였으면 닫기
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

    return (
        <>
            <Card className="bg-sky-50 shadow-md border border-sky-100">
                <CardHeader>
                    <CardTitle className="text-gray-800 font-pretendard font-bold">🌱 강아지 성장 미션 보드</CardTitle>
                    <p className="text-sm text-gray-600 font-pretendard">"프로필을 완성하고 더 정확한 훈련법을 추천받으세요!"</p>
                    <div className="w-full bg-sky-200 rounded-full h-2.5 mt-2">
                        <motion.div
                            className="bg-sky-500 h-2.5 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${completionPercent}%` }}
                            transition={{ duration: 0.8 }}
                        />
                    </div>
                    <p className="text-right text-sm font-semibold text-sky-800 font-pretendard mt-4">프로필 완성도 {completionPercent}%</p>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full" value={openCategory} onValueChange={setOpenCategory}>
                        {missionCategories.map(category => (
                            <ProfileCategoryForm
                                key={category.key}
                                category={category}
                                dogId={dogId}
                                extendedProfile={extendedProfile}
                                onUpdate={() => handleCategoryUpdateAndAdvance(category.key)}
                            />
                        ))}
                    </Accordion>
                </CardContent>
            </Card>
        </>
    );
};

export default GrowthMissionBoard;
