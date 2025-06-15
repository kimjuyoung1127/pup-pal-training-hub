import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Play, Check, X, Award, Star, ThumbsUp, ThumbsDown } from 'lucide-react';
import { trainingPrograms, TrainingProgram, TrainingStep } from '@/lib/trainingData';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { useTrainingHistory, TrainingLogCreate } from '@/hooks/useTrainingHistory';
import { Progress } from "@/components/ui/progress";

interface TrainingProgressPageProps {
  trainingId?: string;
  trainingProgram?: TrainingProgram;
  onNavigate: (page: string) => void;
  onExit: () => void;
}

const TrainingProgressPage = ({ trainingId, onNavigate, onExit, trainingProgram }: TrainingProgressPageProps) => {
  const [flowStep, setFlowStep] = useState(1); // 1: intro, 2: steps, 3: log, 4: summary
  const [currentStep, setCurrentStep] = useState(0);
  const [api, setApi] = React.useState<CarouselApi>()
  const [startTime, setStartTime] = useState<number | null>(null);
  const [trainingResult, setTrainingResult] = useState<{ success: boolean | null, notes: string }>({ success: null, notes: '' });
  const { addMutation } = useTrainingHistory();
  
  const program = trainingProgram || (trainingId ? trainingPrograms[trainingId] : null);

  useEffect(() => {
    if (!api) return;
    setCurrentStep(api.selectedScrollSnap());
    api.on("select", () => setCurrentStep(api.selectedScrollSnap()));
  }, [api]);

  if (!program) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-cream-50">
        <p className="text-lg text-cream-700">훈련 프로그램을 찾을 수 없습니다.</p>
        <Button onClick={onExit} className="mt-4">돌아가기</Button>
      </div>
    );
  }
  const { Icon, title, description, difficulty, duration, steps } = program;

  const handleStart = () => {
    setStartTime(Date.now());
    setFlowStep(2);
  };

  const handleFinishSteps = () => {
    setFlowStep(3);
  }

  const handleSave = () => {
    if (trainingResult.success === null || !startTime) return;

    const durationMinutes = Math.round((Date.now() - startTime) / (1000 * 60));
    const newLog: TrainingLogCreate = {
      training_type: title,
      duration_minutes: durationMinutes,
      success_rate: trainingResult.success ? 100 : 50,
      notes: trainingResult.notes,
    };
    addMutation.mutate(newLog, {
      onSuccess: () => {
        setFlowStep(4);
      }
    });
  };

  const renderIntro = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6 text-center flex flex-col items-center justify-center h-full">
      <Icon className="w-20 h-20 text-orange-500 mb-4" />
      <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
      <p className="text-cream-700 mt-2 mb-4">{description}</p>
      <div className="flex space-x-4 text-cream-600 mb-8">
        <span>{difficulty}</span>
        <span>·</span>
        <span>{duration}</span>
      </div>
      <Button onClick={handleStart} size="lg" className="btn-primary w-full py-4 text-lg">
        <Play className="mr-2" />
        훈련 시작하기
      </Button>
    </motion.div>
  );

  const renderSteps = () => (
    <motion.div initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }} className="p-6 flex flex-col h-full">
      <div className="flex-grow flex flex-col items-center justify-center">
        <Carousel setApi={setApi} className="w-full max-w-md">
          <CarouselContent>
            {steps.map((step, index) => (
              <CarouselItem key={index}>
                <Card className="card-soft">
                  <CardContent className="flex flex-col items-center justify-center p-6 text-center aspect-square">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">{step.title}</h3>
                    <p className="text-lg text-cream-800 mb-6">{step.instruction}</p>
                    {step.tip && <p className="text-sm text-orange-600 bg-orange-50 p-2 rounded-lg">💡 {step.tip}</p>}
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-[-50px]" />
          <CarouselNext className="right-[-50px]" />
        </Carousel>
      </div>
      <Progress value={((currentStep + 1) / steps.length) * 100} className="w-full my-4" />
      {currentStep === steps.length - 1 && (
        <Button onClick={handleFinishSteps} size="lg" className="btn-primary w-full py-4 mt-4">
          <Check className="mr-2" />
          훈련 완료
        </Button>
      )}
    </motion.div>
  );

  const renderLog = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6 flex flex-col h-full space-y-6">
      <h2 className="text-2xl font-bold text-center text-gray-800">훈련은 어땠나요?</h2>
      <div className="grid grid-cols-2 gap-4">
        <Button
          onClick={() => setTrainingResult(prev => ({...prev, success: true}))}
          variant={trainingResult.success === true ? 'default' : 'outline'}
          className={`py-8 text-lg ${trainingResult.success === true ? 'btn-primary' : ''}`}
        >
          <ThumbsUp className="mr-2" /> 성공했어요!
        </Button>
        <Button
          onClick={() => setTrainingResult(prev => ({...prev, success: false}))}
          variant={trainingResult.success === false ? 'destructive' : 'outline'}
          className="py-8 text-lg"
        >
          <ThumbsDown className="mr-2" /> 어려웠어요
        </Button>
      </div>
      <div>
        <label htmlFor="notes" className="font-bold text-gray-800">오늘의 기록</label>
        <Textarea
          id="notes"
          placeholder="딩딩이가 집중을 잘했어요!"
          className="mt-2 min-h-[120px] input-soft"
          value={trainingResult.notes}
          onChange={(e) => setTrainingResult(prev => ({...prev, notes: e.target.value}))}
        />
      </div>
      <Button onClick={handleSave} disabled={trainingResult.success === null || addMutation.isPending} size="lg" className="btn-primary w-full py-4">
        {addMutation.isPending ? "저장 중..." : "훈련 완료 기록하기"}
      </Button>
    </motion.div>
  );

  const renderSummary = () => (
    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="p-6 text-center flex flex-col items-center justify-center h-full">
      <Award className="w-20 h-20 text-yellow-500 mb-4 animate-bounce-gentle" />
      <h1 className="text-3xl font-bold text-gray-800">훈련 완료!</h1>
      <p className="text-cream-700 mt-2 mb-6">수고했어요! 오늘도 한 걸음 성장했네요.</p>
      
      <Card className="card-soft p-4 mb-8 w-full">
        <p className="font-bold text-lg text-orange-600">🏅 '첫 훈련 파트너' 뱃지를 획득했어요!</p>
      </Card>

      <div className="space-y-4 w-full">
        <Button onClick={() => onNavigate('history')} size="lg" className="w-full btn-secondary">
          기록 페이지로 이동
        </Button>
        <Button onClick={onExit} size="lg" variant="ghost" className="w-full text-cream-600">
          홈으로 돌아가기
        </Button>
      </div>
    </motion.div>
  );

  const renderContent = () => {
    switch (flowStep) {
      case 1: return renderIntro();
      case 2: return renderSteps();
      case 3: return renderLog();
      case 4: return renderSummary();
      default: return renderIntro();
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 flex flex-col">
      <header className="p-4">
        <Button variant="ghost" size="icon" onClick={flowStep === 1 ? onExit : () => setFlowStep(prev => prev - 1)}>
          <ArrowLeft />
        </Button>
      </header>
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default TrainingProgressPage;
