
import React, { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Zap, Star, ShieldCheck, Trophy, AlertCircle } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { TrainingLog, useTrainingHistory } from '@/hooks/useTrainingHistory';

interface AiTrainingPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  dogId: string | null; // Corrected type
}

interface ChallengePlan {
  goal: string;
  phases: {
    title: string;
    duration: string;
    description: string;
    icon: 'Star' | 'ShieldCheck' | 'Trophy';
  }[];
}

const AiTrainingPlanModal: React.FC<AiTrainingPlanModalProps> = ({ isOpen, onClose, dogId }) => {
  const { data: trainingHistory, status: historyStatus } = useTrainingHistory(dogId);

  const generatePlanMutation = useMutation({
    mutationFn: async (history: TrainingLog[]) => {
      if (!history || history.length === 0) {
        throw new Error('분석할 훈련 기록이 충분하지 않습니다.');
      }

      const prompt = `
        당신은 최고의 AI 반려견 행동 분석가입니다.
        주어진 훈련 기록(JSON)을 심층적으로 분석하여, 이 강아지를 위한 다음 "14일 훈련 챌린지" 계획을 딱 1개만 생성해주세요.

        **분석 및 계획 수립 단계:**
        1.  **기록 분석:** 훈련 성공률, 특정 훈련의 정체 또는 발전, 훈련 빈도 등 데이터의 패턴을 파악합니다.
        2.  **핵심 목표 설정:** 분석 결과를 바탕으로, 강아지의 성장을 위해 지금 가장 중요하고 시급한 "핵심 성장 목표"를 1가지 설정합니다.
        3.  **단계별 챌린지 생성:** 설정된 목표를 달성하기 위한 구체적인 3단계 챌린지 계획을 수립합니다. 각 단계는 기초, 심화, 실전으로 점진적으로 발전해야 합니다.

        **훈련 기록 데이터 (최신 20개):**
        ${JSON.stringify(history.slice(0, 20), null, 2)}

        **응답 형식 (반드시 아래 JSON 구조를 정확히 지켜주세요. 설명 없이 JSON만 반환):**
        {
          "goal": "[AI가 설정한 핵심 성장 목표]",
          "phases": [
            {
              "title": "1단계: 기초 다지기",
              "duration": "1-4일차",
              "description": "[목표 달성을 위한 첫 단계 훈련 내용]",
              "icon": "Star"
            },
            {
              "title": "2단계: 심화 학습",
              "duration": "5-9일차",
              "description": "[기초 훈련을 응용한 심화 훈련 내용]",
              "icon": "ShieldCheck"
            },
            {
              "title": "3단계: 실전 마스터",
              "duration": "10-14일차",
              "description": "[실제 상황에 적용하는 최종 훈련 내용]",
              "icon": "Trophy"
            }
          ]
        }
      `;

      const { data, error } = await supabase.functions.invoke('gemini-chat', {
        body: { history: [{ role: 'user', parts: [{ text: prompt }] }] },
      });

      if (error) throw error;
      if (!data || !data.content) throw new Error('AI 응답이 비어있습니다.');

      const responseString = data.content.replace(/```json\n?/g, '').replace(/```/g, '').trim();
      const startIndex = responseString.indexOf('{');
      const endIndex = responseString.lastIndexOf('}');
      if (startIndex === -1 || endIndex === -1) {
        throw new Error('AI 응답에서 유효한 JSON 객체를 찾을 수 없습니다.');
      }
      const jsonString = responseString.substring(startIndex, endIndex + 1);

      try {
        return JSON.parse(jsonString) as ChallengePlan;
      } catch (parseError: any) {
        throw new Error(`AI 응답 파싱에 실패했습니다: ${parseError.message}`);
      }
    },
    onSuccess: () => {
      toast.success('AI 맞춤 훈련 챌린지를 생성했습니다!');
    },
    onError: (error: any) => {
      toast.error('플랜 생성 중 오류가 발생했습니다.', {
        description: error.message,
      });
    },
  });

  useEffect(() => {
    if (isOpen && dogId) {
      if (historyStatus === 'success') {
        if (trainingHistory && trainingHistory.length > 0) {
          generatePlanMutation.mutate(trainingHistory);
        } else {
          // 훈련 기록은 있으나, 배열이 비어있는 경우
          // 이 경우는 mutation에서 처리하므로 별도 로직 필요 없음.
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, dogId, historyStatus, trainingHistory]);

  const handleClose = () => {
    if (generatePlanMutation.isPending) return;
    onClose();
  };

  const PhaseIcon = ({ icon }: { icon: ChallengePlan['phases'][0]['icon'] }) => {
    switch (icon) {
      case 'Star': return <Star className="w-6 h-6 text-yellow-500" />;
      case 'ShieldCheck': return <ShieldCheck className="w-6 h-6 text-green-500" />;
      case 'Trophy': return <Trophy className="w-6 h-6 text-blue-500" />;
      default: return null;
    }
  };

  const isLoading = generatePlanMutation.isPending || historyStatus === 'pending';
  const noHistory = historyStatus === 'success' && (!trainingHistory || trainingHistory.length === 0);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center text-2xl">
            <Zap className="w-6 h-6 mr-2 text-yellow-500" />
            AI 맞춤 훈련 챌린지
          </DialogTitle>
          <DialogDescription>
            지난 훈련 기록을 바탕으로 AI가 강아지에게 가장 필요한 성장 목표와 챌린지 플랜을 생성했습니다.
          </DialogDescription>
        </DialogHeader>
        
        <div className="my-6 min-h-[300px]">
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-full">
              <Loader2 className="w-12 h-12 animate-spin text-purple-500" />
              <p className="mt-4 text-lg text-gray-600">AI가 훈련 기록을 분석하고 있어요...</p>
            </div>
          )}
          {noHistory && !isLoading && (
            <div className="flex flex-col items-center justify-center h-full text-center">
                <AlertCircle className="w-12 h-12 text-gray-400" />
                <p className="mt-4 font-semibold text-gray-700">분석할 훈련 기록이 부족해요</p>
                <p className="mt-1 text-sm text-gray-500">AI 챌린지를 시작하려면 최소 1개 이상의 훈련 기록이 필요합니다.</p>
            </div>
          )}
          {generatePlanMutation.isError && !isLoading && (
            <div className="text-center text-red-500">
              <p>오류가 발생했습니다.</p>
              <p className="text-sm">{generatePlanMutation.error.message}</p>
            </div>
          )}
          {generatePlanMutation.data && !isLoading && (
            <div className="space-y-4 animate-in fade-in-50 duration-500">
              <div className="p-4 text-center bg-purple-50 rounded-lg border border-purple-200">
                <p className="font-semibold text-gray-600">이번 챌린지 목표</p>
                <p className="text-xl font-bold text-purple-800">{generatePlanMutation.data.goal}</p>
              </div>
              <div className="space-y-3">
                {generatePlanMutation.data.phases.map((phase, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 border-l-4 border-purple-400 bg-white rounded-r-lg shadow-sm">
                    <PhaseIcon icon={phase.icon} />
                    <div>
                      <p className="font-bold text-purple-700">{phase.title} <span className="text-sm font-normal text-gray-500">({phase.duration})</span></p>
                      <p className="mt-1 text-gray-600">{phase.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={handleClose} variant="outline">닫기</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AiTrainingPlanModal;
