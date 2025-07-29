// src/pages/history/AnalysisDetailModal.tsx

import React, { useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { JointAnalysisRecord } from '@/types/analysis';
import { Calendar, FileText, Hash, BarChart, Video } from 'lucide-react';

// --- 상수 정의 (PostureAnalysisPage와 동일하게 유지) ---
const SKELETON = [
  [15, 13], [13, 11], [16, 14], [14, 12], [11, 12], [5, 11], [6, 12], [5, 6],
  [5, 7], [6, 8], [7, 9], [8, 10], [1, 2], [0, 1], [0, 2], [1, 3], [2, 4], [3, 5], [4, 6]
];
const POINT_COLOR = "#f59e0b";
const LINE_COLOR = "#84cc16";

interface AnalysisDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: JointAnalysisRecord | null;
}

const AnalysisDetailModal: React.FC<AnalysisDetailModalProps> = ({ isOpen, onClose, record }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number>();

  const analysisResult = record?.analysis_results;

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !analysisResult || !isOpen) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawSkeletons = () => {
      if (video.videoWidth === 0 || video.videoHeight === 0 || video.paused || video.ended) {
        return;
      }
      canvas.width = video.clientWidth;
      canvas.height = video.clientHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const scale = Math.min(canvas.width / video.videoWidth, canvas.height / video.videoHeight);
      const renderedVideoWidth = video.videoWidth * scale;
      const renderedVideoHeight = video.videoHeight * scale;
      const offsetX = (canvas.width - renderedVideoWidth) / 2;
      const offsetY = (canvas.height - renderedVideoHeight) / 2;
      const fps = analysisResult.metadata?.fps || 30;
      const currentFrameIndex = Math.floor(video.currentTime * fps);
      if (currentFrameIndex >= analysisResult.frames.length) return;
      const frameKeypoints = analysisResult.frames[currentFrameIndex]?.keypoints;
      if (!frameKeypoints) return;

      // 점과 선 그리기 (keypoints 구조에 맞게 수정)
      frameKeypoints.forEach(point => {
        const transformedX = point.x * scale + offsetX;
        const transformedY = point.y * scale + offsetY;
        ctx.beginPath();
        ctx.arc(transformedX, transformedY, 3, 0, 2 * Math.PI);
        ctx.fillStyle = POINT_COLOR;
        ctx.fill();
      });

      SKELETON.forEach(pair => {
        const startPoint = frameKeypoints[pair[0]];
        const endPoint = frameKeypoints[pair[1]];
        if (startPoint && endPoint) {
          const transformedStartX = startPoint.x * scale + offsetX;
          const transformedStartY = startPoint.y * scale + offsetY;
          const transformedEndX = endPoint.x * scale + offsetX;
          const transformedEndY = endPoint.y * scale + offsetY;
          ctx.beginPath();
          ctx.moveTo(transformedStartX, transformedStartY);
          ctx.lineTo(transformedEndX, transformedEndY);
          ctx.strokeStyle = LINE_COLOR;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      });
    };

    const renderLoop = () => {
      drawSkeletons();
      animationFrameId.current = requestAnimationFrame(renderLoop);
    };
    const startRenderLoop = () => {
      cancelAnimationFrame(animationFrameId.current!);
      renderLoop();
    };
    const stopRenderLoop = () => cancelAnimationFrame(animationFrameId.current!);

    video.addEventListener('play', startRenderLoop);
    video.addEventListener('pause', stopRenderLoop);
    video.addEventListener('loadedmetadata', drawSkeletons);
    return () => {
      video.removeEventListener('play', startRenderLoop);
      video.removeEventListener('pause', stopRenderLoop);
      video.removeEventListener('loadedmetadata', drawSkeletons);
      cancelAnimationFrame(animationFrameId.current!);
    };
  }, [analysisResult, isOpen]);

  if (!record) return null;

  const formattedDate = new Date(record.created_at).toLocaleString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">분석 상세 결과</DialogTitle>
          <DialogDescription>
            선택하신 자세 분석 기록의 상세 정보와 영상 리플레이입니다.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {/* 정보 섹션 */}
          <div className="space-y-4">
            <div className="flex items-center">
              <BarChart className="w-5 h-5 mr-3 text-orange-500" />
              <div>
                <p className="font-semibold">안정성 점수</p>
                <p className="text-2xl font-bold">{record.stability_score?.toFixed(1) ?? 'N/A'}점</p>
              </div>
            </div>
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-3 text-gray-500" />
              <div>
                <p className="font-semibold">분석 일시</p>
                <p>{formattedDate}</p>
              </div>
            </div>
            <div className="flex items-center">
              <FileText className="w-5 h-5 mr-3 text-gray-500" />
              <div>
                <p className="font-semibold">원본 파일명</p>
                <p className="truncate">{record.original_video_filename}</p>
              </div>
            </div>
             <div className="flex items-center">
              <Hash className="w-5 h-5 mr-3 text-gray-500" />
              <div>
                <p className="font-semibold">분석 ID</p>
                <p className="text-xs">{record.id}</p>
              </div>
            </div>
          </div>

          {/* 영상 리플레이 섹션 */}
          <div className="relative w-full mx-auto border rounded-lg overflow-hidden">
            <video ref={videoRef} src={record.processed_video_url} controls playsInline crossOrigin="anonymous" className="w-full h-auto aspect-video" />
            <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full pointer-events-none" />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose} variant="outline">닫기</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AnalysisDetailModal;
