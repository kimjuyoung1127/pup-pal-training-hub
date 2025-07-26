import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface NewPostData {
  title: string;
  content: string;
  category: 'general' | 'qna' | 'gallery';
  user_id: string;
}

const createPost = async (postData: NewPostData) => {
  const { data, error } = await supabase
    .from('posts')
    .insert(postData)
    .select()
    .single(); // .single() to get the created post back

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      // 새 글 작성 성공 시, 'posts' 쿼리를 무효화하여
      // 커뮤니티 목록 페이지가 자동으로 새로고침되도록 합니다.
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};
