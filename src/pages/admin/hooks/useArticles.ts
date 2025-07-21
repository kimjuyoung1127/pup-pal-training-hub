import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabaseClient';

const fetchArticles = async () => {
  const { data, error } = await supabase
    .from('articles')
    .select('id, title, category, is_published, created_at, published_at')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const useArticles = () => {
  return useQuery({
    queryKey: ['articles'],
    queryFn: fetchArticles,
  });
};
