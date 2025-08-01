// src/pages/history/AnalysisDetailView.tsx

import React, { useRef, useEffect, useMemo, useState, useCallback } from 'react';
import { JointAnalysisRecord, AnalysisData } from '@/types/analysis';
import { Calendar, Award, Heart, Sparkles, Share2, Download, Upload, Loader2, Terminal, Star, TrendingUp, TrendingDown, Minus, Info, Expand } from 'lucide-react'; // Expand 아이콘 추가
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import AnalysisResultCard from './AnalysisResultCard';
import { downloadImage, shareToKakao } from '@/lib/shareUtils';
import { useToast } from '@/hooks/use-toast';
import { updateDogBaseline } from '@/lib/dogApi';

const SKELETON = [
  [15, 13], [13, 11], [16, 14], [14, 12], [11, 12], [5, 11], [6, 12], [5, 6],
  [5, 7], [6, 8], [7, 9], [8, 10], [1, 2], [0, 1], [0, 2], [1, 3], [2, 4], [3, 5], [4, 6]
];
const POINT_COLOR = "#f59e0b";
const LINE_COLOR = "#84cc16";

interface AnalysisDataWithKeypoints extends AnalysisData {
    keypoints_data?: number[][][][];
}

interface AnalysisDetailViewProps {
  record: JointAnalysisRecord;
  baselineAnalysisId: number | null;
  baselineRecord: JointAnalysisRecord | null;
  onBaselineUpdate: () => void;
}

