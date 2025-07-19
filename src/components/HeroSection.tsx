// AI/src/components/HeroSection.tsx
import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <section className="relative py-16 md:py-24">
      <div className="absolute inset-0 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1950&q=80" 
          alt="반려동물 배경" 
          className="w-full h-full object-cover"
        />
        {/* 텍스트 가독성을 위한 어두운 오버레이 추가 */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-10 md:mb-0 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 text-shadow-lg">
            반려동물의 행복한 삶,<br />Pet-Life와 함께
          </h1>
          <p className="text-xl text-white mb-8 text-shadow">
            신뢰할 수 있는 정보와 AI 솔루션으로<br />최고의 반려 생활을 만들어가세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <a href="/ai/breed-recommender" className="bg-white text-blue-600 font-medium py-3 px-6 rounded-lg hover:bg-blue-50 transition-colors">
              AI 견종 추천 받기
            </a>
            <a href="/app" className="bg-transparent border-2 border-white text-white font-medium py-3 px-6 rounded-lg hover:bg-white/10 transition-colors">
              AI 행동 분석 시작하기
            </a>
          </div>
        </div>
        
        <div className="md:w-1/2">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">빠른 검색</h2>
            <div className="flex flex-col gap-4">
              <div>
                <label htmlFor="pet-type" className="block text-sm font-medium text-gray-700 mb-1">반려동물 종류</label>
                <select id="pet-type" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="dog">강아지</option>
                  <option value="cat">고양이</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">카테고리</label>
                <select id="category" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="health">건강 정보</option>
                  <option value="training">훈련/행동</option>
                  <option value="nutrition">영양/식단</option>
                  <option value="lifestyle">라이프스타일</option>
                </select>
              </div>
              
              <button className="bg-blue-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors">
                검색하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
