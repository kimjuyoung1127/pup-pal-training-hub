// AI/src/components/CategorizedFeed.tsx
import React from 'react';
import { Article } from '../lib/mock-data';
import ArticleCard from './ArticleCard';

interface CategorizedFeedProps {
  title: string;
  articles: Article[];
}

const CategorizedFeed: React.FC<CategorizedFeedProps> = ({ title, articles }) => {
  // 임시 스타일입니다. 실제 구현 시에는 tailwind-css 등을 사용합니다.
  const sectionStyle: React.CSSProperties = {
    padding: '2rem 1rem',
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: '1280px',
    margin: '0 auto',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '1.5rem',
    borderLeft: '5px solid #6366f1',
    paddingLeft: '1rem',
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '2rem',
  };

  return (
    <section style={sectionStyle}>
      <div style={containerStyle}>
        <h2 style={titleStyle}>{title}</h2>
        <div style={gridStyle}>
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorizedFeed;
