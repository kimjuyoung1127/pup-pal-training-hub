
import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const OnboardingPage = ({ onComplete }: { onComplete: () => void }) => {
  const { t, i18n } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const slides = [
    {
      icon: '🐕',
      title: t('onboarding.slide1.title'),
      description: t('onboarding.slide1.description'),
      bgGradient: 'from-orange-200 to-cream-200'
    },
    {
      icon: '🤖',
      title: t('onboarding.slide2.title'),
      description: t('onboarding.slide2.description'),
      bgGradient: 'from-cream-200 to-orange-200'
    },
    {
      icon: '📊',
      title: t('onboarding.slide3.title'),
      description: t('onboarding.slide3.description'),
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
      {/* Header with logo and language selector */}
      <div className="flex items-center justify-between pt-12 pb-8 px-8">
        <div className="flex items-center space-x-2">
          <div className="text-2xl">🐾</div>
          <h1 className="text-xl font-bold text-cream-800">{t('appName')}</h1>
        </div>
        <Select onValueChange={changeLanguage} defaultValue={i18n.language}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder={t('onboarding.selectLanguage')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="ko">한국어</SelectItem>
          </SelectContent>
        </Select>
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
          {t('onboarding.prevButton')}
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
          <span>{currentSlide === slides.length - 1 ? t('onboarding.getStarted') : t('onboarding.nextButton')}</span>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default OnboardingPage;
