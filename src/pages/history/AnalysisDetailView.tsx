// src/pages/history/AnalysisDetailView.tsx

import React, { useRef, useEffect, useMemo, useState } from 'react';
import { JointAnalysisRecord } from '@/types/analysis';
import { Calendar, Award, Heart, Sparkles, Terminal, Star, Expand, Loader2, Dog } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from '@/hooks/use-toast';
import { updateDogBaseline } from '@/lib/dogApi';
import { AnalysisDataWithKeypoints } from '@/hooks/useVideoExporter';
import { AnalysisShareController } from './AnalysisShareController';

const POINT_COLOR = "#f59e0b";

// 종합 코멘트 생성 함수
const getOverallComment = (stability?: number, curvature?: number): string => {
  if (stability === undefined || curvature === undefined) {
    return "분석 데이터를 읽어오는 중입니다...";
  }
  const stabilityComment = stability >= 80 ? "매우 안정적인 걸음걸이" : stability >= 60 ? "준수한 걸음걸이" : "다소 불안정한 걸음걸이";
  const curvatureComment = curvature >= 170 ? "곧게 펴진 허리" : curvature >= 155 ? "조금 웅크린 자세" : "주의가 필요한 웅크린 자세";

  if (stability >= 80 && curvature >= 170) {
    return `✅ ${stabilityComment}와 ${curvatureComment}를 모두 보여주네요! 아주 이상적인 자세입니다.`;
  }
  if (stability < 60 && curvature < 155) {
    return `⚠️ ${stabilityComment}와 ${curvatureComment}가 함께 관찰됩니다. 자세에 대한 전문가의 관심이 필요해 보입니다.`;
  }
  return `ℹ️ 종합적으로, 우리 강아지는 ${stabilityComment}와 ${curvatureComment}를 보이고 있습니다. 꾸준한 관찰을 통해 변화를 지켜봐 주세요.`;
};

