import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const HeroSection: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const highResImageSrc = "/hero/images/1.png";
  const lowResImageSrc = "/hero/images/1-placeholder.png"; // 가정: 작고 흐린 버전의 이미지

  useEffect(() => {
    const img = new Image();
    img.src = highResImageSrc;
    img.onload = () => {
      setIsLoaded(true);
    };
  }, [highResImageSrc]);

  return (
    <section className="relative h-[75vh] min-h-[500px] w-full flex items-center justify-center text-center text-white overflow-hidden">
      {/* Background Image Container */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${lowResImageSrc})` }}
      >
        <img 
          src={highResImageSrc}
          alt="행복한 강아지와 주인" 
          className={`w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
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