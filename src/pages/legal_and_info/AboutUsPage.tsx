import React from 'react';

const AboutUsPage: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* 헤더 이미지 */}
          <div className="h-64 bg-blue-600 relative">
            <img 
              src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80" 
              alt="반려동물과 함께하는 삶" 
              className="w-full h-full object-cover opacity-75"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <h1 className="text-4xl font-bold text-white drop-shadow-lg">서비스 소개</h1>
            </div>
          </div>
          
          {/* 콘텐츠 */}
          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">멍멍트레이너란?</h2>
              <p className="text-gray-600 leading-relaxed">
                멍멍트레이너는 반려견과 함께 성장하는 AI 서비스입니다.
                반려견의 건강과 행동을 위해 AI 기능을 활용한 다양한 기능을 제공합니다.
              </p>
            </div>
            
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">우리의 미션</h2>
              <p className="text-gray-600 leading-relaxed">
                모든 반려견과 보호자가 더 행복하고 건강한 삶을 살 수 있도록 돕는 것이 우리의 미션입니다.
                최신 AI 기술을 활용하여 맞춤형 솔루션을 제공하고, 반려견의 행동과 건강에 대한 이해를 높이는 데 기여합니다.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl">🔍</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">전문적인 정보</h3>
                <p className="text-gray-600">수의사와 행동 전문가가 검증한 정보를 제공합니다.</p>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl">🤖</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">AI 솔루션</h3>
                <p className="text-gray-600">인공지능 기술로 반려견의 행동을 분석하고 맞춤형 솔루션을 제공합니다.</p>
              </div>
              
              <div className="bg-purple-50 p-6 rounded-lg">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl">💖</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">커뮤니티</h3>
                <p className="text-gray-600">반려인들이 경험과 지식을 나눌 수 있는 커뮤니티를 지원합니다.</p>
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">함께하는 팀</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                멍멍트레이너는 반려동물을 사랑하는 개발자, 수의사, 행동 전문가, 디자이너들이 모여 만들었습니다.
                우리는 모든 반려견이 행복한 삶을 살 수 있도록 최선을 다하고 있습니다.
              </p>
              
              <div className="flex justify-center">
                <a href="/contact" className="inline-block bg-blue-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors">
                  문의하기
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;