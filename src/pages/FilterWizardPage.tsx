
import React from 'react';
import { useWizardStore } from '@/store/useWizardStore';
import { useMutation } from '@tanstack/react-query';
import { woofpediaClient } from '@/lib/woofpediaClient';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import { Loader2, RefreshCw, ArrowLeft, Sparkles, Heart, PawPrint, Wand2 } from 'lucide-react';
import Footer from '@/components/Footer';

const questions = [
    { 
        id: 'environment', 
        title: '어떤 환경에서 함께하게 되나요?', 
        emoji: '🏠',
        options: [
            { value: 'apartment', label: '🏢 아파트/빌라 (소음과 공간 중요)', color: 'from-pink-100 to-rose-100' },
            { value: 'houseWithYard', label: '🏡 마당이 있는 집 (자유로운 활동)', color: 'from-green-100 to-emerald-100' }
        ] 
    },
    { 
        id: 'activity', 
        title: '강아지와 어떤 활동을 즐기고 싶으신가요?', 
        emoji: '🎾',
        options: [
            { value: 'calm', label: '😌 주로 실내에서, 차분한 시간을', color: 'from-blue-100 to-cyan-100' },
            { value: 'moderate', label: '🚶‍♀️ 가벼운 산책과 동네 친구 만나기', color: 'from-yellow-100 to-amber-100' },
            { value: 'active', label: '🏃‍♂️ 등산, 달리기 등 역동적인 활동을 함께!', color: 'from-red-100 to-orange-100' }
        ] 
    },
    { 
        id: 'social', 
        title: '주로 누구와 함께 시간을 보내게 될까요?', 
        emoji: '👥',
        options: [
            { value: 'alone', label: '🤫 저와 조용히, 또는 혼자서도 잘 지내요', color: 'from-purple-100 to-violet-100' },
            { value: 'family', label: '👨‍👩‍👧‍👦 온 가족, 그리고 가끔 오는 손님들과 함께', color: 'from-pink-100 to-rose-100' },
            { value: 'socialButterfly', label: '🎉 새로운 사람과 다른 강아지를 만나는 걸 즐겨요', color: 'from-green-100 to-teal-100' }
        ] 
    },
    { 
        id: 'care', 
        title: '강아지를 돌보는 데 얼마나 신경 쓸 수 있나요?', 
        emoji: '💝',
        options: [
            { value: 'easy', label: '🌱 처음이라, 훈련이 쉽고 관리가 편했으면 해요', color: 'from-green-100 to-lime-100' },
            { value: 'medium', label: '⚖️ 어느 정도의 훈련과 관리는 자신 있어요', color: 'from-yellow-100 to-orange-100' },
            { value: 'hard', label: '💪 털 관리나 훈련에 시간과 노력을 투자할 준비 완료!', color: 'from-red-100 to-pink-100' }
        ] 
    },
];

const BreedCard = ({ breed }: { breed: any }) => (
    <Link to={`/blog/${breed.id}`} className="group">
      <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-white to-pink-50/30 border-2 border-pink-100 hover:border-pink-300 rounded-3xl">
        <CardHeader className="p-0 relative">
          <div className="absolute top-3 right-3 z-10 bg-white/80 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Heart className="h-4 w-4 text-pink-500" />
          </div>
          <img src={breed.thumbnail_url || 'https://via.placeholder.com/300'} alt={breed.name_ko} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent h-16" />
        </CardHeader>
        <CardContent className="p-4 relative">
          <div className="absolute -top-6 left-4 bg-white rounded-full p-2 shadow-lg border-2 border-pink-200">
            <PawPrint className="h-4 w-4 text-pink-500" />
          </div>
          <CardTitle className="text-lg font-bold text-gray-800 mt-2 group-hover:text-pink-600 transition-colors">{breed.name_ko}</CardTitle>
          <p className="text-sm text-gray-500 font-medium">{breed.name_en}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <span className="text-xs bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 px-3 py-1.5 rounded-full font-semibold border border-pink-200">{breed.size_type || '정보 없음'}</span>
        </CardFooter>
      </Card>
    </Link>
);

