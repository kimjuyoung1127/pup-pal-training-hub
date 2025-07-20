import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import ArticleCard from './ArticleCard';

// articles 테이블의 스키마와 일치하는 타입
interface Article {
  id: string;
  created_at: string;
  title: string;
  summary: string;
  cover_image_url: string;
  category: string;
  slug: string;
}

const FullArticleFeed: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('articles')
        .select('id, created_at, title, summary, cover_image_url, category, slug')
        .eq('is_published', true)
        .order('published_at', { ascending: false });

      if (error) {
        console.error('Error fetching full article feed:', error);
      } else if (data) {
        setArticles(data);
      }
      setLoading(false);
    };

    fetchArticles();
  }, []);

  return (
    <section className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">모든 아티클 보기</h2>
        {loading ? (
          <p className="text-center">로딩 중...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FullArticleFeed;