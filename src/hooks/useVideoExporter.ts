// src/hooks/useVideoExporter.ts
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AnalysisDataWithKeypoints } from '@/types/analysis';

const POINT_COLOR = "#f59e0b";

// ★★★ 핵심: 프레임별로 비디오를 탐색하고, 완료되면 resolve하는 Promise를 반환하는 헬퍼 함수
const seekToFrame = (video: HTMLVideoElement, frame: number, fps: number): Promise<void> => {
  return new Promise(resolve => {
    const seekTime = frame / fps;
    // seeked 이벤트가 발생하면 resolve
    const onSeeked = () => {
      video.removeEventListener('seeked', onSeeked);
      resolve();
    };
    video.addEventListener('seeked', onSeeked);
    video.currentTime = seekTime;
  });
};

export const useVideoExporter = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportedUrl, setExportedUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const exportVideoSmooth = async (
    videoElement: HTMLVideoElement | null,
    analysisResult: AnalysisDataWithKeypoints | null
  ) => {
    if (!videoElement || !analysisResult?.keypoints_data) {
      toast({ title: "오류", description: "내보내기에 필요한 데이터가 없습니다.", variant: "destructive" });
      return;
    }

    setIsExporting(true);
    setExportProgress(0);
    setExportedUrl(null);

    try {
      const { keypoints_data, metadata } = analysisResult;
      const fps = metadata?.fps || 30;
      
      // 1. 보이지 않는 비디오와 캔버스 생성
      const hiddenVideo = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      hiddenVideo.src = videoElement.src;
      hiddenVideo.muted = true;
      hiddenVideo.playsInline = true;
      hiddenVideo.crossOrigin = 'anonymous'; // CORS 문제 해결
      
      // 비디오 메타데이터 로드 대기
      await new Promise((resolve, reject) => {
        hiddenVideo.onloadedmetadata = resolve;
        hiddenVideo.onerror = reject;
        hiddenVideo.load(); // 명시적으로 로드
      });
      
      canvas.width = hiddenVideo.videoWidth;
      canvas.height = hiddenVideo.videoHeight;
      
      // 2. MediaRecorder 설정
      const mimeType = getSupportedMimeType();
      const stream = canvas.captureStream(fps);
      const recorder = new MediaRecorder(stream, { 
        mimeType,
        videoBitsPerSecond: 2500000 // 비트레이트 설정으로 품질 개선
      });
      const chunks: Blob[] = [];
      
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };
      
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: mimeType });
        const url = URL.createObjectURL(blob);
        setExportedUrl(url);
        setIsExporting(false);
        toast({ title: "성공!", description: "부드러운 스켈레톤 영상이 완성되었습니다." });
      };
      
      // 3. 개선된 실시간 렌더링 함수
      let animationId: number;
      const startTime = Date.now();
      const videoDuration = hiddenVideo.duration;
      
      const renderFrame = () => {
        // 시간 기반으로 진행률 계산
        const elapsed = (Date.now() - startTime) / 1000;
        const progress = Math.min(elapsed / videoDuration, 1);
        
        // 녹화 완료 조건
        if (progress >= 1 || hiddenVideo.ended) {
          cancelAnimationFrame(animationId);
          recorder.stop();
          hiddenVideo.pause();
          return;
        }
        
        // 캔버스 클리어 및 비디오 프레임 그리기
        if (ctx && canvas.width > 0 && canvas.height > 0) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // 원본 비디오 프레임 그리기
          try {
            ctx.drawImage(hiddenVideo, 0, 0, canvas.width, canvas.height);
          } catch (e) {
            console.warn('비디오 프레임 그리기 실패:', e);
          }
          
          // 현재 시간에 해당하는 스켈레톤 데이터 찾기
          const currentFrameIndex = Math.floor(hiddenVideo.currentTime * fps);
          const frameKeypoints = keypoints_data[currentFrameIndex];
          
          if (frameKeypoints && Array.isArray(frameKeypoints)) {
            frameKeypoints.forEach((dogKeypoints: number[][]) => {
              if (Array.isArray(dogKeypoints)) {
                dogKeypoints.forEach(point => {
                  if (Array.isArray(point) && point.length >= 2) {
                    const [x, y] = point;
                    if (typeof x === 'number' && typeof y === 'number' && x >= 0 && y >= 0) {
                      ctx.beginPath();
                      ctx.arc(x, y, Math.max(canvas.height * 0.005, 2), 0, 2 * Math.PI);
                      ctx.fillStyle = POINT_COLOR;
                      ctx.fill();
                    }
                  }
                });
              }
            });
          }
        }
        
        // 진행률 업데이트
        setExportProgress(Math.round(progress * 100));
        
        animationId = requestAnimationFrame(renderFrame);
      };
      
      // 4. 녹화 시작
      recorder.start(100); // 100ms마다 데이터 수집
      
      // 비디오 재생 시작 후 렌더링 시작
      hiddenVideo.addEventListener('playing', () => {
        renderFrame();
      });
      
      hiddenVideo.currentTime = 0;
      await hiddenVideo.play();
      
    } catch (error) {
      console.error("영상 내보내기 실패:", error);
      toast({ title: "영상 생성 실패", description: "처리 중 오류가 발생했습니다.", variant: "destructive" });
      setIsExporting(false);
    }
  };

  // MIME 타입 지원 확인 함수
  const getSupportedMimeType = (): string => {
    const types = [
      'video/mp4;codecs=avc1.424028,mp4a.40.2', // iOS Safari 지원
      'video/mp4', // 일반 MP4
      'video/webm;codecs=vp9', // Chrome, Firefox
      'video/webm;codecs=vp8', // 구형 브라우저
      'video/webm' // 기본 WebM
    ];
    
    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }
    
    return 'video/webm'; // 기본값
  };

  // 내보내기 상태 초기화 함수 추가
  const resetExport = () => {
    setIsExporting(false);
    setExportProgress(0);
    if (exportedUrl) {
      URL.revokeObjectURL(exportedUrl);
      setExportedUrl(null);
    }
  };

  return { 
    isExporting, 
    exportProgress, 
    exportedUrl, 
    exportVideo: exportVideoSmooth,
    resetExport 
  };
};

export type { AnalysisDataWithKeypoints };