// --- 메인 뷰 컴포넌트 ---
const AnalysisDetailView: React.FC<{
  record: JointAnalysisRecord;
  baselineAnalysisId: number | null;
  onBaselineUpdate: () => void;
}> = ({ record, baselineAnalysisId, onBaselineUpdate }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number>();
  const videoContainerRef = useRef<HTMLDivElement>(null);

  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const parseAnalysisResults = (res: any): AnalysisDataWithKeypoints | null => {
    if (!res) return null;
    if (typeof res === 'string') { try { return JSON.parse(res); } catch (e) { return null; } }
    return res;
  };

  const analysisResult = useMemo(() => parseAnalysisResults(record.analysis_results), [record]);
  
  const stabilityScore = analysisResult?.scores?.stability;
  const curvatureScore = analysisResult?.scores?.curvature;

  const handleFullscreen = () => {
    if (videoContainerRef.current) {
      videoContainerRef.current.requestFullscreen().catch(err => {
        alert(`전체 화면 모드를 시작할 수 없습니다: ${err.message}`);
      });
    }
  };

  const handleSetBaseline = async () => {
    setIsUpdating(true);
    try {
      await updateDogBaseline(record.dog_id, record.id);
      toast({
        title: "기준 설정 완료",
        description: "이 분석이 새로운 기준으로 설정되었습니다.",
      });
      onBaselineUpdate();
    } catch (error) {
      toast({ title: "기준 설정 실패", description: "오류가 발생했습니다.", variant: "destructive" });
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !analysisResult?.keypoints_data) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawSkeletons = () => {
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        if(canvas.width > 0 && canvas.height > 0) ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      canvas.width = video.clientWidth;
      canvas.height = video.clientHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const pointRadius = Math.max(2, canvas.height * 0.004);
      const scale = Math.min(canvas.width / video.videoWidth, canvas.height / video.videoHeight);
      const offsetX = (canvas.width - video.videoWidth * scale) / 2;
      const offsetY = (canvas.height - video.videoHeight * scale) / 2;

      if (video.paused || video.ended) return;

      const fps = analysisResult.metadata?.fps || 30;
      const currentFrameIndex = Math.floor(video.currentTime * fps);

      if (currentFrameIndex >= analysisResult.keypoints_data.length) return;
      const frameKeypoints = analysisResult.keypoints_data[currentFrameIndex];
      if (!frameKeypoints) return;

      frameKeypoints.forEach((dogKeypoints: number[][]) => {
        dogKeypoints.forEach(point => {
          const [x, y] = point;
          ctx.beginPath();
          ctx.arc(x * scale + offsetX, y * scale + offsetY, pointRadius, 0, 2 * Math.PI);
          ctx.fillStyle = POINT_COLOR;
          ctx.fill();
        });
      });
    };

    const renderLoop = () => {
      drawSkeletons();
      animationFrameId.current = requestAnimationFrame(renderLoop);
    };

    const startRenderLoop = () => { cancelAnimationFrame(animationFrameId.current!); renderLoop(); };
    const stopRenderLoop = () => { cancelAnimationFrame(animationFrameId.current!); };
    
    const handleResize = () => {
      setTimeout(() => drawSkeletons(), 100);
    };

    video.addEventListener('play', startRenderLoop);
    video.addEventListener('playing', startRenderLoop);
    video.addEventListener('seeked', drawSkeletons);
    video.addEventListener('pause', stopRenderLoop);
    video.addEventListener('ended', stopRenderLoop);
    video.addEventListener('loadedmetadata', drawSkeletons);
    
    window.addEventListener('resize', handleResize);
    document.addEventListener('fullscreenchange', handleResize);

    return () => {
      video.removeEventListener('play', startRenderLoop);
      video.removeEventListener('playing', startRenderLoop);
      video.removeEventListener('seeked', drawSkeletons);
      video.removeEventListener('pause', stopRenderLoop);
      video.removeEventListener('ended', stopRenderLoop);
      video.removeEventListener('loadedmetadata', drawSkeletons);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('fullscreenchange', handleResize);
      cancelAnimationFrame(animationFrameId.current!);
    };
  }, [analysisResult]);

  const formattedDate = new Date(record.created_at).toLocaleString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  const isCurrentBaseline = record.id === baselineAnalysisId;

  return (
    <Card className="shadow-xl border-2 border-purple-200 bg-white/90 backdrop-blur-md">
      <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-100">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-bold text-gray-800 flex items-center"><Sparkles className="mr-3 h-6 w-6 text-purple-500" />📊 상세 분석 결과</CardTitle>
            <CardDescription className="flex items-center text-gray-600 mt-1"><Heart className="mr-2 h-4 w-4 text-pink-500" />{record.dog_name || '우리 강아지'}의 자세 분석 리포트</CardDescription>
          </div>
          {isCurrentBaseline && (<Badge variant="secondary" className="bg-yellow-400 text-yellow-900 border-yellow-500"><Star className="mr-2 h-4 w-4" />현재 기준</Badge>)}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <Alert variant="destructive" className="bg-yellow-50 border-yellow-400 text-yellow-800 mb-6">
          <Terminal className="h-4 w-4 !text-yellow-800" />
          <AlertTitle className="font-bold">중요 안내: 책임 한계 조항</AlertTitle>
          <AlertDescription className="text-xs">본 AI 자세 분석 기능은 의료적 진단이나 전문적인 수의학적 소견을 대체할 수 없습니다. 분석 결과는 참고용 보조 지표이며, 반려동물의 건강에 이상이 의심될 경우 반드시 전문 수의사와 상담하시기 바랍니다.</AlertDescription>
        </Alert>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* 자세 안정성 */}
          <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl shadow-lg border border-gray-200/80 text-center">
            <div className="flex items-center justify-center mb-3">
              <Award className="h-7 w-7 text-blue-500 mr-2" />
              <h3 className="text-xl font-bold text-gray-800">자세 안정성</h3>
            </div>
            <div className="flex items-baseline justify-center">
              <span className="text-6xl font-extrabold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                {stabilityScore?.toFixed(1) ?? '-'}
              </span>
              <span className="text-xl font-semibold text-gray-500 ml-1">점</span>
            </div>
            <p className="text-xs text-gray-500 mt-2 break-keep">
              걸음걸이의 흔들림이 적을수록 높은 점수를 받아요.
            </p>
          </div>

          {/* 자세 점수 */}
          <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl shadow-lg border border-gray-200/80 text-center">
            <div className="flex items-center justify-center mb-3">
              <Dog className="h-7 w-7 text-green-500 mr-2" />
              <h3 className="text-xl font-bold text-gray-800">자세 점수</h3>
            </div>
            <div className="flex items-baseline justify-center">
              <span className="text-6xl font-extrabold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                {curvatureScore?.toFixed(1) ?? '-'}
              </span>
              <span className="text-xl font-semibold text-gray-500 ml-1">점</span>
            </div>
            <p className="text-xs text-gray-500 mt-2 break-keep">
              AI가 판단한 이상적인 자세에 가까울수록 높은 점수를 받아요.
            </p>
          </div>
        </div>

        {/* 종합 코멘트 */}
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
          <p className="text-sm font-medium text-gray-700 break-keep text-center">
            {getOverallComment(stabilityScore, curvatureScore)}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="space-y-4">
            <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
              <div className="flex items-start"><Calendar className="w-5 h-5 mr-3 text-purple-500 mt-1" /><div><p className="font-semibold text-gray-800">분석 일시</p><p className="text-gray-700">{formattedDate}</p></div></div>
            </div>

            {!isCurrentBaseline && (
              <Button onClick={handleSetBaseline} disabled={isUpdating} className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 text-white">
                {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Star className="mr-2 h-4 w-4" />}
                {isUpdating ? '설정 중...' : '이 분석을 기준으로 설정'}
              </Button>
            )}
            
            <AnalysisShareController 
              record={record}
              analysisResult={analysisResult}
              videoElement={videoRef.current}
            />
          </div>

          <div>
            <div ref={videoContainerRef} className="relative w-full border-2 border-purple-200 rounded-xl overflow-hidden shadow-lg aspect-video">
              <video ref={videoRef} src={record.processed_video_url} controls playsInline crossOrigin="anonymous" className="absolute top-0 left-0 w-full h-full" />
              <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full pointer-events-none" />
            </div>
            <Button onClick={handleFullscreen} variant="outline" className="w-full mt-2"><Expand className="mr-2 h-4 w-4" /> 전체 화면으로 보기 (추적 유지)</Button>
            <p className="text-xs text-gray-500 mt-1 text-center">자세 추적을 유지하려면 이 버튼으로 전체 화면을 실행하세요.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalysisDetailView;
