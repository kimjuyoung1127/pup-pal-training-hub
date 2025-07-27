import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import ArticleCard from './ArticleCard';

// 이 타입은 나중에 공용 타입 파일로 옮기는 것을 고려해볼 수 있습니다.
interface Article {
  id: string;
  slug: string;
  cover_image_url: string;
  title: string;
  category: string;
  summary: string;
}

const fetchArticles = async (): Promise<Article[]> => {
  const { data, error } = await supabase
    .from('articles')
    .select('id, slug, cover_image_url, title, category, summary')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(12); // 우�� 12개만 가져옵니다.

  if (error) {
    throw new Error(error.message);
  }
  return data || [];
};

const FullArticleFeed: React.FC = () => {
  const { data: articles, isLoading, isError, error } = useQuery<Article[], Error>({
    queryKey: ['articles', 'feed'],
    queryFn: fetchArticles,
  });

  if (isError) {
    console.error('Error fetching full article feed:', error);
    return <p className="text-center text-red-500">아티클을 불러오는 중 오류가 발생했습니다.</p>;
  }

  return (
    <section className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 break-keep">최신 아티클</h2>
        {isLoading ? (
          <p className="text-center">아티클을 불러오는 중...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles?.map((article) => (
              <ArticleCard key={article.id} data={article} type="article" />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FullArticleFeed;