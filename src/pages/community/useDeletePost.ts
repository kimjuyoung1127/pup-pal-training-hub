import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const deletePost = async (postId: string) => {
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId);

  if (error) {
    throw new Error(error.message);
  }
  return true;
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      // 글 삭제 성공 시, 'posts' 쿼리를 무효화하여
      // 커뮤니티 목록 페이지가 자동으로 새로고침되도록 합니다.
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};
