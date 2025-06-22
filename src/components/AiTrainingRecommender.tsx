
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useDogProfile } from '@/hooks/useDogProfile';
import { supabase } from '@/integrations/supabase/client';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loader2, Wand2, Star, CheckCircle, List, AlertTriangle } from 'lucide-react';
import { TrainingProgram } from '@/lib/trainingData';
import { motion } from 'framer-motion';
import { Badge } from './ui/badge';

// 확장된 필드를 포함하도록 인터페이스 업데이트
interface AiTrainingProgram {
  title: string;
  description: string;
  difficulty: '초급' | '중급' | '고급';
  duration: string;
  benefits: string[];
  equipment: string[];
  caution: string;
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
      delete fullProfile.id;
      delete fullProfile.dog_id;
      delete fullProfile.created_at;
      delete fullProfile.updated_at;
      
      // 확장된 프롬프트
      const prompt = `당신은 반려견 행동 교정 및 피트니스 전문가입니다. 다음 강아지 프로필을 바탕으로, 전문적이고 과학적인 근거에 기반한 맞춤형 훈련 2가지를 추천해주세요. 이전에 추천했을 법한 일반적인 훈련이 아닌, 강아지의 특성(나이, 품종, 건강 상태, 활동 수준, 성격, 약한 부위)을 종합적으로 고려하여 창의적이고 효과적인 훈련을 제안해야 합니다. 특히, 약한 부위가 있다면 해당 부위를 직접적으로 자극하지 않으면서도 간접적으로 강화할 수 있는 운동을 포함해주세요.\n\n강아지 프로필: ${JSON.stringify(fullProfile, null, 2)}\n\n각 훈련 추천은 다음 항목을 반드시 포함해야 합니다:\n1.  **title**: 훈련의 이름 (예: '코어 강화를 위한 밸런스 보드 챌린지')\n2.  **description**: 훈련의 목적과 강아지에게 어떤 도움이 되는지에 대한 상세한 설명\n3.  **difficulty**: 난이도 ('초급', '중급', '고급')\n4.  **duration**: 예상 소요 시간 (예: '15-20분')\n5.  **benefits**: 이 훈련을 통해 얻을 수 있는 주요 이점 3가지 (배열 형태, 예: ["코어 근육 강화", "집중력 향상", "자신감 증진"])\n6.  **equipment**: 필요한 도구 (배열 형태, 없으면 빈 배열, 예: ["밸런스 보드", "간식"])\n7.  **caution**: 훈련 시 주의해야 할 사항이나 잠재적 위험\n8.  **steps**: 단계별 훈련 방법 (최소 5단계 이상, 각 단계는 title, instruction, tip 포함)\n\n전체 응답은 반드시 아래와 같은 JSON 배열 형식이어야 하며, 다른 설명 없이 JSON 데이터만 반환해주세요:\n[{ "title": string, "description": string, "difficulty": "초급" | "중급" | "고급", "duration": string, "benefits": string[], "equipment": string[], "caution": string, "steps": [{ "title": string, "instruction": string, "tip": string | null }] }]
`;

      const { data, error } = await supabase.functions.invoke('gemini-chat', {
        body: { history: [{ role: 'user', parts: [{ text: prompt }] }] },
      });

      if (error) throw error;

      try {
        let cleanedResponse = data.response.replace(/```json/g, '').replace(/```/g, '').trim();
        
        const startIndex = cleanedResponse.indexOf('[');
        let lastIndex = cleanedResponse.lastIndexOf(']');

        if (startIndex !== -1 && lastIndex > startIndex) {
          let jsonString = cleanedResponse.substring(startIndex, lastIndex + 1);

          // Attempt to fix incomplete JSON
          // Find the last complete object
          const lastBrace = jsonString.lastIndexOf('}');
          const lastComma = jsonString.lastIndexOf(',');

          if (lastBrace > -1 && lastComma > lastBrace) {
             // if comma is after the last brace, it's likely a trailing comma from a truncated object
             jsonString = jsonString.substring(0, lastComma);
          }

          // Ensure the structure is a valid array of objects before closing the array
          if (!jsonString.endsWith('}')) {
            const lastCompleteObjectEnd = jsonString.lastIndexOf('}');
            if(lastCompleteObjectEnd !== -1) {
              jsonString = jsonString.substring(0, lastCompleteObjectEnd + 1);
            }
          }

          // Re-add the closing bracket for the array
          if (!jsonString.endsWith(']')) {
            jsonString += ']';
          }

          return JSON.parse(jsonString) as AiTrainingProgram[];
        } else {
          throw new Error("Incomplete or invalid JSON array structure in AI response.");
        }
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
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2"> 
              {recommendTrainingMutation.data.map((training, index) => (
                <Card 
                  key={index} 
                  onClick={() => handleSelect(training)}
                  className={`cursor-pointer transition-all bg-white/60 hover:bg-white flex flex-col ${selectedTrainingTitle === training.title ? 'border-orange-500 ring-2 ring-orange-400' : 'border-cream-200 shadow-sm hover:shadow-md'}`}
                >
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-slate-800">{training.title}</CardTitle>
                    <div className="flex items-center space-x-2 text-xs text-slate-600 mt-1">
                      <Badge variant="outline" className="border-orange-300 text-orange-800">{training.difficulty}</Badge>
                      <Badge variant="outline" className="border-sky-300 text-sky-800">{training.duration}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col justify-between p-6">
                    <p className="text-sm text-slate-700 mb-6">{training.description}</p>
                    <div className="space-y-4 text-sm">
                      <div>
                        <h4 className="font-semibold flex items-center mb-2 text-slate-700"><CheckCircle className="w-5 h-5 mr-2 text-green-500"/>기대 효과</h4>
                        <div className="flex flex-wrap gap-2">
                          {training.benefits.map(b => <Badge key={b} variant="secondary" className="bg-green-100 text-green-800">{b}</Badge>)} 
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold flex items-center mb-2 text-slate-700"><List className="w-5 h-5 mr-2 text-blue-500"/>필요 도구</h4>
                        <div className="flex flex-wrap gap-2">
                          {training.equipment.length > 0 ? training.equipment.map(e => <Badge key={e} variant="secondary" className="bg-blue-100 text-blue-800">{e}</Badge>) : <Badge variant="secondary" className="bg-gray-100 text-gray-800">특별한 도구 필요 없음</Badge>}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold flex items-center mb-2 text-slate-700"><AlertTriangle className="w-5 h-5 mr-2 text-red-500"/>주의사항</h4>
                        <p className="text-slate-600 bg-red-50/50 p-3 rounded-lg">{training.caution}</p>
                      </div>
                    </div>
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
