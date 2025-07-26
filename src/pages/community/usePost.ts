import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const fetchPost = async (postId: string) => {
  // 1. VIEW에서 게시글과 작성자 정보, 좋아요 정보를 가져옵니다.
  const { data: postData, error: postError } = await supabase
    .from('posts_with_author')
    .select('*')
    .eq('id', postId)
    .single();

  if (postError) {
    throw new Error(`게시글 정보 로딩 실패: ${postError.message}`);
  }

  // 2. VIEW에서 해당 게시글의 댓글과 댓글 작성자 정보를 가져옵니다.
  const { data: commentsData, error: commentsError } = await supabase
    .from('comments_with_author')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (commentsError) {
    throw new Error(`댓글 정보 로딩 실패: ${commentsError.message}`);
  }

  // 3. 두 결과를 합쳐서 반환합니다.
  return { ...postData, comments: commentsData || [] };
};

export const usePost = (postId: string) => {
  return useQuery({
    queryKey: ['post', postId],
    queryFn: () => fetchPost(postId),
    enabled: !!postId, // postId가 있을 때��� 쿼리를 실행합니다.
  });
};
