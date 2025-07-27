
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Database } from '@/integrations/supabase/types';

type Dog = Database['public']['Tables']['dogs']['Row'];

const fetchUserDogs = async (userId: string | undefined): Promise<Dog[]> => {
  if (!userId) {
    return [];
  }

  const { data, error } = await supabase
    .from('dogs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching user dogs:', error);
    throw new Error(error.message);
  }

  return data || [];
};

export const useUserDogs = () => {
  const { session } = useAuth();
  const user = session?.user;

  return useQuery<Dog[], Error>({
    queryKey: ['userDogs', user?.id],
    queryFn: () => fetchUserDogs(user?.id),
    enabled: !!user,
  });
};
