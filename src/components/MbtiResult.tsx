
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { Loader2, Upload, Download, Share2, Dog, Sparkles } from 'lucide-react';
import { toPng } from 'html-to-image';
import { initKakao } from '@/lib/kakao';

// --- Hooks ---
const useMbtiDescription = (mbti: string) => {
  return useQuery({
    queryKey: ['mbtiDescription', mbti],
    queryFn: async () => {
      const { data, error } = await supabase.from('mbti_descriptions').select('title, description, mbti_type').eq('mbti_type', mbti).single();
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!mbti,
  });
};

const useBreedsByMbti = (mbti: string) => {
  return useQuery({
    queryKey: ['breedsByMbti', mbti],
    queryFn: async () => {
      const { data, error } = await supabase.from('breeds').select('id, name_ko, thumbnail_url').eq('dog_mbti', mbti).limit(4);
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!mbti,
  });
};

// --- 헬퍼 함수 ---
const dataURLtoFile = (dataurl: string, filename: string) => {
  const arr = dataurl.split(',');
  const mimeMatch = arr[0].match(/:(.*?);/);
  if (!mimeMatch) throw new Error('Invalid data URL');
  const mime = mimeMatch[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

const resizeImage = (file: File, p0: number): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let { width, height } = img;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round(height * (MAX_WIDTH / width));
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round(width * (MAX_HEIGHT / height));
            height = MAX_HEIGHT;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Could not get canvas context'));
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Canvas to Blob conversion failed'));
            }
          },
          'image/jpeg',
          0.95
        );
      };
      img.onerror = (error) => reject(error);
      if (!readerEvent.target?.result) {
        return reject(new Error("Failed to read file."));
      }
      img.src = readerEvent.target.result as string;
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

// --- 공유용 결과 카드 ---
const MbtiResultCard = React.forwardRef<HTMLDivElement, { result: any, petName: string, petImage: string | null }>(({ result, petName, petImage }, ref) => {
  return (
    <div ref={ref} className="w-[320px] bg-gradient-to-br from-orange-100 via-pink-100 to-purple-100 p-4 font-sans">
      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="flex justify-center -mt-10">
          {petImage ? (
            <img src={petImage} className="w-20 h-20 rounded-full border-4 border-white object-cover" alt={petName} />
          ) : (
            <div className="w-20 h-20 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center">
              <Dog className="w-10 h-10 text-gray-400" />
            </div>
          )}
        </div>
        <div className="text-center mt-2">
          <h2 className="text-xl font-bold text-gray-800">{petName || '우리 강아지'}</h2>
          <p className="text-sm text-gray-500">성향 분석 결과</p>
        </div>
        <div className="text-center my-4">
          <p className="text-4xl font-extrabold bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">{result?.mbti_type}</p>
          <p className="text-lg font-semibold text-gray-700 mt-1">{result?.title}</p>
        </div>
        <p className="text-center text-xs text-gray-500 px-2">
          {result?.description}
        </p>
        <div className="text-center mt-4 text-xs font-bold text-purple-600">
          puppyvill.com
        </div>
      </div>
    </div>
  );
});

// --- 스타일 객체 ---
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
  paddingTop: '75%',
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

