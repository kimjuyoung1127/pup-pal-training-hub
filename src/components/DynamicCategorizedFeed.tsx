import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import ArticleCard from './ArticleCard';

// articles 테이블의 스키마와 일치하는 타입
// (ArticleEditorPage에서 사용한 타입을 가져오거나, 공유 타입으로 분리할 수 있습니다)
interface Article {
  id: string;
  created_at: string;
  title: string;
  summary: string;
  cover_image_url: string;
  category: string;
  slug: string;
  // ... ArticleCard에 필요한 다른 필드들
}

interface DynamicCategorizedFeedProps {
  title: string;
  category: string;
  limit?: number; // 가져올 아티클 수를 제한하는 옵션
}

const DynamicCategorizedFeed: React.FC<DynamicCategorizedFeedProps> = ({ title, category, limit = 3 }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('articles')
        .select('id, created_at, title, summary, cover_image_url, category, slug') // 필요한 컬럼만 선택
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
    // 해당 카테고리에 글이 없으면 섹션 자체를 렌더링하지 않음
    return null;
  }

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6 pl-4 border-l-4 border-indigo-500">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default DynamicCategorizedFeed;
