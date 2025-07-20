import React from 'react';
import { Link } from 'react-router-dom';

// 동적 데이터에 맞는 Article 타입 정의
interface Article {
  id: string;
  slug: string;
  cover_image_url: string;
  title: string;
  category: string;
  summary: string;
  // author_name은 현재 articles 테이블에 없으므로, 필요 시 추가해야 합니다.
  // 우선은 UI에서 제거하거나, 고정된 값으로 표시합니다.
}

interface ArticleCardProps {
  article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  return (
    // Link 컴포넌트로 카드 전체를 감싸서 클릭 가능하게 만듭니다.
    <Link to={`/articles/${article.slug}`} className="block group h-full">
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden h-full flex flex-col">
        <div className="relative">
          <img 
            src={article.cover_image_url || 'https://via.placeholder.com/600x400'} 
            alt={article.title} 
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300"></div>
        </div>
        <div className="p-6 flex flex-col flex-grow">
          <span className="text-indigo-600 font-semibold text-sm mb-2">{article.category}</span>
          <h3 className="text-xl font-bold text-gray-800 mb-3 flex-grow group-hover:text-indigo-700 transition-colors">
            {article.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-3">
            {article.summary}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard;