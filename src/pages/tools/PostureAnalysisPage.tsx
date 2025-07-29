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

  // --- 핸들러 함수 ---
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

  // --- 폴링 로직 ---
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

  // ★★★★★ 디버깅을 위해 렌더링 로직을 수정합니다 ★★★★★
  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !analysisResult) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleMetadataLoaded = () => {
      // --- 1. 디버깅 정보 출력 ---
      console.log("--- 디버깅 정보 (메타데이터 로드됨) ---");
      console.log("원본 영상 크기 (videoWidth/Height):", video.videoWidth, "x", video.videoHeight);
      console.log("화면 표시 크기 (clientWidth/Height):", video.clientWidth, "x", video.clientHeight);
      
      // 캔버스 크기를 비디오의 원본 크기와 맞춥니다.
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      console.log("캔버스 크기 설정:", canvas.width, "x", canvas.height);
    };

    video.addEventListener('loadedmetadata', handleMetadataLoaded);

    const drawSkeletons = () => {
      if (video.paused || video.ended) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const currentFrameIndex = Math.floor(video.currentTime * analysisResult.fps);
      if (currentFrameIndex >= analysisResult.keypoints_data.length) return;

      const frameKeypoints = analysisResult.keypoints_data[currentFrameIndex];
      if (!frameKeypoints || frameKeypoints.length === 0) return;

      // --- 2. 첫 번째 좌표만 출력 (매 프레임마다) ---
      if (frameKeypoints[0] && frameKeypoints[0][0]) {
        // console.log("YOLO 원본 좌표 (예시):", frameKeypoints[0][0]);
      }
      // ---

      // 비율 계산
      const scaleX = video.clientWidth / video.videoWidth;
      const scaleY = video.clientHeight / video.videoHeight;
      
      // 레터박스(검은 여백) 계산
      const realVideoHeight = video.clientWidth * (video.videoHeight / video.videoWidth);
      const paddingTop = (video.clientHeight - realVideoHeight) / 2;

      frameKeypoints.forEach((dogKeypoints: number[][]) => {
        dogKeypoints.forEach(point => {
          const [originalX, originalY] = point;

          // 변환된 좌표 계산
          const transformedX = originalX * scaleX;
          const transformedY = (originalY * scaleX) + paddingTop; // Y축은 X축 비율과 패딩을 함께 고려

          ctx.beginPath();
          ctx.arc(transformedX, transformedY, 5, 0, 2 * Math.PI);
          ctx.fillStyle = POINT_COLOR;
          ctx.fill();
        });

        SKELETON.forEach(pair => {
          const [startIdx, endIdx] = pair;
          const startPoint = dogKeypoints[startIdx];
          const endPoint = dogKeypoints[endIdx];
          if (startPoint && endPoint && startPoint.length > 0 && endPoint.length > 0) {
            const [startX, startY] = startPoint;
            const [endX, endY] = endPoint;

            const transformedStartX = startX * scaleX;
            const transformedStartY = (startY * scaleX) + paddingTop;
            const transformedEndX = endX * scaleX;
            const transformedEndY = (endY * scaleX) + paddingTop;

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
      video.removeEventListener('loadedmetadata', handleMetadataLoaded);
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
