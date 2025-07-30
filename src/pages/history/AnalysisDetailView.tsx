// src/pages/history/AnalysisDetailView.tsx

import React, { useRef, useEffect, useMemo } from 'react';
import { JointAnalysisRecord, AnalysisData } from '@/types/analysis';
import { Calendar, FileText, Hash, Award, Heart, Sparkles, Share2, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
  const animationFrameId = useRef<number>();

  const analysisResult = useMemo(() => {
    if (!record?.analysis_results) return null;
    let parsedData: any;
    if (typeof record.analysis_results === 'string') {
      try { parsedData = JSON.parse(record.analysis_results); } catch (e) { return null; }
    } else {
      parsedData = record.analysis_results;
    }
    return parsedData as AnalysisDataWithKeypoints;
  }, [record?.analysis_results]);

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
        // 비디오 크기가 0이면 캔버스 클리어만 수행
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

      if (video.paused || video.ended) return; // 정지/종료 시에는 그리지 않음

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
    
    // ✅ 전체화면 변경 시 다시 그리기 위한 핸들러
    const handleFullscreenChange = () => {
        // 전체화면 변경 시 캔버스 크기를 재조정하고 다시 그리기 위해 약간의 딜레이 후 실행
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
        {/* 안정성 점수 섹션 */}
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
          {/* 정보 섹션 */}
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
            
            {/* 공유 기능 버튼들 */}
            <div className="bg-gradient-to-r from-orange-50 to-pink-50 p-4 rounded-xl border border-orange-200">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                <Share2 className="mr-2 h-4 w-4 text-orange-500" />
                결과 공유하기
              </h4>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full border-orange-200 text-orange-600 hover:bg-orange-50"
                  onClick={() => alert('SNS 공유 기능 구현 예정')}
                >
                  📱 SNS에 공유하기
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full border-purple-200 text-purple-600 hover:bg-purple-50"
                  onClick={() => alert('썸네일 다운로드 기능 구현 예정')}
                >
                  <Download className="mr-2 h-4 w-4" />
                  🖼️ 썸네일 다운로드
                </Button>
              </div>
            </div>

            {/* 향후 추가될 점수들을 위한 공간 */}
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

          {/* 영상 플레이어 */}
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