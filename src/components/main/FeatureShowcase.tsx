import { BrainCircuit, Dog, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  {
    icon: <Dog className="h-8 w-8 text-primary" />,
    title: 'AI 견종 추천',
    description: '몇 가지 질문에 답하면, 라이프스타일에 꼭 맞는 견종을 AI가 찾아드립니다.',
    link: '/filter-wizard',
    cta: '나에게 맞는 견종은?',
  },
  {
    icon: <Sparkles className="h-8 w-8 text-primary" />,
    title: '강아지 MBTI',
    description: '우리 강아지는 어떤 성격일까요? 재미있는 MBTI 테스트로 반려견을 더 깊이 이해해보세요.',
    link: '/mbti-test',
    cta: '내 강아지 MBTI 테스트',
  },
  {
    icon: <BrainCircuit className="h-8 w-8 text-primary" />,
    title: 'AI 행동 분석',
    description: '행동 전문가의 시선으로, 반려견의 특정 행동에 담긴 의미와 해결책을 알려드립니다.',
    link: '/app/behavior-analysis',
    cta: '행동 분석 시작하기',
  },
];

export function FeatureShowcase() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-800">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-700">
              Mung-AI 핵심 기능
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Mung-AI, 이렇게 똑똑해요
            </h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              단순 정보 제공을 넘어, AI 기술로 당신의 반려 생활에 실질적인 도움을 드립니다.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 lg:grid-cols-3 lg:gap-12">
          {features.map((feature) => (
            <Card key={feature.title} className="h-full flex flex-col">
              <CardHeader className="flex flex-row items-center gap-4">
                {feature.icon}
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {feature.description}
                </p>
              </CardContent>
              <div className="p-6 pt-0">
                <Button asChild className="w-full">
                  <Link to={feature.link}>{feature.cta}</Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
