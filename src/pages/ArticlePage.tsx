import React from 'react';
import { useParams } from 'react-router-dom';
import { mockArticles, Article } from '@/lib/mock-data';

const ArticlePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  
  // 목업 데이터에서 slug와 일치하는 아티클을 찾습니다.
  const article: Article | undefined = mockArticles.find(a => a.slug === slug);

  if (!article) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center p-8 bg-white rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">아티클을 찾을 수 없습니다</h2>
          <p className="text-gray-600 mb-4">요청하신 아티클이 존재하지 않거나 삭제되었을 수 있습니다.</p>
          <a href="/" className="inline-block bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
            홈으로 돌아가기
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* 아티클 헤더 */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
          <img 
            src={article.image_url} 
            alt={article.title} 
            className="w-full h-64 object-cover"
          />
          <div className="p-8">
            <div className="flex items-center mb-4">
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                {article.category}
              </span>
              <span className="text-gray-500 text-sm ml-4">
                {new Date(article.created_at || Date.now()).toLocaleDateString()}
              </span>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{article.title}</h1>
            
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
              <div>
                <p className="font-medium text-gray-800">{article.author_name}</p>
                {article.review_info && <p className="text-sm text-gray-500">검수: {article.review_info}</p>}
              </div>
            </div>
          </div>
        </div>
        
        {/* 아티클 본문 */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
          <div className="p-8">
            <div className="prose max-w-none text-gray-700">
              {article.content?.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4">{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
        
        {/* 관련 태그 */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
          <div className="p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">관련 태그</h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map(tag => (
                <a 
                  key={tag} 
                  href={`/tags/${tag}`} 
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm hover:bg-gray-200 transition-colors"
                >
                  #{tag}
                </a>
              ))}
            </div>
          </div>
        </div>
        
        {/* 추천 아티클 */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">추천 아티클</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockArticles
                .filter(a => a.id !== article.id && a.category === article.category)
                .slice(0, 2)
                .map(relatedArticle => (
                  <a 
                    key={relatedArticle.id} 
                    href={`/articles/${relatedArticle.slug}`}
                    className="flex items-start space-x-4 group"
                  >
                    <img 
                      src={relatedArticle.image_url} 
                      alt={relatedArticle.title} 
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div>
                      <h4 className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                        {relatedArticle.title}
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">{relatedArticle.author_name}</p>
                    </div>
                  </a>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticlePage;
