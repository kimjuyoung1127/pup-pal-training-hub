import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, Zap } from 'lucide-react';
import { TrainingProgram } from '@/lib/trainingData';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { Progress } from "@/components/ui/progress";
import TrainingTimer from './TrainingTimer';

interface TrainingStepsProps {
  program: TrainingProgram;
  onFinish: (actualDuration: number) => void;
  isReplay?: boolean;
}

const TrainingSteps = ({
  program,
  onFinish,
  isReplay = false
}: TrainingStepsProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [currentStep, setCurrentStep] = useState(0);
  const [stepTimeLeft, setStepTimeLeft] = useState(program.steps[0]?.duration_seconds || 60);
  const [isStepTimeUp, setIsStepTimeUp] = useState(false);

  const [overallStartTime] = useState(Date.now());
  const [isPaused, setIsPaused] = useState(isReplay);

  const handleStepChange = useCallback((newStepIndex: number) => {
    setCurrentStep(newStepIndex);
    const newDuration = program.steps[newStepIndex]?.duration_seconds || 60;
    setStepTimeLeft(newDuration);
    setIsStepTimeUp(false);
  }, [program.steps]);

  useEffect(() => {
    if (!api) return;
    
    const handleSelect = () => {
      handleStepChange(api.selectedScrollSnap());
    };

    api.on("select", handleSelect);
    // 초기 단계 설정
    handleStepChange(api.selectedScrollSnap());

    return () => {
      api.off("select", handleSelect);
    };
  }, [api, handleStepChange]);

  const handleFinish = () => {
    const endTime = Date.now();
    const actualDuration = Math.round((endTime - overallStartTime) / 1000);
    onFinish(actualDuration);
  };

  // useCallback으로 메모이제이션하여 불필요한 리렌더링 방지
  const handleTimerTick = useCallback((timeLeft: number) => {
    setStepTimeLeft(timeLeft);
    if (timeLeft < 0) {
      setIsStepTimeUp(true);
    }
  }, []); // 빈 의존성 배열로 함수가 재생성되지 않도록 함

  const currentStepDuration = program.steps[currentStep]?.duration_seconds || 60;
  const isFinishButtonEnabled = currentStep === program.steps.length - 1;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 100 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -100 }} 
      className="p-4 md:p-6 flex flex-col h-full"
    >
      {!isReplay && (
        <TrainingTimer
          key={currentStep}
          initialDuration={currentStepDuration}
          isPaused={isPaused}
          onTick={handleTimerTick} // 메모이제이션된 콜백 사용
        />
      )}
      
      <div className="flex-grow flex flex-col items-center justify-center">
        <Carousel setApi={setApi} className="w-full max-w-md">
          <CarouselContent>
            {program.steps.map((step, index) => (
              <CarouselItem key={index}>
                <Card className="border-sky-200 bg-sky-50/80 shadow-sm">
                  <CardContent className="flex flex-col items-center justify-center p-6 text-center aspect-video md:aspect-square">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-sky-500 text-white font-bold text-xl mb-4">
                      {index + 1}
                    </div>
                    <h3 className="text-2xl font-bold text-sky-800 mb-4">{step.title}</h3>
                    <p className="text-lg text-gray-700 mb-6">{step.instruction}</p>
                    {step.tip && (
                      <p className="text-sm text-sky-700 bg-sky-100 p-3 rounded-lg">
                        <Zap className="inline-block w-4 h-4 mr-2" /> {step.tip}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious 
            className="left-[-16px] md:left-[-50px] bg-sky-100 hover:bg-sky-200 text-sky-700 border-sky-200 disabled:opacity-50"
            disabled={currentStep === 0}
          />
          <CarouselNext 
            className="right-[-16px] md:right-[-50px] bg-sky-100 hover:bg-sky-200 text-sky-700 border-sky-200 disabled:opacity-50"
            // 시간이 다 되면 다음 버튼이 활성화되도록 할 수 있습니다.
            disabled={currentStep === program.steps.length - 1}
          />
        </Carousel>
      </div>
      
      <Progress value={(currentStep + 1) / program.steps.length * 100} className="w-full my-4 [&>div]:bg-sky-600" />
      
      <Button 
        onClick={handleFinish} 
        size="lg" 
        className="bg-sky-600 hover:bg-sky-700 text-white w-full py-4 mt-4 font-bold text-lg disabled:bg-gray-400"
        disabled={!isFinishButtonEnabled}
      >
        <Check className="mr-2" />
        {isReplay ? '재생 완료' : '훈련 완료'}
      </Button>
    </motion.div>
  );
};

export default TrainingSteps;
