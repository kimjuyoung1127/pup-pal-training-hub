import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Video, Loader2, History, Dog, Sparkles, Camera, Award, BarChart, Play, Upload } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUser } from '@supabase/auth-helpers-react';
import { useUserDogs } from '@/pages/history/useUserDogs';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import RealtimeRecorder from './RealtimeRecorder'; // RealtimeRecorder 컴포넌트 임포트

// --- 상수 정의 ---
const HEALTH_CHECK_INTERVAL = 5000;

// --- 타입 정의 ---
type JobStatus = 'idle' | 'connecting' | 'waking_server' | 'uploading' | 'processing' | 'completed' | 'failed';
interface AnalysisResult {
  keypoints_data: number[][][][];
  fps: number;
  scores: {
    stability: number;
    curvature: number;
  };
  metadata: {
    fps: number;
    frame_count: number;
  };
  debug_video_url?: string;
}

// 종합 코멘트 생성 함수
const getOverallComment = (stability?: number, curvature?: number): string => {
  if (stability === undefined || curvature === undefined) return "분석 데이터를 읽어오는 중입니다...";
  const stabilityComment = stability >= 80 ? "매우 안정적인 자세" : stability >= 60 ? "준수한 자세" : "다소 불안정한 자세";
  const curvatureComment = curvature >= 170 ? "곧게 펴진 허리" : curvature >= 155 ? "조금 웅크린 자세" : "주의가 필요한 웅크린 자세";

  if (stability >= 80 && curvature >= 170) return `✅ ${stabilityComment}와 ${curvatureComment}를 모두 보여주네요! 아주 이상적인 자세입니다.`;
  if (stability < 60 && curvature < 155) return `⚠️ ${stabilityComment}와 ${curvatureComment}가 함께 관찰됩니다. 자세에 대한 전문가의 관심이 필요해 보입니다.`;
  return `ℹ️ 종합적으로, 우리 강아지는 ${stabilityComment}와 ${curvatureComment}를 보이고 있습니다. 꾸준한 관찰을 통해 변화를 지켜봐 주세요.`;
};

