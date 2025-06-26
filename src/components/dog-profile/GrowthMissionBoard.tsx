
import React from 'react';
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
            <Card className="card-soft bg-sky-50">
                <CardHeader>
                    <CardTitle className="text-sky-900 font-pretendard">🌱 강아지 성장 미션 보드</CardTitle>
                    <p className="text-sm text-sky-700 font-pretendard">"프로필을 완성하고 더 정확한 훈련법을 추천받으세요!"</p>
                    <div className="w-full bg-sky-200 rounded-full h-2.5 mt-2">
                        <motion.div
                            className="bg-sky-500 h-2.5 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${completionPercent}%` }}
                            transition={{ duration: 0.8 }}
                        />
                    </div>
                    <p className="text-right text-sm font-semibold text-sky-800 font-pretendard mt-1">프로필 완성도 {completionPercent}%</p>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                        {missionCategories.map(category => (
                            <ProfileCategoryForm
                                key={category.key}
                                category={category}
                                dogId={dogId}
                                extendedProfile={extendedProfile}
                                onUpdate={onUpdate}
                            />
                        ))}
                    </Accordion>
                </CardContent>
            </Card>
        </>
    );
};

export default GrowthMissionBoard;