const AnalysisDetailView: React.FC<AnalysisDetailViewProps> = ({ record, baselineAnalysisId, baselineRecord, onBaselineUpdate }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shareCardRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const animationFrameId = useRef<number>();
  const videoContainerRef = useRef<HTMLDivElement>(null); // ★★★ 비디오 컨테이너 Ref 추가

  const [petName, setPetName] = useState('');
  const [petImage, setPetImage] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [showShareCard, setShowShareCard] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  // ★★★ 커스텀 전체화면 핸들러 ★★★
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
    } finally {
      setIsUpdating(false);
    }
  };

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setPetImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  }, []);

  const handleUploadButtonClick = useCallback(() => { imageInputRef.current?.click(); }, []);
  const handleDownloadImage = useCallback(async () => {
    try {
      await downloadImage(shareCardRef, `${petName || 'mungai'}-analysis-result.png`);
      toast({ title: "다운로드 완료", description: "분석 결과 이미지가 저장되었습니다." });
    } catch (error) {
      toast({ title: "다운로드 실패", description: "이미지 저장에 실패했습니다.", variant: "destructive" });
    }
  }, [petName, toast]);

  const handleShareToKakao = useCallback(async () => {
    setIsSharing(true);
    try {
      const stabilityScore = record.analysis_results?.scores?.stability || record.stability_score || 0;
      await shareToKakao(shareCardRef, {
        title: `${petName || '우리 강아지'}의 자세 분석 결과: ${stabilityScore.toFixed(1)}점!`,
        description: 'AI가 분석한 우리 강아지의 자세 안정성을 확인해보세요!',
        petName: petName || '우리 강아지',
        filename: 'analysis-result.png'
      });
      toast({ title: "공유 완료", description: "카카오톡으로 공유되었습니다." });
    } catch (error) {
      toast({ title: "공유 실패", description: "공유에 실패했습니다.", variant: "destructive" });
    } finally {
      setIsSharing(false);
    }
  }, [record, petName, toast]);

  const parseAnalysisResults = (res: any) => {
    if (!res) return null;
    if (typeof res === 'string') {
      try { return JSON.parse(res); } catch (e) { return null; }
    }
    return res;
  };

  const analysisResult = useMemo(() => parseAnalysisResults(record.analysis_results) as AnalysisDataWithKeypoints, [record]);
  const baselineAnalysisResult = useMemo(() => parseAnalysisResults(baselineRecord?.analysis_results) as AnalysisDataWithKeypoints, [baselineRecord]);

  const stabilityScore = analysisResult?.scores?.stability;
  const baselineScore = baselineAnalysisResult?.scores?.stability;

  const getScoreInfo = (score: number) => {
    if (score >= 80) return { emoji: '✅', message: '일관된 안정성', advice: '분석된 영상에서는 일관된 안정성을 보여줍니다. 하지만 이 결과는 보조적인 참고 자료이며, 건강에 대한 우려가 있으시면 반드시 수의사와 상담하세요.', color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' };
    if (score >= 60) return { emoji: '🟡', message: '약간의 변동성 관찰', advice: '걸음걸이에서 약간의 변동성이 관찰됩니다. 주기적인 관찰을 통해 변화를 추적해보세요. 정확한 진단은 전문가의 도움이 필요합니다.', color: 'text-yellow-600', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' };
    if (score >= 40) return { emoji: '⚠️', message: '불안정성 감지', advice: '자세에 눈에 띄는 불안정성이 감지되었습니다. 이는 일시적인 현상일 수도 있지만, 빠른 시일 내에 수의사에게 전문적인 검진을 받아보시는 것을 강력히 권장합니다.', color: 'text-orange-600', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' };
    return { emoji: '🆘', message: '지속적인 관찰 필요', advice: '지속적인 관찰이 필요한 수준의 불안정성이 확인되었습니다. 단순한 자세 문제가 아닐 수 있으니, 반드시 전문가와 상담하여 정확한 원인을 파악해주세요.', color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' };
  };

  const scoreInfo = stabilityScore ? getScoreInfo(stabilityScore) : null;

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !analysisResult) return;

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

      const scale = Math.min(canvas.width / video.videoWidth, canvas.height / video.videoHeight);
      const renderedVideoWidth = video.videoWidth * scale;
      const renderedVideoHeight = video.videoHeight * scale;
      const offsetX = (canvas.width - renderedVideoWidth) / 2;
      const offsetY = (canvas.height - renderedVideoHeight) / 2;

      if (video.paused || video.ended) return;

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
          ctx.arc(transformedX, transformedY, 2, 0, 2 * Math.PI);
          ctx.fillStyle = POINT_COLOR;
          ctx.fill();
        });

        // SKELETON.forEach(pair => {
        //   const [startIdx, endIdx] = pair;
        //   const startPoint = dogKeypoints[startIdx];
        //   const endPoint = dogKeypoints[endIdx];
        //   if (startPoint && endPoint && startPoint.length > 0 && endPoint.length > 0) {
        //     const transformedStartX = startPoint[0] * scale + offsetX;
        //     const transformedStartY = startPoint[1] * scale + offsetY;
        //     const transformedEndX = endPoint[0] * scale + offsetX;
        //     const transformedEndY = endPoint[1] * scale + offsetY;
        //     ctx.beginPath();
        //     ctx.moveTo(transformedStartX, transformedStartY);
        //     ctx.lineTo(transformedEndX, transformedEndY);
        //     ctx.strokeStyle = LINE_COLOR;
        //     ctx.lineWidth = 1.5;
        //     ctx.stroke();
        //   }
        // });
      });
    };

    const renderLoop = () => {
      drawSkeletons();
      animationFrameId.current = requestAnimationFrame(renderLoop);
    };

    const startRenderLoop = () => { cancelAnimationFrame(animationFrameId.current!); renderLoop(); };
    const stopRenderLoop = () => { cancelAnimationFrame(animationFrameId.current!); };
    
    const handleResize = () => {
      setTimeout(() => {
        drawSkeletons();
        if (video.paused) {
            drawSkeletons();
        }
      }, 100);
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

  const renderScoreComparison = () => {
    if (stabilityScore === undefined) return null;

    if (baselineScore === undefined) {
      return (
        <>
          {scoreInfo && (
            <div className={`${scoreInfo.bgColor} ${scoreInfo.borderColor} border-2 p-6 rounded-2xl mb-6`}>
              <div className="text-center mb-4">
                <div className="flex items-center justify-center mb-2"><Award className="w-8 h-8 mr-3 text-amber-500" /><h3 className="text-xl font-bold text-gray-800">자세 안정성 점수</h3></div>
                <div className="flex items-center justify-center space-x-2 mb-3"><span className="text-5xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">{stabilityScore.toFixed(1)}</span><div className="text-left"><div className="text-xl font-bold text-amber-600">점</div><div className="text-sm text-gray-500">/ 100점</div></div></div>
                <Badge className={`${scoreInfo.bgColor} ${scoreInfo.color} border-0 text-lg px-4 py-1`}>{scoreInfo.emoji} {scoreInfo.message}</Badge>
              </div>
              <div className="bg-white/70 p-4 rounded-lg"><h4 className="font-semibold text-gray-800 mb-2 flex items-center"><Sparkles className="mr-2 h-4 w-4" />AI 추천 사항</h4><p className="text-sm text-gray-700">{scoreInfo.advice}</p></div>
            </div>
          )}
          <Alert className="bg-blue-50 border-blue-200 text-blue-800">
            <Info className="h-4 w-4 !text-blue-800" />
            <AlertTitle>변화를 추적해보세요!</AlertTitle>
            <AlertDescription>아직 기준 분석이 없어요. 가장 좋은 자세의 분석을 기준으로 설정하여 변화를 추적해보세요!</AlertDescription>
          </Alert>
        </>
      );
    }

    const diff = stabilityScore - baselineScore;
    const diffColor = diff > 0 ? 'text-green-600' : diff < 0 ? 'text-red-600' : 'text-gray-600';
    const DiffIcon = diff > 0 ? TrendingUp : diff < 0 ? TrendingDown : Minus;

    return (
      <div className="bg-blue-50 border-2 border-blue-200 p-6 rounded-2xl mb-6">
        <div className="text-center mb-4">
          <div className="flex items-center justify-center mb-2"><Award className="w-8 h-8 mr-3 text-blue-500" /><h3 className="text-xl font-bold text-gray-800">기준 대비 안정성 변화</h3></div>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-500">기준 점수</p>
            <p className="text-2xl font-bold text-gray-700">{baselineScore.toFixed(1)}</p>
          </div>
          <div className="flex flex-col items-center justify-center">
            <p className="text-sm text-gray-500">변화</p>
            <div className={`flex items-center text-2xl font-bold ${diffColor}`}>
              <DiffIcon className="w-6 h-6 mr-1" />
              <span>{diff.toFixed(1)}</span>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500">현재 점수</p>
            <p className="text-2xl font-bold text-blue-600">{stabilityScore.toFixed(1)}</p>
          </div>
        </div>
        {scoreInfo && (
          <div className="bg-white/70 p-4 rounded-lg mt-6">
            <h4 className="font-semibold text-gray-800 mb-2 flex items-center"><Sparkles className="mr-2 h-4 w-4" />AI 추천 사항</h4>
            <p className="text-sm text-gray-700">{scoreInfo.advice}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="sticky top-24 shadow-xl border-2 border-purple-200 bg-white/90 backdrop-blur-md">
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
        
        {renderScoreComparison()}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
              <div className="flex items-start">
                <Calendar className="w-5 h-5 mr-3 text-purple-500 mt-1" />
                <div><p className="font-semibold text-gray-800">분석 일시</p><p className="text-gray-700">{formattedDate}</p></div>
              </div>
            </div>

            {!isCurrentBaseline && (
              <Button onClick={handleSetBaseline} disabled={isUpdating} className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 text-white">
                {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Star className="mr-2 h-4 w-4" />}
                {isUpdating ? '설정 중...' : '이 분석을 기준으로 설정'}
              </Button>
            )}
            
            <Card className="bg-gradient-to-r from-orange-50 to-pink-50 border-orange-200">
              <CardHeader>
                <CardTitle className="text-orange-800 flex items-center"><Share2 className="mr-2 h-5 w-5" />결과 공유하기</CardTitle>
                <CardDescription>분석 결과를 이미지로 저장하거나 SNS에 공유해보세요!</CardDescription>
              </CardHeader>
              <CardContent>
                {/* ... (공유 기능 JSX는 동일) ... */}
              </CardContent>
            </Card>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-2 flex items-center"><Sparkles className="mr-2 h-4 w-4 text-gray-500" />추가 분석 항목 (곧 출시!)</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between"><span>🚶 보폭 분석</span><span className="text-gray-400">준비 중...</span></div>
                <div className="flex justify-between"><span>⚖️ 대칭성 분석</span><span className="text-gray-400">준비 중...</span></div>
                <div className="flex justify-between"><span>🏃 활동성 분석</span><span className="text-gray-400">준비 중...</span></div>
              </div>
            </div>
          </div>

          <div>
            {/* ★★★ 컨테이너에 Ref 할당 ★★★ */}
            <div ref={videoContainerRef} className="relative w-full border-2 border-purple-200 rounded-xl overflow-hidden shadow-lg aspect-video">
              <video ref={videoRef} src={record.processed_video_url} controls playsInline crossOrigin="anonymous" className="absolute top-0 left-0 w-full h-full" />
              <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full pointer-events-none" />
            </div>
            {/* ★★★ 커스텀 전체화면 버튼 추가 ★★★ */}
            <Button onClick={handleFullscreen} variant="outline" className="w-full mt-2">
              <Expand className="mr-2 h-4 w-4" />
              전체 화면으로 보기 (추적 유지)
            </Button>
            <p className="text-xs text-gray-500 mt-1 text-center">
              자세 추적을 유지하려면 이 버튼으로 전체 화면을 실행하세요.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalysisDetailView;
