
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
  selectedTrainingTitle: string | null;
  trainingGoals?: string[]; // trainingGoals prop 추가
}

const AiTrainingRecommender = ({ onSelectTraining, trainingGoals }: AiTrainingRecommenderProps) => {
  const { dogInfo, extendedProfile, isLoading: isProfileLoading } = useDogProfile();
  const [aiRecommendations, setAiRecommendations] = useState<AiTrainingProgram[]>([]);
  const [highlightedTitle, setHighlightedTitle] = useState<string | null>(null);

  const { data: savedRecommendations, isLoading: isLoadingRecommendations } = useAiRecommendations(dogInfo?.id ? dogInfo.id : null);
  const saveRecommendationsMutation = useSaveAiRecommendations();

  useEffect(() => {
    console.log('[DEBUG] Saved recommendations loaded:', savedRecommendations);
    if (savedRecommendations && savedRecommendations.length > 0) {
      const latestRecommendation = savedRecommendations[0];
      const parsedRecommendations = latestRecommendation.recommendations as unknown as AiTrainingProgram[];
      console.log('[DEBUG] Parsed recommendations from saved data:', parsedRecommendations);
      setAiRecommendations(parsedRecommendations || []);
    } else {
      console.log('[DEBUG] No saved recommendations found.');
      setAiRecommendations([]);
    }
  }, [savedRecommendations]);

  const recommendTrainingMutation = useMutation({
    mutationFn: async () => {
      console.log('[DEBUG] Starting AI training recommendation mutation.');
      if (!dogInfo) throw new Error('강아지 프로필이 없습니다.');
      
      const fullProfile = { ...dogInfo, ...extendedProfile };
      delete fullProfile.id;
      delete fullProfile.dog_id;
      delete fullProfile.created_at;
      delete fullProfile.updated_at;
      
      console.log('[DEBUG] Training goals received:', trainingGoals);
      console.log('[DEBUG] Full dog profile for prompt:', fullProfile);

      const prompt = `당신은 반려견 행동 수정 전문가입니다.\n\n      다음 **핵심 훈련 목표**를 최우선으로 달성하기 위한 전문적이고 창의적인 맞춤형 훈련 2가지를 추천해주세요.\n      추천하는 훈련은 반드시 아래 **핵심 훈련 목표** 달성에 직접적으로 기여해야 합니다.\n      아래 **강아지 프로필**은 훈련 강도, 난이도, 주의사항 등을 설정할 때 참고용으로만 활용하세요.\n      훈련목표와 상관없는 추천은 금지\n      긍정강화, 부정강화, 긍정처벌, 부정처벌 등 복합적인 트레이닝 방법을 활용하여 훈련 계획을 세워주세요.\n\n      🎯 **핵심 훈련 목표 (가장 중요한 추천 기준):**\n      ${JSON.stringify(trainingGoals && trainingGoals.length > 0 ? trainingGoals : fullProfile.trainingGoals, null, 2)}\n\n      🐶 **강아지 프로필 (참고용):**\n      ${JSON.stringify(fullProfile, null, 2)}\n      \n      📋 훈련 하나당 반드시 다음 구조를 따르세요:\n      {\n        "title": "훈련 이름 (예: '짖음 감소를 위한 5분 집중 훈련')",\n        "description": "이 훈련은 [목표] 달성을 위한 짧은 세션입니다. 타이머와 함께 각 단계를 진행하며 반려견과의 유대감을 강화해보세요. 훈련의 목적과 강아지에게 주는 효과를 간결하고 쉽게 설명해주세요.",\n        "difficulty": "초급 | 중급 | 고급",\n        "duration": "5분에서 10분 사이에 완료할 수 있는 집중 훈련",\n        "benefits": ["훈련을 통해 얻을 수 있는 핵심 효과 3가지", "예: '짖음감소'", "예: '사회성 증가'"],\n        "equipment": ["필요한 도구 목록. 없으면 빈 배열 []", "예: '방석', '간식'"],\n        "caution": "훈련 중 주의할 점 또는 위험 요소",\n        "steps": [\n          {\n            "title": "단계 이름",\n            "instruction": "실행 방법 (예: '1분 동안 간식을 이용해 앉도록 유도하세요.')",\n            "tip": "부드러운 진행을 위한 팁 (없으면 null)",\n            "duration_seconds": 60\n          },\n          ...3~5개의 명확하고 간단한 단계...\n        ]\n      }\n      \n      🎯 응답 전체는 반드시 아래와 같은 **JSON 배열 2개**로 구성된 **JSON만 반환**하세요.\n      (설명 없이 JSON만 제공해야 합니다):\n      \n      [\n        { ...훈련1 },\n        { ...훈련2 }\n      ]\n      `;
      
      console.log('[DEBUG] Generated prompt for AI:', prompt);

      const { data, error } = await supabase.functions.invoke('gemini-chat', {
        body: { history: [{ role: 'user', parts: [{ text: prompt }] }] },
      });

      if (error) throw error;

      if (!data || !data.content) throw new Error('AI 응답이 비어있거나 content 필드가 없습니다.');
      
      console.log('[DEBUG] Raw AI response:', data);
      
      const responseString = data.content;

      const cleanedResponse = responseString
        .replace(/```json\n?/g, '')
        .replace(/```/g, '')
        .trim();

      const startIndex = cleanedResponse.indexOf('[');
      const endIndex = cleanedResponse.lastIndexOf(']');
      
      if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) {
        console.error('[DEBUG] Invalid JSON structure:', cleanedResponse);
        throw new Error('AI 응답에서 유효한 JSON 배열을 찾을 수 없습니다.');
      }

      let jsonString = cleanedResponse.substring(startIndex, endIndex + 1);
      
      try {
        const parsedData = JSON.parse(jsonString) as AiTrainingProgram[];
        
        if (!Array.isArray(parsedData) || parsedData.length === 0) {
          throw new Error('AI 응답이 유효한 훈련 프로그램 배열이 아닙니다.');
        }

        parsedData.forEach((program, index) => {
          if (!program.title || !program.description || !program.difficulty) {
            throw new Error(`훈련 프로그램 #${index + 1}에 필수 필드가 누락되었습니다.`);
          }
        });
        console.log('[DEBUG] Successfully parsed AI response:', parsedData);
        return parsedData;

      } catch (parseError: any) {
        console.error('[DEBUG] JSON parsing error:', parseError, '\nJSON string:', jsonString);
        throw new Error(`AI 응답 파싱 실패: ${parseError.message}`);
      }
    },
    onSuccess: (data) => {
      console.log('[DEBUG] Mutation onSuccess, received data:', data);
      toast.success('AI 훈련 추천을 생성했습니다!');
      setAiRecommendations(data);
      if (dogInfo?.id) {
        console.log('[DEBUG] Saving recommendations to DB for dogId:', dogInfo.id);
        saveRecommendationsMutation.mutate({ dogId: dogInfo.id, recommendations: data });
      }
    },
    onError: (error: any) => {
      console.error('[DEBUG] Mutation onError:', error);
      toast.error('AI 추천 생성에 실패했습니다.', { 
        description: error.message || '알 수 없는 오류가 발생했습니다.'
      });
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
              <><Wand2 className="mr-2 h-4 w-4" /> AI 추천 받기</>
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
