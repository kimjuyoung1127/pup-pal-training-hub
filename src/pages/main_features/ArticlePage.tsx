import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import ReactMarkdown from 'react-markdown';

// articles 테이블 스키마에 맞는 타입
interface Article {
  id: string;
  published_at: string;
  title: string;
  content: string;
  category: string;
  cover_image_url: string;
  tags: string[]; // tags는 text[] 타입이므로 string 배열로 처리
  // author_name, review_info 등은 현재 스키마에 없으므로 UI에서 제거하거나 고정값 사용
}

const ArticlePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!slug) return;
      
      setLoading(true);
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true) // 발행된 글만 가져오도록 조건 추가
        .single(); // slug는 유니크하므로 single() 사용

      if (error) {
        console.error('Error fetching article:', error);
        setArticle(null);
      } else {
        setArticle(data);
      }
      setLoading(false);
    };

    fetchArticle();
  }, [slug]);

  if (loading) {
    return <div className="text-center py-12">아티클을 불러오는 중...</div>;
  }

  if (!article) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center p-8 bg-white rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">아티클을 찾을 수 없습니다</h2>
          <p className="text-gray-600 mb-4">요청하신 아티클이 존재하지 않거나 아직 발행되지 않았을 수 있습니다.</p>
          <a href="/" className="inline-block bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
            홈으로 돌아가기
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-6 md:py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6 md:mb-8">
          <img 
            src={article.cover_image_url || 'https://via.placeholder.com/800x400'} 
            alt={article.title} 
            className="w-full h-48 md:h-64 object-cover"
          />
          <div className="p-6 md:p-8">
            <div className="flex items-center mb-4">
              <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-3 py-1 rounded-full">
                {article.category}
              </span>
              <span className="text-gray-500 text-sm ml-4">
                {new Date(article.published_at).toLocaleDateString()}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{article.title}</h1>
            {/* 저자 정보는 현재 없으므로 임시로 표시 */}
            <p className="text-gray-600">By Pet-Life Magazine</p>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6 md:mb-8">
          <div className="p-6 md:p-10">
            <article className="prose prose-lg max-w-none prose-indigo">
              <ReactMarkdown>{article.content}</ReactMarkdown>
            </article>
          </div>
        </div>
        
        {article.tags && article.tags.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 md:p-8">
              <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4">관련 태그</h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map(tag => (
                  <span key={tag} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticlePage;