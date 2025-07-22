// AI/src/components/MainLayoutV2.tsx
import React from 'react';
import Header from './Header'; // Header 대신 HeaderV2를 가져옵니다.
import Footer from './Footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayoutV2: React.FC<MainLayoutProps> = ({ children }) => {
  const layoutStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  };

  const mainStyle: React.CSSProperties = {
    flex: 1,
  };

  return (
    <div style={layoutStyle}>
      <Header /> {/* Header 대신 HeaderV2를 사용합니다. */}
      <main style={mainStyle}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayoutV2;
