// AI/src/components/MainLayoutV2.tsx
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import WoofpediaBottomNav from './WoofpediaBottomNav';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayoutV2: React.FC<MainLayoutProps> = ({ children }) => {
  const layoutStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100dvh',
    backgroundColor: '#F9FAFB',
    overflowX: 'hidden',
    width: '100%',
    maxWidth: '100vw',
    position: 'fixed', // 고정 위치로 설정
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  };

  const mainStyle: React.CSSProperties = {
    flex: 1,
    paddingBottom: '5rem',
    overflowX: 'hidden',
    overflowY: 'auto', // 세로 스크롤만 허용
    width: '100%',
    WebkitOverflowScrolling: 'touch', // iOS 부드러운 스크롤
  };

  return (
    <div style={layoutStyle}>
      <Header />
      <main style={mainStyle}>
        {children}
      </main>
      <Footer />
      <WoofpediaBottomNav />
    </div>
  );
};

export default MainLayoutV2;
