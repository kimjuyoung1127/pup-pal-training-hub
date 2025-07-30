
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

const questions = [
    // E vs I
    {
        question: "산책 중 다른 강아지를 만났을 때?",
        choiceA: { text: "반갑게 꼬리를 흔들며 먼저 다가간다.", type: "E" },
        choiceB: { text: "거리를 두고 조용히 상대를 살핀다.", type: "I" }
    },
    {
        question: "집에 손님이 왔을 때, 첫 반응은?",
        choiceA: { text: "신나서 뛰어가 반긴다.", type: "E" },
        choiceB: { text: "낯설어 구석으로 피하거나 보호자 옆에 있다.", type: "I" }
    },
    {
        question: "혼자 있을 때 주로 하는 행동은?",
        choiceA: { text: "집안을 돌아다니며 활동한다.", type: "E" },
        choiceB: { text: "조용히 자기 자리에서 쉰다.", type: "I" }
    },

    // S vs N
    {
        question: "새로운 장난감을 줬을 때?",
        choiceA: { text: "냄새, 소리, 질감을 꼼꼼히 살핀다.", type: "S" },
        choiceB: { text: "새로운 놀이법을 상상하며 재밌게 논다.", type: "N" }
    },
    {
        question: "'산책 갈까?'라는 말을 들으면?",
        choiceA: { text: "목줄 소리, 문 앞 신호에 즉각 반응!", type: "S" },
        choiceB: { text: "주인의 말투와 분위기를 먼저 살핀다.", type: "N" }
    },
    {
        question: "처음 가는 산책길에서?",
        choiceA: { text: "발 아래 냄새 맡고 현재 길을 탐색한다.", type: "S" },
        choiceB: { text: "앞으로 뭐가 나올지 기대하며 앞장선다.", type: "N" }
    },

    // T vs F
    {
        question: "주인이 단호하게 '안돼!'라고 말했을 때?",
        choiceA: { text: "왜 안 되는지 멈춰서 고민한다.", type: "T" },
        choiceB: { text: "주인의 기분을 살피며 시무룩해진다.", type: "F" }
    },
    {
        question: "주인이 슬퍼 보일 때?",
        choiceA: { text: "이상함은 느끼지만 거리를 두고 본다.", type: 'T' },
        choiceB: { text: "다정하게 다가와 기대거나 핥는다.", type: 'F' }
    },
    {
        question: "칭찬받을 때 반응은?",
        choiceA: { text: "다음 보상을 기대하며 차분히 행동.", type: "T" },
        choiceB: { text: "그 순간이 좋아서 온몸으로 표현.", type: "F" }
    },

    // J vs P
    {
        question: "하루 루틴(밥, 산책)이 바뀌면?",
        choiceA: { text: "불안해하며 제 시간에 하길 원한다.", type: "J" },
        choiceB: { text: "별 신경 안 쓰고 바로 적응한다.", type: "P" }
    },
    {
        question: "'기다려' 훈련을 할 때?",
        choiceA: { text: "'먹어' 신호가 올 때까지 참는다.", type: "J" },
        choiceB: { text: "참지 못하고 간식만 바라본다.", type: "P" }
    },
    {
        question: "잠자리가 정해져 있나요?",
        choiceA: { text: "항상 같은 자리에서 잔다.", type: "J" },
        choiceB: { text: "편한 곳이면 아무 데서나 잔다.", type: "P" }
    }
];

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
      <div 
        className="bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 h-6 rounded-full transition-all duration-700 ease-out shadow-lg" 
        style={{ width: `${progressPercentage}%` }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold text-purple-800 drop-shadow-md">
          {current} / {total}
        </span>
      </div>
      <PawPrint 
        className="absolute top-1/2 -translate-y-1/2 h-10 w-10 text-purple-600 transition-all duration-700 ease-out drop-shadow-lg animate-bounce"
        style={{ left: `calc(${progressPercentage}% - 20px)` }}
      />
    </div>
  );
};

