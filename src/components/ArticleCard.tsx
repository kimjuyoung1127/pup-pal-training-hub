import React from 'react';
import { Link } from 'react-router-dom';

// 두 테이블의 데이터를 모두 포괄할 수 있는 유연한 타입 정의
// ArticleCard가 필요로 하는 최소한의 필드를 정의합니다.
interface CardData {
  id: string;
  slug?: string; // articles 테이블에만 존재 (optional)
  cover_image_url?: string;
  title: string;
  category?: string;
  summary?: string;
}

interface ArticleCardProps {
  // article 대신 data 라는 이름으로 변경하여 범용성을 높임
  data: CardData;
  // 데이터의 출처를 나타내는 타입을 추가 (링크를 다르게 처리하기 위함)
  type: 'article' | 'suggestion';
}

const ArticleCard: React.FC<ArticleCardProps> = ({ data, type }) => {
  const cardContent = (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden h-full flex flex-col group">
      <div className="relative">
        <img 
          src={data.cover_image_url || 'https://via.placeholder.com/600x400'} 
          alt={data.title} 
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300"></div>
      </div>
      <div className="p-4 md:p-6 flex flex-col flex-grow">
        {data.category && (
          <span className="text-indigo-600 font-semibold text-sm mb-2">{data.category}</span>
        )}
        <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3 flex-grow group-hover:text-indigo-700 transition-colors">
          {data.title}
        </h3>
        {data.summary && (
          <p className="text-gray-600 text-sm line-clamp-3">
            {data.summary}
          </p>
        )}
      </div>
    </div>
  );

  // 'article' 타입일 경우에만 Link로 감싸서 클릭 가능하게 만듭니다.
  if (type === 'article' && data.slug) {
    return (
      <Link to={`/articles/${data.slug}`} className="block h-full">
        {cardContent}
      </Link>
    );
  }

  // 'suggestion' 타입이거나 slug가 없으면 링크 없이 내용만 보여줍니다.
  return cardContent;
};

export default ArticleCard;
