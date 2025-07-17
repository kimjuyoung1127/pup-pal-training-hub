
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

// MBTI 타입에 대한 설명을 가져오는 훅
const useMbtiDescription = (mbti: string) => {
  return useQuery({
    queryKey: ['mbtiDescription', mbti],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('mbti_descriptions')
        .select('title, description')
        .eq('mbti_type', mbti)
        .single();
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!mbti,
  });
};

// 해당 MBTI를 가진 견종 목록을 가져오는 훅
const useBreedsByMbti = (mbti: string) => {
  return useQuery({
    queryKey: ['breedsByMbti', mbti],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('breeds')
        .select('id, name_ko, thumbnail_url')
        .eq('dog_mbti', mbti)
        .limit(4);
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!mbti,
  });
};

interface MbtiResultProps {
  result: string;
  onReset: () => void;
}

export const MbtiResult = React.forwardRef<HTMLDivElement, MbtiResultProps>(({ result, onReset }, ref) => {
  const { data: description, isLoading: isLoadingDesc } = useMbtiDescription(result);
  const { data: breeds, isLoading: isLoadingBreeds } = useBreedsByMbti(result);

  return (
    <div ref={ref} className="text-center bg-white/80 backdrop-blur-sm p-8 md:p-12 rounded-3xl shadow-lg border-2 border-purple-200">
      <h2 className="text-2xl font-bold text-gray-600 mb-2">당신의 강아지 성향은...</h2>
      {isLoadingDesc ? <Loader2 className="mx-auto h-10 w-10 animate-spin text-purple-500" /> : (
        <>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            {description?.title} ({result})
          </h1>
          <p className="text-muted-foreground text-lg mb-8">{description?.description}</p>
        </>
      )}

      <Card className="mt-8 text-left">
        <CardHeader>
          <CardTitle>이런 성향의 친구들은 어때요?</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingBreeds ? <Loader2 className="mx-auto h-8 w-8 animate-spin text-gray-400" /> : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {breeds?.map(breed => (
                <Link to={`/blog/${breed.id}`} key={breed.id} className="group">
                  <img src={breed.thumbnail_url || ''} alt={breed.name_ko} className="w-full h-24 object-cover rounded-lg mb-2 group-hover:scale-105 transition-transform" />
                  <p className="font-semibold text-center text-sm group-hover:text-pink-500">{breed.name_ko}</p>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Button size="lg" onClick={onReset} className="mt-8 bg-purple-500 hover:bg-purple-600 text-white font-bold py-4 px-8 rounded-full text-lg">
        다시 테스트하기
      </Button>
    </div>
  );
});
