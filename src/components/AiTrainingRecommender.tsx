
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useDogProfile } from '@/hooks/useDogProfile';
import { supabase } from '@/integrations/supabase/client';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loader2, Wand2, Star } from 'lucide-react';
import { TrainingProgram } from '@/lib/trainingData';
import { motion } from 'framer-motion';

interface AiTrainingProgram {
  title: string;
  description: string;
  difficulty: '초급' | '중급' | '고급';
  duration: string;
  steps: { title: string; instruction: string; tip?: string | null; }[];
}

interface AiTrainingRecommenderProps {
  onSelectTraining: (training: TrainingProgram) => void;
  selectedTrainingTitle: string | null;
}

const AiTrainingRecommender = ({ onSelectTraining, selectedTrainingTitle }: AiTrainingRecommenderProps) => {
  const { dogInfo, extendedProfile, isLoading: isProfileLoading } = useDogProfile();

  const recommendTrainingMutation = useMutation({
    mutationFn: async () => {
      if (!dogInfo) throw new Error('강아지 프로필이 없습니다.');
      
      const fullProfile = { ...dogInfo, ...extendedProfile };
      // 민감할 수 있는 정보나 불필요한 정보 제거
      delete fullProfile.id;
      delete fullProfile.dog_id;
      delete fullProfile.created_at;
      delete fullProfile.updated_at;
      
      const prompt = `강아지 프로필: ${JSON.stringify(fullProfile, null, 2)}. 이 프로필을 바탕으로 개인화된 훈련 3가지를 추천해주세요. 이전에 추천했던 훈련과는 다른, 다양하고 새로운 훈련을 추천하는 것이 중요합니다. 각 훈련은 제목, 설명, 난이도('초급', '중급', '고급' 중 하나), 예상 소요 시간(예: '10-15분'), 그리고 단계별 지침 배열(각 단계는 제목, 지침, 팁 포함)을 포함해야 합니다. 전체 응답은 반드시 다음 구조의 JSON 배열이어야 합니다: [{title: string, description: string, difficulty: '초급' | '중급' | '고급', duration: string, steps: [{title: string, instruction: string, tip: string | null}]}]`;

      const { data, error } = await supabase.functions.invoke('gemini-chat', {
        body: { history: [{ role: 'user', parts: [{ text: prompt }] }] },
      });

      if (error) throw error;

      try {
        const cleanedResponse = data.response.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanedResponse) as AiTrainingProgram[];
      } catch (e) {
        console.error("Failed to parse AI response:", e, "Raw response:", data.response);
        throw new Error("AI로부터 유효한 훈련 계획을 받지 못했습니다.");
      }
    },
    onSuccess: () => {
      toast.success('AI 훈련 추천을 생성했습니다!');
    },
    onError: (error: any) => {
      toast.error('AI 추천 생성에 실패했습니다.', { description: error.message });
    },
  });

  const handleSelect = (aiTraining: AiTrainingProgram) => {
    const trainingProgram: TrainingProgram = {
      ...aiTraining,
      id: `ai-${aiTraining.title}`,
      color: 'orange',
      Icon: Star,
    };
    onSelectTraining(trainingProgram);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="card-soft bg-gradient-to-br from-orange-50 to-amber-100 border-orange-200/50">
        <CardHeader>
          <CardTitle className="flex items-center font-bold text-gray-800"><Wand2 className="mr-2 text-orange-500" />AI 맞춤 훈련 추천</CardTitle>
          <CardDescription className="text-gray-600">우리 강아지의 프로필을 기반으로 AI가 맞춤 훈련을 추천해드려요.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {recommendTrainingMutation.isPending && (
            <div className="flex justify-center items-center p-4">
              <Loader2 className="animate-spin w-8 h-8 text-orange-500" />
              <p className="ml-2 text-gray-700">AI가 열심히 훈련 계획을 짜고 있어요...</p>
            </div>
          )}
          {recommendTrainingMutation.isError && (
             <p className="text-red-500 text-center">{recommendTrainingMutation.error.message}</p>
          )}
          {recommendTrainingMutation.data && (
            <div className="grid gap-4 md:grid-cols-3">
              {recommendTrainingMutation.data.map((training, index) => (
                <Card 
                  key={index} 
                  onClick={() => handleSelect(training)}
                  className={`cursor-pointer transition-all bg-white/50 hover:bg-white ${selectedTrainingTitle === training.title ? 'border-orange-500 ring-2 ring-orange-400' : 'border-cream-200'}`}
                >
                  <CardHeader>
                    <CardTitle className="text-base font-bold text-gray-800">{training.title}</CardTitle>
                    <CardDescription className="text-xs text-gray-600">{training.difficulty} · {training.duration}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700">{training.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <Button 
            onClick={() => recommendTrainingMutation.mutate()} 
            disabled={isProfileLoading || recommendTrainingMutation.isPending}
            className="w-full btn-secondary"
          >
            {isProfileLoading ? '프로필 로딩 중...' : (recommendTrainingMutation.isPending ? '생성 중...' : 'AI 훈련 추천 받기')}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AiTrainingRecommender;
