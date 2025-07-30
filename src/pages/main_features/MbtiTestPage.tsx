
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
    { question: "산책 중 낯선 사람이나 강아지를 만나면?", choiceA: { text: "“친구다!” 일단 꼬리부터 흔들고 본다.", type: 'E' }, choiceB: { text: "“누구세요?” 일단 거리를 두고 상황을 살핀다.", type: 'I' } },
    { question: "새로운 산책길에 대한 반응은?", choiceA: { text: "“킁킁킁!” 익숙한 길의 냄새를 맡으며 안정감을 느낀다.", type: 'S' }, choiceB: { text: "“여긴 어디?” 새로운 길로 가자고 주인을 이끈다.", type: 'N' } },
    { question: "주인이 “안돼!”라고 단호하게 말했을 때?", choiceA: { text: "“왜 안되지?” 잠시 멈칫하지만, 다시 시도할 궁리를 한다.", type: 'T' }, choiceB: { text: "“내가 뭘 잘못했나...” 금방 시무룩해져서 눈치를 본다.", type: 'F' } },
    { question: "하루 일과(밥, 산책 시간)가 조금 달라지면?", choiceA: { text: "“시간 됐다!” 정확한 시간에 보채며 루틴을 지키려 한다.", type: 'J' }, choiceB: { text: "“주면 먹고, 나가면 걷는다~” 크게 신경 쓰지 않는다.", type: 'P' } },
    { question: "집에 혼자 있을 때, 창밖 구경하는 것을 즐기나요?", choiceA: { text: "“세상 구경이 제일 재밌어!” 창밖 사람, 차에 관심이 많다.", type: 'E' }, choiceB: { text: "“내 집이 최고.” 창밖보다는 자기 자리에 엎드려 있는다.", type: 'I' } },
    { question: "장난감을 가지고 놀 때, 주로 어떻게 노나요?", choiceA: { text: "“냠냠쩝쩝” 입으로 물고 빨고, 질감을 느끼는 데 집중한다.", type: 'S' }, choiceB: { text: "“이리 던지고 저리 던지고!” 상상력을 발휘해 다양한 방법으로 논다.", type: 'N' } },
    { question: "주인이 외출했다가 돌아왔을 때?", choiceA: { text: "“왔는가.” 꼬리를 흔들지만, 하던 일(잠자기 등)을 마저 한다.", type: 'T' }, choiceB: { text: "“보고 싶었어!” 온몸으로 격하게 반가움을 표현해야 직성이 풀린다.", type: 'F' } },
    { question: "간식을 줄 때, “기다려” 훈련을 하면?", choiceA: { text: "“먹으랄 때까지...” 힘들어하지만, 지시를 따르려고 노력한다.", type: 'J' }, choiceB: { text: "“에이, 그냥 먹자!” 기다리는 것을 유독 힘들어한다.", type: 'P' } },
    { question: "집에 손님이 방문했을 때, 아이의 첫 반응은?", choiceA: { text: "“새로운 집사인가?” 꼬리를 흔들며 먼저 다가가 아는 척을 한다.", type: 'E' }, choiceB: { text: "“수상한 사람이다!” 구석에 숨거나, 멀리서 경계하며 짖는다.", type: 'I' } },
    { question: "‘노즈워크’ 놀이를 할 때, 간식을 찾는 방식은?", choiceA: { text: "“하나만 판다!” 한 구역을 꼼꼼히 뒤져서 찾아낸다.", type: 'S' }, choiceB: { text: "“대충 킁킁!” 전체를 빠르게 훑으며 감으로 찾아낸다.", type: 'N' } },
    { question: "주인이 아프거나 슬퍼 보일 때, 옆에 와서 핥아주거나 기대나요?", choiceA: { text: "“음... 평소랑 다른데?” 어색해하며 주변을 맴돈다.", type: 'T' }, choiceB: { text: "“내가 지켜줄게!” 기가 막히게 감정을 알아채고 위로해준다.", type: 'F' } },
    { question: "잠자리가 정해져 있나요, 아니면 아무 데서나 잘 자나요?", choiceA: { text: "“내 자리는 여기!” 자기 쿠션이나 정해진 장소에서만 자려고 한다.", type: 'J' }, choiceB: { text: "“여기가 침대요, 저기가 소파로다.” 피곤하면 어디서든 잘 잔다.", type: 'P' } },
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
      <h2 className="text-center text-xl md:text-2xl font-bold text-gray-800">
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
        <span>{question.choiceA.text}</span>
      </Button>
      <Button
        size="lg"
        className="justify-center p-6 text-center h-auto text-base rounded-2xl bg-gradient-to-r from-pink-100 to-purple-100 text-purple-800 hover:from-pink-200 hover:to-purple-200 border-2 border-purple-300 hover:border-purple-400 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl whitespace-normal break-words"
        onClick={() => onAnswer(question.choiceB.type)}
      >
        <Heart className="h-5 w-5 mr-2 text-purple-500 flex-shrink-0" />
        <span>{question.choiceB.text}</span>
      </Button>
    </div>
  </div>
);

const IntroScreen = ({ onStart }: { onStart: () => void }) => (
    <div className="text-center bg-white/90 backdrop-blur-md p-12 rounded-3xl shadow-2xl border-2 border-orange-200 transform hover:scale-[1.02] transition-all duration-300">
        <div className="flex items-center justify-center mb-6">
            <PawPrint className="h-12 w-12 text-orange-500 mr-4 animate-pulse" />
            <h1 className="text-3xl md:text-4xl font-extrabold">
                <span className="bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                    우리 강아지 성향 분석하기
                </span>
            </h1>
            <PawPrint className="h-12 w-12 text-purple-500 ml-4 animate-pulse" />
        </div>
        <p className="text-gray-600 text-lg mb-8 leading-relaxed">
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
