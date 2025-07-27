
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface AnalysisRecord {
  id: number;
  created_at: string;
  dog_id: string;
  is_baseline: boolean;
  original_video_filename: string;
  processed_video_url: string;
  analysis_results: {
    stability: number;
    symmetry: number;
    stride_length: number;
  };
}

const fetchJointAnalysisHistory = async (dogId: string | undefined, userId: string | undefined) => {
  if (!userId || !dogId) {
    return [];
  }

  const { data, error } = await supabase
    .from('joint_analysis_records')
    .select('*')
    .eq('user_id', userId)
    .eq('dog_id', dogId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching joint analysis history:', error);
    throw new Error(error.message);
  }

  return data as AnalysisRecord[];
};

export const useJointAnalysisHistory = (dogId: string | undefined) => {
  const { session } = useAuth();
  const user = session?.user;
  
  return useQuery<AnalysisRecord[], Error>({
    queryKey: ['jointAnalysisHistory', dogId],
    queryFn: () => fetchJointAnalysisHistory(dogId, user?.id),
    enabled: !!user && !!dogId,
  });
};
