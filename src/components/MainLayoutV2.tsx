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
  };

  const mainStyle: React.CSSProperties = {
    flex: 1,
    paddingBottom: '5rem',
    overflowX: 'hidden',
    width: '100%',
    WebkitOverflowScrolling: 'touch',
  };

  return (
    <div style={layoutStyle}>
      <Header />
      <main style={mainStyle}>
        {children}
        <Footer />
      </main>
      <WoofpediaBottomNav />
    </div>
  );
};

export default MainLayoutV2;
