import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const HeroSection: React.FC = () => {
  // 준비된 이미지 경로에 맞게 변수 업데이트
  const highResImageDesktop = "/hero/images/1-desktop.png";
  const highResImageMobile = "/hero/images/1-mobile.webp";
  const lowResImagePlaceholder = "/hero/images/1-placeholder.png";

  return (
    <section className="relative h-[75vh] min-h-[500px] w-full flex items-center justify-center text-center text-white overflow-hidden">
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0">
        {/* 저해상도 플레이스홀더 이미지: 흐릿한 배경을 즉시 보여줌 */}
        <img
          src={lowResImagePlaceholder}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover"
        />
        {/* picture 태그로 반응형 이미지 최적화 */}
        <picture className="absolute inset-0">
          {/* 모바일용 WebP 이미지 소스 (768px 이하) */}
          <source media="(max-width: 768px)" srcSet={highResImageMobile} type="image/webp" />
          {/* 데스크톱용 PNG 이미지 소스 (769px 이상) */}
          <source media="(min-width: 769px)" srcSet={highResImageDesktop} type="image/png" />
          {/* 기본 이미지 (picture 미지원 브라우저 또는 기본값) */}
          <img
            src={highResImageDesktop}
            alt="행복한 강아지와 주인"
            loading="eager"
            fetchPriority="high"
            className="w-full h-full object-cover absolute inset-0 transition-opacity duration-700 ease-in-out opacity-0"
            onLoad={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
          />
        </picture>
      </div>
      {/* Solid overlay for perfect text readability */}
      <div className="absolute inset-0 bg-black/50"></div>
      
      {/* Content */}
      <motion.div 
        className="relative z-10 flex flex-col items-center px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4">
          AI와 함께하는 반려생활, Mung-Ai
        </h1>
        <p className="max-w-3xl text-lg md:text-xl text-slate-200 mb-8 break-keep">
          AI와 함께 당신의 반려 생활을 가장 완벽한 순간으로 만듭니다.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/app">
            <Button 
              size="lg" 
              className="bg-amber-500 text-slate-900 font-bold hover:bg-amber-400 transition-transform duration-300 ease-in-out hover:scale-105 text-lg px-10 py-7 rounded-full shadow-lg w-full sm:w-auto"
            >
              AI 솔루션 시작하기
            </Button>
          </Link>
          <a href="#features">
            <Button 
              size="lg" 
              variant="outline"
              className="bg-transparent text-white border-2 border-white hover:bg-white/20 backdrop-blur-sm transition-all duration-300 text-lg px-8 py-6 rounded-full shadow-lg w-full sm:w-auto"
            >
              핵심 기능 둘러보기
            </Button>
          </a>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