export default function PostureAnalysisPage() {
  const user = useUser();
  const { data: dogs, isLoading: isLoadingDogs } = useUserDogs();
  const [selectedDogId, setSelectedDogId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<JobStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const pollingTimer = useRef<NodeJS.Timeout>();
  const navigate = useNavigate();
  
  const [recordingOption, setRecordingOption] = useState<'upload' | 'record'>('upload');

  useEffect(() => {
    if (dogs && dogs.length > 0 && !selectedDogId) setSelectedDogId(dogs[0].id);
  }, [dogs, selectedDogId]);

  const resetState = () => {
    setFile(null); setJobId(null); setStatus('idle'); setProgress(0);
    setError(null); setAnalysisResult(null); setVideoUrl(null);
    if (pollingTimer.current) clearTimeout(pollingTimer.current);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      resetState();
      setFile(event.target.files[0]);
    }
  };

  const handleRecordingComplete = (recordedFile: File) => {
    resetState();
    setFile(recordedFile);
    setRecordingOption('upload'); // 녹화 완료 후 파일 업로드 화면으로 전환하여 선택된 파일 표시
  };

  const uploadFileAndStartJob = async () => {
    if (!file || !user || !selectedDogId) return;
    setStatus('uploading');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('user_id', user.id);
    formData.append('dog_id', selectedDogId);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/jobs`, { method: 'POST', body: formData });
      if (!response.ok) throw new Error((await response.json()).detail || '작업 요청 실패');
      const data = await response.json();
      setJobId(data.job_id);
      setStatus('processing');
    } catch (err: any) {
      setError(err.message);
      setStatus('failed');
    }
  };

  const handleAnalyzeClick = async () => {
    if (!file || !user || !selectedDogId) {
      setError("필수 정보를 모두 선택해주세요.");
      return;
    }
    setStatus('connecting');
    setError(null);
    setProgress(0);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/health`);
      if (response.ok) await uploadFileAndStartJob();
      else setStatus('waking_server');
    } catch (error) {
      setStatus('waking_server');
    }
  };

  const pollServerHealth = useCallback(async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/health`);
      if (response.ok) {
        clearTimeout(pollingTimer.current);
        await uploadFileAndStartJob();
      } else {
        pollingTimer.current = setTimeout(pollServerHealth, HEALTH_CHECK_INTERVAL);
      }
    } catch (error) {
      pollingTimer.current = setTimeout(pollServerHealth, HEALTH_CHECK_INTERVAL);
    }
  }, [uploadFileAndStartJob]);

  const pollJobStatus = useCallback(async (currentJobId: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/jobs/${currentJobId}`);
      if (!response.ok) throw new Error('상태 조회 실패');
      const data = await response.json();
      
      setProgress(data.progress);
      setVideoUrl(data.result?.keypoints_data ? (data.result.debug_video_url || data.result.processed_video_url) : null);

      if (data.status === 'completed') {
        setAnalysisResult(data.result);
        setStatus('completed');
        setJobId(null);
      } else if (data.status === 'failed') {
        setError(data.error || '알 수 없는 오류 발생');
        setStatus('failed');
        setJobId(null);
      } else {
        pollingTimer.current = setTimeout(() => pollJobStatus(currentJobId), 2000);
      }
    } catch (err: any) {
      setError(err.message);
      setStatus('failed');
      setJobId(null);
    }
  }, []);

  useEffect(() => {
    if (status === 'waking_server') pollServerHealth();
    else if (status === 'processing' && jobId) pollJobStatus(jobId);
    return () => clearTimeout(pollingTimer.current);
  }, [status, jobId, pollServerHealth, pollJobStatus]);

  const getStatusMessage = () => ({
    'connecting': '🔗 서버에 연결하는 중...',
    'waking_server': '💤 AI 서버를 깨우는 중... (최대 1분 소요)',
    'uploading': '🚀 영상을 안전하게 전송하는 중...',
    'processing': '🔍 AI가 열심히 분석 중...',
  }[status] || '✨ 자세 분석 시작하기');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto p-4 md:p-8"
    >
      {/* 헤더 섹션 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div className="text-left">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <Sparkles className="w-8 h-8 mr-3 text-purple-500" />
            AI 자세 분석
          </h1>
          <p className="text-gray-600 mt-2">
            강아지의 자세를 AI가 분석하여 건강 상태를 확인해보세요.
          </p>
        </div>
        <Button 
          onClick={() => navigate('/app/posture-analysis-history')} 
          className="w-full sm:w-auto flex-shrink-0"
          variant="outline"
        >
          <History className="w-4 h-4 mr-2" />
          분석 기록 보기
        </Button>
      </div>

      {/* 시연 영상 섹션 */}
      <Card className="mb-8 overflow-hidden shadow-xl border-2 border-purple-200 bg-white/90 backdrop-blur-md">
        <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-100">
          <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
            <Play className="mr-3 h-6 w-6 text-purple-500" />
            자세 분석 시연 영상
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">🎯 우리 강아지를 위한 AI 자세 분석 서비스</h3>
              <div className="space-y-4 text-gray-600">
                <div className="flex items-start space-x-3">
                  <Award className="w-5 h-5 mt-1 text-blue-500 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">📊 자세 안정성 점수 측정</h4>
                    <p className="text-sm leading-relaxed">
                      강아지가 자세를 유지할 때 몸의 균형과 안정성을 AI가 정밀하게 분석해요.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Dog className="w-5 h-5 mt-1 text-green-500 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">🏆 자세 점수 평가</h4>
                    <p className="text-sm leading-relaxed">
                      건강한 강아지의 표준 자세를 
                      기준으로 우리 아이의 자세 상태를 객관적으로 평가합니다. ✨
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <BarChart className="w-5 h-5 mt-1 text-purple-500 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">🤖 AI 기반 종합 코멘트</h4>
                    <p className="text-sm leading-relaxed">
                      분석 결과를 바탕으로 AI가 쉽게 점수로 설명해드려요.
                      우리 강아지의 상태와 주의사항을 알려드립니다. 💬
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Video className="w-5 h-5 mt-1 text-orange-500 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">🎬 분석 과정 영상 제공</h4>
                    <p className="text-sm leading-relaxed">
                      AI가 어떻게 분석했는지 시각적으로 확인할 수 있어요. . 🔍
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-center">
                <img 
                  src="/posture/posture-analysis-demo.gif" 
                  alt="자세 분석 시연" 
                  className="rounded-lg shadow-lg max-w-full h-auto border border-gray-200"
                  style={{ maxHeight: '250px' }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 분석 준비 섹션 */}
      <Card className="shadow-xl border-2 border-purple-200 bg-white/90 backdrop-blur-md">
        <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-100">
          <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
            <Camera className="mr-3 h-6 w-6 text-purple-500" />
            분석 준비하기
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* 강아지 선택 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">분석할 강아지 선택</label>
            <Select 
              onValueChange={setSelectedDogId} 
              value={selectedDogId || ''} 
              disabled={isLoadingDogs || !dogs || dogs.length === 0}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={isLoadingDogs ? "로딩 중..." : "강아지를 선택하세요"} />
              </SelectTrigger>
              <SelectContent>
                {dogs?.map(dog => (
                  <SelectItem key={dog.id} value={dog.id}>{dog.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 분석 방식 선택 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">분석 방식 선택</label>
            <Select onValueChange={(value: 'upload' | 'record') => {
              resetState();
              setRecordingOption(value);
            }} value={recordingOption}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="분석 방식을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="upload">영상 파일 업로드</SelectItem>
                <SelectItem value="record">실시간 영상 녹화</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 선택에 따른 UI 렌더링 */}
      {recordingOption === 'upload' ? (
        <Card className="mt-6 shadow-xl border-2 border-purple-200 bg-white/90 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center">
              <Upload className="mr-3 h-5 w-5 text-purple-500" />
              영상 파일 업로드
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">분석할 영상 파일</label>
              <div className="relative">
                <Input 
                  type="file" 
                  accept="video/*" 
                  onChange={handleFileChange} 
                  disabled={status !== 'idle' && status !== 'completed' && status !== 'failed'}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                />
                <Upload className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
              {file && (
                <Badge className="bg-green-50 text-green-700 border-green-200">
                  ✅ {file.name}
                </Badge>
              )}
            </div>

            <Alert variant="destructive" className="bg-yellow-50 border-yellow-400">
              <Terminal className="h-4 w-4 !text-yellow-800" />
              <AlertTitle className="!text-yellow-800 font-bold">책임 한계 조항</AlertTitle>
              <AlertDescription className="!text-yellow-700">
                본 기능은 의료적 진단을 대체할 수 없으며, 참고용 보조 지표입니다.
              </AlertDescription>
            </Alert>

            <Button 
              onClick={handleAnalyzeClick} 
              disabled={!file || !selectedDogId || (status !== 'idle' && status !== 'completed' && status !== 'failed')} 
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3"
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
        </Card>
      ) : (
        <Card className="mt-6 shadow-xl border-2 border-purple-200 bg-white/90 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center">
              <Camera className="mr-3 h-5 w-5 text-purple-500" />
              실시간 영상 녹화
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <RealtimeRecorder onRecordingComplete={handleRecordingComplete} />
            {file && (
              <div className="mt-4 space-y-4">
                <Badge className="bg-green-50 text-green-700 border-green-200">
                  ✅ 녹화 완료: {file.name}
                </Badge>
                <Button 
                  onClick={handleAnalyzeClick} 
                  disabled={!file || !selectedDogId || (status !== 'idle' && status !== 'completed' && status !== 'failed')} 
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3"
                  size="lg"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  녹화 영상으로 분석 시작하기
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* 진행 상황 */}
      {(status !== 'idle' && status !== 'completed' && status !== 'failed') && (
        <Card className="mt-6 shadow-lg">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{getStatusMessage()}</span>
                <span className="text-sm text-gray-500">{status === 'processing' ? `${progress}%` : ''}</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* 오류 메시지 */}
      {error && (
        <Alert variant="destructive" className="mt-6">
          <AlertTitle>오류 발생</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* 분석 결과 */}
      {status === 'completed' && analysisResult && (
        <Card className="mt-6 shadow-xl border-2 border-green-200 bg-white/90 backdrop-blur-md">
          <CardHeader className="bg-gradient-to-r from-green-100 to-emerald-100">
            <CardTitle className="text-2xl font-bold text-gray-800 flex items-center">
              <Sparkles className="mr-3 h-6 w-6 text-green-500" />
              🎉 분석 완료!
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {/* 점수 표시 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl shadow-lg border border-gray-200/80 text-center">
                <div className="flex items-center justify-center mb-3">
                  <Award className="h-7 w-7 text-blue-500 mr-2" />
                  <h3 className="text-xl font-bold text-gray-800">자세 안정성</h3>
                </div>
                <div className="flex items-baseline justify-center">
                  <span className="text-6xl font-extrabold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                    {analysisResult.scores.stability.toFixed(1)}
                  </span>
                  <span className="text-xl font-semibold text-gray-500 ml-1">점</span>
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl shadow-lg border border-gray-200/80 text-center">
                <div className="flex items-center justify-center mb-3">
                  <Dog className="h-7 w-7 text-green-500 mr-2" />
                  <h3 className="text-xl font-bold text-gray-800">자세 점수</h3>
                </div>
                <div className="flex items-baseline justify-center">
                  <span className="text-6xl font-extrabold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                    {analysisResult.scores.curvature.toFixed(1)}
                  </span>
                  <span className="text-xl font-semibold text-gray-500 ml-1">점</span>
                </div>
              </div>
            </div>

            {/* 종합 코멘트 */}
            <div className="p-4 bg-gray-50 rounded-lg border mb-6">
              <p className="text-center font-medium text-gray-700 break-keep">
                {getOverallComment(analysisResult.scores.stability, analysisResult.scores.curvature)}
              </p>
            </div>

            {/* 분석 영상 */}
            {videoUrl && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <Video className="w-5 h-5 mr-2 text-purple-500" />
                  분석 과정 영상
                </h4>
                <video 
                  src={videoUrl} 
                  controls 
                  className="w-full rounded-lg shadow-lg border border-gray-200" 
                />
              </div>
            )}

            {/* 디버그 영상 링크 */}
            {analysisResult.debug_video_url && (
              <div className="text-center mb-6">
                <a 
                  href={analysisResult.debug_video_url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-500 hover:underline font-medium"
                >
                  🔍 상세 분석 영상 보기
                </a>
              </div>
            )}

            {/* 기록 보기 버튼 */}
            <Button 
              onClick={() => navigate('/app/posture-analysis-history')} 
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3"
              size="lg"
            >
              <History className="w-5 h-5 mr-2" />
              분석 기록 보러가기
            </Button>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}