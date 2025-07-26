import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const toggleLike = async (postId: string) => {
  const { data, error } = await supabase.rpc('toggle_like', {
    p_post_id: postId,
  });

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const useToggleLike = (postId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleLike,
    onSuccess: () => {
      // 좋아요 상태 변경 성공 시, 관련 쿼리를 모두 무효화하여
      // UI가 최신 상태를 반영하도록 합니다.
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};
