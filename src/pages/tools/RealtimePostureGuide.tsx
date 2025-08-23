import React, { useRef, useEffect, useState } from 'react';
import * as vision from '@mediapipe/tasks-vision';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera as CameraIcon, Info, Loader2, Play, StopCircle, RadioTower, Sparkles, Award, Dog, Video } from 'lucide-react';
import { usePostureAnalysis } from './hooks/usePostureAnalysis'; // 훅 임포트
import { useUser } from '@supabase/auth-helpers-react';
import { useUserDogs } from '@/pages/history/useUserDogs';

// 새로운 상태 타입 정의
type SetupStatus = 'idle' | 'setting_up' | 'ready' | 'recording' | 'processing' | 'completed';

const RealtimePostureGuide: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [feedback, setFeedback] = useState('AI 모델을 로딩하는 중입니다...');
  const [isLoading, setIsLoading] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const poseLandmarkerRef = useRef<vision.PoseLandmarker | null>(null);
  const animationFrameId = useRef<number | null>(null);
  
  // 새로운 상태 추가
  const [setupStatus, setSetupStatus] = useState<SetupStatus>('idle');
  
  // MediaRecorder 관련 상태
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  
  // 사용자 및 강아지 정보
  const user = useUser();
  const { data: dogs, isLoading: isLoadingDogs } = useUserDogs();
  const [selectedDogId, setSelectedDogId] = useState<string | null>(null);
  
  // 분석 결과 상태
  const [analysisResult, setAnalysisResult] = useState<any>(null); // TODO: 실제 타입 정의 필요
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  
  // 훅 사용
  const { wakeUpServer, submitForAnalysis, serverStatus } = usePostureAnalysis();

  // Effect to create the PoseLandmarker
  useEffect(() => {
    const createPoseLandmarker = async () => {
      try {
        const visionResolver = await vision.FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
        );
        const landmarker = await vision.PoseLandmarker.createFromOptions(visionResolver, {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task`,
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numPoses: 1,
        });
        poseLandmarkerRef.current = landmarker;
        setIsLoading(false);
        // 모델 로딩 완료 후, 준비 상태로 전환할 수 있도록 함
        if (setupStatus === 'setting_up') {
            setSetupStatus('ready');
            setFeedback('준비가 완료되었습니다! 녹화를 시작해보세요.');
        } else {
            setFeedback('시작 버튼을 눌러 자세 분석을 시작하세요.');
        }
      } catch (error) {
        console.error("Error creating PoseLandmarker:", error);
        setFeedback('AI 모델 로딩에 실패했습니다.');
        setIsLoading(false);
        setSetupStatus('idle'); // 오류 발생 시 상태 초기화
      }
    };

    createPoseLandmarker();

    return () => {
      poseLandmarkerRef.current?.close();
    };
  }, []);

  // Effect to handle starting/stopping the prediction loop based on isCameraOn state
  useEffect(() => {
    if (isCameraOn) {
      animationFrameId.current = requestAnimationFrame(predictWebcam);
    } else {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
    }

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
    };
  }, [isCameraOn]);

  // 수정된 startWebcam 함수: setupStatus에 따라 동작
  const startWebcam = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.addEventListener("loadeddata", () => {
              // Just set the state, the useEffect will handle the rest
              setIsCameraOn(true);
            });
          }
        })
        .catch((err) => {
          console.error("Camera access denied:", err);
          setFeedback('카메라 접근이 거부되었습니다.');
          setSetupStatus('idle'); // 오류 발생 시 상태 초기화
        });
    }
  };

  // 새로운 "준비하기" 버튼 핸들러
  const handlePrepare = async () => {
    setSetupStatus('setting_up');
    setFeedback('카메라를 여는 중입니다...');
    
    // 1. 카메라 켜기
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.addEventListener("loadeddata", () => {
            setIsCameraOn(true);
            setFeedback('AI 모델을 로딩하는 중입니다...');
          });
        }
      } catch (err) {
        console.error("Camera access denied:", err);
        setFeedback('카메라 접근이 거부되었습니다.');
        setSetupStatus('idle');
        return;
      }
    }

    // 2. 서버 깨우기 시작 (백그라운드에서)
    // 모델 로딩은 useEffect가 처리하므로, 여기서는 서버만 깨우면 됨.
    // 모델 로딩 완료 후 준비 상태로 전환하는 로직은 useEffect와 모델 로딩 콜백에서 처리.
    wakeUpServer().then(success => {
      if (success) {
        // 모델 로딩이 이미 완료되었는지 확인
        if (!isLoading) {
            setSetupStatus('ready');
            setFeedback('준비가 완료되었습니다! 녹화를 시작해보세요.');
        }
        // 모델 로딩이 아직 진행 중이라면, 모델 로딩 완료 콜백에서 상태를 'ready'로 변경할 것임.
      } else {
        setFeedback('서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.');
        setSetupStatus('idle');
      }
    }).catch(error => {
        console.error("Error waking up server:", error);
        setFeedback('서버 연결 중 오류가 발생했습니다.');
        setSetupStatus('idle');
    });
  };

  const stopWebcam = () => {
    const stream = videoRef.current?.srcObject as MediaStream;
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    if (canvasRef.current) {
        const canvasCtx = canvasRef.current.getContext('2d');
        canvasCtx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    // Setting state to false will trigger the useEffect to stop the loop
    setIsCameraOn(false);
    // setupStatus에 따라 다른 피드백 제공
    if (setupStatus === 'recording') {
        setFeedback('녹화가 중지되었습니다.');
    } else if (setupStatus === 'processing') {
        // 분석 중에는 특별히 상태를 바꾸지 않음
    } else {
        setSetupStatus('idle');
        setFeedback('시작 버튼을 눌러 자세 분석을 시작하세요.');
    }
  };

  // 새로운 "녹화 시작" 버튼 핸들러
  const handleStartRecording = () => {
    if (!isCameraOn || setupStatus !== 'ready') {
        setFeedback('준비가 완료되지 않았습니다.');
        return;
    }

    setSetupStatus('recording');
    setFeedback('녹화 중... 15초 후 자동으로 종료됩니다.');

    // MediaRecorder 로직 시작
    startRecording();
  };

  const startRecording = () => {
    if (!videoRef.current?.srcObject) {
        console.error("No video stream available for recording");
        setFeedback('녹화를 시작할 수 없습니다. 카메라가 없습니다.');
        setSetupStatus('ready');
        return;
    }

    // userId와 dogId 확인
    if (!user || !selectedDogId) {
        setFeedback('사용자 정보 또는 강아지 정보가 없습니다.');
        setSetupStatus('ready');
        return;
    }

    const stream = videoRef.current.srcObject as MediaStream;
    
    // MIME 타입 설정
    let mimeType = 'video/mp4';
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = 'video/webm';
      console.warn('MP4 not supported, falling back to WebM');
    }

    try {
        const mediaRecorder = new MediaRecorder(stream, { mimeType });
        mediaRecorderRef.current = mediaRecorder;
        recordedChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            recordedChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = async () => {
          const blob = new Blob(recordedChunksRef.current, { type: mimeType });
          const fileExtension = mimeType.split('/')[1];
          const fileName = `posture_${Date.now()}.${fileExtension}`;
          const recordedFile = new File([blob], fileName, { type: mimeType });

          setSetupStatus('processing');
          setFeedback('영상 분석 중...');
          
          // userId와 dogId를 사용하여 분석 요청
          const result = await submitForAnalysis(recordedFile, user.id, selectedDogId);
          if (result) {
              // 분석 결과 저장
              setAnalysisResult(result);
              // 비디오 URL 설정 (있는 경우)
              setVideoUrl(result.debug_video_url || result.processed_video_url || null);
              
              // 분석 완료 상태로 변경
              setSetupStatus('completed');
              setFeedback('분석이 완료되었습니다!');
          } else {
              setFeedback('분석 중 오류가 발생했습니다. 다시 시도해주세요.');
              setSetupStatus('ready'); // 오류 후에도 재시도 가능하도록
          }
        };

        mediaRecorder.start();
        
        // 15초 후 자동 중지
        setTimeout(() => {
          if (mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
          }
        }, 15000); // 15초

    } catch (error) {
        console.error("Error starting recording:", error);
        setFeedback('녹화 시작 중 오류가 발생했습니다.');
        setSetupStatus('ready');
    }
  };

  const predictWebcam = () => {
    if (!videoRef.current || !poseLandmarkerRef.current || !canvasRef.current) {
      return;
    }

    const video = videoRef.current;
    const canvasElement = canvasRef.current;
    const canvasCtx = canvasElement.getContext('2d');
    if (!canvasCtx) return;

    canvasElement.width = video.videoWidth;
    canvasElement.height = video.videoHeight;

    const nowInMs = performance.now();
    poseLandmarkerRef.current.detectForVideo(video, nowInMs, (result) => {
      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      canvasCtx.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);

      if (result.landmarks && result.landmarks.length > 0) {
        const landmarks = result.landmarks[0];
        const drawingUtils = new vision.DrawingUtils(canvasCtx);
        drawingUtils.drawLandmarks(landmarks, { color: '#FF0000', lineWidth: 2 });
        drawingUtils.drawConnectors(landmarks, vision.PoseLandmarker.POSE_CONNECTIONS, { color: '#00FF00', lineWidth: 4 });
        updateFeedback(landmarks);
      } else {
        setFeedback('강아지를 화면에 맞춰주세요.');
      }
      canvasCtx.restore();
    });

    // The useEffect hook now controls the loop continuation
    if (isCameraOn) {
        animationFrameId.current = requestAnimationFrame(predictWebcam);
    }
  };

  const updateFeedback = (landmarks: any[]) => {
    let x_min = 1, y_min = 1, x_max = 0, y_max = 0;
    let visibility_sum = 0;

    for (const landmark of landmarks) {
      visibility_sum += landmark.visibility ?? 0;
      x_min = Math.min(x_min, landmark.x);
      y_min = Math.min(y_min, landmark.y);
      x_max = Math.max(x_max, landmark.x);
      y_max = Math.max(y_max, landmark.y);
    }

    if (visibility_sum / landmarks.length < 0.5) {
      setFeedback('더 선명한 자세가 필요해요.');
      return;
    }

    const area = (x_max - x_min) * (y_max - y_min);
    if (area < 0.1) {
      setFeedback('조금 더 가까이 다가가세요!');
    } else if (area > 0.6) {
      setFeedback('조금 멀리 떨어져주세요.');
    } else {
      setFeedback('좋은 자세입니다! 이대로 촬영하세요.');
    }
  };

  // 종합 코멘트 생성 함수 (PostureAnalysisPage.tsx에서 재사용)
  const getOverallComment = (stability?: number, curvature?: number): string => {
    if (stability === undefined || curvature === undefined) return "분석 데이터를 읽어오는 중입니다...";
    const stabilityComment = stability >= 80 ? "매우 안정적인 자세" : stability >= 60 ? "준수한 자세" : "다소 불안정한 자세";
    const curvatureComment = curvature >= 170 ? "곧게 펴진 허리" : curvature >= 155 ? "조금 웅크린 자세" : "주의가 필요한 웅크린 자세";

    if (stability >= 80 && curvature >= 170) return `✅ ${stabilityComment}와 ${curvatureComment}를 모두 보여주네요! 아주 이상적인 자세입니다.`;
    if (stability < 60 && curvature < 155) return `⚠️ ${stabilityComment}와 ${curvatureComment}가 함께 관찰됩니다. 자세에 대한 전문가의 관심이 필요해 보입니다.`;
    return `ℹ️ 종합적으로, 우리 강아지는 ${stabilityComment}와 ${curvatureComment}를 보이고 있습니다. 꾸준한 관찰을 통해 변화를 지켜봐 주세요.`;
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="shadow-xl border-2 border-blue-200 bg-white/90 backdrop-blur-md">
        <CardHeader className="bg-gradient-to-r from-blue-100 to-indigo-100">
          <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
            <CameraIcon className="mr-3 h-6 w-6 text-blue-500" />
            실시간 자세 분석 가이드
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <Alert className="bg-blue-50 border-blue-400">
            <Info className="h-4 w-4 !text-blue-800" />
            <AlertTitle className="!text-blue-800 font-bold">안내</AlertTitle>
            <AlertDescription className="!text-blue-700">
              AI가 실시간으로 강아지의 자세를 인식합니다. 아래 가이드에 따라 강아지를 위치시켜주세요.
            </AlertDescription>
          </Alert>

          {/* 강아지 선택 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">분석할 강아지 선택</label>
            <Select 
              onValueChange={setSelectedDogId} 
              value={selectedDogId || ''} 
              disabled={isLoadingDogs || !dogs || dogs.length === 0 || setupStatus !== 'idle'}
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

          <div className="relative w-full mx-auto aspect-video bg-gray-900 rounded-lg flex items-center justify-center overflow-hidden" style={{maxWidth: '640px'}}>
             {isLoading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600 bg-gray-200">
                <Loader2 className="w-10 h-10 animate-spin mb-2" />
                <p className="font-semibold">{feedback}</p>
              </div>
            ) : (
              <>
                <video ref={videoRef} className={`w-full h-full ${!isCameraOn ? 'hidden' : ''}`} autoPlay playsInline muted style={{ transform: 'scaleX(-1)' }}></video>
                <canvas ref={canvasRef} className={`absolute top-0 left-0 w-full h-full ${!isCameraOn ? 'hidden' : ''}`} />
                {!isCameraOn && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-gray-900">
                        <CameraIcon className="w-16 h-16 mb-4" />
                        <p className="font-semibold">{feedback}</p>
                    </div>
                )}
                {isCameraOn && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black bg-opacity-60 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    <p>{feedback}</p>
                    {/* 서버 상태에 따른 추가 피드백 */}
                    {setupStatus === 'setting_up' && serverStatus === 'waking_server' && (
                      <p className="text-xs mt-1">서버를 깨우는 중입니다. 잠시만 기다려주세요...</p>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
          
          <div className="flex justify-center space-x-4 mt-4">
            {/* 기존 버튼들 대체 */}
            {!isLoading && setupStatus === 'idle' && (
              <Button 
                onClick={handlePrepare} 
                size="lg" 
                className="bg-blue-500 hover:bg-blue-600 text-white"
                disabled={!selectedDogId || isLoadingDogs} // 강아지 선택 전 또는 로딩 중에는 버튼 비활성화
              >
                <RadioTower className="mr-2 h-5 w-5" />
                준비하기
              </Button>
            )}
            
            {!isLoading && setupStatus === 'setting_up' && (
              <Button disabled size="lg" className="bg-gray-500 text-white">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                준비 중...
              </Button>
            )}
            
            {!isLoading && setupStatus === 'ready' && (
              <Button 
                onClick={handleStartRecording} 
                size="lg" 
                className="bg-green-500 hover:bg-green-600 text-white"
                disabled={!selectedDogId} // 강아지 선택 전에는 버튼 비활성화
              >
                <Play className="mr-2 h-5 w-5" />
                녹화 시작
              </Button>
            )}
            
            {!isLoading && setupStatus === 'recording' && (
              <Button onClick={stopWebcam} size="lg" variant="destructive">
                <StopCircle className="mr-2 h-5 w-5" />
                녹화 중지
              </Button>
            )}
            
            {!isLoading && setupStatus === 'processing' && (
              <Button disabled size="lg" className="bg-gray-500 text-white">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                분석 중...
              </Button>
            )}
            
            {/* 모든 상태에서 중지 버튼이 필요할 수 있으므로, 조건에 따라 표시 */}
            {!isLoading && (setupStatus === 'setting_up' || setupStatus === 'ready' || setupStatus === 'recording') && (
              <Button onClick={stopWebcam} size="lg" variant="outline">
                <StopCircle className="mr-2 h-5 w-5" />
                중지하기
              </Button>
            )}
          </div>

          {/* 분석 결과 */}
          {setupStatus === 'completed' && analysisResult && (
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
                        {analysisResult.scores?.stability?.toFixed(1) || 'N/A'}
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
                        {analysisResult.scores?.curvature?.toFixed(1) || 'N/A'}
                      </span>
                      <span className="text-xl font-semibold text-gray-500 ml-1">점</span>
                    </div>
                  </div>
                </div>

                {/* 종합 코멘트 */}
                <div className="p-4 bg-gray-50 rounded-lg border mb-6">
                  <p className="text-center font-medium text-gray-700 break-keep">
                    {getOverallComment(analysisResult.scores?.stability, analysisResult.scores?.curvature)}
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

                {/* 다시 시작하기 버튼 */}
                <Button 
                  onClick={() => {
                    // 상태 초기화
                    setSetupStatus('idle');
                    setAnalysisResult(null);
                    setVideoUrl(null);
                    setFeedback('시작 버튼을 눌러 자세 분석을 시작하세요.');
                  }}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-bold py-3"
                  size="lg"
                >
                  <RadioTower className="w-5 h-5 mr-2" />
                  다시 시작하기
                </Button>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RealtimePostureGuide;