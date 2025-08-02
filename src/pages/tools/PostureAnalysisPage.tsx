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
const HEALTH_CHECK_INTERVAL = 5000; // 서버 헬스 체크 간격 (5초)
const POLLING_INTERVAL = 2000; // 작업 상태 폴링 간격 (2초)

// --- 타입 정의 ---
type JobStatus = 'idle' | 'connecting' | 'waking_server' | 'uploading' | 'processing' | 'completed' | 'failed';
type AnalysisResult = {
  keypoints_data: number[][][][];
  fps: number;
  stability_score: number;
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

  const resetState = () => {
    setFile(null);
    setJobId(null);
    setStatus('idle');
    setProgress(0);
    setError(null);
    setAnalysisResult(null);
    setVideoUrl(null);
    if (pollingTimer.current) clearTimeout(pollingTimer.current);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      resetState();
      setFile(event.target.files[0]);
    }
  };

  const handleGoToHistory = () => {
    if (analysisResult && videoUrl && user && selectedDogId) {
      const resultToStore = {
        id: Date.now(),
        user_id: user.id,
        dog_id: selectedDogId,
        created_at: new Date().toISOString(),
        is_baseline: false,
        original_video_filename: file?.name || 'unknown_video',
        processed_video_url: videoUrl,
        analysis_results: {
          metadata: { fps: analysisResult.fps },
          scores: { stability: analysisResult.stability_score }
        },
        dog_name: dogs?.find(d => d.id === selectedDogId)?.name || 'Unknown Dog',
        stability_score: analysisResult.stability_score,
      };
      localStorage.setItem('latestAnalysisResult', JSON.stringify(resultToStore));
      navigate('/app/posture-analysis-history');
    } else {
      setError("분석 결과가 없어 기록 페이지로 이동할 수 없습니다.");
    }
  };

  // ★★★ 2단계: 실제 파일 업로드 로직 분리 ★★★
  const uploadFileAndStartJob = async () => {
    if (!file || !user || !selectedDogId) return;

    setStatus('uploading');
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

  // ★★★ 1단계: 분석 시작 버튼 클릭 핸들러 수정 ★★★
  const handleAnalyzeClick = async () => {
    if (!file || !user || !selectedDogId) {
      setError("필수 정보를 모두 선택해주세요.");
      return;
    }

    setStatus('connecting');
    setError(null);
    setProgress(0);

    try {
      const healthApiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/health`;
      const response = await fetch(healthApiUrl);
      if (response.ok) {
        // 서버가 즉시 응답하면 바로 업로드 시작
        await uploadFileAndStartJob();
      } else {
        // 응답이 없거나 에러가 발생하면 서버를 깨우는 상태로 전환
        setStatus('waking_server');
      }
    } catch (error) {
      // 네트워크 에러 등 fetch 자체가 실패하면 서버를 깨우는 상태로 전환
      setStatus('waking_server');
    }
  };

  // ★★★ 3단계: 서버 상태 폴링 로직 ★★★
  const pollServerHealth = useCallback(async () => {
    try {
      const healthApiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/health`;
      const response = await fetch(healthApiUrl);
      if (response.ok) {
        // 서버가 깨어나면 폴링을 멈추고 파일 업로드 시작
        clearTimeout(pollingTimer.current);
        await uploadFileAndStartJob();
      } else {
        // 아직 자고 있으면 다시 폴링
        pollingTimer.current = setTimeout(pollServerHealth, HEALTH_CHECK_INTERVAL);
      }
    } catch (error) {
      // 아직 자고 있으면 다시 폴링
      pollingTimer.current = setTimeout(pollServerHealth, HEALTH_CHECK_INTERVAL);
    }
  }, []);

  // ★★★ 4단계: 작업 상태 폴링 로직 (기존과 유사) ★★★
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

  // ★★★ 5단계: 상태에 따라 적절한 폴링 함수 호출 ★★★
  useEffect(() => {
    if (status === 'waking_server') {
      pollServerHealth();
    } else if (status === 'processing') {
      pollJobStatus();
    }
    return () => clearTimeout(pollingTimer.current);
  }, [status, pollServerHealth, pollJobStatus]);

  // ★★★ 6단계: 페이지 이탈 방지 ★★★
  useEffect(() => {
    const isProcessing = ['connecting', 'waking_server', 'uploading', 'processing'].includes(status);

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isProcessing) {
        const message = "분석이 진행 중입니다. 페이지를 벗어나면 업로드가 중단될 수 있습니다. 정말로 나가시겠습니까?";
        event.preventDefault();
        event.returnValue = message;
        return message;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [status]);

  // ... (렌더링 로직은 동일) ...
  const getStatusMessage = () => {
    switch (status) {
      case 'connecting':
        return '🔗 서버에 연결하는 중...';
      case 'waking_server':
        return '💤 AI 서버를 깨우는 중... (최대 5분 소요)';
      case 'uploading':
        return '🚀 영상을 안전하게 전송하는 중...';
      case 'processing':
        return '🔍 AI가 열심히 분석 중...';
      default:
        return '✨ 자세 분석 시작하기';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      <div className="container mx-auto p-4 max-w-4xl">
        {/* ... (기존 헤더 UI) ... */}
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
          <p className="mt-2 text-lg text-gray-600 font-light leading-relaxed max-w-2xl break-keep">
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
            {/* ... (강아지 선택, 파일 입력, 책임 한계 조항, GIF 미리보기 UI는 동일) ... */}
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
                네 발로 서있는 옆 모습 영상을 올려주세요
              </label>
              <Input 
                type="file" 
                accept="video/*" 
                onChange={handleFileChange} 
                disabled={status !== 'idle' && status !== 'completed' && status !== 'failed'}
                className="border-2 border-purple-200 focus:border-purple-400 file:bg-gradient-to-r file:from-orange-400 file:to-pink-400 file:text-white file:border-0 file:rounded-md file:px-4 file:py-2 file:mr-4"
              />
              <p className="text-xs text-gray-500 mt-2">
                💡 팁: 강아지 옆에서 촬영한 영상을 권장해요!
              </p>
            </div>

            <Alert variant="destructive" className="bg-yellow-50 border-yellow-400 text-yellow-800 mb-6">
              <Terminal className="h-4 w-4 !text-yellow-800" />
              <AlertTitle className="font-bold"></AlertTitle>
              <AlertDescription className="text-xs break-keep">
                본 AI 자세 분석 기능은 의료적 진단이나 전문적인 수의학적 소견을 대체할 수 없습니다. 분석 결과는 참고용 보조 지표이며, 반려동물의 건강에 이상이 의심될 경우 반드시 전문 수의사와 상담하시기 바랍니다.
              </AlertDescription>
            </Alert>

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
              disabled={!file || !selectedDogId || (status !== 'idle' && status !== 'completed' && status !== 'failed')} 
              className="w-full bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 hover:from-orange-500 hover:via-pink-600 hover:to-purple-600 text-white font-bold py-3 rounded-xl shadow-lg transform hover:scale-[1.02] transition-all duration-200"
              size="lg"
            >
              {status !== 'idle' && status !== 'completed' && status !== 'failed' ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {getStatusMessage()}
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  ✨ 자세 분석 시작하기
                </>
              )}
            </Button>
          </CardContent>

          {(status !== 'idle' && status !== 'completed' && status !== 'failed') && (
            <CardContent className="px-6 pb-6">
              <div className="bg-gradient-to-r from-orange-100 to-purple-100 p-4 rounded-xl">
                <Progress value={progress} className="w-full h-3 mb-3" />
                <p className="text-center text-sm text-gray-700 font-medium break-keep">
                  🎯 {status === 'processing' ? `${progress}% 완료! AI가 우리 강아지를 꼼꼼히 살펴보고 있어요` : getStatusMessage()}
                </p>
                <p className="text-center text-xs text-gray-500 mt-1 break-keep">
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
            {/* ... (분석 완료 후 UI는 동일) ... */}
            <CardHeader className="bg-gradient-to-r from-green-100 to-blue-100 text-center">
              <CardTitle className="text-2xl font-bold text-gray-800 flex items-center justify-center">
                <Sparkles className="mr-2 h-6 w-6 text-green-500" />
                🎉 분석 완료!
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
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
                <div className="mt-4 p-3 bg-white/70 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 break-keep">
                    {analysisResult.stability_score >= 80 ? "✅ 분석된 영상에서는 일관된 안정성을 보여줍니다. 하지만 이 결과는 보조적인 참고 자료이며, 건강에 대한 우려가 있으시면 반드시 수의사와 상담하세요." :
                     analysisResult.stability_score >= 60 ? "🟡 걸음걸이에서 약간의 변동성이 관찰됩니다. 주기적인 관찰을 통해 변화를 추적해보세요. 정확한 진단은 전문가의 도움이 필요합니다." :
                     analysisResult.stability_score >= 40 ? "⚠️ 자세에 눈에 띄는 불안정성이 감지되었습니다. 이는 일시적인 현상일 수도 있지만, 빠른 시일 내에 수의사에게 전문적인 검진을 받아보시는 것을 강력히 권장합니다." :
                     "🆘 지속적인 관찰이 필요한 수준의 불안정성이 확인되었습니다. 단순한 자세 문제가 아닐 수 있으니, 반드시 전문가와 상담하여 정확한 원인을 파악해주세요."}
                  </p>
                </div>
              </div>

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