const FilterWizardPage: React.FC = () => {
    const { currentStep, answers, setAnswer, setCurrentStep, reset } = useWizardStore();
    
    const mutation = useMutation({
        mutationFn: async (newAnswers: Record<string, string>) => {
            const response = await woofpediaClient.rpc('get_filtered_breeds', { p_answers: newAnswers });
            return response.data;
        },
    });

    const handleAnswerSelect = (questionId: string, answerValue: string) => {
        const newAnswers = { ...answers, [questionId]: answerValue };
        setAnswer(questionId, answerValue);
        
        if (currentStep === questions.length - 1) {
            mutation.mutate(newAnswers);
        }
        handleNext();
    };

    const handleNext = () => {
        if (currentStep < questions.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
            mutation.reset();
        }
    };
    
    const handleReset = () => {
        reset();
        mutation.reset();
    }

    const progressValue = (currentStep / questions.length) * 100;
    const currentQuestion = questions[currentStep];

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
                <div className="container mx-auto px-4 py-12">
                    <Link to="/" className="inline-flex items-center text-pink-600 hover:text-pink-700 font-semibold mb-8 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border-2 border-pink-200 hover:border-pink-300 transition-all duration-200 hover:shadow-md">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        메인으로 돌아가기
                    </Link>
                    
                    <div className="text-center mb-12 relative">
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4">
                            <Wand2 className="h-8 w-8 text-purple-400 animate-bounce" />
                        </div>
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
                            <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                                나에게 꼭 맞는 견종 찾기
                            </span>
                        </h1>
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 font-light leading-relaxed">
                            🪄 네 가지 마법 같은 질문에 답하고, 당신의 라이프스타일에 완벽한 반려견을 만나보세요!
                        </p>
                    </div>

                    <Card className="w-full max-w-4xl mx-auto mb-12 bg-white/90 backdrop-blur-sm border-2 border-pink-100 rounded-3xl shadow-2xl overflow-hidden">
                        <CardHeader className="text-center bg-gradient-to-r from-pink-50 to-purple-50 border-b border-pink-100">
                            {currentStep < questions.length ? (
                                <>
                                    <div className="flex justify-center mb-4">
                                        <div className="bg-white rounded-full p-4 shadow-lg border-2 border-pink-200">
                                            <span className="text-3xl">{currentQuestion.emoji}</span>
                                        </div>
                                    </div>
                                    <CardTitle className="text-2xl md:text-3xl font-bold text-gray-800">
                                        맞춤 견종 찾기 ({currentStep + 1}/{questions.length})
                                    </CardTitle>
                                    <CardDescription className="text-lg text-gray-600 mt-2 font-medium">
                                        {currentQuestion.title}
                                    </CardDescription>
                                </>
                            ) : (
                                <>
                                    <div className="flex justify-center mb-4">
                                        <div className="bg-white rounded-full p-4 shadow-lg border-2 border-pink-200">
                                            <Sparkles className="h-8 w-8 text-purple-500" />
                                        </div>
                                    </div>
                                    <CardTitle className="text-2xl md:text-3xl font-bold">
                                        <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                                            결과 확인
                                        </span>
                                    </CardTitle>
                                    <CardDescription className="text-lg text-gray-600 mt-2 font-medium">
                                        당신에게 꼭 맞는 견종들을 찾아냈어요! 🐾✨
                                    </CardDescription>
                                </>
                            )}
                        </CardHeader>
                        
                        <CardContent className="p-8">
                            {/* 진행률 바 */}
                            <div className="mb-8">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-semibold text-gray-600">진행률</span>
                                    <span className="text-sm font-bold text-pink-600">{Math.round(progressValue)}%</span>
                                </div>
                                <Progress 
                                    value={progressValue} 
                                    className="h-4 bg-gray-100 [&>*]:bg-gradient-to-r [&>*]:from-pink-400 [&>*]:via-purple-400 [&>*]:to-blue-400 rounded-full" 
                                />
                            </div>
                            
                            {currentStep < questions.length && (
                                <div className="grid grid-cols-1 gap-4">
                                    {questions[currentStep].options.map((option, index) => (
                                        <Button 
                                            key={option.value} 
                                            variant="outline" 
                                            size="lg" 
                                            className={`justify-start p-6 text-left h-auto text-base border-2 rounded-2xl transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 bg-gradient-to-r ${option.color} border-pink-200 hover:border-pink-300 text-gray-700 hover:text-gray-800`}
                                            onClick={() => handleAnswerSelect(questions[currentStep].id, option.value)}
                                            style={{ animationDelay: `${index * 0.1}s` }}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className="bg-white rounded-full p-2 shadow-sm">
                                                    <PawPrint className="h-4 w-4 text-pink-500" />
                                                </div>
                                                <span className="font-medium">{option.label}</span>
                                            </div>
                                        </Button>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                        
                        <CardFooter className="flex justify-between bg-gradient-to-r from-gray-50 to-pink-50 p-6 border-t border-pink-100">
                            {currentStep > 0 ? (
                                <Button 
                                    variant="ghost" 
                                    onClick={handlePrev} 
                                    className="text-gray-600 hover:text-pink-600 hover:bg-pink-50 rounded-full px-6"
                                >
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    이전
                                </Button>
                            ) : <div />}
                            
                            {currentStep === questions.length && (
                                <Button 
                                    onClick={handleReset} 
                                    className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-full px-6 shadow-lg"
                                >
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    다시하기
                                </Button>
                            )}
                        </CardFooter>
                    </Card>

                    {/* 로딩 상태 */}
                    {mutation.isPending && (
                        <div className="text-center py-16">
                            <div className="relative inline-block">
                                <Loader2 className="h-16 w-16 animate-spin text-pink-500" />
                                <Wand2 className="h-8 w-8 text-purple-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                            </div>
                            <p className="mt-6 text-xl text-gray-600 font-medium">🔮 마법을 부리는 중... 최적의 견종을 찾고 있어요!</p>
                        </div>
                    )}
                    
                    {/* 에러 상태 */}
                    {mutation.isError && (
                        <div className="text-center py-16">
                            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border-2 border-red-200 max-w-md mx-auto">
                                <p className="text-red-500 text-lg font-semibold">앗! 마법이 실패했어요 😢</p>
                                <p className="text-red-400 text-sm mt-2">{mutation.error?.message}</p>
                            </div>
                        </div>
                    )}
                    
                    {/* 성공 결과 */}
                    {mutation.isSuccess && mutation.data?.data && (
                        <div className="animate-in fade-in-50 duration-500">
                            <div className="text-center mb-8">
                                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border-2 border-green-200 max-w-2xl mx-auto">
                                    <Sparkles className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                                    <p className="text-xl text-gray-700 font-semibold">
                                        🎉 총 <span className="font-bold text-pink-600 text-2xl">{mutation.data.data.length}</span>마리의 
                                        <span className="font-bold text-purple-600">완벽한 짝꿍</span>을 찾았어요!
                                    </p>
                                    <p className="text-sm text-gray-500 mt-2">(인지도 순으로 정렬)</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
                                {mutation.data.data.map((breed: any) => (
                                    <BreedCard key={breed.id} breed={breed} />
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {/* 빈 결과 */}
                    {mutation.isSuccess && (!mutation.data?.data || mutation.data.data.length === 0) && (
                        <div className="text-center py-16">
                            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 border-2 border-gray-200 max-w-md mx-auto">
                                <PawPrint className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-lg text-gray-600 font-semibold mb-2">아쉽지만, 모든 조건에 맞는 견종을 찾지 못했어요 😢</p>
                                <p className="text-sm text-gray-500">조건을 변경하여 다시 시도해 보세요!</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}

export default FilterWizardPage;
