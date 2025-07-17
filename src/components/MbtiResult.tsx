
import React, { useEffect, useState } from 'react';
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

const resultCardStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(8px)',
  padding: '2rem',
  borderRadius: '1.5rem',
  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
  border: '2px solid #ddd6fe',
};

const titleGradientStyle = {
  background: 'linear-gradient(to right, #a855f7, #ec4899)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  color: 'transparent',
  fontWeight: 800,
  marginBottom: '1rem',
};

const breedCardStyle = {
  backgroundColor: '#ffffff',
  borderRadius: '0.75rem',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  overflow: 'hidden',
  transition: 'transform 0.3s ease',
  height: '100%',
  display: 'flex',
  flexDirection: 'column' as const,
};

const breedImageContainerStyle = {
  position: 'relative' as const,
  width: '100%',
  paddingTop: '75%', // 4:3 비율 유지
  overflow: 'hidden',
};

const breedImageStyle = {
  position: 'absolute' as const,
  top: '0',
  left: '0',
  width: '100%',
  height: '100%',
  objectFit: 'cover' as const,
  transition: 'transform 0.3s ease',
};

const resetButtonStyle = {
  backgroundColor: '#a855f7',
  color: '#ffffff',
  fontWeight: 'bold',
  padding: '1rem 2rem',
  borderRadius: '9999px',
  fontSize: '1.125rem',
  marginTop: '2rem',
  transition: 'background-color 0.3s ease',
};

export const MbtiResult = React.forwardRef<HTMLDivElement, MbtiResultProps>(({ result, onReset }, ref) => {
  const { data: description, isLoading: isLoadingDesc } = useMbtiDescription(result);
  const { data: breeds, isLoading: isLoadingBreeds } = useBreedsByMbti(result);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div ref={ref} style={resultCardStyle}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#4b5563', marginBottom: '0.5rem' }}>당신의 강아지 성향은...</h2>
      {isLoadingDesc ? <Loader2 style={{ margin: '0 auto', height: '2.5rem', width: '2.5rem', animation: 'spin 1s linear infinite', color: '#a855f7' }} /> : (
        <>
          <h1 style={titleGradientStyle} className="text-4xl md:text-5xl">
            {description?.title} ({result})
          </h1>
          <p style={{ color: '#6b7280', fontSize: '1.125rem', marginBottom: '2rem' }}>{description?.description}</p>
        </>
      )}

      <Card style={{ marginTop: '2rem', textAlign: 'left', backgroundColor: '#ffffff', borderRadius: '0.75rem', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}>
        <CardHeader>
          <CardTitle style={{ color: '#1f2937', fontSize: '1.25rem' }}>이런 성향의 친구들은 어때요?</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingBreeds ? <Loader2 style={{ margin: '0 auto', height: '2rem', width: '2rem', animation: 'spin 1s linear infinite', color: '#9ca3af' }} /> : (
            <div 
              className="grid gap-4" 
              style={{ 
                gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)'
              }}
            >
              {breeds?.map(breed => (
                <Link 
                  to={`/blog/${breed.id}`} 
                  key={breed.id} 
                  style={{ textDecoration: 'none' }}
                >
                  <div style={breedCardStyle}>
                    <div style={breedImageContainerStyle}>
                      <img 
                        src={breed.thumbnail_url || ''} 
                        alt={breed.name_ko} 
                        style={breedImageStyle}
                        onMouseOver={(e) => {
                          (e.target as HTMLElement).style.transform = 'scale(1.05)';
                        }}
                        onMouseOut={(e) => {
                          (e.target as HTMLElement).style.transform = 'scale(1)';
                        }}
                      />
                    </div>
                    <div style={{ 
                      padding: '0.75rem',
                      textAlign: 'center' as const,
                      backgroundColor: '#ffffff',
                    }}>
                      <p style={{ 
                        fontWeight: 600, 
                        fontSize: '0.875rem',
                        color: '#1f2937',
                        margin: 0,
                        transition: 'color 0.3s ease'
                      }}
                      onMouseOver={(e) => {
                        (e.target as HTMLElement).style.color = '#ec4899';
                      }}
                      onMouseOut={(e) => {
                        (e.target as HTMLElement).style.color = '#1f2937';
                      }}
                      >
                        {breed.name_ko}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Button 
        size="lg" 
        onClick={onReset} 
        style={resetButtonStyle}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#9333ea'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#a855f7'}
      >
        다시 테스트하기
      </Button>
    </div>
  );
});
