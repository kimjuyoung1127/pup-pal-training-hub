import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

export type AiRecommendation = Tables<'ai_recommendations'>;

// Fetch AI recommendations
const fetchAiRecommendations = async (dogId: string | undefined): Promise<AiRecommendation[]> => {
  if (!dogId) return [];

  const { data, error } = await supabase
    .from('ai_recommendations')
    .select('*')
    .eq('dog_id', dogId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching AI recommendations:', error);
    throw new Error(error.message);
  }

  return data || [];
};

export const useAiRecommendations = (dogId: string | null) => {
  return useQuery({
    queryKey: ['ai-recommendations', dogId],
    queryFn: () => fetchAiRecommendations(dogId ?? undefined),
    enabled: !!dogId,
  });
};

// Save AI recommendations
export const useSaveAiRecommendations = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ dogId, recommendations }: { dogId: string; recommendations: any }) => {
      console.log('Attempting to save AI recommendations...');

      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        console.error('Error getting session:', sessionError.message);
        throw new Error('세션 정보를 가져오는 중 오류가 발생했습니다.');
      }

      if (!sessionData.session) {
        console.warn('No active session found. User might be logged out.');
        throw new Error('사용자 인증이 필요합니다. 로그인이 되어 있는지 확인해주세요.');
      }

      const user = sessionData.session.user;
      console.log('✅ Session and user confirmed. User ID:', user.id);

      const dataToInsert = {
        dog_id: dogId,
        user_id: user.id, // ✅ insert에 user_id 포함 및 auth.uid()와 일치 확인
        recommendations,
      };

      console.log('Inserting data into ai_recommendations:', dataToInsert);

      const { data, error } = await supabase
        .from('ai_recommendations')
        .insert(dataToInsert)
        .select();

      if (error) {
        console.error('Supabase insert error:', error.message);
        throw new Error(`추천 저장에 실패했습니다: ${error.message}`);
      }

      console.log('✅ Successfully inserted recommendations:', data);
      return data;
    },
    onSuccess: (data, variables) => {
      console.log('Mutation success, invalidating queries for dogId:', variables.dogId);
      queryClient.invalidateQueries({ queryKey: ['ai-recommendations', variables.dogId] });
    },
    onError: (error: Error) => {
      console.error('Mutation failed:', error.message);
      // UI에 표시될 에러 메시지는 toast에서 처리합니다.
    },
  });
};

// Delete AI recommendations
export const useDeleteAiRecommendations = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dogId: string) => {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData.session) {
        throw new Error('User not authenticated');
      }
      const user = sessionData.session.user;

      const { error } = await supabase
        .from('ai_recommendations')
        .delete()
        .eq('dog_id', dogId)
        .eq('user_id', user.id);

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: (data, dogId) => {
      queryClient.invalidateQueries({ queryKey: ['ai-recommendations', dogId] });
    },
  });
};