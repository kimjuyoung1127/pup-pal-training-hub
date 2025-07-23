import React from 'react';
import { PawPrint, BrainCircuit, HeartHandshake, Search, Bone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const FeatureDetail = ({ icon, title, subtitle, description, image, imageAlt, reverse = false }) => (
  <div className={`flex flex-col lg:flex-row items-start gap-12 lg:gap-20 ${reverse ? 'lg:flex-row-reverse' : ''}`}>
    <div className="lg:w-1/2 rounded-2xl shadow-lg overflow-hidden aspect-[4/3] bg-white">
      <img src={image} alt={imageAlt} className="w-full h-full object-contain" />
    </div>
    <div className="lg:w-1/2">
      <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-amber-100 rounded-full">
        {icon}
      </div>
      <h3 className="text-3xl font-bold text-slate-800 mb-4">{title}</h3>
      <p className="text-amber-600 font-semibold mb-6">{subtitle}</p>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
  </div>
);

export const DetailedFeatureIntroduction = () => {
  return (
    <section id="features" className="w-full py-20 lg:py-32 bg-cream-50">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-20">
          <div className="inline-block rounded-lg bg-cream-200 px-4 py-2 text-sm text-amber-700 font-semibold">
            Mung-AI의 약속
          </div>
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl text-slate-800">
            단순한 앱을 넘어, 든든한 파트너로
          </h2>
          <p className="max-w-3xl text-lg text-slate-600">
            Mung-AI는 어렵고 막막한 반려 생활의 모든 순간에, 데이터와 진심을 담아 가장 현명한 길을 안내합니다.
            우리가 어떻게 그 약속을 지키는지 확인해보세요.
          </p>
        </div>

        {/* Features Details */}
        <div className="space-y-24">
          <FeatureDetail
            icon={<Search className="w-8 h-8 text-amber-600" />}
            title="AI 견종 추천: 운명의 파트너 찾기"
            subtitle="“어떤 아이를 데려와야 할지 막막해요”"
            description="수백 종의 강아지, 저마다 다른 성격과 필요조건. Mung-AI의 AI 견종 추천은 당신의 라이프스타일, 환경, 성향을 정밀하게 분석하여 평생을 함께할 가장 이상적인 반려견을 찾아줍니다. 더 이상 추측에 의존하지 마세요. 데이터가 당신의 완벽한 시작을 도와드립니다."
            image="https://images.unsplash.com/photo-1529429617124-95b109e86bb8?q=80&w=1935&auto=format&fit=crop"
            imageAlt="다양한 강아지들 중에서 선택을 고민하는 모습"
          />

          <FeatureDetail
            icon={<PawPrint className="w-8 h-8 text-amber-600" />}
            title="강아지 MBTI: 마음을 여는 열쇠"
            subtitle="“우리 아이, 도대체 왜 이러는 걸까요?”"
            description="말 못 하는 반려견의 행동에는 숨겨진 성격과 이유가 있습니다. Mung-AI가 개발한 강아지 MBTI는 과학적인 분석을 통해 반려견의 타고난 기질과 성향을 16가지 유형으로 알려줍니다. 우리 아이의 진짜 마음을 이해하고, 더 깊은 유대감을 형성하는 첫걸음이 될 거예요."
            image="https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?q=80&w=1974&auto=format&fit=crop"
            imageAlt="주인과 교감하는 강아지"
            reverse={true}
          />

          <FeatureDetail
            icon={<BrainCircuit className="w-8 h-8 text-amber-600" />}
            title="AI 행동 분석: 문제의 본질을 해결"
            subtitle="“짖고, 물고... 어떻게 해야 할지 모르겠어요”"
            description="문제 행동에는 반드시 원인이 있습니다. Mung-AI의 행동 분석 시스템은 수의학과 동물행동학 전문가들의 지식을 학습한 AI가 영상과 설문을 통해 문제의 핵심을 파악하고, 맞춤형 훈련 솔루션을 제공합니다. 이제 혼자 끙끙 앓지 말고, 전문가의 지혜를 빌려보세요."
            image="https://images.unsplash.com/photo-1587300003388-59208cc962cb?q=80&w=2070&auto=format&fit=crop"
            imageAlt="훈련받는 강아지"
          />
        </div>

        {/* Final CTA */}
        <div className="text-center mt-24">
            <h3 className="text-3xl font-bold text-slate-800 mb-4">이제, Mung-AI와 함께 시작할 시간</h3>
            <p className="max-w-2xl mx-auto text-slate-600 mb-8 leading-relaxed">
                최고의 전문가들이 설계한 지식과 최첨단 AI의 만남.<br />
                당신의 반려 생활을 혁신할 모든 준비가 끝났습니다.
            </p>
            <Link to="/app">
                <Button size="lg" className="bg-amber-500 text-slate-900 font-bold hover:bg-amber-400 transition-transform duration-300 ease-in-out hover:scale-105 text-lg px-10 py-7 rounded-full shadow-lg">
                    내 반려견 프로필 만들고 시작하기
                </Button>
            </Link>
        </div>
      </div>
    </section>
  );
};
