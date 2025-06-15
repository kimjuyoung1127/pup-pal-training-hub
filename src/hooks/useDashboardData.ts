
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const fetchDog = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('dogs')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116: no rows found
    console.error('Error fetching dog:', error);
    toast.error('강아지 정보를 불러오는 데 실패했습니다.');
    throw error;
  }
  return data;
};

const fetchRandom = async (tableName: 'training_tips' | 'recommended_videos' | 'daily_missions') => {
    const { data, error } = await supabase.from(tableName).select('*');
    if (error) {
        console.error(`Error fetching from ${tableName}:`, error);
        toast.error('데이터를 불러오는 데 실패했습니다.');
        throw error;
    }
    if (!data || data.length === 0) return null;
    return data[Math.floor(Math.random() * data.length)];
}

export const useDashboardData = () => {
  const { data: dog, isLoading: isDogLoading } = useQuery({
    queryKey: ['dog'],
    queryFn: fetchDog,
  });

  const { data: tip, isLoading: isTipLoading } = useQuery({
    queryKey: ['random-tip'],
    queryFn: () => fetchRandom('training_tips'),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });

  const { data: video, isLoading: isVideoLoading } = useQuery({
    queryKey: ['random-video'],
    queryFn: () => fetchRandom('recommended_videos'),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });

  const { data: mission, isLoading: isMissionLoading } = useQuery({
    queryKey: ['random-mission'],
    queryFn: () => fetchRandom('daily_missions'),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });

  return {
    dog,
    tip,
    video,
    mission,
    isLoading: isDogLoading || isTipLoading || isVideoLoading || isMissionLoading,
  };
};
