// C:\Users\gmdqn\AI\src\pages\app\adventure\[dogId].tsx

import React from 'react';
import { useRouter } from 'next/router';
import useDogProfile from '@/hooks/useDogProfile';
import GrowthAdventureMap from '@/components/dog-profile/GrowthAdventureMap';
import AppCoreHeader from '@/components/layout/AppCoreHeader';
import WoofpediaBottomNav from '@/components/layout/WoofpediaBottomNav';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const AdventurePage = () => {
    const router = useRouter();
    const { dogId } = router.query;
    const { extendedProfile, loading, error, refreshProfile } = useDogProfile(dogId as string);

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <AppCoreHeader
                title={
                    <div className="flex items-center">
                        <Button variant="ghost" size="icon" className="mr-2" asChild>
                            <Link href="/app"> 
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                        </Button>
                        <span className="font-bold text-lg">
                            {extendedProfile?.profile.name || '강아지'}의 성장 어드벤처
                        </span>
                    </div>
                }
            />
            <main className="flex-grow container mx-auto px-4 py-8">
                {loading && <div className="text-center p-10">로딩 중...</div>}
                {error && <div className="text-center p-10 text-red-500">오류가 발생했습니다: {error.message}</div>}
                {extendedProfile && (
                    <GrowthAdventureMap
                        extendedProfile={extendedProfile}
                        dogId={dogId as string}
                        onUpdate={refreshProfile}
                    />
                )}
            </main>
            <WoofpediaBottomNav />
        </div>
    );
};

export default AdventurePage;
