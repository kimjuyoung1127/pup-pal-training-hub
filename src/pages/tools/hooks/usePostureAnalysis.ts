import { useState, useCallback } from 'react';

// JobStatus 및 AnalysisResult 타입은 PostureAnalysisPage에서 가져온 실제 타입으로 교체해야 합니다.
// 예시 타입 정의 (실제 구조에 맞게 수정 필요)
type JobStatus = 'idle' | 'connecting' | 'waking_server' | 'uploading' | 'processing' | 'completed' | 'failed';

interface AnalysisResult {
  // 예시 구조:
  // scores: { stability: number; curvature: number };
  // metadata: { fps: number; frame_count: number };
  // debug_video_url?: string;
  // 실제 백엔드 API 응답 형식에 맞게 정의
  [key: string]: any; // 임시로 any 사용, 추후 구체적인 타입으로 변경
}

// 훅의 반환 값 타입 정의
interface UsePostureAnalysisReturn {
  wakeUpServer: () => Promise<boolean>;
  submitForAnalysis: (file: File, userId: string, dogId: string) => Promise<AnalysisResult | null>;
  isServerAwake: boolean;
  serverStatus: JobStatus; // 더 자세한 피드백을 제공하기 위해
  setServerStatus: React.Dispatch<React.SetStateAction<JobStatus>>; // 부모 컴포넌트에서 상태 재설정이 필요할 경우를 대비해 노출
}

const HEALTH_CHECK_INTERVAL = 5000; // 5초
const JOB_POLL_INTERVAL = 2000; // 2초

/**
 * 자세 분석 로직(서버 상태 확인 및 비디오 제출)을 처리하는 커스텀 훅.
 */
export const usePostureAnalysis = (): UsePostureAnalysisReturn => {
  const [isServerAwake, setIsServerAwake] = useState(false);
  const [serverStatus, setServerStatus] = useState<JobStatus>('idle');

  /**
   * 분석 서버의 상태를 확인합니다.
   * PostureAnalysisPage의 pollServerHealth 로직을 모방합니다.
   * @returns 서버가 깨어 있으면 true, 그렇지 않으면 false를 반환하는 Promise.
   */
  const wakeUpServer = useCallback(async (): Promise<boolean> => {
    const healthCheckUrl = `${import.meta.env.VITE_API_BASE_URL}/api/health`;

    const checkHealth = async (): Promise<boolean> => {
      try {
        setServerStatus('connecting');
        const response = await fetch(healthCheckUrl);
        if (response.ok) {
          setIsServerAwake(true);
          setServerStatus('idle'); // 또는 'ready'
          return true;
        } else {
          setServerStatus('waking_server');
          // 서버가 준비되지 않았으므로, 지연 후 다시 시도
          await new Promise(resolve => setTimeout(resolve, HEALTH_CHECK_INTERVAL));
          return await checkHealth(); // 폴링을 위한 재귀 호출
        }
      } catch (error) {
        console.error("서버 상태 확인 중 오류 발생:", error);
        setServerStatus('waking_server');
        await new Promise(resolve => setTimeout(resolve, HEALTH_CHECK_INTERVAL));
        return await checkHealth(); // 오류 발생 시 폴링을 위한 재귀 호출
      }
    };

    return await checkHealth();
  }, []);

  /**
   * 자세 분석을 위해 비디오 파일을 제출합니다.
   * PostureAnalysisPage의 uploadFileAndStartJob 및 pollJobStatus 로직을 모방합니다.
   * @param file 분석할 비디오 파일.
   * @param userId 사용자 ID.
   * @param dogId 강아지 ID.
   * @returns 분석 결과 또는 실패 시 null을 반환하는 Promise.
   */
  const submitForAnalysis = useCallback(async (file: File, userId: string, dogId: string): Promise<AnalysisResult | null> => {
    const jobsUrl = `${import.meta.env.VITE_API_BASE_URL}/api/jobs`;

    if (!userId || !dogId) {
      console.error("사용자 ID 또는 강아지 ID가 누락되었습니다.");
      return null;
    }

    try {
      setServerStatus('uploading');
      
      // 1. 파일 업로드
      const formData = new FormData();
      formData.append('file', file);
      formData.append('user_id', userId);
      formData.append('dog_id', dogId);

      const uploadResponse = await fetch(jobsUrl, {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json().catch(() => ({}));
        throw new Error(errorData.detail || '분석을 위한 비디오 업로드 실패');
      }

      const jobData = await uploadResponse.json();
      const jobId = jobData.job_id;

      if (!jobId) {
        throw new Error('응답에서 작업 ID를 찾을 수 없습니다.');
      }

      setServerStatus('processing');
      
      // 2. 작업 완료를 위해 폴링
      const pollJobStatus = async (): Promise<AnalysisResult | null> => {
        try {
          const statusResponse = await fetch(`${jobsUrl}/${jobId}`);
          
          if (!statusResponse.ok) {
            const errorData = await statusResponse.json().catch(() => ({}));
            throw new Error(errorData.detail || '작업 상태 조회 실패');
          }

          const statusData = await statusResponse.json();
          
          if (statusData.status === 'completed') {
            setServerStatus('completed');
            return statusData.result;
          } else if (statusData.status === 'failed') {
            setServerStatus('failed');
            throw new Error(statusData.error || '분석 작업 실패');
          } else {
            // 작업이 아직 처리 중, 다시 폴링
            await new Promise(resolve => setTimeout(resolve, JOB_POLL_INTERVAL));
            return await pollJobStatus();
          }
        } catch (error) {
          console.error("작업 상태 폴링 중 오류 발생:", error);
          setServerStatus('failed');
          throw error; // 외부 catch에서 잡히도록 재발생
        }
      };

      return await pollJobStatus();

    } catch (error) {
      console.error("분석을 위한 파일 제출 중 오류 발생:", error);
      // pollJobStatus에서 이미 실패 상태로 설정되지 않았다면 설정
      if (serverStatus !== 'failed') {
        setServerStatus('failed');
      }
      return null;
    }
  }, [serverStatus]); // 필요에 따라 의존성 추가

  return {
    wakeUpServer,
    submitForAnalysis,
    isServerAwake,
    serverStatus,
    setServerStatus // 부모 컴포넌트에서 상태 재설정이 필요할 경우를 대비해 setter 노출
  };
};