
import { Step } from 'react-joyride';

export const tourSteps: Step[] = [
  {
    target: '.dog-info-button',
    title: '🐾 강아지 정보 입력 (가장 먼저!)',
    content: '우리 아이의 정보를 알려주시면, 모든 서비스를 맞춤형으로 제공해드려요.',
    disableBeacon: true,
  },
  {
    target: '.ai-recommender-button',
    title: '✨ AI 훈련 추천',
    content: '어떤 훈련을 해야 할지 막막할 때, AI가 맞춤 훈련 계획을 짜드려요.',
  },
  {
    target: '.ai-coach-button',
    title: '🤖 AI 훈련 코치',
    content: '궁금한 점이 생기면 언제든 AI 훈련 코치와 대화하며 도움을 받으세요.',
  },
  {
    target: '.joint-analysis-button',
    title: '🔬 AI 자세 분석',
    content: '아이의 자세를 영상으로 찍어 올리면, AI가 분석하여 자세 균형을 알려줘요.',
  },
  {
    target: '.training-history-button',
    title: '📊 훈련 기록 보기',
    content: 'AI 코칭과 자세 분석 등 모든 활동 기록을 이곳에서 확인할 수 있어요.',
  },
  {
    target: '.offline-training-button',
    title: '🎓 전문가 도움이 필요하다면?',
    content: '검증된 전문가의 오프라인 훈련이 필요할 땐 이 버튼을 눌러 확인해보세요.',
  },
];
