// AI/src/components/HeaderV2.tsx
import React, { useState, useEffect, useRef } from 'react';

const HeaderV2 = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 메뉴 바깥 영역 클릭 시 메뉴를 닫는 로직
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    // 이벤트 리스너 추가
    document.addEventListener('mousedown', handleClickOutside);
    // 클린업 함수에서 이벤트 리스너 제거
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  // --- 스타일 정의 (이전과 동일) ---
  const navStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e5e7eb',
    position: 'relative',
  };

  const logoStyle: React.CSSProperties = {
    fontSize: '1.75rem',
    fontWeight: 'bold',
    color: '#111827',
  };

  const navLinksStyle: React.CSSProperties = {
    display: 'flex',
    gap: '2rem',
    alignItems: 'center',
  };

  const linkStyle: React.CSSProperties = {
    textDecoration: 'none',
    color: '#374151',
    fontWeight: 600,
    fontSize: '1rem',
    transition: 'color 0.2s',
    cursor: 'pointer',
  };

  const dropdownContainerStyle: React.CSSProperties = {
    position: 'relative',
  };

  const dropdownMenuStyle: React.CSSProperties = {
    position: 'absolute',
    top: '100%',
    left: 0,
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '0.5rem',
    padding: '0.5rem 0',
    marginTop: '0.5rem',
    minWidth: '200px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    display: isMenuOpen ? 'block' : 'none',
    zIndex: 10,
  };

  const dropdownLinkStyle: React.CSSProperties = {
    display: 'block',
    padding: '0.75rem 1.5rem',
    textDecoration: 'none',
    color: '#374151',
    fontSize: '0.95rem',
  };

  return (
    <header style={navStyle}>
      <div style={logoStyle}>
        <a href="/" style={{ ...linkStyle, ...logoStyle }}>Pet-Life</a>
      </div>
      <nav style={navLinksStyle}>
        <a href="/health" style={linkStyle}>건강 정보</a>
        <a href="/training" style={linkStyle}>훈련/행동</a>
        <a href="/nutrition" style={linkStyle}>영양/식단</a>
        <div 
          style={dropdownContainerStyle}
          ref={dropdownRef} // ref를 div에 연결
        >
          <a 
            style={linkStyle} 
            onClick={() => setIsMenuOpen(!isMenuOpen)} // 클릭으로 메뉴 토글
          >
            AI 솔루션 ▼
          </a>
          <div style={dropdownMenuStyle}>
            <a href="/ai/breed-recommender" style={dropdownLinkStyle}>AI 견종 추천</a>
            <a href="/ai/mbti-test" style={dropdownLinkStyle}>견종 MBTI 테스트</a>
            <a href="/breeds" style={dropdownLinkStyle}>견종 백과</a>
            <a href="/app" style={{...dropdownLinkStyle, fontWeight: 'bold', color: '#6366f1'}}>AI 행동 분석</a>
          </div>
        </div>
      </nav>
      <div>
        {/* TODO: 검색창 및 사용자 메뉴 구현 */}
        <input type="text" placeholder="검색..." style={{padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #d1d5db'}} />
      </div>
    </header>
  );
};

export default HeaderV2;
