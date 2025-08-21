import React, { useRef, useEffect, useState } from 'react';
import { Pose, POSE_CONNECTIONS } from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Camera as CameraIcon, Info } from 'lucide-react';

const RealtimePostureGuide: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [feedback, setFeedback] = useState('카메라를 준비하는 중입니다...');

  useEffect(() => {
    const pose = new Pose({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    const onResults = (results: any) => {
      if (!canvasRef.current || !results.poseLandmarks) {
        setFeedback('강아지를 화면에 맞춰주세요.');
        return;
      }

      const canvasElement = canvasRef.current;
      const canvasCtx = canvasElement.getContext('2d');
      if (!canvasCtx) return;

      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

      // Draw skeleton
      drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {
        color: '#00FF00',
        lineWidth: 4,
      });
      drawLandmarks(canvasCtx, results.poseLandmarks, {
        color: '#FF0000',
        lineWidth: 2,
      });

      // Simple feedback logic
      const landmarks = results.poseLandmarks;
      const nose = landmarks[0]; // Example landmark
      if (nose.visibility > 0.8) {
          const area = calculateBoundingBoxArea(landmarks);
          if(area < 0.1) {
              setFeedback('조금 더 가까이 다가가세요!');
          } else if (area > 0.5) {
              setFeedback('조금 멀리 떨어져주세요.');
          } else {
              setFeedback('좋은 자세입니다! 촬영을 준비하세요.');
          }
      } else {
          setFeedback('강아지가 화면 중앙에 오도록 해주세요.');
      }

      canvasCtx.restore();
    };

    pose.onResults(onResults);

    if (videoRef.current) {
      const camera = new Camera(videoRef.current, {
        onFrame: async () => {
          if (videoRef.current) {
            await pose.send({ image: videoRef.current });
          }
        },
        width: 640,
        height: 480,
      });
      camera.start();
    }

    // Helper function to calculate bounding box area
    const calculateBoundingBoxArea = (landmarks: any[]) => {
        let x_min = 1, y_min = 1, x_max = 0, y_max = 0;
        for(const landmark of landmarks) {
            if(landmark.visibility > 0.5) { // Only consider visible landmarks
                x_min = Math.min(x_min, landmark.x);
                y_min = Math.min(y_min, landmark.y);
                x_max = Math.max(x_max, landmark.x);
                y_max = Math.max(y_max, landmark.y);
            }
        }
        return (x_max - x_min) * (y_max - y_min);
    }

  }, []);

  return (
    <div className="container mx-auto p-4 md:p-8">
        <Card className="shadow-xl border-2 border-blue-200 bg-white/90 backdrop-blur-md">
            <CardHeader className="bg-gradient-to-r from-blue-100 to-indigo-100">
                <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
                    <CameraIcon className="mr-3 h-6 w-6 text-blue-500" />
                    실시간 자세 분석 가이드 (Test)
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

                <div className="relative w-full mx-auto" style={{maxWidth: '640px'}}>
                    <video ref={videoRef} className="w-full h-auto rounded-lg" style={{ display: 'none' }}></video>
                    <canvas ref={canvasRef} className="w-full h-auto rounded-lg border-2 border-gray-300" width="640" height="480"></canvas>
                    <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white p-2 rounded-lg">
                        <p className="font-semibold">AI 피드백:</p>
                        <p>{feedback}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
  );
};

export default RealtimePostureGuide;