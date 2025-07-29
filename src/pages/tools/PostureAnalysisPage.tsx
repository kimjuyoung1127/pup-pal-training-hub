import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Video, Loader2 } from "lucide-react";

// --- 상수 정의 ---
const SKELETON = [
  [15, 13], [13, 11], [16, 14], [14, 12], [11, 12], [5, 11], [6, 12], [5, 6],
  [5, 7], [6, 8], [7, 9], [8, 10], [1, 2], [0, 1], [0, 2], [1, 3], [2, 4], [3, 5], [4, 6]
];
const POINT_COLOR = "#f59e0b";
const LINE_COLOR = "#84cc16";
const POLLING_INTERVAL = 2000;

// --- 타입 정의 ---
type JobStatus = 'idle' | 'uploading' | 'processing' | 'completed' | 'failed';
type AnalysisResult = {
  keypoints_data: number[][][][];
  fps: number;
};

export default function PostureAnalysisPage() {
  // --- 상태 관리 ---
  const [file, setFile] = useState<File | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<JobStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  // --- Ref 관리 ---
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number>();
  const pollingTimer = useRef<NodeJS.Timeout>();

  // --- 핸들러 함수 (이전과 동일) ---
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setJobId(null);
      setStatus('idle');
      setProgress(0);
      setError(null);
      setAnalysisResult(null);
      setVideoUrl(null);
      if (pollingTimer.current) clearTimeout(pollingTimer.current);
    }
  };

  const handleAnalyzeClick = async () => {
    if (!file) {
      setError("분석할 동영상 파일을 선택해주세요.");
      return;
    }
    setStatus('uploading');
    setError(null);
    setProgress(0);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/jobs`;
      const response = await fetch(apiUrl, { method: 'POST', body: formData });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || '작업 요청에 실패했습니다.');
      }

      const data = await response.json();
      setJobId(data.job_id);
      setStatus('processing');
    } catch (err: any) {
      setError(err.message);
      setStatus('failed');
    }
  };

  // --- 폴링 로직 (이전과 동일) ---
  const pollJobStatus = useCallback(async () => {
    if (!jobId) return;
    try {
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/jobs/${jobId}`;
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error('상태 조회에 실패했습니다.');
      
      const data = await response.json();
      
      setProgress(data.progress);
      setVideoUrl(data.original_video_url);

      if (data.status === 'completed') {
        setStatus('completed');
        setAnalysisResult(data.result);
        clearTimeout(pollingTimer.current);
      } else if (data.status === 'failed') {
        setStatus('failed');
        setError(data.error || '알 수 없는 오류로 분석에 실패했습니다.');
        clearTimeout(pollingTimer.current);
      } else {
        pollingTimer.current = setTimeout(pollJobStatus, POLLING_INTERVAL);
      }
    } catch (err: any) {
      setError(err.message);
      setStatus('failed');
      clearTimeout(pollingTimer.current);
    }
  }, [jobId]);

  useEffect(() => {
    if (status === 'processing') {
      pollJobStatus();
    }
    return () => clearTimeout(pollingTimer.current);
  }, [status, pollJobStatus]);

  // ★★★★★ 최종 수정: 완벽한 좌표 변환 렌더링 로직 ★★★★★
  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !analysisResult) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawSkeletons = () => {
      if (video.paused || video.ended) return;

      // 1. 캔버스 크기를 화면에 표시되는 비디오의 크기와 정확히 일치시킴
      canvas.width = video.clientWidth;
      canvas.height = video.clientHeight;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 2. 정확한 축소 비율(scale) 계산
      const scale = Math.min(
        canvas.width / video.videoWidth,
        canvas.height / video.videoHeight
      );

      // 3. 화면에 렌더링된 실제 비디오의 크기와 위치(여백) 계산
      const renderedVideoWidth = video.videoWidth * scale;
      const renderedVideoHeight = video.videoHeight * scale;
      const offsetX = (canvas.width - renderedVideoWidth) / 2;
      const offsetY = (canvas.height - renderedVideoHeight) / 2;

      // 4. 현재 프레임의 좌표 데이터 가져오기
      const currentFrameIndex = Math.floor(video.currentTime * analysisResult.fps);
      if (currentFrameIndex >= analysisResult.keypoints_data.length) return;
      const frameKeypoints = analysisResult.keypoints_data[currentFrameIndex];
      if (!frameKeypoints || frameKeypoints.length === 0) return;

      // 5. 변환된 좌표를 사용하여 캔버스에 그리기
      frameKeypoints.forEach((dogKeypoints: number[][]) => {
        // 점 그리기
        dogKeypoints.forEach(point => {
          const [originalX, originalY] = point;
          const transformedX = originalX * scale + offsetX;
          const transformedY = originalY * scale + offsetY;
          
          ctx.beginPath();
          ctx.arc(transformedX, transformedY, 5, 0, 2 * Math.PI);
          ctx.fillStyle = POINT_COLOR;
          ctx.fill();
        });

        // 선 그리기
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
            ctx.lineWidth = 3;
            ctx.stroke();
          }
        });
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
    
    const stopRenderLoop = () => {
      cancelAnimationFrame(animationFrameId.current!);
    };

    video.addEventListener('play', startRenderLoop);
    video.addEventListener('playing', startRenderLoop);
    video.addEventListener('seeked', drawSkeletons);
    video.addEventListener('pause', stopRenderLoop);
    video.addEventListener('ended', stopRenderLoop);
    
    return () => {
      video.removeEventListener('play', startRenderLoop);
      video.removeEventListener('playing', startRenderLoop);
      video.removeEventListener('seeked', drawSkeletons);
      video.removeEventListener('pause', stopRenderLoop);
      video.removeEventListener('ended', stopRenderLoop);
      cancelAnimationFrame(animationFrameId.current!);
    };
  }, [analysisResult]);

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex flex-col items-center text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight">AI 강아지 자세 분석 (비동기)</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          대용량 영상도 안정적으로! AI가 강아지의 관절 움직임을 분석하는 동안 다른 작업을 하실 수 있습니다.
        </p>
      </div>

      <div className="bg-card border rounded-lg p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-grow w-full">
            <Input type="file" accept="video/*" onChange={handleFileChange} disabled={status === 'processing' || status === 'uploading'} />
          </div>
          <Button onClick={handleAnalyzeClick} disabled={!file || status === 'processing' || status === 'uploading'} className="w-full sm:w-auto">
            {status === 'idle' && <Video className="mr-2 h-4 w-4" />}
            {(status === 'processing' || status === 'uploading') && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {status === 'idle' && '자세 분석 시작'}
            {status === 'uploading' && '업로드 중...'}
            {status === 'processing' && '분석 중...'}
            {status === 'completed' && '분석 완료!'}
            {status === 'failed' && '다시 시도'}
          </Button>
        </div>

        {(status === 'processing' || status === 'uploading') && (
          <div className="mt-4">
            <Progress value={progress} className="w-full" />
            <p className="text-center text-sm text-muted-foreground mt-2">
              {progress}% 진행 중... (이 페이지를 벗어나도 분석은 계속됩니다)
            </p>
          </div>
        )}
        
        {error && (
          <Alert variant="destructive" className="mt-4">
            <Terminal className="h-4 w-4" />
            <AlertTitle>오류가 발생했습니다</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>

      {status === 'completed' && analysisResult && videoUrl && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4 text-center">분석 결과</h2>
          <div className="relative w-full max-w-2xl mx-auto border rounded-lg overflow-hidden">
            <video ref={videoRef} src={videoUrl} controls playsInline crossOrigin="anonymous" className="w-full h-auto aspect-video" />
            <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full pointer-events-none" />
          </div>
        </div>
      )}
    </div>
  );
}