import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Video, Loader2, History, Dog, Sparkles, Camera, Award } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUser } from '@supabase/auth-helpers-react';
import { useUserDogs } from '@/pages/history/useUserDogs';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  const stabilityComment = stability >= 80 ? "매우 안정적인 걸음걸이" : stability >= 60 ? "준수한 걸음걸이" : "다소 불안정한 걸음걸이";
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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">AI 자세 분석</h1>
          <p className="text-lg text-gray-600">강아지의 자세를 AI가 분석해드려요!</p>
        </div>

        <Card>
          <CardHeader><CardTitle>분석 준비하기</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Select onValueChange={setSelectedDogId} value={selectedDogId || ''} disabled={isLoadingDogs || !dogs || dogs.length === 0}>
              <SelectTrigger><SelectValue placeholder={isLoadingDogs ? "로딩 중..." : "���아지를 선택하세요"} /></SelectTrigger>
              <SelectContent>{dogs?.map(dog => <SelectItem key={dog.id} value={dog.id}>{dog.name}</SelectItem>)}</SelectContent>
            </Select>
            <Input type="file" accept="video/*" onChange={handleFileChange} disabled={status !== 'idle' && status !== 'completed' && status !== 'failed'} />
            <Alert variant="destructive">
              <Terminal className="h-4 w-4" />
              <AlertTitle>책임 한계 조항</AlertTitle>
              <AlertDescription>본 기능은 의료적 진단을 대체할 수 없으며, 참고용 보조 지표입니다.</AlertDescription>
            </Alert>
            <Button onClick={handleAnalyzeClick} disabled={!file || !selectedDogId || (status !== 'idle' && status !== 'completed' && status !== 'failed')} className="w-full">
              {status !== 'idle' && status !== 'completed' && status !== 'failed' ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{getStatusMessage()}</> : '✨ 자세 분석 시작하기'}
            </Button>
          </CardContent>
        </Card>

        {(status !== 'idle' && status !== 'completed' && status !== 'failed') && (
          <Card className="mt-4"><CardContent className="p-4">
            <Progress value={progress} className="mb-2" />
            <p className="text-center text-sm">{status === 'processing' ? `${progress}% 완료` : getStatusMessage()}</p>
          </CardContent></Card>
        )}
        
        {error && <Alert variant="destructive" className="mt-4"><AlertTitle>오류</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}

        {status === 'completed' && analysisResult && (
          <Card className="mt-4">
            <CardHeader><CardTitle>🎉 분석 완료!</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="text-center p-4 rounded-lg bg-blue-50">
                  <h3 className="font-bold">자세 안정성</h3>
                  <p className="text-3xl font-bold">{analysisResult.scores.stability.toFixed(1)}점</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-green-50">
                  <h3 className="font-bold">허리 곧음 정도</h3>
                  <p className="text-3xl font-bold">{analysisResult.scores.curvature.toFixed(1)}°</p>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-center font-medium">{getOverallComment(analysisResult.scores.stability, analysisResult.scores.curvature)}</p>
              </div>
              {videoUrl && <video src={videoUrl} controls className="w-full mt-4 rounded-lg" />}
              {analysisResult.debug_video_url && <div className="mt-2 text-center"><a href={analysisResult.debug_video_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">디버그 영상 보기</a></div>}
              <Button onClick={() => navigate('/app/posture-analysis-history')} className="w-full mt-4">기록 보러가기</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}