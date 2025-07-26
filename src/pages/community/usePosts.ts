import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const POSTS_PER_PAGE = 10;

const fetchPosts = async (page: number) => {
  const from = (page - 1) * POSTS_PER_PAGE;
  const to = from + POSTS_PER_PAGE - 1;

  const { data, error, count } = await supabase
    .from('posts_with_author')
    .select('*', { count: 'exact' }) // 'exact'로 전체 개수를 가져옵니다.
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error(error.message);
  }
  
  return { posts: data, count };
};

export const usePosts = (page: number) => {
  return useQuery({
    queryKey: ['posts', page], // queryKey에 page를 포함하여 페이지별로 캐시합니다.
    queryFn: () => fetchPosts(page),
  });
};
