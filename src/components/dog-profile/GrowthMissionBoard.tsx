
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
    { key: 'family_composition', title: '👨‍👩‍👧‍👦 가족 구성', question: '함께 사는 가족 구성원에 대해 알려주세요.' },
    { key: 'known_behaviors', title: '👍 잘하는 행동', question: '이미 잘하는 행동들을 알려주세요.' },
    { key: 'leash_type', title: '🦮 산책 장비', question: '산책 시 어떤 장비를 사용하나요?' },
    { key: 'toilet_type', title: '🚽 배변 습관', question: '배변은 주로 어디서 해결하나요?' },
    { key: 'social_level', title: '🐾 사회성', question: '다른 강아지나 사람들과의 사회성은 어떤가요?' },
    { key: 'meal_habit', title: '🍚 식사 습관', question: '식사 습관은 어떤 편인가요?' },
    { key: 'favorites', title: '💖 최애템', question: '가장 좋아하는 간식이나 장난감은 무엇인가요?' },
    { key: 'owner_proximity', title: '🤝 보호자와의 관계', question: '보호자와의 거리감은 어느 정도인가요?' },
    { key: 'activity_level', title: '⚡️ 활동량', question: '하루 평균 활동량은 어느 정도인가요?' },
    { key: 'past_experience', title: '📜 과거 경험', question: '딩딩이에게 특별한 과거 경험이 있나요?' },
    { key: 'sensitive_items', title: '🤫 민감 요소', question: '특별히 민감하게 반응하는 것이 있나요?' },
    { key: 'family_kids', title: '👶 아이 동거 여부', question: '가족 중에 아이가 함께 사나요?' },
    { key: 'family_elderly', title: '👵 어르신 동거 여부', question: '가족 중에 어르신이 함께 사나요?' },
    { key: 'preferred_play', title: '🎾 선호하는 놀이', question: '어떤 놀이를 가장 좋아하나요?' },
];

const GrowthMissionBoard = ({ extendedProfile, dogId, onUpdate }: GrowthMissionBoardProps) => {
    const [selectedMission, setSelectedMission] = useState<(typeof missions[0]) | null>(null);

    const completionCount = missions.filter(m => extendedProfile?.[m.key]).length;
    const completionPercent = Math.round((completionCount / missions.length) * 100);

    return (
        <>
            <Card className="card-soft bg-green-50">
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
                                    className={`cursor-pointer transition-all duration-300 h-full flex flex-col justify-between ${isCompleted ? 'bg-green-50 border-green-200' : 'bg-white hover:bg-green-100'}`}
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
