import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const HeroSection: React.FC = () => {
  return (
    <section className="relative h-[60vh] min-h-[400px] md:h-[70vh] lg:h-[80vh] w-full flex items-center justify-center text-center text-white">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/hero/images/1.png" 
          alt="행복한 강아지와 주인" 
          className="w-full h-full object-cover"
        />
        {/* Soft overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/30 to-transparent"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-4 animate-fade-in-up">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.6)' }}>
          함께하는 모든 순간이<br />더 특별해지도록
        </h1>
        <p className="max-w-2xl text-lg md:text-xl lg:text-2xl mb-8 text-slate-100" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.7)' }}>
          전문가의 지식과 AI 기술을 결합하여<br />당신과 반려견의 삶에 최고의 가이드를 제공합니다.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/app">
            <Button 
              size="lg" 
              variant="outline"
              className="bg-white/10 text-white border-2 border-white hover:bg-white/20 backdrop-blur-sm transition-all duration-300 text-lg px-8 py-6 rounded-full shadow-lg w-full sm:w-auto"
            >
              AI 분석 시작하기
            </Button>
          </Link>
          <a href="#features">
            <Button 
              size="lg" 
              variant="outline"
              className="bg-white/10 text-white border-2 border-white hover:bg-white/20 backdrop-blur-sm transition-all duration-300 text-lg px-8 py-6 rounded-full shadow-lg w-full sm:w-auto"
            >
              핵심 기능 알아보기
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;