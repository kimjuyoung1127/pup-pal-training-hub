import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';

const fetchSuggestions = async () => {
  const { data, error } = await supabase
    .from('suggested_topics')
    .select('*, articles(id)') // 초안이 생성되었는지 확인하기 위해 articles 테이블 join
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  
  // id 기준으로 중복 제거 (Supabase join 시 발생 가능)
  return data.filter(
    (suggestion, index, self) =>
      index === self.findIndex((s) => s.id === suggestion.id)
  );
};

export const useSuggestions = () => {
  return useQuery({
    queryKey: ['suggestions'],
    queryFn: fetchSuggestions,
  });
};
