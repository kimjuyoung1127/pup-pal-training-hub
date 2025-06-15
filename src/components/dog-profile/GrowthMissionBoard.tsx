
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Lock } from 'lucide-react';
import { FullDogExtendedProfile } from '@/hooks/useDogProfile';
import { motion } from 'framer-motion';
import ExtendedProfileFormSheet, { MissionKey } from './ExtendedProfileFormSheet';

interface GrowthMissionBoardProps {
    extendedProfile: FullDogExtendedProfile | null;
    dogId: string;
    onUpdate: () => void;
}

const missions: { key: MissionKey; title: string; question: string; }[] = [
    { key: 'living_environment', title: '🏠 생활 환경', question: '딩딩이는 어디에서 살고 있나요?' },
    { key: 'family_composition', title: '👨‍👩‍👧 가족 구성', question: '가족 구성원에 대해 알려주세요.' },
    { key: 'favorite_snacks', title: '🍗 좋아하는 간식', question: '어떤 간식을 가장 좋아하나요?' },
    { key: 'sensitive_factors', title: '😰 민감한 요소', question: '딩딩이는 무엇에 예민한가요?' },
    { key: 'past_history', title: '🐕 과거 히스토리', question: '입양 또는 과거 훈련 경험이 있나요?' },
];

const GrowthMissionBoard = ({ extendedProfile, dogId, onUpdate }: GrowthMissionBoardProps) => {
    const [selectedMission, setSelectedMission] = useState<(typeof missions[0]) | null>(null);

    const completionCount = missions.filter(m => extendedProfile?.[m.key]).length;
    const completionPercent = Math.round((completionCount / missions.length) * 100);

    return (
        <>
            <Card className="card-soft">
                <CardHeader>
                    <CardTitle className="text-cream-800 font-pretendard">🌱 강아지 성장 미션 보드</CardTitle>
                    <p className="text-sm text-cream-600 font-pretendard">"프로필을 완성하고 더 정확한 훈련법을 추천받으세요!"</p>
                    <div className="w-full bg-cream-200 rounded-full h-2.5 mt-2">
                        <motion.div
                            className="bg-green-500 h-2.5 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${completionPercent}%` }}
                            transition={{ duration: 0.8 }}
                        />
                    </div>
                    <p className="text-right text-sm font-semibold text-green-600 font-pretendard mt-1">프로필 완성도 {completionPercent}%</p>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {missions.map((mission, index) => {
                        const isCompleted = !!extendedProfile?.[mission.key];
                        return (
                            <motion.div
                                key={mission.key}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.05 }}
                                whileHover={{ scale: 1.03 }}
                            >
                                <Card
                                    onClick={() => setSelectedMission(mission)}
                                    className={`cursor-pointer transition-all duration-300 h-full flex flex-col justify-between ${isCompleted ? 'bg-green-50 border-green-200' : 'bg-white hover:bg-cream-50'}`}
                                >
                                    <CardContent className="p-4 flex items-center justify-between">
                                        <div>
                                            <p className="font-bold text-cream-800 font-pretendard">{mission.title}</p>
                                            <p className="text-sm text-cream-600 font-pretendard">{isCompleted ? '✨ 입력 완료!' : mission.question}</p>
                                        </div>
                                        {isCompleted ? (
                                            <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                                        ) : (
                                            <Lock className="w-6 h-6 text-cream-400 flex-shrink-0" />
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}
                </CardContent>
            </Card>

            <ExtendedProfileFormSheet
                isOpen={!!selectedMission}
                onClose={() => setSelectedMission(null)}
                mission={selectedMission}
                dogId={dogId}
                extendedProfile={extendedProfile}
                onUpdate={onUpdate}
            />
        </>
    );
};

export default GrowthMissionBoard;
