
import React, { useState, useEffect } from 'react';
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
import { useAiRecommendations, useSaveAiRecommendations, AiRecommendation } from '@/hooks/useAiRecommendations';

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
  selectedTrainingTitle: string | null; // 이 prop은 더 이상 하이라이트에 사용되지 않지만, 호환성을 위해 남겨둡니다.
}

const AiTrainingRecommender = ({ onSelectTraining }: AiTrainingRecommenderProps) => {
  const { dogInfo, extendedProfile, isLoading: isProfileLoading } = useDogProfile();
  const [aiRecommendations, setAiRecommendations] = useState<AiTrainingProgram[]>([]);
  const [highlightedTitle, setHighlightedTitle] = useState<string | null>(null);

  const { data: savedRecommendations, isLoading: isLoadingRecommendations } = useAiRecommendations(dogInfo?.id ? dogInfo.id : null);
  const saveRecommendationsMutation = useSaveAiRecommendations();

  useEffect(() => {
    if (savedRecommendations && savedRecommendations.length > 0) {
      // 가장 최근의 추천 기록만 사용합니다.
      const latestRecommendation = savedRecommendations[0];
      const parsedRecommendations = latestRecommendation.recommendations as unknown as AiTrainingProgram[];
      setAiRecommendations(parsedRecommendations || []);
    } else {
      setAiRecommendations([]);
    }
  }, [savedRecommendations]);

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

      다음 강아지 프로필과 **핵심 훈련 목표**를 기반으로, 전문적이고 창의적인 맞춤형 훈련 2가지를 추천해주세요.
      추천하는 훈련은 반드시 아래 **핵심 훈련 목표** 달성에 직접적으로 기여해야 합니다.
      강아지의 나이, 품종, 건강 상태, 활동 수준, 성격, 약한 부위 등 프로필 정보도 종합적으로 고려해주세요.
      긍정강화, 부정강화, 긍정처벌, 부정처벌 등 복합적인 트레이닝 방법을 활용하여 훈련 계획을 세워주세요.

      🎯 **핵심 훈련 목표:**
      ${JSON.stringify(fullProfile.trainingGoals, null, 2)}

      🐶 **강아지 프로필:**
      ${JSON.stringify(fullProfile, null, 2)}
      
      📋 훈련 하나당 반드시 다음 구조를 따르세요:
      {
        "title": "훈련 이름 (예: '짖음 감소를 위한 훈련')",
        "description": "훈련의 목적과 강아지에게 주는 효과를 간결하고 쉽게 설명",
        "difficulty": "초급 | 중급 | 고급",
        "duration": "예상 소요 시간 (15분 내외로')",
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

      const responseData = Array.isArray(data) ? data : data?.response;

      if (!responseData) {
        console.error("Invalid response structure from AI function:", data);
        throw new Error("AI 응답이 비어있거나 잘못된 형식입니다.");
      }

      try {
        // If responseData is already an object (array), stringify it for cleaning.
        // Otherwise, it's already a string.
        const responseString = typeof responseData === 'string' ? responseData : JSON.stringify(responseData);

        let cleanedResponse = responseString.replace(/```json/g, '').replace(/```/g, '').trim();
        
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
    onSuccess: (data) => {
      toast.success('AI 훈련 추천을 생성했습니다!');
      // 새로 생성된 추천으로 상태를 완전히 교체합니다.
      setAiRecommendations(data);
      if (dogInfo?.id) {
        saveRecommendationsMutation.mutate({ dogId: dogInfo.id, recommendations: data });
      }
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
      iconName: 'Star' // iconName을 Star로 명시적으로 지정
    };
    onSelectTraining(trainingProgram);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="bg-gradient-to-br from-sky-50 to-sky-100 border-sky-200/50">
        <CardHeader>
          <CardTitle className="flex items-center font-bold text-sky-900 text-xl"><Wand2 className="mr-2 text-sky-500" />AI 맞춤 훈련 추천</CardTitle>
          <CardDescription className="text-sky-700">우리 강아지의 프로필을 기반으로 AI가 맞춤 훈련을 추천해드려요.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {(recommendTrainingMutation.isPending || isLoadingRecommendations) && (
            <div className="flex justify-center items-center p-4">
              <Loader2 className="animate-spin w-8 h-8 text-sky-500" />
              <p className="ml-2 text-sky-700">AI가 열심히 훈련을 추천하고 있어요...</p>
            </div>
          )}

          {aiRecommendations.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2">
              {aiRecommendations.map((rec, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  onClick={() => setHighlightedTitle(rec.title)}
                  className="cursor-pointer h-full"
                >
                  <Card className={`bg-white/80 border-gray-200/80 flex flex-col h-full relative ${highlightedTitle === rec.title ? 'border-blue-500 ring-2 ring-blue-500' : ''}`}>
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-gray-800 pr-20">{rec.title}</CardTitle>
                      <Badge 
                        variant={rec.difficulty === '초급' ? 'default' : rec.difficulty === '중급' ? 'secondary' : 'destructive'} 
                        className={`w-fit ${rec.difficulty === '중급' ? 'bg-teal-500 text-white' : ''}`}>
                        {rec.difficulty}
                      </Badge>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
                      <div className="text-xs text-gray-500 space-y-1">
                        <p><Star className="inline-block w-3 h-3 mr-1.5 text-yellow-500" /><strong>효과:</strong> {rec.benefits.join(', ')}</p>
                        <p><CheckCircle className="inline-block w-3 h-3 mr-1.5 text-green-500" /><strong>준비물:</strong> {rec.equipment.length > 0 ? rec.equipment.join(', ') : '없음'}</p>
                        <p><AlertTriangle className="inline-block w-3 h-3 mr-1.5 text-red-500" /><strong>주의:</strong> {rec.caution}</p>
                      </div>
                    </CardContent>
                    <Button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelect(rec);
                      }}
                      className="absolute top-4 right-4 bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1 text-sm h-auto"
                    >
                      시작
                    </Button>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {aiRecommendations.length === 0 && !recommendTrainingMutation.isPending && !isLoadingRecommendations && (
            <div className="text-center py-6 bg-orange-50/50 rounded-lg">
              <p className="text-sm text-gray-500 mt-2">버튼을 눌러 AI에게 훈련을 추천받아보세요!</p>
            </div>
          )}

          <Button 
            onClick={() => recommendTrainingMutation.mutate()} 
            disabled={recommendTrainingMutation.isPending || isProfileLoading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold"
          >
            {recommendTrainingMutation.isPending ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> 추천 생성 중...</>
            ) : (
              <><Wand2 className="mr-2 h-4 w-4" /> AI 추천 다시 받기</>
            )}
          </Button>

          {dogInfo && extendedProfile ? null : (
            <div className="text-center text-sm text-red-500">
              <p className="text-sm text-gray-500 mt-2">버튼을 눌러 AI에게 훈련을 추천받아보세요!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AiTrainingRecommender;
