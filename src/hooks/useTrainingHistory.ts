import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { checkAndAwardBadges } from '@/lib/badgeManager';

export interface TrainingLog {
  id: string; 
  created_at: string;
  user_id: string;
  dog_id: string;
  session_date: string; // date type in db
  duration_minutes: number | null; // int4
  success_rate: number | null; // numeric
  training_type: string | null; // text
  notes: string | null; // text
  is_ai_training: boolean | null; // bool
  ai_training_details: Record<string, any> | null; // jsonb
  training_program_id: string | null; // text
}

export type TrainingLogUpdate = Partial<Omit<TrainingLog, 'id' | 'created_at' | 'user_id' | 'dog_id'>>;
export type TrainingLogCreate = Omit<TrainingLog, 'id' | 'created_at' | 'user_id' | 'dog_id' | 'session_date'> & {
  session_date?: string;
};

const fetchTrainingHistory = async (dogId: string | undefined): Promise<TrainingLog[]> => {
  if (!dogId) return [];

  const { data, error } = await supabase
    .from('training_history')
    .select(`
      id,
      created_at,
      user_id,
      dog_id,
      session_date,
      duration_minutes,
      success_rate,
      training_type,
      notes,
      is_ai_training,
      ai_training_details,
      training_program_id
    `)
    .eq('dog_id', dogId)
    .order('session_date', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching training history:', error);
    toast.error('훈련 기록을 가져오는 데 실패했습니다.');
    throw error;
  }

  return data;
};

export const useTrainingHistory = (dogId: string | undefined) => {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ['trainingHistory', dogId],
        queryFn: () => fetchTrainingHistory(dogId),
        enabled: !!dogId,
    });

    const addMutation = useMutation({
        mutationFn: async (newLog: TrainingLogCreate) => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("로그인이 필요합니다.");

            const { data: dog, error: dogError } = await supabase
                .from('dogs')
                .select('id')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();
            
            if (dogError && dogError.code !== 'PGRST116') {
                console.error('Error fetching dog for new training log:', dogError);
                toast.error('강아지 정보를 가져오는 중 오류가 발생했습니다.');
                throw dogError;
            }

            if (!dog) {
                throw new Error("강아지 정보를 찾을 수 없습니다. 프로필을 먼저 등록해주세요.");
            }

            const { data, error } = await supabase
                .from('training_history')
                .insert([{ ...newLog, dog_id: dog.id, user_id: user.id }])
                .select('*, notes')
                .single();

            if (error) {
                console.error("Error inserting training log:", error)
                toast.error('훈련 기록 저장에 실패했습니다.');
                throw error;
            }
            return data;
        },
        onSuccess: (newLog: any) => {
            toast.success('훈련 기록이 저장되었습니다.');
            
            if (newLog && newLog.dog_id) {
                checkAndAwardBadges(newLog.dog_id).finally(() => {
                    queryClient.invalidateQueries({ queryKey: ['dogBadges'] });
                    queryClient.invalidateQueries({ queryKey: ['dogProfile'] });
                });
            } else {
                queryClient.invalidateQueries({ queryKey: ['dogBadges'] });
                queryClient.invalidateQueries({ queryKey: ['dogProfile'] });
            }
            queryClient.invalidateQueries({ queryKey: ['trainingHistory'] });
        },
        onError: (error) => {
            console.error('Error adding training log:', error);
            toast.error(error.message);
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from('training_history')
                .delete()
                .eq('id', id);

            if (error) {
                toast.error('기록 삭제에 실패했습니다.');
                throw error;
            }
            return id;
        },
        onSuccess: () => {
            toast.success('훈련 기록이 삭제되었습니다.');
            queryClient.invalidateQueries({ queryKey: ['trainingHistory'] });
            queryClient.invalidateQueries({ queryKey: ['dogBadges'] });
            queryClient.invalidateQueries({ queryKey: ['dogProfile'] });
        },
        onError: (error) => {
            console.error('Error deleting training log:', error);
        }
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, ...updateData }: { id: string } & TrainingLogUpdate) => {
            const { data, error } = await supabase
                .from('training_history')
                .update(updateData)
                .eq('id', id)
                .select('*, notes')
                .single();
            
            if (error) {
                toast.error('기록 수정에 실패했습니다.');
                throw error;
            }
            return data;
        },
        onSuccess: () => {
            toast.success('훈련 기록이 수정되었습니다.');
            queryClient.invalidateQueries({ queryKey: ['trainingHistory'] });
            queryClient.invalidateQueries({ queryKey: ['dogBadges'] });
            queryClient.invalidateQueries({ queryKey: ['dogProfile'] });
        },
        onError: (error) => {
            console.error('Error updating training log:', error);
        }
    });

    return { ...query, addMutation, deleteMutation, updateMutation };
}
