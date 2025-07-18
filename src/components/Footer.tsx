// AI/src/components/Footer.tsx
import React from 'react';

const Footer = () => {
  // 임시 스타일입니다. 실제 구현 시에는 tailwind-css 등을 사용합니다.
  const footerStyle: React.CSSProperties = {
    backgroundColor: '#1f2937',
    color: '#d1d5db',
    padding: '3rem 2rem',
    marginTop: '4rem',
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: '1280px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '2rem',
  };

  const sectionStyle: React.CSSProperties = {
    flex: '1 1 200px',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '1.125rem',
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: '1rem',
  };

  const linkStyle: React.CSSProperties = {
    display: 'block',
    textDecoration: 'none',
    color: '#9ca3af',
    marginBottom: '0.5rem',
    transition: 'color 0.2s',
  };

  const bottomTextStyle: React.CSSProperties = {
    marginTop: '3rem',
    paddingTop: '2rem',
    borderTop: '1px solid #374151',
    textAlign: 'center',
    fontSize: '0.875rem',
    color: '#9ca3af',
  };

  return (
    <footer style={footerStyle}>
      <div style={containerStyle}>
        <div style={sectionStyle}>
          <h3 style={titleStyle}>Pet-Life Magazine</h3>
          <p style={{fontSize: '0.9rem', color: '#9ca3af'}}>
            반려동물의 행복한 삶을 위한 모든 정보. Pet-Life가 함께합니다.
          </p>
        </div>
        <div style={sectionStyle}>
          <h3 style={titleStyle}>콘텐츠</h3>
          <a href="/health" style={linkStyle}>건강 정보</a>
          <a href="/training" style={linkStyle}>훈련/행동</a>
          <a href="/nutrition" style={linkStyle}>영양/식단</a>
        </div>
        <div style={sectionStyle}>
          <h3 style={titleStyle}>AI 솔루션</h3>
          <a href="/ai/breed-recommender" style={linkStyle}>AI 견종 추천</a>
          <a href="/ai/mbti-test" style={linkStyle}>견종 MBTI 테스트</a>
          <a href="/breeds" style={linkStyle}>견종 백과</a>
          <a href="/app" style={linkStyle}>AI 행동 분석</a>
        </div>
        <div style={sectionStyle}>
          <h3 style={titleStyle}>회사</h3>
          <a href="/about" style={linkStyle}>About Us</a>
          <a href="/contact" style={linkStyle}>Contact</a>
          <a href="/privacy" style={linkStyle}>Privacy Policy</a>
          <a href="/terms" style={linkStyle}>Terms of Service</a>
        </div>
      </div>
      <div style={bottomTextStyle}>
        <p>&copy; {new Date().getFullYear()} Pet-Life. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;