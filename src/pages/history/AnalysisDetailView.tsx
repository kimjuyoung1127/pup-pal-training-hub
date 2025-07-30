// src/pages/history/AnalysisDetailView.tsx

import React, { useRef, useEffect, useMemo, useState, useCallback } from 'react';
import { JointAnalysisRecord, AnalysisData } from '@/types/analysis';
import { Calendar, Award, Heart, Sparkles, Share2, Download, Upload, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import AnalysisResultCard from './AnalysisResultCard';
import { downloadImage, shareToKakao } from '@/lib/shareUtils';
import { useToast } from '@/hooks/use-toast';

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
  const shareCardRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const animationFrameId = useRef<number>();
  
  // 공유 기능 상태
  const [petName, setPetName] = useState('');
  const [petImage, setPetImage] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [showShareCard, setShowShareCard] = useState(false);
  
  const { toast } = useToast();

  // 이미지 업로드 핸들러
  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPetImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleUploadButtonClick = useCallback(() => {
    imageInputRef.current?.click();
  }, []);

  // 이미지 다운로드 핸들러
  const handleDownloadImage = useCallback(async () => {
    try {
      await downloadImage(shareCardRef, `${petName || 'mungai'}-analysis-result.png`);
      toast({
        title: "다운로드 완료",
        description: "분석 결과 이미지가 저장되었습니다.",
      });
    } catch (error) {
      toast({
        title: "다운로드 실패",
        description: "이미지 저장에 실패했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    }
  }, [petName, toast]);

  // 카카오톡 공유 핸들러
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
      toast({
        title: "공유 완료",
        description: "카카오톡으로 공유되었습니다.",
      });
    } catch (error) {
      toast({
        title: "공유 실패",
        description: "공유에 실패했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setIsSharing(false);
    }
  }, [record, petName, toast]);

  const analysisResult = useMemo(() => {
    if (!record?.analysis_results) return null;
    let parsedData: any;
    if (typeof record.analysis_results === 'string') {
      try { 
        parsedData = JSON.parse(record.analysis_results); 
      } catch (e) { 
        return null; 
      }
    } else {
      parsedData = record.analysis_results;
    }
    return parsedData as AnalysisDataWithKeypoints;
  }, [record]);

  const stabilityScore = analysisResult?.scores?.stability;

  // 점수별 정보
  const getScoreInfo = (score: number) => {
    if (score >= 80) return { 
      emoji: '🌟', 
      message: '완벽한 자세입니다!', 
      advice: '현재 자세를 잘 유지하고 계세요. 정기적인 산책으로 건강을 지켜주세요!',
      color: 'text-green-600', 
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    };
    if (score >= 60) return { 
      emoji: '👍', 
      message: '좋은 자세예요!', 
      advice: '전반적으로 안정적입니다. 꾸준한 운동으로 더욱 개선할 수 있어요!',
      color: 'text-blue-600', 
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    };
    if (score >= 40) return { 
      emoji: '💪', 
      message: '개선이 필요해요', 
      advice: '규칙적인 운동과 스트레칭으로 자세를 개선해보세요. 수의사 상담도 고려해보세요.',
      color: 'text-yellow-600', 
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    };
    return { 
      emoji: '🤗', 
      message: '관리가 필요해요', 
      advice: '수의사와 상담하여 전문적인 관리 방법을 알아보시는 것을 권장합니다.',
      color: 'text-orange-600', 
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    };
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
    
    const handleFullscreenChange = () => {
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
    <Card className="sticky top-24 shadow-xl border-2 border-purple-200 bg-white/90 backdrop-blur-md">
      <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-100">
        <CardTitle className="text-2xl font-bold text-gray-800 flex items-center">
          <Sparkles className="mr-3 h-6 w-6 text-purple-500" />
          📊 상세 분석 결과
        </CardTitle>
        <CardDescription className="flex items-center text-gray-600">
          <Heart className="mr-2 h-4 w-4 text-pink-500" />
          {record.dog_name || '우리 강아지'}의 자세 분석 리포트
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        {stabilityScore !== undefined && scoreInfo && (
          <div className={`${scoreInfo.bgColor} ${scoreInfo.borderColor} border-2 p-6 rounded-2xl mb-6`}>
            <div className="text-center mb-4">
              <div className="flex items-center justify-center mb-2">
                <Award className="w-8 h-8 mr-3 text-amber-500" />
                <h3 className="text-xl font-bold text-gray-800">자세 안정성 점수</h3>
              </div>
              <div className="flex items-center justify-center space-x-2 mb-3">
                <span className="text-5xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                  {stabilityScore.toFixed(1)}
                </span>
                <div className="text-left">
                  <div className="text-xl font-bold text-amber-600">점</div>
                  <div className="text-sm text-gray-500">/ 100점</div>
                </div>
              </div>
              <Badge className={`${scoreInfo.bgColor} ${scoreInfo.color} border-0 text-lg px-4 py-1`}>
                {scoreInfo.emoji} {scoreInfo.message}
              </Badge>
            </div>
            <div className="bg-white/70 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                <Sparkles className="mr-2 h-4 w-4" />
                AI 추천 사항
              </h4>
              <p className="text-sm text-gray-700">{scoreInfo.advice}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
              <div className="flex items-start">
                <Calendar className="w-5 h-5 mr-3 text-purple-500 mt-1" />
                <div>
                  <p className="font-semibold text-gray-800">분석 일시</p>
                  <p className="text-gray-700">{formattedDate}</p>
                </div>
              </div>
            </div>
            
            {/* 공유 기능 섹션 */}
            <Card className="bg-gradient-to-r from-orange-50 to-pink-50 border-orange-200">
              <CardHeader>
                <CardTitle className="text-orange-800 flex items-center">
                  <Share2 className="mr-2 h-5 w-5" />
                  결과 공유하기
                </CardTitle>
                <CardDescription>
                  분석 결과를 이미지로 저장하거나 SNS에 공유해보세요!
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!showShareCard ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full border-orange-200 text-orange-600 hover:bg-orange-50 flex items-center justify-center whitespace-nowrap"
                        onClick={() => setShowShareCard(true)}
                      >
                        <Share2 className="mr-1 h-4 w-4" />
                        SNS에 공유하기
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full border-purple-200 text-purple-600 hover:bg-purple-50 flex items-center justify-center whitespace-nowrap"
                        onClick={() => setShowShareCard(true)}
                      >
                        <Download className="mr-1 h-4 w-4" />
                        이미지 저장하기
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="petName" className="block text-sm font-medium text-gray-700 mb-1">
                            강아지 이름
                          </label>
                          <Input 
                            id="petName" 
                            type="text" 
                            placeholder="예: 몽이" 
                            value={petName} 
                            onChange={(e) => setPetName(e.target.value)} 
                            className="border-orange-300 focus:ring-orange-500 focus:border-orange-500" 
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            사진 업로드 (선택)
                          </label>
                          <Input 
                            id="petImage" 
                            type="file" 
                            accept="image/*" 
                            ref={imageInputRef} 
                            onChange={handleImageUpload} 
                            className="hidden" 
                          />
                          <Button 
                            onClick={handleUploadButtonClick} 
                            variant="outline" 
                            className="w-full border-orange-300 text-orange-700 hover:bg-orange-100"
                          >
                            <Upload className="mr-2 h-4 w-4" />
                            컴퓨터에서 사진 선택
                          </Button>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button 
                            onClick={handleDownloadImage} 
                            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                          >
                            <Download className="mr-2 h-4 w-4" /> 
                            이미지로 저장하기
                          </Button>
                          <Button 
                            onClick={handleShareToKakao} 
                            disabled={isSharing} 
                            className="w-full bg-yellow-400 text-yellow-900 hover:bg-yellow-500"
                          >
                            {isSharing ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <Share2 className="mr-2 h-4 w-4" />
                            )}
                            {isSharing ? '공유 준비중...' : '카카오톡으로 공유'}
                          </Button>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setShowShareCard(false)}
                          className="w-full text-gray-500"
                        >
                          취소
                        </Button>
                      </div>
                      
                      <div className="flex flex-col items-center">
                        <p className="text-sm font-medium text-gray-700 mb-2">미리보기</p>
                        <AnalysisResultCard 
                          ref={shareCardRef} 
                          record={record} 
                          petName={petName} 
                          petImage={petImage} 
                        />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                <Sparkles className="mr-2 h-4 w-4 text-gray-500" />
                추가 분석 항목 (곧 출시!)
              </h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>🚶 보폭 분석</span>
                  <span className="text-gray-400">준비 중...</span>
                </div>
                <div className="flex justify-between">
                  <span>⚖️ 대칭성 분석</span>
                  <span className="text-gray-400">준비 중...</span>
                </div>
                <div className="flex justify-between">
                  <span>🏃 활동성 분석</span>
                  <span className="text-gray-400">준비 중...</span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative w-full border-2 border-purple-200 rounded-xl overflow-hidden shadow-lg aspect-video">
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
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalysisDetailView;