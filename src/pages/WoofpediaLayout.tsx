
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const WoofpediaLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      {/* 우프피디아 서브 네비게이션 */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex overflow-x-auto py-4 scrollbar-hide">
            <a href="/woofpedia/breeds" className="whitespace-nowrap px-5 py-2 rounded-full bg-blue-50 text-blue-600 font-medium mr-3 hover:bg-blue-100 transition-colors">
              견종 백과
            </a>
            <a href="/woofpedia/health" className="whitespace-nowrap px-5 py-2 rounded-full text-gray-600 font-medium mr-3 hover:bg-gray-100 transition-colors">
              건강 정보
            </a>
            <a href="/woofpedia/training" className="whitespace-nowrap px-5 py-2 rounded-full text-gray-600 font-medium mr-3 hover:bg-gray-100 transition-colors">
              훈련/행동
            </a>
            <a href="/woofpedia/nutrition" className="whitespace-nowrap px-5 py-2 rounded-full text-gray-600 font-medium mr-3 hover:bg-gray-100 transition-colors">
              영양/식단
            </a>
            <a href="/woofpedia/lifestyle" className="whitespace-nowrap px-5 py-2 rounded-full text-gray-600 font-medium mr-3 hover:bg-gray-100 transition-colors">
              라이프스타일
            </a>
            <a href="/woofpedia/tech" className="whitespace-nowrap px-5 py-2 rounded-full text-gray-600 font-medium hover:bg-gray-100 transition-colors">
              펫테크
            </a>
          </nav>
        </div>
      </div>
      
      <main className="flex-grow">
        <Outlet /> {/* 여기에 각 페이지의 내용이 렌더링됩니다. */}
      </main>
      
      <Footer />
    </div>
  );
};

export default WoofpediaLayout;
