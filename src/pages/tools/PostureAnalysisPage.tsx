import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Video } from "lucide-react";

// YOLO 모델의 스켈레톤 연결 정보 (ultralytics/cfg/datasets/dog-pose.yaml 참고)
// 0-based index로 변환하여 사용합니다. (YAML 파일의 1-based index - 1)
const SKELETON = [
  [15, 13], [13, 11], [16, 14], [14, 12], [11, 12], [5, 11], [6, 12], [5, 6],
  [5, 7], [6, 8], [7, 9], [8, 10], [1, 2], [0, 1], [0, 2], [1, 3], [2, 4], [3, 5], [4, 6]
];
const POINT_COLOR = "#f59e0b"; // 관절 포인트 색상 (Amber 500)
const LINE_COLOR = "#84cc16"; // 스켈레톤 라인 색상 (Lime 500)

export default function PostureAnalysisPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  // 서버로부터 받을 데이�����
  const [analysisResult, setAnalysisResult] = useState<{
    original_video_url: string;
    keypoints_data: number[][][][]; // [frame][person][point][xy]
    fps: number;
  } | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number>();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setAnalysisResult(null); // 새 파일 선택 시 이전 결과 초기화
      setError(null);
    }
  };

  const handleAnalyzeClick = async () => {
    if (!file) {
      setError("분석할 동영상 파일을 선택해주세요.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setProgress(0);

    const formData = new FormData();
    formData.append('file', file);
    // 실제 앱에서는 로그인된 사용자 정보 등을 사용해야 합니다.
    formData.append('user_id', 'test-user-id');
    formData.append('dog_id', 'test-dog-id');

    try {
      // ★★★ 새로운 백엔드 엔드포인트 호출
      const response = await fetch('http://127.0.0.1:8000/api/process-video-client-render', {
        method: 'POST',
        body: formData,
      });
      
      // 간단한 프로그레스 시뮬레이션
      setProgress(50);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '분석에 실패했습니다.');
      }

      const data = await response.json();
      setAnalysisResult(data);
      setProgress(100);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ★★★★★ 핵심: 비디오 재생에 맞춰 캔버스에 그림을 그리는 로직
  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (!video || !canvas || !analysisResult) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawSkeletons = () => {
      if (video.paused || video.ended) return;

      // 캔버스 초기화
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 현재 비디오 시간으로 프레임 인덱스 계산
      const currentFrameIndex = Math.floor(video.currentTime * analysisResult.fps);
      if (currentFrameIndex >= analysisResult.keypoints_data.length) {
        return;
      }

      const frameKeypoints = analysisResult.keypoints_data[currentFrameIndex];
      if (!frameKeypoints || frameKeypoints.length === 0) return;

      // 비디오의 실제 크기와 캔버스 크기를 맞춤 (한 번만 설정)
      if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }

      // 각 객체(강아지)의 스켈레톤 그리기
      frameKeypoints.forEach((dogKeypoints: number[][]) => {
        // 1. 관절 포인트(점) 그리기
        dogKeypoints.forEach(point => {
          const [x, y] = point;
          ctx.beginPath();
          ctx.arc(x, y, 5, 0, 2 * Math.PI);
          ctx.fillStyle = POINT_COLOR;
          ctx.fill();
        });

        // 2. 스켈레톤(선) 그리기
        SKELETON.forEach(pair => {
          const [startIdx, endIdx] = pair;
          const startPoint = dogKeypoints[startIdx];
          const endPoint = dogKeypoints[endIdx];

          if (startPoint && endPoint && startPoint.length > 0 && endPoint.length > 0) {
            ctx.beginPath();
            ctx.moveTo(startPoint[0], startPoint[1]);
            ctx.lineTo(endPoint[0], endPoint[1]);
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
    }
    
    const stopRenderLoop = () => {
        cancelAnimationFrame(animationFrameId.current!);
    }

    video.addEventListener('play', startRenderLoop);
    video.addEventListener('playing', startRenderLoop);
    video.addEventListener('seeked', drawSkeletons); // 탐색 후 바로 그리기
    video.addEventListener('pause', stopRenderLoop);
    video.addEventListener('ended', stopRenderLoop);
    
    // 컴포넌트 언마운트 시 이벤트 리스너 정리
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
        <h1 className="text-4xl font-bold tracking-tight">AI 강아지 자세 분석</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          동영상을 업로드하여 AI가 강아지의 관절 움직임을 실시간으로 분석하는 것을 확인해보세요.
        </p>
      </div>

      <div className="bg-card border rounded-lg p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-grow w-full">
            <Input 
              type="file" 
              accept="video/mp4,video/quicktime,video/x-msvideo" 
              onChange={handleFileChange} 
              className="cursor-pointer"
            />
          </div>
          <Button onClick={handleAnalyzeClick} disabled={isLoading || !file} className="w-full sm:w-auto">
            <Video className="mr-2 h-4 w-4" />
            {isLoading ? '분석 중...' : '자세 분석 시작'}
          </Button>
        </div>

        {isLoading && <Progress value={progress} className="w-full mt-4" />}
        {error && (
          <Alert variant="destructive" className="mt-4">
            <Terminal className="h-4 w-4" />
            <AlertTitle>오류가 발생했습니다</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>

      {analysisResult && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4 text-center">분석 결과</h2>
          <div className="relative w-full max-w-2xl mx-auto border rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              src={analysisResult.original_video_url}
              controls
              playsInline
              crossOrigin="anonymous" // CORS 이슈 방지
              className="w-full h-auto aspect-video"
            />
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full pointer-events-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}
