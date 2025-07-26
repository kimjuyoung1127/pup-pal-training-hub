import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface NewCommentData {
  content: string;
  post_id: string;
  user_id: string;
}

const createComment = async (commentData: NewCommentData) => {
  const { data, error } = await supabase
    .from('comments')
    .insert(commentData)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const useCreateComment = (postId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      // 댓글 작성 성공 시, 해당 post의 쿼리를 무효화하여
      // 상세 페이지가 자동으로 새로고침되도록 합니다.
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
    },
  });
};
