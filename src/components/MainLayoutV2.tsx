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
    minHeight: '100vh',
    backgroundColor: '#F9FAFB', // bg-gray-50
  };

  const mainStyle: React.CSSProperties = {
    flex: 1,
    paddingBottom: '5rem', // pb-20
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
