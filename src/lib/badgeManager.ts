
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Helper to calculate consecutive training days
const calculateConsecutiveDays = (trainingHistory: { session_date: string }[]): number => {
    if (!trainingHistory || trainingHistory.length === 0) {
        return 0;
    }
    const trainingDates = [...new Set(trainingHistory.map(h => h.session_date))].map(d => new Date(d)).sort((a,b) => b.getTime() - a.getTime());

    let consecutiveDays = 0;
    if (trainingDates.length > 0) {
        const today = new Date();
        today.setHours(0,0,0,0);
        const firstDate = new Date(trainingDates[0]);
        firstDate.setHours(0,0,0,0);
        
        const diffTime = today.getTime() - firstDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 1) {
            consecutiveDays = 1;
            for (let i = 0; i < trainingDates.length - 1; i++) {
                const currentDay = new Date(trainingDates[i]);
                const nextDay = new Date(trainingDates[i+1]);
                const dayDiff = Math.round((currentDay.getTime() - nextDay.getTime()) / (1000 * 60 * 60 * 24));
                if (dayDiff === 1) {
                    consecutiveDays++;
                } else {
                    break;
                }
            }
        }
    }
    return consecutiveDays;
}


export const checkAndAwardBadges = async (dogId: string) => {
    try {
        const { data: allBadges, error: badgesError } = await supabase.from('badges').select('*');
        if (badgesError) throw badgesError;
        if (!allBadges) return;

        const { data: dogBadges, error: dogBadgesError } = await supabase.from('dog_badges').select('badge_id').eq('dog_id', dogId);
        if (dogBadgesError) throw dogBadgesError;
        const dogBadgeIds = dogBadges?.map(b => b.badge_id) || [];
        
        const { data: trainingHistory, error: historyError } = await supabase
            .from('training_history')
            .select('session_date, success_rate, created_at')
            .eq('dog_id', dogId)
            .order('created_at', { ascending: false });

        if (historyError) throw historyError;
        if (!trainingHistory || trainingHistory.length === 0) return [];

        const newBadgesToAward: { dog_id: string, badge_id: number }[] = [];

        // Badge 1: '첫 훈련 파트너'
        const firstTrainingBadge = allBadges.find(b => b.name === '첫 훈련 파트너');
        if (firstTrainingBadge && !dogBadgeIds.includes(firstTrainingBadge.id)) {
            newBadgesToAward.push({ dog_id: dogId, badge_id: firstTrainingBadge.id });
        }
        
        // Badge 3: '성공의 맛'
        const successTasteBadge = allBadges.find(b => b.name === '한번 더');
        if (successTasteBadge && !dogBadgeIds.includes(successTasteBadge.id)) {
            const firstLog = [...trainingHistory].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())[0];
            if (firstLog && firstLog.success_rate && Number(firstLog.success_rate) === 100) {
                newBadgesToAward.push({ dog_id: dogId, badge_id: successTasteBadge.id });
            }
        }

        // Badge 2: '꾸준함의 상징'
        const consistencyBadge = allBadges.find(b => b.name === '꾸준함의 상징');
        if (consistencyBadge && !dogBadgeIds.includes(consistencyBadge.id)) {
            const consecutiveDays = calculateConsecutiveDays(trainingHistory.map(h => ({ session_date: h.session_date })));
            if (consecutiveDays >= 7) {
                newBadgesToAward.push({ dog_id: dogId, badge_id: consistencyBadge.id });
            }
        }

        const uniqueNewBadgesToAward = newBadgesToAward.filter((badge) => !dogBadgeIds.includes(badge.badge_id));

        if (uniqueNewBadgesToAward.length > 0) {
            const { error: insertError } = await supabase.from('dog_badges').insert(uniqueNewBadgesToAward.map(b => ({ dog_id: b.dog_id, badge_id: b.badge_id })));
            if (insertError) {
                console.error("Error awarding badges:", insertError);
                return [];
            } else {
                const awardedBadges = uniqueNewBadgesToAward.map(b => {
                    const awardedBadgeInfo = allBadges.find(ab => ab.id === b.badge_id);
                    toast.success(`🎉 뱃지 획득: ${awardedBadgeInfo?.name}`);
                    return awardedBadgeInfo;
                }).filter(Boolean);

                return awardedBadges;
            }
        }
        return [];
    } catch (error: any) {
        console.error("Failed to check and award badges:", error);
        return [];
    }
};
