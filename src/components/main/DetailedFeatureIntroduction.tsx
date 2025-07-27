"use client";

import React from 'react';
import { BrainCircuit, Dog, Sparkles, BookOpenCheck } from 'lucide-react';

const features = [
  {
    id: 1,
    title: 'AI 견종 분석 & 추천',
    description:
      '나의 라이프스타일, 성향과 환경에 완벽하게 맞는 견종을 AI가 과학적으로 분석하고 추천합니다. 더 이상 잘못된 정보에 의존하지 마세요. 데이터가 운명의 파트너를 찾아드립니다.',
    Icon: Dog,
    image_path: '/features/1.png',
  },
  {
    id: 2,
    title: 'AI 행동 및 심리 분석',
    description:
      'YOLOv8 기술로 반려견의 관절 움직임까지 감지하는 AI가 행동의 숨은 의미를 정확히 해석합니다. 강아지 MBTI 테스트로 내면의 성향을 파악하고 더 깊은 유대감을 형성하세요.',
    Icon: BrainCircuit,
    image_path: '/features/2.png',
  },
  {
    id: 3,
    title: 'AI 기반 맞춤형 콘텐츠',
    description:
      '당신의 관심사와 반려견의 품종, 나이, 건강 상태에 맞춰 AI가 매일 맞춤형 아티클과 팁을 제공합니다. 넘쳐나는 정보 속에서 헤매지 말고, 나에게 꼭 필요한 지식만 얻으세요.',
    Icon: Sparkles,
    image_path: '/features/3.png',
  },
  {
    id: 4,
    title: '신뢰도 높은 전문가 매거진',
    description:
      '모든 콘텐츠는 수의사와 훈련 전문가의 검수를 거칩니다. AI의 기술력과 전문가의 신뢰도를 결합하여, 당신의 반려 생활을 가장 정확하고 안전한 길로 안내합니다.',
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
        <p className="text-slate-600 text-lg leading-relaxed">
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
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
            Pet-Life, AI로 완성하는 반려 생활
          </h2>
          <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
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
