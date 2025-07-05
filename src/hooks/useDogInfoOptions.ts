
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const healthIcons: Record<string, string> = {
    '특별한 문제 없음': '✔️',
    '건강함': '💚',
    '관절 문제': '🦴',
    '알레르기': '🤧',
    '소화 문제': '🤱',
    '피부 문제': '🐕',
    '과체중': '⚖️',
    '저체중': '📏',
    '기타': '🏥',
    // 아래는 데이터베이스 값과 일치하지 않거나 오래된 값이므로 수정 또는 제거합니다.
    '심장 문제': '❤️',
    '시력 문제': '👀',
    '청각 문제': '👂'
};

const trainingGoalIcons: Record<string, string> = {
    '기본 명령어': '🎓',
    '배변 훈련': '🚽',
    '짖음 조절': '🤫',
    '산책 훈련': '🚶',
    '사회화 훈련': '👥',
    '분리불안 해결': '💔',
    '물건물기/파괴방지': '🚫',
    '손 올리기/앉기': '🐾',
    '기다려': '⏳',
    '이리와': '🐶',
    // 아래는 이미지에 있지만 코드에 없는 항목들입니다. 추가가 필요합니다.
    '클리커훈련': '🖱️',
    '미용 훈련': '✂️',
    '독 피트니스 훈련': '🏋️',
    '개인기 훈련': '🤸',
    '아직 안 함': '🤷'
};

const fetchOptions = async (tableName: string) => {
  const { data, error } = await supabase.from(tableName as 'health_status_options' | 'behavior_options').select('id, name');
  if (error) throw new Error(error.message);
  return data as { id: number; name: string }[];
};

export const useDogInfoOptions = () => {
    const { data: healthOptionsData, isLoading: healthLoading } = useQuery({ 
        queryKey: ['health_options'], 
        queryFn: () => fetchOptions('health_status_options'),
        staleTime: 0,
        gcTime: 0, // Do not use cache
    });

    const { data: trainingOptionsData, isLoading: trainingLoading } = useQuery({ 
        queryKey: ['behavior_options'], 
        queryFn: () => fetchOptions('behavior_options'),
        staleTime: 0,
        gcTime: 0, // Do not use cache
    });

    const healthOptions = healthOptionsData?.map(o => ({ id: o.id, label: o.name, icon: healthIcons[o.name] || '❓' })) || [];
    const trainingGoalOptions = trainingOptionsData?.map(o => ({ id: o.id, label: o.name, icon: trainingGoalIcons[o.name] || '❓' })) || [];

    return { 
        healthOptions, 
        trainingGoalOptions,
        isLoading: healthLoading || trainingLoading,
    };
};
