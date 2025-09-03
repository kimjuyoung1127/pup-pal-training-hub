"use client";

import React from 'react';
import { BrainCircuit, Dog, Sparkles, BookOpenCheck } from 'lucide-react';

const features = [
  {
    id: 1,
    title: 'AI 견종 분석 & 추천',
    description:
      '나의 라이프스타일, 성향과 환경에 완벽하게 맞는 솔루션을 AI가 과학적으로 분석하고 추천합니다.',
    Icon: Dog,
    image_path: '/features/1.png',
  },
  {
    id: 2,
    title: 'AI 자세 추적',
    description:
      '최신 AI 기술로 반려견의 관절 움직임까지 감지하는 AI가 자세를 정확히 분석합니다. 반려견의 자세를 실시간으로 모니터링해보세요.',
    Icon: BrainCircuit,
    image_path: '/features/2.png',
  },
  {
    id: 3,
    title: 'AI 훈련 챗봇',
    description:
      'AI 코치와 대화를 나누며 고민을 상담하고,반려견의 훈련을 도와드립니다.',

    Icon: Sparkles,
    image_path: '/features/3.png',
  },
  {
    id: 4,
    title: '초개인화된 사료 구독 시스템',
    description:
      '반려견의 성향과 필요에 맞춘 사료를 구독하세요. AI가 분석한 데이터를 바탕으로 최적의 사료를 추천합니다.',

    Icon: BookOpenCheck,
    image_path: '/features/4.png',
  },
];

const FeatureSection = ({ feature, index }) => {
  const isReversed = index % 2 !== 0;

  return (
    <div className={`grid md:grid-cols-2 gap-12 md:gap-16 items-center`}>
      <div className={`rounded-2xl overflow-hidden shadow-lg aspect-[4/3] ${isReversed ? 'md:order-last' : ''}`}>
        <img
          src={feature.image_path}
          alt={feature.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-4 mb-4">
          <feature.Icon className="w-10 h-10 text-amber-500 flex-shrink-0" />
          <h3 className="text-3xl font-bold text-slate-900">{feature.title}</h3>
        </div>
        <p className="text-slate-600 text-lg leading-relaxed break-keep">
          {feature.description}
        </p>
      </div>
    </div>
  );
};

export const DetailedFeatureIntroduction = () => {
  return (
    <section id="features" className="w-full py-24 md:py-32 bg-cream-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 break-keep">
            Mung-Ai, AI로 완성하는 반려 생활
          </h2>
          <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto break-keep">
            단순 정보 제공을 넘어, AI 기술로 당신의 반려 생활에 실질적인 도움을 드립니다.
          </p>
        </div>
        
        <div className="space-y-24">
          {features.map((feature, index) => (
            <FeatureSection key={feature.id} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
