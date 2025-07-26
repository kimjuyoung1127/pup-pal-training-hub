import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface UpdatePostData {
  postId: string;
  updates: {
    title: string;
    content: string;
    category: 'general' | 'qna' | 'gallery';
  };
}

const updatePost = async ({ postId, updates }: UpdatePostData) => {
  const { data, error } = await supabase
    .from('posts')
    .update(updates)
    .eq('id', postId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const useUpdatePost = (postId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePost,
    onSuccess: () => {
      // 글 수정 성공 시, 해당 post와 전체 posts 쿼리를 모두 무효화합니다.
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};
