import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabaseClient';

const fetchArticle = async (id: string) => {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const useArticle = (id: string) => {
  return useQuery({
    queryKey: ['article', id],
    queryFn: () => fetchArticle(id),
    enabled: !!id, // id가 있을 때만 쿼리 실행
  });
};
