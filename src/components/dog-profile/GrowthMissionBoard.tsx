
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
            <Card className="card-soft bg-pink-50 shadow-md"> {/* 배경 및 섀도우 변경 */}
                <CardHeader>
                    <CardTitle className="text-pink-700 font-pretendard">🌱 강아지 성장 미션 보드</CardTitle> {/* 타이틀 색상 변경 */}
                    <p className="text-sm text-muted-foreground font-pretendard">"프로필을 완성하고 더 정확한 훈련법을 추천받으세요!"</p> {/* 설명 텍스트 색상 변경 */}
                    <div className="w-full bg-pink-100 rounded-full h-2.5 mt-2"> {/* 프로그레스 바 배경색 변경 */}
                        <motion.div
                            className="bg-pink-400 h-2.5 rounded-full" /* 프로그레스 바 색상 변경 */
                            initial={{ width: 0 }}
                            animate={{ width: `${completionPercent}%` }}
                            transition={{ duration: 0.8 }}
                        />
                    </div>
                    <p className="text-right text-sm font-semibold text-pink-600 font-pretendard mt-1">프로필 완성도 {completionPercent}%</p> {/* 완성도 텍스트 색상 변경 */}
                </CardHeader>
                <CardContent>
                    {/* Accordion 내부 (ProfileCategoryForm) 스타일도 일관성 있게 수정 필요 */}
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
