import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Video, Loader2, History, Dog, BarChart, Heart, Sparkles, Camera, Award } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUser } from '@supabase/auth-helpers-react';
import { useUserDogs } from '@/pages/history/useUserDogs';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
  stability_score: number; // 점수 필드 추가
};

export default function PostureAnalysisPage() {
  // --- 사용자 및 강아지 정보 ---
  const user = useUser();
  const { data: dogs, isLoading: isLoadingDogs } = useUserDogs();
  const [selectedDogId, setSelectedDogId] = useState<string | null>(null);

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
  const navigate = useNavigate();

  // 강아지 목록이 로드되면 첫 번째 강아지를 자동으로 선택
  useEffect(() => {
    if (dogs && dogs.length > 0 && !selectedDogId) {
      setSelectedDogId(dogs[0].id);
    }
  }, [dogs, selectedDogId]);

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

  const handleGoToHistory = () => {
    if (analysisResult && videoUrl && user && selectedDogId) {
      // JointAnalysisRecord 타입에 맞춰 데이터 재구성
      const resultToStore = {
        id: Date.now(), // 임시 ID (DB의 실제 ID와는 다름)
        user_id: user.id,
        dog_id: selectedDogId,
        created_at: new Date().toISOString(),
        is_baseline: false, // 이 정보는 백엔드에서 결정되므로 기본값 설정
        original_video_filename: file?.name || 'unknown_video',
        processed_video_url: videoUrl,
        analysis_results: {
          frames: [], // 프론트에서는 전체 프레임 데이터가 없으므로 비워둠
          metadata: { // fps만 사용 가능
            fps: analysisResult.fps,
            width: videoRef.current?.videoWidth || 0,
            height: videoRef.current?.videoHeight || 0,
            frame_count: 0,
          },
          scores: {
            stability: analysisResult.stability_score,
          }
        },
        // 프론트에서 가공해서 사용하는 추가 정보
        dog_name: dogs?.find(d => d.id === selectedDogId)?.name || 'Unknown Dog',
        stability_score: analysisResult.stability_score,
      };

      localStorage.setItem('latestAnalysisResult', JSON.stringify(resultToStore));
      navigate('/app/posture-analysis-history'); // 올바른 경로로 수정
    } else {
      setError("분석 결과가 없어 기록 페이지로 이동할 수 없습니다.");
    }
  };

  const handleAnalyzeClick = async () => {
    if (!file) {
      setError("분석할 동영상 파일을 선택해주세요.");
      return;
    }
    if (!user) {
      setError("로그인이 필요합니다.");
      return;
    }
    if (!selectedDogId) {
      setError("분석할 강아지를 선택해주세요.");
      return;
    }

    setStatus('uploading');
    setError(null);
    setProgress(0);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('user_id', user.id);
    formData.append('dog_id', selectedDogId);

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

  // ★★★★★ 최종 수정: 완벽한 좌표 변환 렌더링 로직 (경쟁 상태 해결) ★★★★★
  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !analysisResult) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawSkeletons = () => {
      // [안전 장치] 비디오 메타데이터가 로드되지 않았거나, 재생이 멈춘 상태면 아무것도 그리지 않음
      if (video.videoWidth === 0 || video.videoHeight === 0 || video.paused || video.ended) {
        return;
      }

      // 1. 캔버스 크기를 화면에 표시되는 비디오의 크기와 정확히 일치시킴
      canvas.width = video.clientWidth;
      canvas.height = video.clientHeight;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 2. 정확한 축소 비율(scale) 계산 (가로/세로 비율 유지)
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
          ctx.arc(transformedX, transformedY, 3, 0, 2 * Math.PI); // 점 반지름 수정 (5 -> 3)
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
            ctx.lineWidth = 2; // 선 두께 수정 (3 -> 2)
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
    
    // 메타데이터가 로드된 후 첫 프레임을 바로 그리기 위한 이벤트 리스너
    video.addEventListener('loadedmetadata', drawSkeletons);

    return () => {
      video.removeEventListener('play', startRenderLoop);
      video.removeEventListener('playing', startRenderLoop);
      video.removeEventListener('seeked', drawSkeletons);
      video.removeEventListener('pause', stopRenderLoop);
      video.removeEventListener('ended', stopRenderLoop);
      video.removeEventListener('loadedmetadata', drawSkeletons);
      cancelAnimationFrame(animationFrameId.current!);
    };
  }, [analysisResult]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Dog className="h-8 w-8 text-purple-500 mr-3" />
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              <span className="bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                🐕 AI 자세 분석
              </span>
            </h1>
            <Sparkles className="h-8 w-8 text-purple-500 ml-3" />
          </div>
          <p className="mt-2 text-lg text-gray-600 font-light leading-relaxed max-w-2xl">
            🌟 우리 강아지의 자세를 AI가 똑똑하게 분석해드려요! 🌟
          </p>
        </div>

        <Card className="overflow-hidden shadow-xl border-2 border-orange-200 bg-white/90 backdrop-blur-md">
          <CardHeader className="bg-gradient-to-r from-orange-100 to-pink-100 pb-6">
            <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
              <Camera className="mr-2 h-5 w-5 text-orange-500" />
              분석 준비하기
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div>
              <label className="font-semibold text-sm mb-3 block flex items-center">
                <Heart className="inline-block mr-2 h-4 w-4 text-pink-500" />
                어떤 강아지를 분석할까요?
              </label>
              <Select onValueChange={setSelectedDogId} value={selectedDogId || ''} disabled={isLoadingDogs || !dogs || dogs.length === 0}>
                <SelectTrigger className="border-2 border-orange-200 focus:border-orange-400">
                  <SelectValue placeholder={isLoadingDogs ? "🐕 강아지 목록을 불러오는 중..." : "🐾 분석할 강아지를 선택해주세요"} />
                </SelectTrigger>
                <SelectContent>
                  {dogs && dogs.map(dog => (
                    <SelectItem key={dog.id} value={dog.id}>
                      <span className="flex items-center">
                        🐕 {dog.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!isLoadingDogs && (!dogs || dogs.length === 0) && (
                <p className="text-xs text-gray-500 mt-2 flex items-center">
                  <Dog className="mr-1 h-3 w-3" />
                  등록된 강아지가 없어요. 먼저 강아지를 등록해주세요!
                </p>
              )}
            </div>

            <div>
              <label className="font-semibold text-sm mb-3 block flex items-center">
                <Video className="inline-block mr-2 h-4 w-4 text-purple-500" />
                걸어다니는 영상을 올려주세요
              </label>
              <Input 
                type="file" 
                accept="video/*" 
                onChange={handleFileChange} 
                disabled={status === 'processing' || status === 'uploading'}
                className="border-2 border-purple-200 focus:border-purple-400 file:bg-gradient-to-r file:from-orange-400 file:to-pink-400 file:text-white file:border-0 file:rounded-md file:px-4 file:py-2 file:mr-4"
              />
              <p className="text-xs text-gray-500 mt-2">
                💡 팁: 강아지 옆에서 촬영한 영상을 권장해요!
              </p>
            </div>

            {/* --- GIF 미리보기 --- */}
            <div className="mt-6 p-4 border-2 border-dashed border-orange-200 rounded-xl bg-orange-50/50">
              <p className="text-sm font-semibold text-center text-orange-700 mb-3 flex items-center justify-center">
                <Sparkles className="inline-block mr-2 h-4 w-4 text-orange-500" />
                AI 분석 미리보기
              </p>
              <img 
                src="/posture/posture-analysis-demo.gif" 
                alt="AI 자세 분석 시연" 
                className="rounded-lg shadow-md w-full"
              />
              <p className="text-xs text-gray-500 mt-3 text-center">
                💡 이렇게 자세를 분석하여 피드백을 해드려요
              </p>
            </div>
            
            <Button 
              onClick={handleAnalyzeClick} 
              disabled={!file || !selectedDogId || status === 'processing' || status === 'uploading'} 
              className="w-full bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 hover:from-orange-500 hover:via-pink-600 hover:to-purple-600 text-white font-bold py-3 rounded-xl shadow-lg transform hover:scale-[1.02] transition-all duration-200"
              size="lg"
            >
              {(status === 'processing' || status === 'uploading') ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {status === 'uploading' ? '🚀 업로드 중...' : '🔍 AI가 열심히 분석 중...'}
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  ✨ 자세 분석 시작하기
                </>
              )}
            </Button>
          </CardContent>

          {(status === 'processing' || status === 'uploading') && (
            <CardContent className="px-6 pb-6">
              <div className="bg-gradient-to-r from-orange-100 to-purple-100 p-4 rounded-xl">
                <Progress value={progress} className="w-full h-3 mb-3" />
                <p className="text-center text-sm text-gray-700 font-medium">
                  🎯 {progress}% 완료! AI가 우리 강아지를 꼼꼼히 살펴보고 있어요
                </p>
                <p className="text-center text-xs text-gray-500 mt-1">
                  💫 이 페이지를 벗어나도 분석은 계속돼요!
                </p>
              </div>
            </CardContent>
          )}
          
          {error && (
            <CardContent className="px-6 pb-6">
              <Alert variant="destructive" className="border-red-200">
                <Terminal className="h-4 w-4" />
                <AlertTitle>앗, 문제가 생겼어요! 😅</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </CardContent>
          )}
        </Card>

        {status === 'completed' && analysisResult && videoUrl && (
          <Card className="mt-8 overflow-hidden shadow-xl border-2 border-green-200 bg-white/90 backdrop-blur-md">
            <CardHeader className="bg-gradient-to-r from-green-100 to-blue-100 text-center">
              <CardTitle className="text-2xl font-bold text-gray-800 flex items-center justify-center">
                <Sparkles className="mr-2 h-6 w-6 text-green-500" />
                🎉 분석 완료!
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {/* 안정성 점수 표시 */}
              <div className="mb-6 p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl text-center">
                <div className="flex items-center justify-center mb-3">
                  <Award className="h-8 w-8 text-amber-500 mr-3" />
                  <h3 className="text-xl font-bold text-amber-800">자세 안정성 점수</h3>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-6xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                    {analysisResult.stability_score}
                  </span>
                  <div className="text-left">
                    <div className="text-2xl font-bold text-amber-600">점</div>
                    <div className="text-sm text-gray-500">/ 100점</div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-3 flex items-center justify-center">
                  <Heart className="mr-1 h-4 w-4 text-pink-500" />
                  점수가 높을수록 우리 강아지의 자세가 안정적이에요!
                </p>
                {/* 점수별 코멘트 */}
                <div className="mt-4 p-3 bg-white/70 rounded-lg">
                  <p className="text-sm font-medium text-gray-700">
                    {analysisResult.stability_score >= 80 ? "✅ 분석된 영상에서는 일관된 안정성을 보여줍니다. 하지만 이 결과는 보조적인 참고 자료이며, 건강에 대한 우려가 있으시면 반드시 수의사와 상담하세요." :
                     analysisResult.stability_score >= 60 ? "🟡 걸음걸이에서 약간의 변동성이 관찰됩니다. 주기적인 관찰을 통해 변화를 추적해보세요. 정확한 진단은 전문가의 도움이 필요합니다." :
                     analysisResult.stability_score >= 40 ? "⚠️ 자세에 눈에 띄는 불안정성이 감지되었습니다. 이는 일시적인 현상일 수도 있지만, 빠른 시일 내에 수의사에게 전문적인 검진을 받아보시는 것을 강력히 권장합니다." :
                     "🆘 지속적인 관찰이 필요한 수준의 불안정성이 확인되었습니다. 단순한 자세 문제가 아닐 수 있으니, 반드시 전문가와 상담하여 정확한 원인을 파악해주세요."}
                  </p>
                </div>
              </div>

              {/* 영상 플레이어 */}
              <div className="relative w-full max-w-2xl mx-auto border-2 border-gray-200 rounded-xl overflow-hidden shadow-lg">
                <video ref={videoRef} src={videoUrl} controls playsInline crossOrigin="anonymous" className="w-full h-auto aspect-video" />
                <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full pointer-events-none" />
              </div>
              
              <div className="text-center mt-6">
                <Button 
                  onClick={handleGoToHistory}
                  className="bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 px-8 rounded-xl shadow-lg transform hover:scale-[1.02] transition-all duration-200"
                  size="lg"
                >
                  <History className="mr-2 h-5 w-5" />
                  📊 상세 결과 보러가기
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}