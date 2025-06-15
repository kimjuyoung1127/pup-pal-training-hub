
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface DogBadge {
  name: string;
  description: string | null;
  icon: string | null;
  achieved_at: string;
}

const fetchDogBadges = async (): Promise<DogBadge[]> => {
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
  
  if (!dog) {
      return [];
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
  
  if (!dogBadgesData || dogBadgesData.length === 0) {
      return [];
  }
  
  const badgeIds = dogBadgesData.map(b => b.badge_id);

  const { data: badgesData, error: badgesError } = await supabase
    .from('badges')
    .select('id, name, description, icon')
    .in('id', badgeIds);

  if (badgesError) {
    console.error('Error fetching badges details:', badgesError);
    toast.error('뱃지 상세 정보를 가져오는 데 실패했습니다.');
    throw badgesError;
  }

  if (!badgesData) {
    return [];
  }
  
  const badgeMap = new Map(badgesData.map(b => [b.id, b]));

  return dogBadgesData.map(db => {
    const badgeDetails = badgeMap.get(db.badge_id);
    return {
      name: badgeDetails?.name || '알 수 없는 뱃지',
      description: badgeDetails?.description || null,
      icon: badgeDetails?.icon || null,
      achieved_at: db.achieved_at,
    };
  }).sort((a, b) => new Date(b.achieved_at).getTime() - new Date(a.achieved_at).getTime());
};

export const useDogBadges = () => {
    return useQuery({
        queryKey: ['dogBadges'],
        queryFn: fetchDogBadges,
    });
};
