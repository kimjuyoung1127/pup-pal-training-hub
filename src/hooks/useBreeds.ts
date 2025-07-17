
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Breed } from '@/types/breeds'; // Breed 타입을 정의해야 합니다.

const fetchBreeds = async (): Promise<Breed[]> => {
  const { data, error } = await supabase
    .from('breeds')
    .select('*')
    .order('popularity_score', { ascending: false }); // 인기도 순으로 정렬

  if (error) {
    throw new Error(error.message);
  }

  return data as Breed[];
};

export const useBreeds = () => {
  return useQuery<Breed[], Error>({
    queryKey: ['breeds'],
    queryFn: fetchBreeds,
  });
};
