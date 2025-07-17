
'use client';

import React, { useReducer, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { MbtiResult } from '@/components/MbtiResult';
import { PawPrint, Heart, Sparkles } from 'lucide-react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

type MbtiDimension = 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';

const mbtiQuestions = [
  { question: "산책 중 다른 강아지를 만나면, 먼저 다가가서 냄새를 맡나요?", choiceA: { text: "네, 완전 인싸에요! 🐕", type: 'E' }, choiceB: { text: "아니요, 힐끔 보고 지나가요. 😳", type: 'I' } },
  { question: "새로운 장난감보다, 늘 가지고 놀던 익숙한 장난감을 더 좋아하나요?", choiceA: { text: "네, 익숙한 게 최고죠. 🧸", type: 'S' }, choiceB: { text: "아니요, 새로운 건 못 참죠! ✨", type: 'N' } },
  { question: "간식이 없을 때도, 주인의 칭찬만으로 만족감을 표현하나요?", choiceA: { text: "아니요, 현실적인 편이에요. 🦴", type: 'T' }, choiceB: { text: "네, 칭찬은 강아지도 춤추게 해요! 💕", type: 'F' } },
  { question: "정해진 시간에 산책을 나가지 않으면, 보채거나 불안해하나요?", choiceA: { text: "네, 칼같이 지켜야 해요. ⏰", type: 'J' }, choiceB: { text: "아니요, 딱히 상관 안 해요. 😌", type: 'P' } },
  { question: "낯선 사람이 집에 방문했을 때, 경계하기보다 반기는 편인가요?", choiceA: { text: "네, 사람을 너무 좋아해요. 🤗", type: 'E' }, choiceB: { text: "아니요, 일단 짖고 봐요. 🚨", type: 'I' } },
  { question: "장난감을 가지고 놀 때, 주로 물고 빠는 등 감각적으로 탐색하나요?", choiceA: { text: "네, 입으로 가져가는 게 국룰이죠. 👄", type: 'S' }, choiceB: { text: "아니요, 던지고 굴리면서 다양하게 놀아요. 🎾", type: 'N' } },
  { question: "잘못했을 때 혼내면, 시무룩해지거나 눈치를 보나요?", choiceA: { text: "네, 감정이 얼굴에 다 드러나요. 🥺", type: 'F' }, choiceB: { text: "아니요, 금방 잊어버리는 것 같아요. 😄", type: 'T' } },
  { question: "산책 코스가 항상 같아도, 즐거워하며 잘 다니나요?", choiceA: { text: "네, 안정적인 걸 좋아해요. 🛤️", type: 'J' }, choiceB: { text: "아니요, 새로운 길로 가고 싶어 해요. 🗺️", type: 'P' } },
];

interface TestState {
  step: 'start' | 'testing' | 'result';
  answers: MbtiDimension[];
  currentQuestionIndex: number;
}

type TestAction = 
  | { type: 'START_TEST' }
  | { type: 'ANSWER', payload: MbtiDimension }
  | { type: 'RESET_TEST' };

const initialState: TestState = {
  step: 'start',
  answers: [],
  currentQuestionIndex: 0,
};

function testReducer(state: TestState, action: TestAction): TestState {
  switch (action.type) {
    case 'START_TEST':
      return { ...initialState, step: 'testing' };
    case 'ANSWER':
      const newAnswers = [...state.answers, action.payload];
      const isLastQuestion = state.currentQuestionIndex === mbtiQuestions.length - 1;
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
      <div 
        className="bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 h-6 rounded-full transition-all duration-700 ease-out shadow-lg" 
        style={{ width: `${progressPercentage}%` }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold text-white drop-shadow-lg">
          {current} / {total}
        </span>
      </div>
      <PawPrint 
        className="absolute top-1/2 -translate-y-1/2 h-10 w-10 text-orange-600 transition-all duration-700 ease-out drop-shadow-lg animate-bounce"
        style={{ left: `calc(${progressPercentage}% - 20px)` }}
      />
    </div>
  );
};

const QuestionCard = ({ question, onAnswer, index }: { question: any, onAnswer: (type: MbtiDimension) => void, index: number }) => (
  <div className="bg-white/90 backdrop-blur-md border-2 border-orange-200 rounded-3xl shadow-2xl p-8 w-full max-w-2xl mx-auto transform hover:scale-[1.02] transition-all duration-300">
    <div className="flex items-center justify-center mb-6">
      <Sparkles className="h-6 w-6 text-orange-400 mr-2" />
      <h2 className="text-center text-xl md:text-2xl font-bold text-gray-800">
        Q{index + 1}. {question.question}
      </h2>
      <Sparkles className="h-6 w-6 text-orange-400 ml-2" />
    </div>
    <div className="grid grid-cols-1 gap-4">
      <Button
        size="lg"
        className="justify-center p-6 text-center h-auto text-base rounded-2xl bg-gradient-to-r from-orange-100 to-pink-100 text-orange-800 hover:from-orange-200 hover:to-pink-200 border-2 border-orange-300 hover:border-orange-400 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        onClick={() => onAnswer(question.choiceA.type)}
      >
        <Heart className="h-5 w-5 mr-2 text-orange-500" />
        {question.choiceA.text}
      </Button>
      <Button
        size="lg"
        className="justify-center p-6 text-center h-auto text-base rounded-2xl bg-gradient-to-r from-pink-100 to-purple-100 text-purple-800 hover:from-pink-200 hover:to-purple-200 border-2 border-purple-300 hover:border-purple-400 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        onClick={() => onAnswer(question.choiceB.type)}
      >
        <Heart className="h-5 w-5 mr-2 text-purple-500" />
        {question.choiceB.text}
      </Button>
    </div>
  </div>
);

const MbtiTestPage: React.FC = () => {
  const [state, dispatch] = useReducer(testReducer, initialState);
  const nodeRef = useRef(null);

  const renderContent = () => {
    switch (state.step) {
      case 'testing':
        const question = mbtiQuestions[state.currentQuestionIndex];
        return (
          <div key={state.currentQuestionIndex} ref={nodeRef}>
            <PawgressBar current={state.currentQuestionIndex + 1} total={mbtiQuestions.length} />
            <QuestionCard question={question} onAnswer={(type) => dispatch({ type: 'ANSWER', payload: type })} index={state.currentQuestionIndex} />
          </div>
        );
      case 'result':
        const finalResult = calculateResult(state.answers);
        return <MbtiResult ref={nodeRef} result={finalResult} onReset={() => dispatch({ type: 'RESET_TEST' })} />;
      case 'start':
      default:
        return (
          <div className="text-center bg-white/90 backdrop-blur-md p-12 rounded-3xl shadow-2xl border-2 border-orange-200 transform hover:scale-[1.02] transition-all duration-300" ref={nodeRef}>
            <div className="flex items-center justify-center mb-6">
              <PawPrint className="h-12 w-12 text-orange-500 mr-4 animate-pulse" />
              <h1 className="text-3xl md:text-4xl font-extrabold">
                <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                  나의 강아지 소울메이트 찾기
                </span>
              </h1>
              <PawPrint className="h-12 w-12 text-purple-500 ml-4 animate-pulse" />
            </div>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              🐾 간단한 질문으로 내 강아지의 성향을 알아보고, <br className="hidden sm:block" /> 
              💕 최고의 짝꿍을 찾아보세요!
            </p>
            <Button 
              size="lg" 
              onClick={() => dispatch({ type: 'START_TEST' })} 
              className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              테스트 시작하기
              <Heart className="h-5 w-5 ml-2" />
            </Button>
          </div>
        );
    }
  };

  const currentStep = state.step === 'testing' ? state.currentQuestionIndex : state.step;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      <div className="container mx-auto max-w-4xl py-8 px-4">
        <Link to="/" className="inline-flex items-center text-orange-600 hover:text-orange-700 hover:underline mb-6 font-medium transition-colors duration-200">
          <ArrowLeft className="mr-2 h-4 w-4" />
          메인으로 돌아가기
        </Link>
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <PawPrint className="h-8 w-8 text-orange-500 mr-3" />
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                견종 성향 테스트 (MBTI)
              </span>
            </h1>
            <PawPrint className="h-8 w-8 text-purple-500 ml-3" />
          </div>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 font-light leading-relaxed">
            🌟 8가지 간단한 질문으로 당신의 반려견 성향을 알아보세요. 🌟
          </p>
        </div>
        <SwitchTransition>
          <CSSTransition
            key={currentStep}
            nodeRef={nodeRef}
            timeout={300}
            classNames="fade"
          >
            {renderContent()}
          </CSSTransition>
        </SwitchTransition>
      </div>
      <Footer />
      
      <style>{`
        .fade-enter {
          opacity: 0;
          transform: translateY(20px);
        }
        .fade-enter-active {
          opacity: 1;
          transform: translateY(0);
          transition: opacity 300ms ease-out, transform 300ms ease-out;
        }
        .fade-exit {
          opacity: 1;
          transform: translateY(0);
        }
        .fade-exit-active {
          opacity: 0;
          transform: translateY(-20px);
          transition: opacity 300ms ease-out, transform 300ms ease-out;
        }
      `}</style>
    </div>
  );
}

export default MbtiTestPage;
