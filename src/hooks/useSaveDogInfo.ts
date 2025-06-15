
import { useMutation } from '@tanstack/react-query';
import { saveDogInfo } from '@/lib/dogApi';
import { DogInfo } from '@/types/dog';

export const useSaveDogInfo = ({ onSuccess }: { onSuccess: (data: DogInfo) => void }) => {
    return useMutation({
        mutationFn: saveDogInfo,
        onSuccess,
    });
};
