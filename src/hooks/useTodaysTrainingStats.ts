
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const fetchTodaysTrainingStats = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return {
            completedTrainings: 0,
            totalDuration: 0,
            averageSuccessRate: 0,
        };
    }

    const { data: dog, error: dogError } = await supabase
        .from('dogs')
        .select('id')
        .eq('user_id', user.id)
        .limit(1)
        .single();

    if (dogError && dogError.code !== 'PGRST116') { // "no rows found" 에러는 무시
        console.error('Error fetching dog:', dogError);
        toast.error('강아지 정보를 불러오는 데 실패했습니다.');
        throw dogError;
    }

    if (!dog) {
        return {
            completedTrainings: 0,
            totalDuration: 0,
            averageSuccessRate: 0,
        };
    }

    const today = new Date().toISOString().split('T')[0];

    const { data: history, error: historyError } = await supabase
        .from('training_history')
        .select('duration_minutes, success_rate')
        .eq('dog_id', dog.id)
        .eq('session_date', today);

    if (historyError) {
        console.error('Error fetching training history:', historyError);
        toast.error('훈련 기록을 불러오는 데 실패했습니다.');
        throw historyError;
    }

    if (!history || history.length === 0) {
        return {
            completedTrainings: 0,
            totalDuration: 0,
            averageSuccessRate: 0,
        };
    }

    const completedTrainings = history.length;
    const totalDuration = history.reduce((acc, item) => acc + (item.duration_minutes || 0), 0);
    
    const successfulTrainings = history.filter(item => typeof item.success_rate === 'number');
    const totalSuccessRate = successfulTrainings.reduce((acc, item) => acc + (item.success_rate || 0), 0);
    
    const averageSuccessRate = successfulTrainings.length > 0
        ? Math.round(totalSuccessRate / successfulTrainings.length)
        : 0;

    return {
        completedTrainings,
        totalDuration,
        averageSuccessRate,
    };
};

export const useTodaysTrainingStats = () => {
    return useQuery({
        queryKey: ['todaysTrainingStats'],
        queryFn: fetchTodaysTrainingStats,
        staleTime: 1000 * 60 * 5, // 5분
    });
};
