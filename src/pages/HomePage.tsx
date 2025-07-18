
// AI/src/pages/HomePage.tsx
import React from 'react';
import { mockArticles } from '@/lib/mock-data';
import CategorizedFeed from '../components/CategorizedFeed';
import AIGateway from '../components/AIGateway';
import HeroSection from '../components/HeroSection';
import FullArticleFeed from '../components/FullArticleFeed'; // FullArticleFeed 컴포넌트를 임포트합니다.

const HomePage: React.FC = () => {
  // 목업 데이터에서 카테고리별로 아티클을 필터링합니다.
  const healthArticles = mockArticles.filter(a => a.category === '건강 정보').slice(0, 3);
  const trainingArticles = mockArticles.filter(a => a.category === '훈련/행동').slice(0, 3);
  const nutritionArticles = mockArticles.filter(a => a.category === '영양/식단').slice(0, 3);
  const petTechArticles = mockArticles.filter(a => a.tags.includes('펫테크')).slice(0, 3);

  // 임시 스타일입니다.
  const pageStyle: React.CSSProperties = {
    backgroundColor: '#f9fafb',
  };

  return (
    <div style={pageStyle}>
      <HeroSection />

      {/* 카테고리별 피드 */}
      <CategorizedFeed title="최신 건강 정보" articles={healthArticles} />
      <CategorizedFeed title="전문가의 훈련/행동 팁" articles={trainingArticles} />
      
      <AIGateway />

      {/* '주목할 만한 펫테크' 특집 섹션 */}
      <CategorizedFeed title="주목할 만한 펫테크" articles={petTechArticles} />
      <CategorizedFeed title="똑똑한 영양/식단 가이드" articles={nutritionArticles} />

      {/* 전체 아티클 피드 */}
      <FullArticleFeed articles={mockArticles} />
    </div>
  );
};

export default HomePage;
