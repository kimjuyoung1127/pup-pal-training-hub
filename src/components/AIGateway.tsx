// AI/src/components/AIGateway.tsx
import React from 'react';

const AIGateway: React.FC = () => {
  // 임시 스타일입니다.
  const sectionStyle: React.CSSProperties = {
    backgroundColor: '#4f46e5',
    color: 'white',
    padding: '4rem 2rem',
    textAlign: 'center',
    margin: '4rem 0',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '2.5rem',
    fontWeight: 'bold',
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: '1.2rem',
    marginTop: '1rem',
    opacity: 0.9,
    maxWidth: '600px',
    margin: '1rem auto 0',
  };

  const buttonContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '1rem',
    marginTop: '2.5rem',
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: 'white',
    color: '#4f46e5',
    fontWeight: 'bold',
    padding: '0.75rem 1.5rem',
    borderRadius: '9999px',
    textDecoration: 'none',
    transition: 'background-color 0.2s',
  };

  return (
    <section style={sectionStyle}>
      <h2 style={titleStyle}>🐾 우리 아이, 혹시 이런 행동 보이나요?</h2>
      <p style={subtitleStyle}>AI가 행동의 의미를 분석하고, 전문가의 솔루션을 바탕으로 맞춤 해결책을 찾아드려요.</p>
      <div style={buttonContainerStyle}>
        <a href="/app?problem=separation-anxiety" style={buttonStyle}>#분리불안</a>
        <a href="/app?problem=house-soiling" style={buttonStyle}>#배변 실수</a>
        <a href="/app?problem=aggression" style={buttonStyle}>#공격성</a>
        <a href="/app?problem=excessive-barking" style={buttonStyle}>#잦은 짖음</a>
      </div>
    </section>
  );
};

export default AIGateway;
