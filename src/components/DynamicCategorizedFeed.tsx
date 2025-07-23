import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import ArticleCard from './ArticleCard';

// articles 테이블의 스키마와 일치하는 타입
interface Article {
  id: string;
  slug: string;
  cover_image_url: string;
  title: string;
  category: string;
  summary: string;
}

interface DynamicCategorizedFeedProps {
  title: string;
  category: string;
  limit?: number;
}

const DynamicCategorizedFeed: React.FC<DynamicCategorizedFeedProps> = ({ title, category, limit = 3 }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('articles')
        .select('id, slug, cover_image_url, title, category, summary')
        .eq('category', category)
        .eq('is_published', true)
        .order('published_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error(`Error fetching articles for category ${category}:`, error);
      } else if (data) {
        setArticles(data);
      }
      setLoading(false);
    };

    fetchArticles();
  }, [category, limit]);

  if (loading) {
    return (
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6 pl-4 border-l-4 border-indigo-500">{title}</h2>
          <p>로딩 중...</p>
        </div>
      </section>
    );
  }
  
  if (articles.length === 0) {
    return null;
  }

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6 pl-4 border-l-4 border-indigo-500">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            // ArticleCard에 type='article'을 전달
            <ArticleCard key={article.id} data={article} type="article" />
          ))}
        </div>
      </div>
    </section>
  );
};

export default DynamicCategorizedFeed;