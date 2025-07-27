import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface CardData {
  id: string;
  slug?: string;
  cover_image_url?: string;
  title: string;
  category?: string;
  summary?: string;
}

interface ArticleCardProps {
  data: CardData;
  type: 'article' | 'suggestion';
}

const ArticleCard: React.FC<ArticleCardProps> = ({ data, type }) => {
  const cardContent = (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden h-full flex flex-col group transform hover:-translate-y-1">
      <div className="relative overflow-hidden">
        <img 
          src={data.cover_image_url ? `${data.cover_image_url}?transform=w_400,h_300,f_webp` : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=1974&auto=format&fit=crop'} 
          alt={data.title} 
          className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
          loading="lazy"
        />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        {data.category && (
          <span className="text-amber-600 font-semibold text-sm mb-2">{data.category}</span>
        )}
        <h3 className="text-xl font-bold text-slate-800 mb-3 flex-grow">
          {data.title}
        </h3>
        {data.summary && (
          <p className="text-slate-600 text-sm line-clamp-3 mb-4">
            {data.summary}
          </p>
        )}
        <div className="mt-auto">
          <div className="text-slate-700 font-semibold text-sm inline-flex items-center group-hover:text-amber-700 transition-colors">
            자세히 보기
            <ArrowRight className="ml-1 h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </div>
  );

  if (type === 'article' && data.slug) {
    return (
      <Link to={`/articles/${data.slug}`} className="block h-full">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
};

export default ArticleCard;