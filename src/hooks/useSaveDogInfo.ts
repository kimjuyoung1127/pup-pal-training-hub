
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { saveDogInfo } from '@/lib/dogApi';
import { DogInfo } from '@/types/dog';

export const useSaveDogInfo = ({ onSuccess }: { onSuccess: (data: DogInfo) => void }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveDogInfo,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['dog-profile'] });
      onSuccess(data);
    },
  });
};
