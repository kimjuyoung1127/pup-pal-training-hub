
// src/pages/history/useUserDogs.ts
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@supabase/auth-helpers-react';

const fetchUserDogs = async (userId: string) => {
  const { data, error } = await supabase
    .from('dogs')
    .select('id, name, age, gender, breed, weight, image_url, baseline_analysis_id') // ★★★ baseline_analysis_id 추가
    .eq('user_id', userId);

  if (error) {
    console.error("Error fetching user's dogs:", error);
    throw new Error(error.message);
  }
  return data;
};

export const useUserDogs = () => {
  const user = useUser();
  return useQuery({
    queryKey: ['userDogs', user?.id],
    queryFn: () => {
      if (!user) throw new Error('User not authenticated');
      return fetchUserDogs(user.id);
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5분
    cacheTime: 10 * 60 * 1000, // 10분
  });
};