const QuestionCard = ({ question, onAnswer, index }: { question: any, onAnswer: (type: MbtiDimension) => void, index: number }) => (
  <div className="bg-white/90 backdrop-blur-md border-2 border-orange-200 rounded-3xl shadow-2xl p-8 w-full max-w-2xl mx-auto transform hover:scale-[1.02] transition-all duration-300">
    <div className="flex items-center justify-center mb-6">
      <Sparkles className="h-6 w-6 text-orange-400 mr-2" />
      <h2 className="text-center text-xl md:text-2xl font-bold text-gray-800 break-keep">
        Q{index + 1}. {question.question}
      </h2>
      <Sparkles className="h-6 w-6 text-orange-400 ml-2" />
    </div>
    <div className="grid grid-cols-1 gap-4">
      <Button
        size="lg"
        className="justify-center p-6 text-center h-auto text-base rounded-2xl bg-gradient-to-r from-orange-100 to-pink-100 text-orange-800 hover:from-orange-200 hover:to-pink-200 border-2 border-orange-300 hover:border-orange-400 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl whitespace-normal break-words"
        onClick={() => onAnswer(question.choiceA.type)}
      >
        <Heart className="h-5 w-5 mr-2 text-pink-500 flex-shrink-0" />
        <span className="break-keep">{question.choiceA.text}</span>
      </Button>
      <Button
        size="lg"
        className="justify-center p-6 text-center h-auto text-base rounded-2xl bg-gradient-to-r from-pink-100 to-purple-100 text-purple-800 hover:from-pink-200 hover:to-purple-200 border-2 border-purple-300 hover:border-purple-400 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl whitespace-normal break-words"
        onClick={() => onAnswer(question.choiceB.type)}
      >
        <Heart className="h-5 w-5 mr-2 text-purple-500 flex-shrink-0" />
        <span className="break-keep">{question.choiceB.text}</span>
      </Button>
    </div>
  </div>
);

const IntroScreen = ({ onStart }: { onStart: () => void }) => (
    <div className="text-center bg-white/90 backdrop-blur-md p-12 rounded-3xl shadow-2xl border-2 border-orange-200 transform hover:scale-[1.02] transition-all duration-300">
        <div className="flex items-center justify-center mb-6">
            <PawPrint className="h-12 w-12 text-orange-500 mr-4 animate-pulse" />
            <h1 className="text-3xl md:text-4xl font-extrabold">
                <span className="bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 bg-clip-text text-transparent break-keep">
                    우리 강아지 성향 분석하기
                </span>
            </h1>
            <PawPrint className="h-12 w-12 text-purple-500 ml-4 animate-pulse" />
        </div>
        <p className="text-gray-600 text-lg mb-8 leading-relaxed break-keep">
            🐾 12가지 간단한 질문으로 우리 강아지의 진짜 성향을 알아보고, <br className="hidden sm:block" />
            💕 더 깊이 이해하는 시간을 가져보세요!
        </p>
        <Button
            size="lg"
            onClick={onStart}
            className="bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
        >
            <Sparkles className="h-5 w-5 mr-2" />
            분석 시작하기
            <Heart className="h-5 w-5 ml-2 text-white" />
        </Button>
    </div>
);


const MbtiTestPage: React.FC = () => {
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
        return <MbtiResult ref={nodeRef} result={finalResult} onReset={() => dispatch({ type: 'RESET_TEST' })} />;
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
            <PawPrint className="h-8 w-8 text-purple-500 mr-3" />
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              <span className="bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                우리 강아지 성향 분석
              </span>
            </h1>
            <PawPrint className="h-8 w-8 text-purple-500 ml-3" />
          </div>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 font-light leading-relaxed">
            🌟 행동 뒤에 숨겨진 우리 아이의 진짜 마음을 알아보세요. 🌟
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
