// AI/src/components/FullArticleFeed.tsx
import React from 'react';
import { Article } from '../lib/mock-data';
import ArticleCard from './ArticleCard';

interface FullArticleFeedProps {
  articles: Article[];
}

const FullArticleFeed: React.FC<FullArticleFeedProps> = ({ articles }) => {
  // 임시 스타일입니다.
  const sectionStyle: React.CSSProperties = {
    padding: '2rem 1rem',
    backgroundColor: '#ffffff'
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: '1280px',
    margin: '0 auto',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '1.5rem',
    textAlign: 'center',
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '2rem',
  };

  return (
    <section style={sectionStyle}>
      <div style={containerStyle}>
        <h2 style={titleStyle}>모든 아티클 보기</h2>
        <div style={gridStyle}>
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FullArticleFeed;
