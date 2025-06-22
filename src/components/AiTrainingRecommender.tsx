
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
      const prompt = `당신은 반려견 행동 수정 전문가입니다.

      다음 강아지 프로필을 기반으로, **전문적이고 창의적인 맞춤형 훈련 2가지**를 추천해주세요. 
      이전에도 흔히 추천했을 법한 훈련이 아닌, **강아지의 나이, 품종, 건강 상태, 활동 수준, 성격, 약한 부위**를 종합적으로 고려해 주세요.
      
      📌 주의사항:
      - 사용자의 훈련 목표를 위주로 훈련을 추천해주세요.
      - 사용자가 읽기 쉽도록 **짧은 문장**, **강조가 필요한 부분은 명확히**, **훈련 목적이 분명한 설명**을 작성해주세요.
      
      🐶 강아지 프로필:
      ${JSON.stringify(fullProfile, null, 2)}
      
      📋 훈련 하나당 반드시 다음 구조를 따르세요:
      {
        "title": "훈련 이름 (예: '짖음 감소를 위한 훈련')",
        "description": "훈련의 목적과 강아지에게 주는 효과를 간결하고 쉽게 설명",
        "difficulty": "초급 | 중급 | 고급",
        "duration": "예상 소요 시간 (예: '10~15분')",
        "benefits": ["훈련을 통해 얻을 수 있는 핵심 효과 3가지", "예: '짖음감소'", "예: '사회성 증가'"],
        "equipment": ["필요한 도구 목록. 없으면 빈 배열 []", "예: '방석', '간식'"],
        "caution": "훈련 중 주의할 점 또는 위험 요소",
        "steps": [
          {
            "title": "단계 이름",
            "instruction": "실행 방법 (짧고 명확하게)",
            "tip": "부드러운 진행을 위한 팁 (없으면 null)"
          },
          ...최소 5단계 이상...
        ]
      }
      
      🎯 응답 전체는 반드시 아래와 같은 **JSON 배열 2개**로 구성된 **JSON만 반환**하세요.
      (설명 없이 JSON만 제공해야 합니다):
      
      [
        { ...훈련1 },
        { ...훈련2 }
      ]
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
