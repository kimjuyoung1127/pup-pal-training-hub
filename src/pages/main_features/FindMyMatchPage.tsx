'use client';

import React, { useReducer, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { PawPrint, Heart, Sparkles } from 'lucide-react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

type MbtiDimension = 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';

// A모드: 나와 잘 맞는 견종 찾기 질문
const questions = [
  { question: "주말에 주로 무엇을 하시나요?", choiceA: { text: "친구들과 약속! 밖에서 에너지 충전! 🔥", type: 'E' }, choiceB: { text: "집에서 휴식... 조용한 게 최고! 🏠", type: 'I' } },
  { question: "새로운 장소에 가는 것을 좋아하시나요?", choiceA: { text: "네, 새로운 경험은 언제나 환영이죠! ✨", type: 'N' }, choiceB: { text: "아니요, 익숙하고 편안한 곳이 좋아요. 😌", type: 'S' } },
  { question: "반려견의 문제를 해결할 때, 가장 먼저 하는 것은?", choiceA: { text: "객관적인 정보와 데이터를 찾아본다. 📊", type: 'T' }, choiceB: { text: "다른 사람들의 경험담과 조언을 구한다. ❤️", type: 'F' } },
  { question: "여행 계획을 세울 때 당신은?", choiceA: { text: "분 단위로 엑셀에 정리해야 마음이 편안~ ✈️", type: 'J' }, choiceB: { text: "비행기 표만 끊고 나머지는 즉흥적으로! 🗺️", type: 'P' } },
  { question: "친구와 갈등이 생겼을 때, 어떻게 해결하시나요?", choiceA: { text: "솔직하게 내 감정을 이야기하고 공감을 구한다. 😢", type: 'F' }, choiceB: { text: "무엇이 문제인지 논리적으로 분석하고 해결책을 찾는다. 🧠", type: 'T' } },
  { question: "산책할 때, 어떤 스타일을 선호하시나요?", choiceA: { text: "매일 같은 시간에, 같은 코스를 도는 안정적인 산책! ⏰", type: 'J' }, choiceB: { text: "발길 닿는 대로, 새로운 길을 탐험하는 즉흥적인 산책! 🌿", type: 'P' } },
  { question: "처음 만난 사람들과 쉽게 친해지는 편인가요?", choiceA: { text: "네, 금방 친구가 될 수 있어요! 🤗", type: 'E' }, choiceB: { text: "아니요, 시간이 좀 필요해요. 😳", type: 'I' } },
  { question: "새로운 물건이나 제품을 접할 때, 당신의 반응은?", choiceA: { text: "사용 설명서를 꼼꼼히 읽고 원리부터 파악한다. 📖", type: 'S' }, choiceB: { text: "일단 눌러보고 부딪히면서 가능성을 탐색한다. 💡", type: 'N' } },
];

// --- 결과 표시 컴포넌트 (스타일 독립성 확보) ---
const OriginalMbtiResult = React.forwardRef<HTMLDivElement, { result: string; onReset: () => void; }>(({ result, onReset }, ref) => {
    const { data: description, isLoading: isLoadingDesc } = useQuery({
        queryKey: ['mbtiDescription', result],
        queryFn: async () => {
            const { data, error } = await supabase.from('mbti_descriptions').select('title, description').eq('mbti_type', result).single();
            if (error) throw new Error(error.message);
            return data;
        },
        enabled: !!result,
    });

    const { data: breeds, isLoading: isLoadingBreeds } = useQuery({
        queryKey: ['breedsByMbti', result],
        queryFn: async () => {
            const { data, error } = await supabase.from('breeds').select('id, name_ko, thumbnail_url').eq('dog_mbti', result).limit(4);
            if (error) throw new Error(error.message);
            return data;
        },
        enabled: !!result,
    });

    const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);
    React.useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div ref={ref} style={{
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(8px)',
            padding: '2rem',
            borderRadius: '1.5rem',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            border: '2px solid #ddd6fe',
            textAlign: 'center'
        }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#4b5563', marginBottom: '0.5rem' }}>당신의 성향과 잘 맞는 소울메이트는...</h2>
            {isLoadingDesc ? <Loader2 style={{ margin: '0 auto', height: '2.5rem', width: '2.5rem', animation: 'spin 1s linear infinite', color: '#a855f7' }} /> : (
                <>
                    <h1 style={{
                        background: 'linear-gradient(to right, #f97316, #ec4899, #a855f7)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontSize: isMobile ? '2.25rem' : '3rem',
                        fontWeight: 800,
                    }}>
                        {description?.title} ({result})
                    </h1>
                    <p style={{ color: '#6b7280', fontSize: '1.125rem', marginTop: '0.5rem' }}>{description?.description}</p>
                </>
            )}

            <div style={{ marginTop: '1.5rem', textAlign: 'left', backgroundColor: '#ffffff', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}>
                <h3 style={{ color: '#4c1d95', fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>추천 견종 친구들 🐶</h3>
                {isLoadingBreeds ? <Loader2 style={{ margin: '0 auto', height: '2rem', width: '2rem', animation: 'spin 1s linear infinite', color: '#9ca3af' }} /> : (
                    <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: `repeat(${isMobile ? 2 : 4}, 1fr)` }}>
                        {breeds?.map(breed => (
                            <Link to={`/blog/${breed.id}`} key={breed.id} style={{ textDecoration: 'none' }}>
                                <div className="group" style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'hidden', height: '100%', transition: 'transform 0.3s' }}>
                                    <div style={{ position: 'relative', width: '100%', paddingTop: '100%', overflow: 'hidden' }}>
                                        <img src={breed.thumbnail_url || ''} alt={breed.name_ko} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }} className="group-hover:scale-105" />
                                    </div>
                                    <div style={{ padding: '0.75rem', textAlign: 'center' }}>
                                        <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1f2937', margin: 0 }} className="group-hover:text-pink-500">
                                            {breed.name_ko}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            <button onClick={onReset} style={{
                background: 'linear-gradient(to right, #fb923c, #f472b6)',
                color: '#ffffff',
                fontWeight: 'bold',
                padding: '0.75rem 2rem',
                borderRadius: '9999px',
                fontSize: '1.125rem',
                marginTop: '2rem',
                border: 'none',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                boxShadow: '0 4px 15px rgba(236, 72, 153, 0.4)'
            }} className="hover:scale-105 hover:shadow-lg">
                테스트 다시하기
            </button>
        </div>
    );
});


// --- 테스트 페이지 로직 (기존과 동일) ---
interface TestState {
  step: 'intro' | 'testing' | 'result';
  answers: MbtiDimension[];
  currentQuestionIndex: number;
}

type TestAction = 
  | { type: 'START_TEST' }
  | { type: 'ANSWER', payload: MbtiDimension }
  | { type: 'RESET_TEST' };

const initialState: TestState = {
  step: 'intro',
  answers: [],
  currentQuestionIndex: 0,
};

function testReducer(state: TestState, action: TestAction): TestState {
  switch (action.type) {
    case 'START_TEST':
      return { ...initialState, step: 'testing' };
    case 'ANSWER':
      const newAnswers = [...state.answers, action.payload];
      const isLastQuestion = state.currentQuestionIndex === questions.length - 1;
      return {
        ...state,
        answers: newAnswers,
        currentQuestionIndex: isLastQuestion ? state.currentQuestionIndex : state.currentQuestionIndex + 1,
        step: isLastQuestion ? 'result' : 'testing',
      };
    case 'RESET_TEST':
      return initialState;
    default:
      return state;
  }
}

const calculateResult = (userAnswers: MbtiDimension[]): string => {
  const counts = userAnswers.reduce((acc, type) => {
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<MbtiDimension, number>);

  let result = '';
  result += (counts['E'] || 0) >= (counts['I'] || 0) ? 'E' : 'I';
  result += (counts['S'] || 0) >= (counts['N'] || 0) ? 'S' : 'N';
  result += (counts['T'] || 0) >= (counts['F'] || 0) ? 'F' : 'T';
  result += (counts['J'] || 0) >= (counts['P'] || 0) ? 'P' : 'J';
  return result;
};

const PawgressBar = ({ current, total }: { current: number, total: number }) => {
  const progressPercentage = (current / total) * 100;
  return (
    <div className="w-full bg-gradient-to-r from-orange-100 to-pink-100 rounded-full h-6 my-8 relative shadow-inner border border-orange-200">
      <div className="bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 h-6 rounded-full transition-all duration-700 ease-out shadow-lg" style={{ width: `${progressPercentage}%` }} />
      <div className="absolute inset-0 flex items-center justify-center"><span className="text-xs font-bold text-purple-800 drop-shadow-md">{current} / {total}</span></div>
      <PawPrint className="absolute top-1/2 -translate-y-1/2 h-10 w-10 text-purple-600 transition-all duration-700 ease-out drop-shadow-lg animate-bounce" style={{ left: `calc(${progressPercentage}% - 20px)` }} />
    </div>
  );
};

const QuestionCard = ({ question, onAnswer, index }: { question: any, onAnswer: (type: MbtiDimension) => void, index: number }) => (
  <div className="bg-white/90 backdrop-blur-md border-2 border-orange-200 rounded-3xl shadow-2xl p-8 w-full max-w-2xl mx-auto transform hover:scale-[1.02] transition-all duration-300">
    <div className="flex items-center justify-center mb-6">
      <Sparkles className="h-6 w-6 text-orange-400 mr-2" /><h2 className="text-center text-xl md:text-2xl font-bold text-gray-800">Q{index + 1}. {question.question}</h2><Sparkles className="h-6 w-6 text-orange-400 ml-2" />
    </div>
    <div className="grid grid-cols-1 gap-4">
      <Button size="lg" className="justify-center p-6 text-center h-auto text-base rounded-2xl bg-gradient-to-r from-orange-100 to-pink-100 text-orange-800 hover:from-orange-200 hover:to-pink-200 border-2 border-orange-300 hover:border-orange-400 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl whitespace-normal break-words" onClick={() => onAnswer(question.choiceA.type)}>
        <Heart className="h-5 w-5 mr-2 flex-shrink-0" />
        <span>{question.choiceA.text}</span>
      </Button>
      <Button size="lg" className="justify-center p-6 text-center h-auto text-base rounded-2xl bg-gradient-to-r from-pink-100 to-purple-100 text-purple-800 hover:from-pink-200 hover:to-purple-200 border-2 border-purple-300 hover:border-purple-400 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl whitespace-normal break-words" onClick={() => onAnswer(question.choiceB.type)}>
        <Heart className="h-5 w-5 mr-2 flex-shrink-0" />
        <span>{question.choiceB.text}</span>
      </Button>
    </div>
  </div>
);

const IntroScreen = ({ onStart }: { onStart: () => void }) => (
    <div className="text-center bg-white/90 backdrop-blur-md p-12 rounded-3xl shadow-2xl border-2 border-orange-200 transform hover:scale-[1.02] transition-all duration-300">
        <div className="flex items-center justify-center mb-6">
            <PawPrint className="h-12 w-12 text-orange-500 mr-4 animate-pulse" /><h1 className="text-3xl md:text-4xl font-extrabold"><span className="bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">나와 잘 맞는 견종 찾기</span></h1><PawPrint className="h-12 w-12 text-purple-500 ml-4 animate-pulse" />
        </div>
        <p className="text-gray-600 text-lg mb-8 leading-relaxed">
            🐾 8가지 간단한 질문으로 나의 성향을 알아보고, <br className="hidden sm:block" />
            💕 평생 함께할 소울메이트 견종을 추천받아 보세요!
        </p>
        <Button size="lg" onClick={onStart} className="bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
            <Sparkles className="h-5 w-5 mr-2" />
            추천 시작하기
            <Heart className="h-5 w-5 ml-2 text-white" />
        </Button>
    </div>
);

const FindMyMatchPage: React.FC = () => {
  const [state, dispatch] = useReducer(testReducer, initialState);
  const nodeRef = useRef(null);

  const renderContent = () => {
    switch (state.step) {
      case 'testing':
        const question = questions[state.currentQuestionIndex];
        return (
          <div key={state.currentQuestionIndex} ref={nodeRef}>
            <PawgressBar current={state.currentQuestionIndex + 1} total={questions.length} />
            <QuestionCard question={question} onAnswer={(type) => dispatch({ type: 'ANSWER', payload: type })} index={state.currentQuestionIndex} />
          </div>
        );
      case 'result':
        const finalResult = calculateResult(state.answers);
        return <OriginalMbtiResult ref={nodeRef} result={finalResult} onReset={() => dispatch({ type: 'RESET_TEST' })} />;
      case 'intro':
      default:
        return (
          <div ref={nodeRef}>
            <IntroScreen onStart={() => dispatch({ type: 'START_TEST' })} />
          </div>
        );
    }
  };

  const currentStep = state.step === 'testing' ? state.currentQuestionIndex : state.step;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      <div className="container mx-auto max-w-4xl py-8 px-4">
        <Link to="/mbti-test" className="inline-flex items-center text-orange-600 hover:text-orange-700 hover:underline mb-6 font-medium transition-colors duration-200">
          <ArrowLeft className="mr-2 h-4 w-4" />
          테스트 선택으로 돌아가기
        </Link>
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <PawPrint className="h-8 w-8 text-purple-500 mr-3" /><h1 className="text-3xl md:text-5xl font-extrabold tracking-tight"><span className="bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">나와 잘 맞는 견종 찾기</span></h1><PawPrint className="h-8 w-8 text-purple-500 ml-3" />
          </div>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 font-light leading-relaxed">
            🌟 당신의 라이프스타일에 딱 맞는 반려견을 찾아보세요. 🌟
          </p>
        </div>
        <SwitchTransition>
          <CSSTransition key={currentStep} nodeRef={nodeRef} timeout={300} classNames="fade">
            {renderContent()}
          </CSSTransition>
        </SwitchTransition>
      </div>
      <Footer />
      <style>{`
        .fade-enter { opacity: 0; transform: translateY(20px); }
        .fade-enter-active { opacity: 1; transform: translateY(0); transition: opacity 300ms ease-out, transform 300ms ease-out; }
        .fade-exit { opacity: 1; transform: translateY(0); }
        .fade-exit-active { opacity: 0; transform: translateY(-20px); transition: opacity 300ms ease-out, transform 300ms ease-out; }
      `}</style>
    </div>
  );
}

export default FindMyMatchPage;