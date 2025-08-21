import React, { useRef, useEffect, useState } from 'react';
import * as vision from '@mediapipe/tasks-vision';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Camera as CameraIcon, Info, Loader2, Play, StopCircle } from 'lucide-react';

const RealtimePostureGuide: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [feedback, setFeedback] = useState('AI 모델을 로딩하는 중입니다...');
  const [isLoading, setIsLoading] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const poseLandmarkerRef = useRef<vision.PoseLandmarker | null>(null);
  const animationFrameId = useRef<number | null>(null);

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
        setFeedback('시작 버튼을 눌러 자세 분석을 시작하세요.');
      } catch (error) {
        console.error("Error creating PoseLandmarker:", error);
        setFeedback('AI 모델 로딩에 실패했습니다.');
        setIsLoading(false);
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
        });
    }
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
    setFeedback('시작 버튼을 눌러 자세 분석을 시작하세요.');
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
                  </div>
                )}
              </>
            )}
          </div>
          
          <div className="flex justify-center space-x-4 mt-4">
            {!isLoading && !isCameraOn && (
              <Button onClick={startWebcam} size="lg" className="bg-green-500 hover:bg-green-600 text-white">
                <Play className="mr-2 h-5 w-5" />
                시작하기
              </Button>
            )}
            {!isLoading && isCameraOn && (
              <Button onClick={stopWebcam} size="lg" variant="destructive">
                <StopCircle className="mr-2 h-5 w-5" />
                중지하기
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealtimePostureGuide;
