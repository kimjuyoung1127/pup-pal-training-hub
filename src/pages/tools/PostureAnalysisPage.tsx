import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UploadCloud, Video, AlertCircle, CheckCircle, BarChart, History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type Dog = Database['public']['Tables']['dogs']['Row'];

interface AnalysisResult {
  stability: number;
  symmetry: number;
  stride_length: number;
}

const PostureAnalysisPage = () => {
  const { session } = useAuth();
  const user = session?.user;
  const navigate = useNavigate();

  const [dogs, setDogs] = useState<Dog[]>([]);
  const [selectedDogId, setSelectedDogId] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const [processedVideoUrl, setProcessedVideoUrl] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isBaseline, setIsBaseline] = useState<boolean>(false);

  // 사용자의 강아지 목록 불러오기
  useEffect(() => {
    const fetchDogs = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from('dogs')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error fetching dogs:', error);
        setError('강아지 목록을 불러오는 데 실패했습니다.');
      } else {
        setDogs(data || []);
      }
    };
    fetchDogs();
  }, [user]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('video/')) {
        setError('비디오 파일만 업로드할 수 있습니다. (mp4, mov 등)');
        return;
      }
      setSelectedFile(file);
      // 새 파일 선택 시 이전 결과 초기화
      setProcessedVideoUrl(null);
      setAnalysisResult(null);
      setError(null);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile || !selectedDogId || !user) {
      setError('분석할 강아지와 비디오 파일을 모두 선택해주세요.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setUploadProgress(0);
    setStatusMessage('영상 업로드 준비 중...');

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('user_id', user.id);
    formData.append('dog_id', selectedDogId);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'https://juyoungkim-dogpose.hf.space';
      
      const response = await axios.post(`${API_URL}/api/process-video`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          setUploadProgress(percent);
          if (percent < 100) {
            setStatusMessage(`영상 업로드 중... ${percent}%`);
          } else {
            setStatusMessage('서버에서 영상을 분석 중입니다. 잠시만 기다려주세요...');
          }
        },
      });

      if (response.status === 200 && response.data) {
        setProcessedVideoUrl(response.data.processed_video_url);
        setAnalysisResult(response.data.analysis_results);
        setIsBaseline(response.data.is_baseline);
      } else {
        setError('영상 처리 중 오류가 발생했습니다.');
      }
    } catch (err) {
      console.error('API Error:', err);
      setError('서버와 통신하는 데 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderResult = () => (
    <Card className="mt-8 bg-green-50 border-green-200">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl text-green-800">
          <CheckCircle className="w-8 h-8 mr-3" />
          분석 완료!
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-center p-6">
        <p className="text-green-700">
          AI 자세 분석이 성공적으로 완료되었습니다.
          <br />
          상세 결과 페이지에서 모든 기록과 변화를 확인해보세요.
        </p>
        <Button 
          onClick={() => navigate('/app/posture-analysis-history')}
          className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
        >
            <History className="w-4 h-4 mr-2" />
            자세한 결과 보기
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">AI 자세 분석</h1>
        <p className="text-gray-600 mt-2">
          강아지의 걷는 영상을 업로드하여 자세를 분석하고, 변화를 추적하여 건강을 관리하세요.
        </p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-6">
          {/* 1. 강아지 선택 */}
          <div className="space-y-2">
            <label htmlFor="dog-select" className="font-semibold">1. 분석할 강아지 선택</label>
            <Select onValueChange={setSelectedDogId} value={selectedDogId} disabled={isLoading}>
              <SelectTrigger id="dog-select">
                <SelectValue placeholder="강아지를 선택해주세요" />
              </SelectTrigger>
              <SelectContent>
                {dogs.map((dog) => (
                  <SelectItem key={dog.id} value={dog.id.toString()}>{dog.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 2. 영상 업로드 */}
          <div className="space-y-2">
            <label className="font-semibold">2. 분석할 영상 업로드</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
              <input
                type="file"
                id="video-upload"
                className="hidden"
                accept="video/*"
                onChange={handleFileChange}
                disabled={isLoading}
              />
              <label htmlFor="video-upload" className={`mt-4 font-semibold ${isLoading ? 'text-gray-500' : 'text-blue-600 cursor-pointer hover:underline'}`}>
                영상 파일 선택하기
              </label>
              {selectedFile && <p className="text-sm text-gray-500 mt-2">{selectedFile.name}</p>}
            </div>
          </div>

          {/* 3. 분석 시작 */}
          <Button
            onClick={handleSubmit}
            disabled={!selectedFile || !selectedDogId || isLoading}
            className="w-full text-lg py-6"
          >
            <BarChart className="w-5 h-5 mr-2" />
            {isLoading ? '분석 중...' : '분석 시작하기'}
          </Button>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="mt-8 space-y-2">
          <Progress value={uploadProgress} className="w-full" />
          <p className="text-center text-gray-600">{statusMessage}</p>
        </div>
      )}

      {error && (
        <Alert variant="destructive" className="mt-8">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>오류 발생</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {processedVideoUrl && analysisResult && !isLoading && renderResult()}
    </div>
  );
};

export default PostureAnalysisPage;