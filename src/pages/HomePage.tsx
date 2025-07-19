
// AI/src/pages/HomePage.tsx
import React from 'react';
import { mockArticles } from '@/lib/mock-data';
import CategorizedFeed from '../components/CategorizedFeed';
import AIGateway from '../components/AIGateway';
import HeroSection from '../components/HeroSection';
import FullArticleFeed from '../components/FullArticleFeed';

const HomePage: React.FC = () => {
  // 목업 데이터에서 카테고리별로 아티클을 필터링합니다.
  const healthArticles = mockArticles.filter(a => a.category === '건강 정보').slice(0, 3);
  const trainingArticles = mockArticles.filter(a => a.category === '훈련/행동').slice(0, 3);
  const nutritionArticles = mockArticles.filter(a => a.category === '영양/식단').slice(0, 3);
  const petTechArticles = mockArticles.filter(a => a.tags.includes('펫테크')).slice(0, 3);

  return (
    <div className="bg-gray-50 min-h-screen">
      <HeroSection />
      
      {/* 인기 카테고리 바로가기 */}
      <div className="max-w-7xl mx-auto py-8 px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">인기 카테고리</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a href="/health" className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center transition-transform hover:translate-y-[-5px]">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">🩺</span>
            </div>
            <span className="font-medium text-gray-800">건강 정보</span>
          </a>
          <a href="/training" className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center transition-transform hover:translate-y-[-5px]">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">🦮</span>
            </div>
            <span className="font-medium text-gray-800">훈련/행동</span>
          </a>
          <a href="/nutrition" className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center transition-transform hover:translate-y-[-5px]">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">🍖</span>
            </div>
            <span className="font-medium text-gray-800">영양/식단</span>
          </a>
          <a href="/tech" className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center transition-transform hover:translate-y-[-5px]">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">📱</span>
            </div>
            <span className="font-medium text-gray-800">펫테크</span>
          </a>
        </div>
      </div>

      {/* 카테고리별 피드 */}
      <div className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <CategorizedFeed title="최신 건강 정보" articles={healthArticles} />
        </div>
      </div>
      
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <CategorizedFeed title="전문가의 훈련/행동 팁" articles={trainingArticles} />
        </div>
      </div>
      
      <AIGateway />

      <div className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <CategorizedFeed title="주목할 만한 펫테크" articles={petTechArticles} />
        </div>
      </div>
      
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <CategorizedFeed title="똑똑한 영양/식단 가이드" articles={nutritionArticles} />
        </div>
      </div>

      {/* 전체 아티클 피드 */}
      <div className="bg-white py-10">
        <div className="max-w-7xl mx-auto px-4">
          <FullArticleFeed articles={mockArticles} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
