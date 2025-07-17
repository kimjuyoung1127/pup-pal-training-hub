"use client";

import React, { useState, useTransition, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import { Loader2, RefreshCw, PawPrint, Heart, Sparkles, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import Footer from '@/components/Footer';

// 임시 Breed 타입 정의
type Breed = {
  id: string;
  name_ko: string;
  name_en: string;
  thumbnail_url: string | null;
  size_type: string | null;
};

// 임시 BreedCard 컴포넌트
const BreedCard = ({ breed }: { breed: Breed }) => {
  // 인라인 스타일 정의
  const cardStyle = {
    overflow: "hidden",
    borderRadius: "1.5rem",
    border: "2px solid #FED7AA",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    transition: "all 0.3s ease",
    backgroundColor: "#ffffff"
  };

  const cardHoverStyle = {
    boxShadow: "0 10px 15px rgba(0, 0, 0, 0.1)",
    transform: "scale(1.05)"
  };

  const imageStyle = {
    width: "100%",
    height: "12rem",
    objectFit: "cover" as const,
    borderTopLeftRadius: "1.25rem",
    borderTopRightRadius: "1.25rem"
  };

  const titleStyle = {
    fontSize: "1.125rem",
    fontWeight: "bold",
    background: "linear-gradient(to right, #F97316, #EC4899, #A855F7)",
    WebkitBackgroundClip: "text" as const,
    WebkitTextFillColor: "transparent" as const,
    padding: "0.5rem 0"
  };

  const subtitleStyle = {
    fontSize: "0.875rem",
    color: "#6B7280"
  };

  const tagStyle = {
    fontSize: "0.75rem",
    background: "linear-gradient(to right, #FEF3C7, #FCE7F3)",
    color: "#9A3412",
    padding: "0.25rem 0.5rem",
    borderRadius: "9999px",
    border: "1px solid #FED7AA",
    display: "inline-block",
    marginTop: "0.5rem"
  };

  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <Link to={`/blog/${breed.id}`}>
      <div 
        style={{
          ...cardStyle,
          ...(isHovered ? cardHoverStyle : {})
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div>
          <img 
            src={breed.thumbnail_url || 'https://via.placeholder.com/300'} 
            alt={breed.name_ko} 
            style={imageStyle} 
          />
        </div>
        <div style={{ padding: "1rem" }}>
          <div style={titleStyle}>{breed.name_ko}</div>
          <p style={subtitleStyle}>{breed.name_en}</p>
        </div>
        <div style={{ padding: "0 1rem 1rem 1rem" }}>
          <span style={tagStyle}>{breed.size_type || '정보 없음'}</span>
        </div>
      </div>
    </Link>
  );
};

const questions = [
  { id: 'environment', title: '어떤 환경에서 함께하게 되나요?', options: [ { value: 'apartment', label: '아파트/빌라 (소음과 공간 중요)' }, { value: 'houseWithYard', label: '마당이 있는 집 (자유로운 활동)' } ] },
  { id: 'activity', title: '강아지와 어떤 활동을 즐기고 싶으신가요?', options: [ { value: 'calm', label: '주로 실내에서, 차분한 시간을' }, { value: 'moderate', label: '가벼운 산책과 동네 친구 만나기' }, { value: 'active', label: '등산, 달리기 등 역동적인 활동을 함께!' } ] },
  { id: 'social', title: '주로 누구와 함께 시간을 보내게 될까요?', options: [ { value: 'alone', label: '저와 조용히, 또는 혼자서도 잘 지내요' }, { value: 'family', label: '온 가족, 그리고 가끔 오는 손님들과 함께' }, { value: 'socialButterfly', label: '새로운 사람과 다른 강아지를 만나는 걸 즐겨요' } ] },
  { id: 'care', title: '강아지를 돌보는 데 얼마나 신경 쓸 수 있나요?', options: [ { value: 'easy', label: '처음이라, 훈련이 쉽고 관리가 편했으면 해요' }, { value: 'medium', label: '어느 정도의 훈련과 관리는 자신 있어요' }, { value: 'hard', label: '털 관리나 훈련에 시간과 노력을 투자할 준비 완료!' } ] },
  { id: 'playfulness', title: '강아지와 얼마나 활동적으로 놀아주고 싶으신가요?', options: [ { value: 'low', label: '장난감을 가지고 조용히 노는 편' }, { value: 'medium', label: '공놀이 등 가벼운 놀이를 즐겨요' }, { value: 'high', label: '항상 에너지가 넘치고, 활동적인 놀이가 필요해요' } ] },
  { id: 'affection', title: '강아지와의 스킨십, 얼마나 원하시나요?', options: [ { value: 'low', label: '독립적이며, 혼자 있는 시간을 존중해주는 게 좋아요' }, { value: 'medium', label: '가끔 다가와 애교를 부리는 정도가 딱 좋아요' }, { value: 'high', label: '껌딱지처럼 항상 곁에 있고 싶어해요' } ] },
  { id: 'exercise', title: '하루에 산책이나 운동에 얼마나 시간을 쓸 수 있나요?', options: [ { value: 'low', label: '30분 미만의 가벼운 산책' }, { value: 'medium', label: '1시간 내외의 규칙적인 산책' }, { value: 'high', label: '1시간 이상의 긴 산책이나 운동' } ] },
];

// PawgressBar 컴포넌트 추가
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

const FilterWizardPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Breed[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const nodeRef = useRef(null);

  const handleAnswerSelect = (questionId: string, answerValue: string) => {
    const newAnswers = { ...answers, [questionId]: answerValue };
    setAnswers(newAnswers);
    
    if (currentStep === questions.length - 1) {
      console.log('Submitting answers:', newAnswers);
      supabase.rpc('get_filtered_breeds_v5', { p_answers: newAnswers })
        .then(({ data, error }) => {
          console.log('Supabase response data:', data);
          console.log('Supabase response error:', error);
          startTransition(() => {
            if (error) {
              setError(error.message);
            } else if (data) {
              setResults(data as Breed[]);
            }
          });
        });
    }
    handleNext();
  };

  const handleNext = () => {
    if (currentStep < questions.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      setResults([]);
      setError(null);
    }
  };
  
  const handleReset = () => {
    setCurrentStep(0);
    setAnswers({});
    setResults([]);
    setError(null);
  }

  const progressValue = (currentStep / questions.length) * 100;
  const currentQuestion = questions[currentStep];
  const displayStep = currentStep <= questions.length ? currentStep : 'results';

  const renderContent = () => {
    if (currentStep < questions.length) {
      return (
        <div key={currentStep} ref={nodeRef}>
          <PawgressBar current={currentStep + 1} total={questions.length} />
          <div className="bg-white/90 backdrop-blur-md border-2 border-orange-200 rounded-3xl shadow-2xl p-8 w-full max-w-2xl mx-auto transform hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center justify-center mb-6">
              <Sparkles className="h-6 w-6 text-orange-400 mr-2" />
              <h2 className="text-center text-xl md:text-2xl font-bold text-gray-800">
                Q{currentStep + 1}. {currentQuestion.title}
              </h2>
              <Sparkles className="h-6 w-6 text-orange-400 ml-2" />
            </div>
            <div className="grid grid-cols-1 gap-4">
              {currentQuestion.options.map((option) => (
                <Button
                  key={option.value}
                  size="lg"
                  className="justify-center p-6 text-center h-auto text-base rounded-2xl bg-gradient-to-r from-orange-100 to-pink-100 text-orange-800 hover:from-orange-200 hover:to-pink-200 border-2 border-orange-300 hover:border-orange-400 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  onClick={() => handleAnswerSelect(currentQuestion.id, option.value)}
                >
                  <Heart className="h-5 w-5 mr-2 text-pink-500" />
                  {option.label}
                </Button>
              ))}
            </div>
            {currentStep > 0 && (
              <div className="mt-6 flex justify-center">
                <Button 
                  variant="ghost" 
                  onClick={handlePrev} 
                  className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                >
                  이전 질문으로
                </Button>
              </div>
            )}
          </div>
        </div>
      );
    } else {
      return (
        <div ref={nodeRef}>
          <div className="text-center bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl border-2 border-orange-200 mb-8 transform hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center justify-center mb-6">
              <PawPrint className="h-10 w-10 text-purple-500 mr-4 animate-pulse" />
              <h1 className="text-3xl md:text-4xl font-extrabold">
                <span className="bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                  결과 확인
                </span>
              </h1>
              <PawPrint className="h-10 w-10 text-purple-500 ml-4 animate-pulse" />
            </div>
            <p className="text-gray-600 text-lg mb-6 leading-relaxed">
              🐾 당신에게 꼭 맞는 견종들을 찾아냈어요! 🐾
            </p>
            <Button 
              onClick={handleReset} 
              className="bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              다시하기
            </Button>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
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
                맞춤 견종 찾기
              </span>
            </h1>
            <PawPrint className="h-8 w-8 text-purple-500 ml-3" />
          </div>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 font-light leading-relaxed">
            🌟 간단한 질문으로 당신에게 딱 맞는 반려견을 찾아보세요. 🌟
          </p>
        </div>

        <SwitchTransition>
          <CSSTransition
            key={displayStep}
            nodeRef={nodeRef}
            timeout={300}
            classNames="fade"
          >
            {renderContent()}
          </CSSTransition>
        </SwitchTransition>

        {isPending && (
          <div className="text-center py-10">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-orange-500" />
            <p className="mt-4 text-lg text-gray-600">최적의 견종을 찾고 있어요...</p>
          </div>
        )}
        {error && <p className="text-center text-red-500 py-10">{error}</p>}
        {!isPending && results.length > 0 && (
          <div 
            style={{
              animation: "fadeIn 0.5s ease-out",
              background: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(8px)",
              padding: "2rem",
              borderRadius: "1.5rem",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              border: "2px solid #FED7AA",
              marginBottom: "2rem"
            }}
          >
            <p style={{
              textAlign: "center",
              fontSize: "1.125rem",
              color: "#4B5563",
              marginBottom: "2rem"
            }}>
              총 <span style={{
                fontWeight: "bold",
                background: "linear-gradient(to right, #F97316, #EC4899, #A855F7)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}>{results.length}</span>개의 견종을 찾았습니다. (인지도 순)
            </p>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: "1.5rem"
            }}>
              {results.map((breed) => (
                <BreedCard key={breed.id} breed={breed} />
              ))}
            </div>
          </div>
        )}
        {!isPending && currentStep === questions.length && results.length === 0 && !error && (
          <p style={{
            textAlign: "center",
            color: "#4B5563",
            padding: "2.5rem",
            background: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(8px)",
            borderRadius: "1.5rem",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            border: "2px solid #FED7AA"
          }}>
            아쉽지만, 모든 조건에 맞는 견종을 찾지 못했어요. <br/> 조건을 변경하여 다시 시도해 보세요!
          </p>
        )}
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
};

export default FilterWizardPage;