// --- 메인 결과 컴포넌트 ---
export const MbtiResult = React.forwardRef<HTMLDivElement, { result: string; onReset: () => void; }>(({ result, onReset }, ref) => {
  const { data: description, isLoading: isLoadingDesc } = useMbtiDescription(result);
  const { data: breeds, isLoading: isLoadingBreeds } = useBreedsByMbti(result);
  
  const [petName, setPetName] = useState('');
  const [petImage, setPetImage] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isSharing, setIsSharing] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    initKakao();
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      try {
        const resizedBlob = await resizeImage(file, 800);
        const imageUrl = URL.createObjectURL(resizedBlob);
        setPetImage(imageUrl);
      } catch (error) {
        console.error("Image resizing failed:", error);
        alert('이미지 처리 중 오류가 발생했습니다. 다른 파일을 선택해주세요.');
      }
    }
  };

  const handleUploadButtonClick = () => imageInputRef.current?.click();

  const handleDownloadImage = useCallback(() => {
    if (!cardRef.current) return;
    toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `${petName || 'mungai'}-mbti-result.png`;
        link.href = dataUrl;
        link.click();
      });
  }, [petName]);

  const handleShareToKakao = useCallback(async () => {
    if (!cardRef.current) return;
    setIsSharing(true);
    try {
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 });
      const imageFile = dataURLtoFile(dataUrl, 'mbti-card.png');

      const formData = new FormData();
      formData.append('file', imageFile);
      formData.append('petName', petName);
      formData.append('result', result);

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/upload-mbti-card`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: formData,
        }
      );

      const { publicUrl, error } = await response.json();

      if (error) {
        throw new Error(error);
      }

      window.Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: `${petName || '우리 강아지'}의 성향은 "${description?.title}"!`,
          description: '내 강아지의 MBTI를 알아보고, 나랑 잘 맞는 견종도 찾아보세요!',
          imageUrl: publicUrl,
          link: { mobileWebUrl: 'https://mungai.co.kr/mbti-test', webUrl: 'https://mungai.co.kr/mbti-test' },
        },
        buttons: [{ title: '나도 테스트하기', link: { mobileWebUrl: 'https://mungai.co.kr/mbti-test', webUrl: 'https://mungai.co.kr/mbti-test' } }],
      });
    } catch (error) {
      console.error('카카오톡 공유 실패:', error);
      alert('공유 이미지를 생성하는 데 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSharing(false);
    }
  }, [petName, result, description]);

  if (isLoadingDesc || isLoadingBreeds) {
    return (
      <div ref={ref} className="w-full max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
        <Card className="bg-white/80 backdrop-blur-lg border-2 border-purple-200/50 shadow-2xl rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 p-6 border-b-2 border-purple-200/50">
            <CardTitle className="text-xl text-purple-800">나만의 결과 카드 만들기 🐾</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row md:items-start md:gap-6">
            <div className="flex-grow mb-6 md:mb-0">
              <div className="mb-4">
                <label htmlFor="petName" className="block text-sm font-medium text-gray-700 mb-1">강아지 이름</label>
                <Input id="petName" type="text" placeholder="예: 몽이" value={petName} onChange={(e) => setPetName(e.target.value)} className="border-purple-300 focus:ring-purple-500 focus:border-purple-500" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">사진 업로드 (선택)</label>
                <input
                type="file"
                ref={imageInputRef}
                onChange={handleImageUpload}
                className="hidden"
                accept="image/*"
              />
              <Button onClick={handleUploadButtonClick} className="w-full sm:w-auto bg-gradient-to-r from-orange-400 to-pink-500 text-white font-bold hover:scale-105 transition-transform duration-300 shadow-lg">
                <Upload className="mr-2 h-4 w-4" /> 사진 올리기
              </Button>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 mt-4">
                <Button onClick={handleDownloadImage} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <Download className="mr-2 h-4 w-4" /> 이미지 저장하기
                </Button>
                <Button onClick={handleShareToKakao} disabled={isSharing} className="w-full bg-yellow-400 text-yellow-900 hover:bg-yellow-500">
                  {isSharing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Share2 className="mr-2 h-4 w-4" />}
                  {isSharing ? '공유 준비중...' : '카카오톡으로 공유'}
                </Button>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center w-full md:w-auto md:flex-shrink-0">
              <p className="text-center text-sm font-medium text-gray-700 mb-2">미리보기</p>
              <div className="flex justify-center">
                <MbtiResultCard ref={cardRef} result={description} petName={petName} petImage={petImage} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-md p-6 md:p-8 rounded-3xl shadow-2xl border-2 border-purple-200">
      <div className="text-center">
        <h2 className="text-lg font-bold text-gray-600 mb-1">우리 강아지 성향은...</h2>
        {isLoadingDesc ? <Loader2 className="mx-auto h-10 w-10 animate-spin text-purple-500" /> : (
          <>
            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
              {description?.title} ({result})
            </h1>
            <p className="text-gray-600 text-base md:text-lg mt-2">{description?.description}</p>
          </>
        )}
      </div>

      <Card className="mt-6 bg-purple-50/50 border-purple-200">
        <CardHeader>
          <CardTitle className="text-xl text-purple-800">나만의 결과 카드 만들기 🐾</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row md:items-start md:gap-6">
          <div className="flex-grow mb-6 md:mb-0">
            <div className="mb-4">
              <label htmlFor="petName" className="block text-sm font-medium text-gray-700 mb-1">강아지 이름</label>
              <Input id="petName" type="text" placeholder="예: 몽이" value={petName} onChange={(e) => setPetName(e.target.value)} className="border-purple-300 focus:ring-purple-500 focus:border-purple-500" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">사진 업로드 (선택)</label>
              <Input id="petImage" type="file" accept="image/*" ref={imageInputRef} onChange={handleImageUpload} className="hidden" />
              <Button onClick={handleUploadButtonClick} variant="outline" className="w-full border-purple-300 text-purple-700 hover:bg-purple-100 hover:text-purple-800">
                <Upload className="mr-2 h-4 w-4" />
                사진 선택
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <Button onClick={handleDownloadImage} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <Download className="mr-2 h-4 w-4" /> 이미지 저장하기
              </Button>
              <Button onClick={handleShareToKakao} disabled={isSharing} className="w-full bg-yellow-400 text-yellow-900 hover:bg-yellow-500">
                {isSharing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Share2 className="mr-2 h-4 w-4" />}
                {isSharing ? '공유 준비중...' : '카카오톡으로 공유'}
              </Button>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center w-full md:w-auto md:flex-shrink-0">
            <p className="text-center text-sm font-medium text-gray-700 mb-2">미리보기</p>
            <div className="flex justify-center">
              <MbtiResultCard ref={cardRef} result={description} petName={petName} petImage={petImage} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card style={{ marginTop: '1.5rem', textAlign: 'left', backgroundColor: '#ffffff', borderRadius: '0.75rem', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}>
        <CardHeader>
          <CardTitle style={{ color: '#1f2937', fontSize: '1.25rem' }}>이런 성향의 친구들은 어때요?</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingBreeds ? <Loader2 style={{ margin: '0 auto', height: '2rem', width: '2rem', animation: 'spin 1s linear infinite', color: '#9ca3af' }} /> : (
            <div className="grid gap-4" style={{ gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)' }}>
              {breeds?.map(breed => (
                <Link to={`/blog/${breed.id}`} key={breed.id} style={{ textDecoration: 'none' }}>
                  <div style={breedCardStyle} onMouseOver={(e) => { const t=e.currentTarget; t.style.transform='scale(1.05)'; const i=t.querySelector('img'); i&&(i.style.transform='scale(1.05)'); const p=t.querySelector('p'); p&&(p.style.color='#ec4899')}} onMouseOut={(e) => { const t=e.currentTarget; t.style.transform='scale(1)'; const i=t.querySelector('img'); i&&(i.style.transform='scale(1)'); const p=t.querySelector('p'); p&&(p.style.color='#1f2937')}}>
                    <div style={breedImageContainerStyle}><img src={breed.thumbnail_url || ''} alt={breed.name_ko} style={breedImageStyle} /></div>
                    <div style={{ padding: '0.75rem', textAlign: 'center' as const }}><p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1f2937', margin: 0, transition: 'color 0.3s ease, transform 0.3s ease' }}>{breed.name_ko}</p></div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mt-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <CardHeader className="flex-row items-center gap-4">
          <div className="bg-white/20 p-3 rounded-full"><Sparkles className="h-6 w-6 text-white" /></div>
          <div>
            <CardTitle className="text-xl text-white">AI 맞춤 솔루션 받기</CardTitle>
            <p className="text-sm text-purple-100">결과를 바탕으로 더 깊이 있는 정보를 알아보세요!</p>
          </div>
        </CardHeader>
        <CardContent>
          <p className="mb-4"><span className="font-bold">{petName || '우리 아이'}</span>의 <span className="font-bold">({result})</span> 성향에 딱 맞는 훈련법, 놀이, 사료 추천까지! Mung-AI의 핵심 기능을 통해 더 스마트한 반려 생활을 시작해보세요.</p>
          <Link to="/app"><Button size="lg" className="w-full bg-white text-purple-600 font-bold hover:bg-purple-100">AI 훈련 계획 받으러 가기</Button></Link>
        </CardContent>
      </Card>

      <div className="text-center mt-8">
        <Button size="lg" onClick={onReset} className="bg-gradient-to-r from-orange-400 to-pink-500 text-white font-bold py-3 px-8 rounded-full text-base shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
          테스트 다시하기
        </Button>
      </div>
    </div>
  );
});
