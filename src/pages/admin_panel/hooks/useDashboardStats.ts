import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';

const fetchDashboardStats = async () => {
  // 여러 쿼리를 병렬로 실행
  const [suggestionsCount, publishedArticlesCount] = await Promise.all([
    supabase.from('suggested_topics').select('id', { count: 'exact', head: true }),
    supabase.from('articles').select('id', { count: 'exact', head: true }).eq('is_published', true)
  ]);

  if (suggestionsCount.error) throw new Error(suggestionsCount.error.message);
  if (publishedArticlesCount.error) throw new Error(publishedArticlesCount.error.message);

  return {
    suggestionsCount: suggestionsCount.count ?? 0,
    publishedArticlesCount: publishedArticlesCount.count ?? 0,
  };
};

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboardStats'],
    queryFn: fetchDashboardStats,
  });
};
