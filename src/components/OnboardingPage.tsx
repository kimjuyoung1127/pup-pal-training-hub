
import React, { useState } from 'react';
import { ChevronRight, Heart, BookOpen, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const OnboardingPage = ({ onComplete }: { onComplete: () => void }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      icon: '🐕',
      title: '안녕하세요!\n멍멍트레이너입니다',
      description: '반려견과 함께하는 특별한 훈련 여정을\n시작해보세요',
      bgGradient: 'from-orange-200 to-cream-200'
    },
    {
      icon: '🤖',
      title: 'AI 맞춤 훈련\n추천받기',
      description: '우리 강아지만을 위한\n특별한 훈련 계획을 만들어드려요',
      bgGradient: 'from-cream-200 to-orange-200'
    },
    {
      icon: '📊',
      title: '성장하는 모습을\n기록하기',
      description: '매일매일 발전하는 우리 강아지의\n성장 과정을 함께 추적해요',
      bgGradient: 'from-orange-100 to-cream-300'
    }
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-cream-50 to-orange-50">
      {/* Header with logo */}
      <div className="flex items-center justify-center pt-12 pb-8">
        <div className="flex items-center space-x-2">
          <div className="text-2xl">🐾</div>
          <h1 className="text-xl font-bold text-cream-800">멍멍트레이너</h1>
        </div>
      </div>

      {/* Slides container */}
      <div className="flex-1 relative overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-out h-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div key={index} className="w-full flex-shrink-0 px-8">
              <div className={`h-full flex flex-col justify-center items-center text-center bg-gradient-to-br ${slide.bgGradient} rounded-3xl mx-4 p-8 shadow-lg`}>
                <div className="text-8xl mb-8 animate-bounce-gentle">
                  {slide.icon}
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-cream-800 mb-6 leading-tight whitespace-pre-line">
                  {slide.title}
                </h2>
                <p className="text-lg text-cream-700 leading-relaxed whitespace-pre-line max-w-md">
                  {slide.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between p-8">
        {/* Previous button */}
        <Button
          variant="ghost"
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="text-cream-600 hover:text-cream-800 disabled:opacity-30"
        >
          이전
        </Button>

        {/* Page indicators */}
        <div className="flex space-x-2">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentSlide 
                  ? 'bg-orange-500 scale-125' 
                  : 'bg-cream-300'
              }`}
            />
          ))}
        </div>

        {/* Next/Start button */}
        <Button
          onClick={nextSlide}
          className="btn-primary flex items-center space-x-2"
        >
          <span>{currentSlide === slides.length - 1 ? '시작하기' : '다음'}</span>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default OnboardingPage;
