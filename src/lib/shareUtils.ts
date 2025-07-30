import { toPng } from 'html-to-image';
import { initKakao } from '@/lib/kakao';

// 데이터 URL을 파일로 변환하는 유틸리티
export const dataURLtoFile = (dataurl: string, filename: string) => {
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

// 이미지 다운로드 함수
export const downloadImage = async (elementRef: React.RefObject<HTMLElement>, filename: string) => {
  if (!elementRef.current) return;
  
  try {
    const dataUrl = await toPng(elementRef.current, { cacheBust: true, pixelRatio: 2 });
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error('이미지 다운로드 실패:', error);
    throw error;
  }
};

// 카카오톡 공유 함수
export const shareToKakao = async (
  elementRef: React.RefObject<HTMLElement>,
  shareData: {
    title: string;
    description: string;
    petName: string;
    filename: string;
  }
) => {
  if (!elementRef.current) return;
  
  try {
    // 카카오 SDK 초기화
    await initKakao();
    
    // 이미지 생성
    const dataUrl = await toPng(elementRef.current, { cacheBust: true, pixelRatio: 2 });
    const imageFile = dataURLtoFile(dataUrl, shareData.filename);

    // Supabase Edge Function을 통해 이미지 업로드
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('petName', shareData.petName);
    formData.append('type', 'analysis'); // 분석 결과임을 명시

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

    // 카카오톡 공유
    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: shareData.title,
        description: shareData.description,
        imageUrl: publicUrl,
        link: { 
          mobileWebUrl: 'https://mungai.co.kr/app/posture-analysis-history', 
          webUrl: 'https://mungai.co.kr/app/posture-analysis-history' 
        },
      },
      buttons: [
        { 
          title: '나도 분석하기', 
          link: { 
            mobileWebUrl: 'https://mungai.co.kr/app/posture-analysis', 
            webUrl: 'https://mungai.co.kr/app/posture-analysis' 
          } 
        }
      ],
    });
  } catch (error) {
    console.error('카카오톡 공유 실패:', error);
    throw error;
  }
};