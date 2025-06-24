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
                <Card className="card-soft">
                  <CardContent className="flex flex-col items-center justify-center p-6 text-center aspect-square bg-sky-200">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">{step.title}</h3>
                    <p className="text-lg text-cream-800 mb-6">{step.instruction}</p>
                    {step.tip && <p className="text-sm text-orange-600 bg-orange-50 p-2 rounded-lg">💡 {step.tip}</p>}
                  </CardContent>
                </Card>
              </CarouselItem>)}
          </CarouselContent>
          <CarouselPrevious className="left-[-50px]" />
          <CarouselNext className="right-[-50px]" />
        </Carousel>
      </div>
      <Progress value={(currentStep + 1) / steps.length * 100} className="w-full my-4" />
      {currentStep === steps.length - 1 && <Button onClick={onFinishSteps} size="lg" className="btn-primary w-full py-4 mt-4">
          <Check className="mr-2" />
          {isReplay ? '재생 완료' : '훈련 완료'}
        </Button>}
    </motion.div>;
};

export default TrainingSteps;