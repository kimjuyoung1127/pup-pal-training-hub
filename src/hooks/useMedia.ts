
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Media {
    id: string;
    user_id: string;
    file_url: string;
    file_path: string;
    file_type: string;
    created_at: string;
}

const fetchMedia = async (): Promise<Media[]> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
        .from('media')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    if (error) {
        toast.error('미디어를 불러오는데 실패했습니다.');
        throw error;
    }
    return data;
};

export const useMedia = () => {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ['media'],
        queryFn: fetchMedia,
    });

    const uploadMutation = useMutation({
        mutationFn: async (file: File) => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('로그인이 필요합니다.');

            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${user.id}/${fileName}`;
            
            const { error: uploadError } = await supabase.storage
                .from('media_storage')
                .upload(filePath, file);

            if (uploadError) {
                toast.error('파일 업로드에 실패했습니다.');
                throw uploadError;
            }

            const { data: urlData } = supabase.storage
                .from('media_storage')
                .getPublicUrl(filePath);

            const { data, error: insertError } = await supabase.from('media').insert({
                user_id: user.id,
                file_url: urlData.publicUrl,
                file_path: filePath,
                file_type: file.type.startsWith('image/') ? 'image' : 'video',
            }).select().single();
            
            if (insertError) {
                toast.error('미디어 정보 저장에 실패했습니다.');
                await supabase.storage.from('media_storage').remove([filePath]);
                throw insertError;
            }
            return data;
        },
        onSuccess: () => {
            toast.success('파일이 성공적으로 업로드되었습니다.');
            queryClient.invalidateQueries({ queryKey: ['media'] });
        },
        onError: (error) => {
            console.error('Error uploading media:', error);
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async ({ id, file_path }: { id: string; file_path: string }) => {
            const { error: deleteStorageError } = await supabase.storage
                .from('media_storage')
                .remove([file_path]);

            if (deleteStorageError) {
                toast.error('스토리지에서 파일 삭제를 실패했습니다.');
                throw deleteStorageError;
            }
            
            const { error: deleteDbError } = await supabase
                .from('media')
                .delete()
                .eq('id', id);

            if (deleteDbError) {
                toast.error('미디어 정보 삭제에 실패했습니다.');
                throw deleteDbError;
            }
        },
        onSuccess: () => {
            toast.success('미디어가 삭제되었습니다.');
            queryClient.invalidateQueries({ queryKey: ['media'] });
        },
        onError: (error) => {
            console.error('Error deleting media:', error);
        }
    });

    return { ...query, uploadMutation, deleteMutation };
};
