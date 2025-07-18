// AI/src/components/HeroSection.tsx
import React from 'react';

const HeroSection: React.FC = () => {
  // 임시 스타일입니다.
  const heroStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '4rem 2rem',
    backgroundColor: '#eef2ff',
  };

  const heroTitleStyle: React.CSSProperties = {
    fontSize: '3rem',
    fontWeight: 'bold',
    color: '#1f2937',
  };

  const heroSubtitleStyle: React.CSSProperties = {
    fontSize: '1.25rem',
    color: '#4b5563',
    marginTop: '1rem',
    maxWidth: '600px',
    margin: '1rem auto 0',
  };

  return (
    <section style={heroStyle}>
      <h1 style={heroTitleStyle}>반려동물의 행복한 삶, Pet-Life와 함께</h1>
      <p style={heroSubtitleStyle}>신뢰할 수 있는 정보와 AI 솔루션으로 최고의 반려 생활을 만들어가세요.</p>
    </section>
  );
};

export default HeroSection;
