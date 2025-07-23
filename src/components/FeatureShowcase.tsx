import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket, TestTube2, BrainCircuit } from 'lucide-react';

const FeatureCard = ({ icon, title, description, link, linkText }: { icon: React.ReactNode, title: string, description: string, link: string, linkText: string }) => (
  <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col text-center items-center">
    <div className="bg-indigo-100 p-4 rounded-full mb-6">
      {icon}
    </div>
    <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-600 mb-6 flex-grow">{description}</p>
    <Link to={link} className="font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
      {linkText} &rarr;
    </Link>
  </div>
);

const FeatureShowcase = () => {
  const features = [
    {
      icon: <Rocket size={32} className="text-indigo-600" />,
      title: 'AI 견종 추천',
      description: '나의 라이프스타일에 꼭 맞는 운명의 반려견을 찾아보세요.',
      link: '/ai/breed-recommender',
      linkText: '나에게 맞는 견종 찾기'
    },
    {
      icon: <TestTube2 size={32} className="text-indigo-600" />,
      title: '견종 MBTI 테스트',
      description: '과학적인 성격 유형 분석으로 반려견의 진짜 속마음을 알아보세요.',
      link: '/ai/mbti-test',
      linkText: '우리 아이 MBTI 테스트'
    },
    {
      icon: <BrainCircuit size={32} className="text-indigo-600" />,
      title: 'AI 행동 분석',
      description: '꼬리 흔들기부터 으르렁까지, 반려견의 행동 신호를 정확히 이해하세요.',
      link: '/app',
      linkText: '행동의 의미 분석하기'
    }
  ];

  return (
    <section className="bg-gray-50 py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Mung-AI, 데이터로 반려 생활의 모든 순간을 함께합니다.</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            AI가 당신의 라이프스타일과 반려견의 성향을 분석하여, 오해는 줄이고 행복은 더하는 맞춤 솔루션을 제안합니��.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map(feature => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureShowcase;
