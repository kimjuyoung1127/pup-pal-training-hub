import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { TrainingStep } from '@/lib/trainingData';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { Progress } from "@/components/ui/progress";

interface TrainingStepsProps {
  steps: TrainingStep[];
  onFinishSteps: () => void;
  isReplay?: boolean;
}

const TrainingSteps = ({
  steps,
  onFinishSteps,
  isReplay = false
}: TrainingStepsProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [api, setApi] = useState<CarouselApi>();
  useEffect(() => {
    if (!api) return;
    setCurrentStep(api.selectedScrollSnap());
    api.on("select", () => setCurrentStep(api.selectedScrollSnap()));
  }, [api]);
  return <motion.div initial={{
    opacity: 0,
    x: 100
  }} animate={{
    opacity: 1,
    x: 0
  }} exit={{
    opacity: 0,
    x: -100
  }} className="p-6 flex flex-col h-full">
      <div className="flex-grow flex flex-col items-center justify-center">
        <Carousel setApi={setApi} className="w-full max-w-md">
          <CarouselContent>
            {steps.map((step, index) => <CarouselItem key={index}>
                <Card className="card-soft shadow-lg"> {/* 섀도우 추가 */}
                  <CardContent className="flex flex-col items-center justify-center p-6 text-center aspect-square bg-training-yellow-light rounded-lg"> {/* 배경 및 라운딩 변경 */}
                    <h3 className="text-xl font-bold text-training-yellow-text mb-4">{step.title}</h3> {/* 텍스트 색상 변경 */}
                    <p className="text-lg text-muted-foreground mb-6">{step.instruction}</p> {/* 텍스트 색상 변경 */}
                    {step.tip && <p className="text-sm text-training-yellow-dark bg-training-yellow/20 p-3 rounded-lg shadow">💡 {step.tip}</p>} {/* 팁 스타일 변경 */}
                  </CardContent>
                </Card>
              </CarouselItem>)}
          </CarouselContent>
          <CarouselPrevious className="left-[-50px] text-training-yellow-dark hover:bg-training-yellow-light hover:text-training-yellow-dark" /> {/* 아이콘 색상 변경 */}
          <CarouselNext className="right-[-50px] text-training-yellow-dark hover:bg-training-yellow-light hover:text-training-yellow-dark" /> {/* 아이콘 색상 변경 */}
        </Carousel>
      </div>
      <Progress value={(currentStep + 1) / steps.length * 100} className="w-full my-4 [&>div]:bg-training-yellow" /> {/* Progress bar 색상 변경 */}
      {currentStep === steps.length - 1 &&
        <Button
          onClick={onFinishSteps}
          size="lg"
          className="bg-training-yellow hover:bg-training-yellow/90 text-training-yellow-text w-full py-4 mt-4 shadow-md" /* 버튼 스타일 변경 */
        >
          <Check className="mr-2" />
          {isReplay ? '재생 완료' : '훈련 완료'}
        </Button>}
    </motion.div>;
};

export default TrainingSteps;