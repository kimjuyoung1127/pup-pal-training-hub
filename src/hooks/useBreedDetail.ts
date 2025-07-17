
import { useQuery } from '@tanstack/react-query';
import { woofpediaClient } from '@/lib/woofpediaClient';
import { BreedDetail } from '@/types/breeds';

const fetchBreedDetail = async (id: string): Promise<BreedDetail | null> => {
  const { data, error } = await woofpediaClient
    .from('breeds')
    .select(
      `
      *,
      details:breed_details (
        *
      )
    `
    )
    .eq('id', id)
    .single(); // 단일 항목을 가져옵니다.

  if (error) {
    // 404 Not Found와 같은 예상된 오류는 에러를 던지지 않을 수 있습니다.
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(error.message);
  }

  // Supabase의 join 결과는 'details'가 배열일 수 있으므로, 객체로 변환합니다.
  const breedData = data as any;
  if (breedData && Array.isArray(breedData.details)) {
    breedData.details = breedData.details[0] || null;
  }

  return breedData as BreedDetail;
};

export const useBreedDetail = (id: string | undefined) => {
  return useQuery<BreedDetail | null, Error>({
    queryKey: ['breedDetail', id],
    queryFn: () => {
      if (!id) return Promise.resolve(null);
      return fetchBreedDetail(id);
    },
    enabled: !!id, // id가 있을 때만 쿼리를 실행합니다.
  });
};
