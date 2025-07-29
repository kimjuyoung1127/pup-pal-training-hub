// src/pages/history/AnalysisDetailView.tsx

import React, { useRef, useEffect, useMemo } from 'react';
import { JointAnalysisRecord, AnalysisData } from '@/types/analysis';
import { Calendar, FileText, Hash, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// --- 상수 정의 (PostureAnalysisPage와 동일하게 유지) ---
const SKELETON = [
  [15, 13], [13, 11], [16, 14], [14, 12], [11, 12], [5, 11], [6, 12], [5, 6],
  [5, 7], [6, 8], [7, 9], [8, 10], [1, 2], [0, 1], [0, 2], [1, 3], [2, 4], [3, 5], [4, 6]
];
const POINT_COLOR = "#f59e0b";
const LINE_COLOR = "#84cc16";

// analysis_results에 keypoints_data가 있을 수 있음을 명시하는 새로운 타입
interface AnalysisDataWithKeypoints extends AnalysisData {
    keypoints_data?: number[][][][];
}

interface AnalysisDetailViewProps {
  record: JointAnalysisRecord;
}

const AnalysisDetailView: React.FC<AnalysisDetailViewProps> = ({ record }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number>();

  const analysisResult = useMemo(() => {
    if (!record?.analysis_results) return null;
    let parsedData: any;
    if (typeof record.analysis_results === 'string') {
      try { parsedData = JSON.parse(record.analysis_results); } catch (e) { return null; }
    } else {
      parsedData = record.analysis_results;
    }
    return parsedData as AnalysisDataWithKeypoints;
  }, [record?.analysis_results]);

  const stabilityScore = analysisResult?.scores?.stability;

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !analysisResult) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawSkeletons = () => {
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        // 비디오 크기가 0이면 캔버스 클리어만 수행
        if(canvas.width > 0 && canvas.height > 0) ctx.clearRect(0, 0, canvas.width, canvas.height);
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

      if (video.paused || video.ended) return; // 정지/종료 시에는 그리지 않음

      const fps = analysisResult.metadata?.fps || 30;
      const currentFrameIndex = Math.floor(video.currentTime * fps);

      if (!analysisResult.keypoints_data || currentFrameIndex >= analysisResult.keypoints_data.length) return;
      const frameKeypoints = analysisResult.keypoints_data[currentFrameIndex];
      if (!frameKeypoints || frameKeypoints.length === 0) return;

      frameKeypoints.forEach((dogKeypoints: number[][]) => {
        dogKeypoints.forEach(point => {
          const [originalX, originalY] = point;
          const transformedX = originalX * scale + offsetX;
          const transformedY = originalY * scale + offsetY;
          ctx.beginPath();
          ctx.arc(transformedX, transformedY, 3, 0, 2 * Math.PI);
          ctx.fillStyle = POINT_COLOR;
          ctx.fill();
        });

        SKELETON.forEach(pair => {
          const [startIdx, endIdx] = pair;
          const startPoint = dogKeypoints[startIdx];
          const endPoint = dogKeypoints[endIdx];
          if (startPoint && endPoint && startPoint.length > 0 && endPoint.length > 0) {
            const transformedStartX = startPoint[0] * scale + offsetX;
            const transformedStartY = startPoint[1] * scale + offsetY;
            const transformedEndX = endPoint[0] * scale + offsetX;
            const transformedEndY = endPoint[1] * scale + offsetY;
            ctx.beginPath();
            ctx.moveTo(transformedStartX, transformedStartY);
            ctx.lineTo(transformedEndX, transformedEndY);
            ctx.strokeStyle = LINE_COLOR;
            ctx.lineWidth = 2;
            ctx.stroke();
          }
        });
      });
    };

    const renderLoop = () => {
      drawSkeletons();
      animationFrameId.current = requestAnimationFrame(renderLoop);
    };

    const startRenderLoop = () => { cancelAnimationFrame(animationFrameId.current!); renderLoop(); };
    const stopRenderLoop = () => { cancelAnimationFrame(animationFrameId.current!); };
    
    // ✅ 전체화면 변경 시 다시 그리기 위한 핸들러
    const handleFullscreenChange = () => {
        // 전체화면 변경 시 캔버스 크기를 재조정하고 다시 그리기 위해 약간의 딜레이 후 실행
        setTimeout(() => {
            drawSkeletons();
        }, 100);
    };

    video.addEventListener('play', startRenderLoop);
    video.addEventListener('playing', startRenderLoop);
    video.addEventListener('seeked', drawSkeletons);
    video.addEventListener('pause', stopRenderLoop);
    video.addEventListener('ended', stopRenderLoop);
    video.addEventListener('loadedmetadata', drawSkeletons);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      video.removeEventListener('play', startRenderLoop);
      video.removeEventListener('playing', startRenderLoop);
      video.removeEventListener('seeked', drawSkeletons);
      video.removeEventListener('pause', stopRenderLoop);
      video.removeEventListener('ended', stopRenderLoop);
      video.removeEventListener('loadedmetadata', drawSkeletons);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      cancelAnimationFrame(animationFrameId.current!);
    };
  }, [analysisResult]);

  const formattedDate = new Date(record.created_at).toLocaleString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <Card className="sticky top-24 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">분석 상세 결과</CardTitle>
          <CardDescription>
            선택하신 자세 분석 기록의 상세 정보와 영상 리플레이입니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            {stabilityScore !== undefined && (
                <div className="flex items-center text-gray-800">
                <Award className="w-10 h-10 mr-4 text-orange-500" />
                <div>
                    <p className="text-lg font-semibold text-gray-700">자세 안정성 점수</p>
                    <p className="text-4xl font-bold text-orange-600">{stabilityScore.toFixed(1)}점</p>
                </div>
                </div>
            )}
            <div className="flex items-start">
              <Calendar className="w-5 h-5 mr-4 text-gray-500 mt-1" />
              <div>
                <p className="font-semibold">분석 일시</p>
                <p className="text-gray-700">{formattedDate}</p>
              </div>
            </div>
            <div className="flex items-start">
              <FileText className="w-5 h-5 mr-4 text-gray-500 mt-1" />
              <div>
                <p className="font-semibold">원본 파일명</p>
                <p className="truncate text-gray-700">{record.original_video_filename}</p>
              </div>
            </div>
             <div className="flex items-start">
              <Hash className="w-5 h-5 mr-4 text-gray-500 mt-1" />
              <div>
                <p className="font-semibold">분석 ID</p>
                <p className="text-xs text-gray-600">{record.id}</p>
              </div>
            </div>
          </div>
          <div className="relative w-full max-w-2xl mx-auto border-2 border-gray-200 rounded-xl overflow-hidden shadow-md aspect-video">
            <video 
                ref={videoRef} 
                src={record.processed_video_url} 
                controls 
                playsInline 
                crossOrigin="anonymous" 
                className="absolute top-0 left-0 w-full h-full"
            />
            <canvas 
                ref={canvasRef} 
                className="absolute top-0 left-0 w-full h-full pointer-events-none" 
            />
          </div>
        </CardContent>
    </Card>
  );
};

export default AnalysisDetailView;