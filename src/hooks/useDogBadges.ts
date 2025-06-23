
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface DogBadge {
  id: number;
  name: string;
  description: string | null;
  icon: string | null;
  achieved: boolean;
  achieved_at: string | null;
}

const fetchDogBadges = async (dogId: string | undefined): Promise<Badge[]> => {
  if (!dogId) return [];
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return [];
  }

  const { data: dog, error: dogError } = await supabase
    .from('dogs')
    .select('id')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (dogError && dogError.code !== 'PGRST116') {
    console.error('Error fetching dog:', dogError);
    toast.error('강아지 정보를 가져오는 데 실패했습니다.');
    throw dogError;
  }

  const { data: allBadges, error: badgesError } = await supabase
    .from('badges')
    .select('*');

  if (badgesError) {
    console.error('Error fetching all badges:', badgesError);
    toast.error('전체 뱃지 목록을 가져오는 데 실패했습니다.');
    throw badgesError;
  }

  if (!allBadges) {
    return [];
  }

  if (!dog) {
    return allBadges.map(badge => ({
      ...badge,
      achieved: false,
      achieved_at: null,
    }));
  }

  const { data: dogBadgesData, error: dogBadgesError } = await supabase
    .from('dog_badges')
    .select('badge_id, achieved_at')
    .eq('dog_id', dog.id);

  if (dogBadgesError) {
    console.error('Error fetching dog badges:', dogBadgesError);
    toast.error('획득한 뱃지 정보를 가져오는 데 실패했습니다.');
    throw dogBadgesError;
  }

  const achievedBadgeIds = new Set(dogBadgesData?.map(b => b.badge_id) || []);
  const achievedBadgeMap = new Map(dogBadgesData?.map(b => [b.badge_id, b.achieved_at]) || []);

  return allBadges.map(badge => ({
    ...badge,
    achieved: achievedBadgeIds.has(badge.id),
    achieved_at: achievedBadgeMap.get(badge.id) || null,
  })).sort((a, b) => {
    if (a.achieved && !b.achieved) return -1;
    if (!a.achieved && b.achieved) return 1;
    if (a.achieved_at && b.achieved_at) {
      return new Date(b.achieved_at).getTime() - new Date(a.achieved_at).getTime();
    }
    return a.name.localeCompare(b.name);
  });
};

export const useDogBadges = (dogId: string | undefined) => {
  return useQuery<Badge[], Error>({
    queryKey: ['dogBadges', dogId],
    queryFn: () => fetchDogBadges(dogId),
    enabled: !!dogId,
  });
};
