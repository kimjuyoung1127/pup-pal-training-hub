
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

const healthIcons: Record<string, string> = {
    '건강함': '💚', '관절 문제': '🦴', '알레르기': '🤧', '소화 문제': '🤱',
    '피부 질환': '🐕', '과체중': '⚖️', '저체중': '📏', '기타': '🏥'
};

const trainingGoalIcons: Record<string, string> = {
    '기본 예절 훈련': '🎓', '배변 훈련': '🚽', '짖음 줄이기': '🤫', '산책 훈련': '🚶',
    '사회성 훈련': '👥', '분리불안 해결': '💔', '물어뜯기 교정': '🚫',
    '손 올리기/앉기': '✋', '기다려': '⏱️', '이리와': '🤗'
};

const fetchDogInfoOptions = async () => {
    const [healthResult, trainingResult] = await Promise.all([
        supabase.from('health_status_options').select('id, name'),
        supabase.from('behavior_options').select('id, name')
    ]);

    const { data: healthData, error: healthError } = healthResult;
    if (healthError) {
        console.error('Error fetching health options:', healthError);
        toast.error("건강 상태 목록을 불러오는데 실패했습니다.");
        throw healthError;
    }

    const { data: trainingData, error: trainingError } = trainingResult;
    if (trainingError) {
        console.error('Error fetching training options:', trainingError);
        toast.error("훈련 목표 목록을 불러오는데 실패했습니다.");
        throw trainingError;
    }

    const healthOptions = healthData?.map(o => ({ id: o.id, label: o.name, icon: healthIcons[o.name] || '❓' })) || [];
    const trainingGoalOptions = trainingData?.map(o => ({ id: o.id, label: o.name, icon: trainingGoalIcons[o.name] || '❓' })) || [];

    return { healthOptions, trainingGoalOptions };
};

export const useDogInfoOptions = () => {
    const { data, isLoading } = useQuery({
        queryKey: ['dogInfoOptions'],
        queryFn: fetchDogInfoOptions,
    });
    
    return { 
        healthOptions: data?.healthOptions ?? [], 
        trainingGoalOptions: data?.trainingGoalOptions ?? [], 
        isLoading,
    };
};
