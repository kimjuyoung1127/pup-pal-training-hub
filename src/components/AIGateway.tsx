import React from 'react';

const AIGateway: React.FC = () => {
  return (
    <section className="bg-gradient-to-r from-purple-600 to-indigo-600 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 p-8 md:p-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                🐾 우리 아이, 혹시 이런 행동 보이나요?
              </h2>
              <p className="text-gray-600 mb-8">
                AI가 행동의 의미를 분석하고, 전문가의 솔루션을 바탕으로 맞춤 해결책을 찾아드려요.
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                <a 
                  href="/app?problem=separation-anxiety" 
                  className="bg-purple-50 text-purple-700 font-medium py-3 px-4 rounded-lg text-center hover:bg-purple-100 transition-colors"
                >
                  #분리불안
                </a>
                <a 
                  href="/app?problem=house-soiling" 
                  className="bg-purple-50 text-purple-700 font-medium py-3 px-4 rounded-lg text-center hover:bg-purple-100 transition-colors"
                >
                  #배변 실수
                </a>
                <a 
                  href="/app?problem=aggression" 
                  className="bg-purple-50 text-purple-700 font-medium py-3 px-4 rounded-lg text-center hover:bg-purple-100 transition-colors"
                >
                  #공격성
                </a>
                <a 
                  href="/app?problem=excessive-barking" 
                  className="bg-purple-50 text-purple-700 font-medium py-3 px-4 rounded-lg text-center hover:bg-purple-100 transition-colors"
                >
                  #잦은 짖음
                </a>
              </div>
              
              <div className="mt-8">
                <a 
                  href="/app" 
                  className="inline-block bg-purple-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  AI 상담 시작하기
                </a>
              </div>
            </div>
            
            <div className="md:w-1/2 bg-purple-100">
              <img 
                src="https://images.unsplash.com/photo-1544568100-847a948585b9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80" 
                alt="강아지 행동" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIGateway;
