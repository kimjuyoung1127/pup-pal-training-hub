
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

      다음 **핵심 훈련 목표**를 최우선으로 달성하기 위한 전문적이고 창의적인 맞춤형 훈련 2가지를 추천해주세요.
      추천하는 훈련은 반드시 아래 **핵심 훈련 목표** 달성에 직접적으로 기여해야 합니다.
      아래 **강아지 프로필**은 훈련 강도, 난이도, 주의사항 등을 설정할 때 참고용으로만 활용하세요.
      훈련목표와 상관없는 추천은 금지
      긍정강화, 부정강화, 긍정처벌, 부정처벌 등 복합적인 트레이닝 방법을 활용하여 훈련 계획을 세워주세요.

      🎯 **핵심 훈련 목표 (가장 중요한 추천 기준):**
      ${JSON.stringify(trainingGoals && trainingGoals.length > 0 ? trainingGoals : fullProfile.trainingGoals, null, 2)}

      🐶 **강아지 프로필 (참고용):**
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

      // 응답 데이터 구조 검증 및 파싱
      if (!data || !data.content) throw new Error('AI 응답이 비어있거나 content 필드가 없습니다.');
      
      // 응답 데이터 로깅 (디버깅용)
      console.log('Raw AI response:', data);
      
      // content 필드에서 JSON 문자열 추출
      const responseString = data.content;

      // JSON 배열 추출 및 정제
      const cleanedResponse = responseString
        .replace(/```json\n?/g, '')
        .replace(/```/g, '')
        .trim();

      // JSON 배열 범위 찾기
      const startIndex = cleanedResponse.indexOf('[');
      const endIndex = cleanedResponse.lastIndexOf(']');
      
      if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) {
        console.error('Invalid JSON structure:', cleanedResponse);
        throw new Error('AI 응답에서 유효한 JSON 배열을 찾을 수 없습니다.');
      }

      // JSON 배열 추출 및 파싱
      let jsonString = cleanedResponse.substring(startIndex, endIndex + 1);
      
      try {
        const parsedData = JSON.parse(jsonString) as AiTrainingProgram[];
        
        // 데이터 유효성 검증
        if (!Array.isArray(parsedData) || parsedData.length === 0) {
          throw new Error('AI 응답이 유효한 훈련 프로그램 배열이 아닙니다.');
        }

        // 각 훈련 프로그램의 필수 필드 검증
        parsedData.forEach((program, index) => {
          if (!program.title || !program.description || !program.difficulty) {
            throw new Error(`훈련 프로그램 #${index + 1}에 필수 필드가 누락되었습니다.`);
          }
        });

        return parsedData;

      } catch (parseError: any) {
        console.error('JSON parsing error:', parseError, '\nJSON string:', jsonString);
        throw new Error(`AI 응답 파싱 실패: ${parseError.message}`);
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
      console.error('AI recommendation error:', error);
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
