// C:\Users\gmdqn\AI\src\components\GrowthAdventurePage.tsx

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDogProfile } from '@/hooks/useDogProfile'; // 훅 재사용
import GrowthAdventureMap from '@/components/dog-profile/GrowthAdventureMap';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const GrowthAdventurePage = () => {
    const { dogId } = useParams<{ dogId: string }>();
    const navigate = useNavigate();
    const { extendedProfile, loading, error, refreshProfile } = useDogProfile(dogId);

    if (loading) return <div className="text-center p-10">로딩 중...</div>;
    if (error) return <div className="text-center p-10 text-red-500">오류: {error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center mb-6">
                <Button variant="ghost" size="icon" onClick={() => navigate('/app')}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-2xl font-bold font-pretendard ml-2">
                    {extendedProfile?.profile.name || '강아지'}의 성장 어드벤처
                </h1>
            </div>
            <GrowthAdventureMap
                extendedProfile={extendedProfile}
                dogId={dogId as string}
                onUpdate={refreshProfile}
            />
        </div>
    );
};

export default GrowthAdventurePage;
