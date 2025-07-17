
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const WoofpediaLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow">
        <Outlet /> {/* 여기에 각 페이지의 내용이 렌더링됩니다. */}
      </main>
      <Footer />
    </div>
  );
};

export default WoofpediaLayout;
