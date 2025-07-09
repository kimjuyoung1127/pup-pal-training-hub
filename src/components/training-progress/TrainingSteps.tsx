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
                <Card className="border-sky-200 bg-sky-50">
                  <CardContent className="flex flex-col items-center justify-center p-6 text-center aspect-square">
                    <h3 className="text-2xl font-bold text-sky-800 mb-4">{step.title}</h3>
                    <p className="text-lg text-gray-700 mb-6">{step.instruction}</p>
                    {step.tip && <p className="text-sm text-sky-700 bg-sky-100 p-3 rounded-lg">💡 {step.tip}</p>}
                  </CardContent>
                </Card>
              </CarouselItem>)}
          </CarouselContent>
          <CarouselPrevious className="left-[-50px] bg-sky-100 hover:bg-sky-200 text-sky-700 border-sky-200" />
          <CarouselNext className="right-[-50px] bg-sky-100 hover:bg-sky-200 text-sky-700 border-sky-200" />
        </Carousel>
      </div>
      <Progress value={(currentStep + 1) / steps.length * 100} className="w-full my-4 [&>div]:bg-sky-600" />
      {currentStep === steps.length - 1 && <Button onClick={onFinishSteps} size="lg" className="bg-sky-600 hover:bg-sky-700 text-white w-full py-4 mt-4">
          <Check className="mr-2" />
          {isReplay ? '재생 완료' : '훈련 완료'}
        </Button>}
    </motion.div>;
};

export default TrainingSteps;