
import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Heart, BookOpen, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSwipeable } from 'react-swipeable';

const OnboardingPage = ({ onComplete }: { onComplete: () => void }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      icon: '🐕',
      title: '안녕하세요!\n멍멍트레이너입니다',
      description: '반려견과 함께하는 특별한 훈련 여정을\n시작해보세요',
      bgGradient: 'from-sky-100 to-sky-200'
    },
    {
      icon: '🤖',
      title: 'AI 맞춤 훈련\n추천받기',
      description: '우리 강아지만을 위한\n특별한 훈련 계획을 만들어드려요',
      bgGradient: 'from-sky-200 to-sky-100'
    },
    {
      icon: '📊',
      title: '성장하는 모습을\n기록하기',
      description: '매일매일 발전하는 우리 강아지의\n성장 과정을 함께 추적해요',
      bgGradient: 'from-sky-100 to-sky-300'
    }
  ];

  const nextSlide = () => {
    console.log('nextSlide function called. Current slide:', currentSlide);
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      console.log('Last slide. Calling onComplete...');
      onComplete();
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => nextSlide(),
    onSwipedRight: () => prevSlide(),
    preventScrollOnSwipe: true,
    trackMouse: true
  });

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-sky-50 to-sky-100">
      {/* Header with logo */}
      <div className="flex items-center justify-center pt-12 pb-8">
        <div className="flex items-center space-x-2">
          <div className="text-2xl">🐾</div>
          <h1 className="text-xl font-bold text-sky-800">멍멍트레이너</h1>
        </div>
      </div>

      {/* Slides container */}
      <div {...handlers} className="flex-1 relative overflow-hidden">
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
                <h2 className="text-2xl md:text-3xl font-bold text-sky-800 mb-6 leading-tight whitespace-pre-line">
                  {slide.title}
                </h2>
                <p className="text-lg text-sky-700 leading-relaxed whitespace-pre-line max-w-md">
                  {slide.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between p-4 md:p-8">
        {/* Previous button */}
        <Button
          size="icon"
          variant="ghost"
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="text-sky-600 hover:text-sky-800 disabled:opacity-30"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>

        {/* Page indicators */}
        <div className="flex space-x-2">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentSlide 
                  ? 'bg-sky-500 scale-125' 
                  : 'bg-sky-200'
              }`}
            />
          ))}
        </div>

        {/* Next/Start button */}
        <Button
          size="icon"
          onClick={nextSlide}
          className="bg-sky-600 hover:bg-sky-700 text-white"
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>
      
      {/* Bottom action button for the last slide */}
      {currentSlide === slides.length - 1 && (
        <div className="p-4 md:p-8">
          <Button
            onClick={onComplete}
            className="w-full bg-sky-600 hover:bg-sky-700 text-white py-4 text-lg"
          >
            시작하기
          </Button>
        </div>
      )}
    </div>
  );
};

export default OnboardingPage;
