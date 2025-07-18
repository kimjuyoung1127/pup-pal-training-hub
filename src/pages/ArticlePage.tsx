import React from 'react';
import { useParams } from 'react-router-dom';
import { mockArticles, Article } from '@/lib/mock-data'; // Article 타입과 목업 데이터를 가져옵니다.

const ArticlePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  
  // 목업 데이터에서 slug와 일치하는 아티클을 찾습니다.
  const article: Article | undefined = mockArticles.find(a => a.slug === slug);

  // 임시 스타일입니다.
  const containerStyle: React.CSSProperties = {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem',
  };
  const titleStyle: React.CSSProperties = { fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' };
  const metaInfoStyle: React.CSSProperties = { color: '#6b7280', marginBottom: '2rem' };
  const imageStyle: React.CSSProperties = { width: '100%', height: 'auto', objectFit: 'cover', borderRadius: '0.5rem', marginBottom: '2rem' };
  const contentStyle: React.CSSProperties = { lineHeight: 1.7, fontSize: '1.1rem' };
  const tagsContainerStyle: React.CSSProperties = { marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #e5e7eb' };
  const tagsTitleStyle: React.CSSProperties = { fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem' };
  const tagStyle: React.CSSProperties = {
    display: 'inline-block',
    backgroundColor: '#eef2ff',
    color: '#4f46e5',
    padding: '0.5rem 1rem',
    borderRadius: '9999px',
    marginRight: '0.5rem',
    marginBottom: '0.5rem',
    textDecoration: 'none',
    fontSize: '0.9rem',
  };

  if (!article) {
    return <div style={{textAlign: 'center', padding: '2rem'}}>아티클을 찾을 수 없습니다.</div>;
  }

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>{article.title}</h1>
      <div style={metaInfoStyle}>
        <p>작성자: {article.author_name}</p>
        {article.review_info && <p>검수 정보: {article.review_info}</p>}
        <p>발행일: {new Date(article.created_at).toLocaleDateString()}</p>
      </div>
      <img src={article.image_url} alt={article.title} style={imageStyle} />
      <div style={contentStyle}>
        {/* 실제 구현에서는 마크다운을 HTML로 변환하는 라이브러리를 사용합니다. */}
        {article.content.split('\n').map((paragraph, index) => <p key={index}>{paragraph}</p>)}
      </div>

      {/* 관련 태그 섹션 */}
      <div style={tagsContainerStyle}>
        <h3 style={tagsTitleStyle}>관련 태그</h3>
        <div>
          {article.tags.map(tag => (
            <a key={tag} href={`/tags/${tag}`} style={tagStyle}>
              #{tag}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArticlePage;
