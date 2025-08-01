// src/pages/history/AnalysisShareController.tsx
import React, { useState, useRef, useCallback } from 'react';
import { JointAnalysisRecord } from '@/types/analysis';
import { AnalysisDataWithKeypoints, useVideoExporter } from '@/hooks/useVideoExporter';
import { useToast } from '@/hooks/use-toast';
import { toPng } from 'html-to-image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Share2, Download, Upload, Loader2, Video } from 'lucide-react';
import { AnalysisResultShareCard } from './AnalysisResultShareCard';

interface AnalysisShareControllerProps {
  record: JointAnalysisRecord;
  analysisResult: AnalysisDataWithKeypoints | null;
  videoElement: HTMLVideoElement | null;
}

export const AnalysisShareController: React.FC<AnalysisShareControllerProps> = ({ record, analysisResult, videoElement }) => {
  const [petName, setPetName] = useState(record.dog_name || '');
  const [petImage, setPetImage] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const shareCardRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  
  const { toast } = useToast();
  const { isExporting, exportProgress, exportedUrl, exportVideo, resetExport } = useVideoExporter();
  
  const stabilityScore = analysisResult?.scores?.stability;

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setPetImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  }, []);

  const handleDownloadImage = useCallback(async () => {
    if (!shareCardRef.current) return;
    try {
      const dataUrl = await toPng(shareCardRef.current, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `${petName || 'mungai'}-analysis-result.png`;
      link.href = dataUrl;
      link.click();
      toast({ title: "다운로드 완료", description: "분석 결과 이미지가 저장되었습니다." });
    } catch (error) {
      toast({ title: "다운로드 실패", description: "이미지 저장에 실패했습니다.", variant: "destructive" });
    }
  }, [petName, toast]);

  const handleShareToKakao = useCallback(async () => {
    // TODO: MbtiResult.tsx에서 카카오톡 공유 로직 가져와서 구현
    toast({ title: "알림", description: "카카오톡 공유 기능은 현재 준비 중입니다." });
  }, [petName, stabilityScore]);

  const handleExportVideo = () => {
    if (videoElement && !videoElement.paused) {
      videoElement.pause();
    }
    exportVideo(videoElement, analysisResult);
  };

  return (
    <Card className="bg-gradient-to-r from-orange-50 to-pink-50 border-orange-200">
      <CardHeader>
        <CardTitle className="text-orange-800 flex items-center"><Share2 className="mr-2 h-5 w-5" />결과 공유 및 내보내기</CardTitle>
        <CardDescription>분석 결과를 이미지나 영상으로 저장하여 공유해보세요.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row md:items-start md:gap-6">
        <div className="flex-grow mb-6 md:mb-0">
          <div className="mb-4">
            <label htmlFor="petNameShare" className="block text-sm font-medium text-gray-700 mb-1">강아지 이름</label>
            <Input id="petNameShare" type="text" placeholder="예: 몽이" value={petName} onChange={(e) => setPetName(e.target.value)} className="border-orange-300 focus:ring-orange-500 focus:border-orange-500" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">사진 업로드 (선택)</label>
            <input type="file" ref={imageInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
            <Button onClick={() => imageInputRef.current?.click()} variant="outline" className="w-full border-dashed border-gray-400 hover:border-gray-600 hover:bg-gray-50 transition-all duration-200 py-4 flex flex-col items-center justify-center h-auto">
              <Upload className="h-6 w-6 text-gray-500 mb-1" />
              <span className="text-gray-600 font-semibold">사진 올리기</span>
            </Button>
          </div>
          <div className="space-y-2">
            <Button onClick={handleDownloadImage} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white"><Download className="mr-2 h-4 w-4" /> 이미지로 저장하기</Button>
            <Button onClick={handleShareToKakao} disabled={isSharing} className="w-full bg-yellow-400 text-yellow-900 hover:bg-yellow-500">{isSharing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Share2 className="mr-2 h-4 w-4" />} 카카오톡으로 공유</Button>
          </div>
          <div className="mt-4 pt-4 border-t border-orange-200">
            {isExporting ? (
              <div className="flex flex-col items-center justify-center space-y-2">
                <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
                <p className="text-sm font-medium text-teal-700">영상 생성 중... ({exportProgress}%)</p>
                <Progress value={exportProgress} className="w-full" />
              </div>
            ) : exportedUrl ? (
              <div className="flex flex-col space-y-2">
                <p className="text-sm text-center font-semibold text-green-700">✅ 영상이 준비되었습니다!</p>
                <Button asChild>
                  <a href={exportedUrl} download={`${record.dog_name || 'dog'}_posture_analysis.webm`}>
                    <Download className="mr-2 h-4 w-4" />영상 다운로드
                  </a>
                </Button>
                <Button variant="outline" size="sm" onClick={resetExport}>다시 만들기</Button>
              </div>
            ) : (
              <Button onClick={handleExportVideo} disabled={isExporting} className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 text-white">
                <Video className="mr-2 h-4 w-4" /> 스켈레톤 영상 만들기
              </Button>
            )}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center w-full md:w-auto md:flex-shrink-0">
          <p className="text-center text-sm font-medium text-gray-700 mb-2">미리보기</p>
          <div className="flex justify-center">
            <AnalysisResultShareCard ref={shareCardRef} record={record} stabilityScore={stabilityScore} petName={petName} petImage={petImage} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
