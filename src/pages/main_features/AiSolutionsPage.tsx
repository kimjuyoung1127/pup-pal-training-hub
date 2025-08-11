import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Compass, HeartHandshake, Bone } from 'lucide-react';

const aiSolutions = [
  { name: '견종 백과', icon: BookOpen, path: '/woofpedia', description: '수백 가지 견종의 정보를 탐색해 보세요.' },
  { name: '견종 MBTI', icon: Compass, path: '/mbti', description: '우리 강아지의 성격 유형을 알아보세요.' },
  { name: '댕댕이 궁합 테스트', icon: HeartHandshake, path: '/compatibility-test', description: '나와 꼭 맞는 운명의 댕댕이를 찾아보세요.' },
  { name: 'AI 자세 추적', icon: Bone, path: '/joint-tracking', description: '강아지의 자세를 분석하여 건강 상태를 확인해요.', isDeveloping: true },
];

const AiSolutionsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto max-w-2xl py-8 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-800">✨ AI 기능 모아보기</h1>
          <p className="mt-4 text-lg text-gray-600">
            당신의 반려 생활을 더욱 스마트하고 풍요롭게 만들어 줄 특별한 기능들을 만나보세요.
          </p>
        </div>

        <div className="space-y-4">
          {aiSolutions.map((solution) => (
            <Link to={solution.path} key={solution.name} className="block">
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:border-rose-300 hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1">
                <div className="flex items-center">
                  <div className="bg-rose-100 p-3 rounded-full mr-4">
                    <solution.icon className="w-8 h-8 text-rose-500" />
                  </div>
                  <div className="flex-grow">
                    <h2 className="text-xl font-bold text-gray-800">{solution.name}</h2>
                    <p className="text-gray-500">{solution.description}</p>
                  </div>
                  {solution.isDeveloping && (
                    <span className="text-xs text-white bg-rose-400 px-3 py-1 rounded-full font-semibold">개발중</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link to="/app" className="inline-flex items-center text-gray-600 hover:text-rose-500 font-medium transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AiSolutionsPage;
