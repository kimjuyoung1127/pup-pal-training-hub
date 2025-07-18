// AI/src/components/ArticleCard.tsx
import React from 'react';
import { Article } from '../lib/mock-data'; // Article 타입을 가져옵니다.

interface ArticleCardProps {
  article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  // 임시 스타일입니다. 실제 구현 시에는 tailwind-css 등을 사용합니다.
  const cardStyle: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '0.75rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    transition: 'transform 0.2s',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  };

  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
  };

  const contentStyle: React.CSSProperties = {
    padding: '1.5rem',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  };

  const categoryStyle: React.CSSProperties = {
    color: '#4f46e5',
    fontWeight: 600,
    fontSize: '0.875rem',
    marginBottom: '0.5rem',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    marginBottom: '0.75rem',
    flexGrow: 1,
  };

  const linkStyle: React.CSSProperties = {
    textDecoration: 'none',
    color: 'inherit',
  };
  
  const authorStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    color: '#6b7280',
    marginTop: 'auto',
  };

  return (
    <div style={cardStyle} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'none'}>
      <a href={`/articles/${article.slug}`} style={linkStyle}>
        <img src={article.image_url} alt={article.title} style={imageStyle} />
        <div style={contentStyle}>
          <span style={categoryStyle}>{article.category}</span>
          <h3 style={titleStyle}>{article.title}</h3>
          <p style={authorStyle}>By {article.author_name}</p>
        </div>
      </a>
    </div>
  );
};

export default ArticleCard;
