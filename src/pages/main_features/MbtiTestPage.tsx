'use client';

import React, { useReducer, useRef, useState, useEffect, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import Confetti from 'react-confetti';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { PawPrint, Heart, Sparkles, ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { MbtiResult } from '@/components/MbtiResult';
import Footer from '@/components/Footer';

// --- 타입 정의 ---

/** MBTI 각 차원의 타입을 정의합니다. */
type MbtiDimension = 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';

/** 테스트의 각 단계를 나타내는 타입입니다. */
type TestStep = 'intro' | 'testing' | 'result';

/** 테스트 상태를 위한 인터페이스입니다. */
interface TestState {
  step: TestStep;
  answers: MbtiDimension[];
  currentQuestionIndex: number;
}

/** 테스트 상태 변경을 위한 액션 타입입니다. */
type TestAction = 
  | { type: 'START_TEST' }
  | { type: 'ANSWER', payload: MbtiDimension }
  | { type: 'RESET_TEST' };

// --- 상수 및 초기 상태 ---

/** MBTI 테스트 질문 목록입니다. */
const questions = [
    // E vs I: 에너지 방향 (외향/내향)
    {
        question: "산책 중 다른 강아지를 만났을 때, 우리 강아지는 어떻게 행동하나요?",
        choiceA: { text: "신나서 꼬리를 흔들며 먼저 다가가서 인사를 나눠요.", type: "E" as MbtiDimension },
        choiceB: { text: "상대방을 잠시 관찰하며 조심스럽게 거리를 유지해요.", type: "I" as MbtiDimension }
    },
    {
        question: "집에 새로운 손님이 방문했을 때, 주로 어떤 반응을 보이나요?",
        choiceA: { text: "반갑게 맞이하며 손님 주변을 맴돌며 관심을 표현해요.", type: "E" as MbtiDimension },
        choiceB: { text: "낯선 사람이라 경계하며 보호자 곁에 머물거나 숨으려고 해요.", type: "I" as MbtiDimension }
    },
    {
        question: "혼자 집에 있을 때, 우리 강아지는 주로 무엇을 하며 시간을 보내나요?",
        choiceA: { text: "장난감을 가지고 놀거나 집안을 돌아다니며 활발하게 보내요.", type: "E" as MbtiDimension },
        choiceB: { text: "자신의 잠자리나 편안한 곳에서 조용히 휴식을 취해요.", type: "I" as MbtiDimension }
    },

    // S vs N: 인식 기능 (감각/직관)
    {
        question: "새로운 장난감을 주었을 때, 가장 먼저 하는 행동은 무엇인가요?",
        choiceA: { text: "장난감의 냄새를 맡고, 물어보며 구체적인 특징을 탐색해요.", type: "S" as MbtiDimension },
        choiceB: { text: "장난감의 새로운 가능성을 탐색하며 다양한 방법으로 놀이를 시도해요.", type: "N" as MbtiDimension }
    },
    {
        question: "'산책 갈까?'라는 말을 들었을 때, 어떤 반응을 보이나요?",
        choiceA: { text: "산책과 관련된 소리나 물건(목줄 등)에 즉각적으로 반응해요.", type: "S" as MbtiDimension },
        choiceB: { text: "보호자의 표정이나 분위기를 먼저 살피며 상황을 파악하려고 해요.", type: "N" as MbtiDimension }
    },
    {
        question: "처음 방문하는 낯선 장소에서, 주로 어떻게 행동하나요?",
        choiceA: { text: "바닥의 냄새를 맡거나 주변 사물을 살피며 현재 환경을 탐색해요.", type: "S" as MbtiDimension },
        choiceB: { text: "주변을 두리번거리며 앞으로 어떤 일이 일어날지 궁금해하며 탐험해요.", type: "N" as MbtiDimension }
    },

    // T vs F: 판단 기능 (사고/감정)
    {
        question: "보호자가 단호한 목소리로 '안돼!'라고 말했을 때, 어떤 반응을 보이나요?",
        choiceA: { text: "행동을 멈추고, 왜 안 되는지 상황을 이해하려는 듯 보호자를 쳐다봐요.", type: "T" as MbtiDimension },
        choiceB: { text: "보호자의 기분을 살피며 시무룩해지거나 불안한 모습을 보여요.", type: "F" as MbtiDimension }
    },
    {
        question: "보호자가 슬퍼 보이거나 기운이 없어 보일 때, 어떻게 행동하나요?",
        choiceA: { text: "상황을 지켜보며, 평소와 다른 점이 무엇인지 파악하려고 해요.", type: 'T' as MbtiDimension },
        choiceB: { text: "곁에 다가와 몸을 기대거나 핥으며 위로하려는 행동을 보여요.", type: 'F' as MbtiDimension }
    },
    {
        question: "칭찬을 받을 때, 우리 강아지의 반응은 어떤가요?",
        choiceA: { text: "칭찬의 의미를 이해하고, 다음 보상을 기대하며 침착하게 행동해요.", type: "T" as MbtiDimension },
        choiceB: { text: "칭찬받는 상황 자체가 좋아서 꼬리를 흔들고 애교를 부리며 기쁨을 표현해요.", type: "F" as MbtiDimension }
    },

    // J vs P: 생활 양식 (판단/인식)
    {
        question: "매일 정해진 식사나 산책 시간이 변경되었을 때, 어떤 반응을 보이나요?",
        choiceA: { text: "정해진 루틴이 깨지면 불안해하며, 원래 시간에 활동하기를 원해요.", type: "J" as MbtiDimension },
        choiceB: { text: "새로운 시간에 금방 적응하며, 크게 신경 쓰지 않는 모습을 보여요.", type: "P" as MbtiDimension }
    },
    {
        question: "'기다려' 훈련을 할 때, 간식을 앞에 두고 얼마나 잘 기다리나요?",
        choiceA: { text: "'먹어'라는 신호가 있을 때까지 인내심을 갖고 꾸준히 기다려요.", type: "J" as MbtiDimension },
        choiceB: { text: "기다리는 것을 힘들어하며, 신호가 없어도 간식을 먹으려고 시도해요.", type: "P" as MbtiDimension }
    },
    {
        question: "우리 강아지는 주로 어디에서 잠을 자나요?",
        choiceA: { text: "항상 정해진 자신의 잠자리에서 규칙적으로 잠을 자요.", type: "J" as MbtiDimension },
        choiceB: { text: "그때그때 편안하다고 느끼는 곳 어디에서나 자유롭게 잠을 자요.", type: "P" as MbtiDimension }
    }
];

/** 테스트의 초기 상태값입니다. */
const initialState: TestState = {
  step: 'intro',
  answers: [],
  currentQuestionIndex: 0,
};

// --- 리듀서 및 헬퍼 함수 ---

/**
 * 테스트 상태를 관리하는 리듀서 함수입니다.
 * @param state 현재 상태
 * @param action 디스패치된 액션
 * @returns 새로운 상태
 */
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

/**
 * 사용자의 답변을 기반으로 MBTI 결과를 계산합니다.
 * @param userAnswers 사용자의 답변 배열
 * @returns 계산된 MBTI 결과 문자열 (예: 'ENFP')
 */
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

// --- 커스텀 훅 ---

/**
 * 브라우저 창의 크기를 실시간으로 추적하는 커스텀 훅입니다.
 * @returns 현재 창의 너비와 높이
 */
function useWindowSize() {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize(); // 초기 사이즈 설정
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return { width: size[0], height: size[1] };
}

// --- UI 컴포넌트 ---

/** 테스트 진행 상태를 시각적으로 보여주는 프로그레스 바 컴포넌트입니다. */
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

/** 개별 질문과 선택지를 담고 있는 카드 컴포넌트입니다. */
const QuestionCard = ({ question, onAnswer, index }: { question: typeof questions[0], onAnswer: (type: MbtiDimension) => void, index: number }) => (
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

/** 테스트 시작 전 보여지는 인트로 화면 컴포넌트입니다. */
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

// --- 메인 페이지 컴포넌트 ---

/**
 * 강아지 MBTI 테스트 페이지 전체를 렌더링하는 메인 컴포넌트입니다.
 */
const MbtiTestPage: React.FC = () => {
  const [state, dispatch] = useReducer(testReducer, initialState);
  const nodeRef = useRef(null); // CSSTransition을 위한 ref
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(false);

  // 테스트 결과가 나오면 5초간 컨페티 효과를 보여줍니다.
  useEffect(() => {
    if (state.step === 'result') {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [state.step]);

  /** 테스트 단계에 따라 적절한 컨텐츠를 렌더링합니다. */
  const renderContent = () => {
    switch (state.step) {
      case 'testing':
        const question = questions[state.currentQuestionIndex];
        return (
          <div key={state.currentQuestionIndex} ref={nodeRef}>
            <PawgressBar current={state.currentQuestionIndex + 1} total={questions.length} />
            <QuestionCard 
              question={question} 
              onAnswer={(type) => dispatch({ type: 'ANSWER', payload: type })} 
              index={state.currentQuestionIndex} 
            />
          </div>
        );
      case 'result':
        const finalResult = calculateResult(state.answers);
        return (
          <MbtiResult 
            ref={nodeRef} 
            result={finalResult} 
            onReset={() => dispatch({ type: 'RESET_TEST' })} 
          />
        );
      case 'intro':
      default:
        return (
          <div ref={nodeRef}>
            <IntroScreen onStart={() => dispatch({ type: 'START_TEST' })} />
          </div>
        );
    }
  };

  // CSSTransition의 key로 사용될 값입니다.
  const currentStepKey = state.step === 'testing' ? state.currentQuestionIndex : state.step;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      {showConfetti && <Confetti width={width} height={height} recycle={false} />}
      <div className="container mx-auto max-w-4xl py-8 px-4">
        <Link to="/" className="inline-flex items-center text-orange-600 hover:text-orange-700 hover:underline mb-6 font-medium transition-colors duration-200">
          <ArrowLeft className="mr-2 h-4 w-4" />
          메인으로 돌아가기
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
            key={currentStepKey}
            nodeRef={nodeRef}
            timeout={300}
            classNames="fade"
            unmountOnExit
          >
            {renderContent()}
          </CSSTransition>
        </SwitchTransition>
      </div>
      <Footer />
      
      {/* 페이지 전환 애니메이션을 위한 스타일 */}
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