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

  const exportVideo = async (
    videoElement: HTMLVideoElement | null,
    analysisResult: AnalysisDataWithKeypoints | null
  ) => {
    if (!videoElement || !analysisResult?.keypoints_data) {
      toast({ title: "오류", description: "내보내기에 필요한 데이터가 없습니다.", variant: "destructive" });
      return;
    }

    if (!('MediaRecorder' in window)) {
      toast({ title: "오류", description: "사용 중인 브라우저가 영상 녹화 기능을 지원하지 않습니다.", variant: "destructive" });
      return;
    }

    setIsExporting(true);
    setExportProgress(0);
    setExportedUrl(null);

    try {
      const originalVideo = videoElement;
      const { keypoints_data, metadata } = analysisResult;
      const fps = metadata?.fps || 30;
      const totalFrames = Math.floor(originalVideo.duration * fps);

      // 1. 보이지 않는 캔버스 생성
      const offscreenCanvas = document.createElement('canvas');
      offscreenCanvas.width = originalVideo.videoWidth;
      offscreenCanvas.height = originalVideo.videoHeight;
      const ctx = offscreenCanvas.getContext('2d');
      if (!ctx) throw new Error("캔버스 컨텍스트를 가져올 수 없습니다.");

      // 2. MediaRecorder 설정
      const stream = offscreenCanvas.captureStream(fps);
      const recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });
      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => chunks.push(e.data);
      
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setExportedUrl(url);
        setIsExporting(false);
        toast({ title: "성공!", description: "스켈레톤 영상이 완성되었습니다. 이제 다운로드할 수 있습니다." });
      };

      recorder.start();

      // 3. 프레임 단위로 영상 처리
      for (let i = 0; i < totalFrames; i++) {
        // 비디오의 특정 프레임으로 이동
        await seekToFrame(originalVideo, i, fps);

        // 캔버스에 현재 비디오 프레임 그리기
        ctx.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
        ctx.drawImage(originalVideo, 0, 0, offscreenCanvas.width, offscreenCanvas.height);

        // 해당 프레임의 스켈레톤 데이터 그리기
        const frameKeypoints = keypoints_data[i];
        if (frameKeypoints) {
          frameKeypoints.forEach((dogKeypoints: number[][]) => {
            dogKeypoints.forEach(point => {
              const [x, y] = point;
              ctx.beginPath();
              // 원본 비디오 해상도 기준이므로, 크기 변환(scale, offset)이 필요 없음
              ctx.arc(x, y, offscreenCanvas.height * 0.005, 0, 2 * Math.PI); // 점 크기는 비디오 높이에 비례
              ctx.fillStyle = POINT_COLOR;
              ctx.fill();
            });
          });
        }
        
        // 진행률 업데이트
        setExportProgress(Math.round(((i + 1) / totalFrames) * 100));
      }

      recorder.stop();

    } catch (error) {
      console.error("영상 내보내기 실패:", error);
      toast({ title: "영상 생성 실패", description: "처리 중 오류가 발생했습니다.", variant: "destructive" });
      setIsExporting(false);
    }
  };

  const resetExport = () => {
    setExportedUrl(null);
    setExportProgress(0);
  }

  return { isExporting, exportProgress, exportedUrl, exportVideo, resetExport };
};

export type { AnalysisDataWithKeypoints };
