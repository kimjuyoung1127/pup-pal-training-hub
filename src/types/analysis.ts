// src/types/analysis.ts

/**
 * Supabase의 `joint_analysis_records` 테이블의 한 행을 나타내는 타입입니다.
 * DB 스키마 덤프를 기반으로 정확하게 정의되었습니다.
 */
export interface JointAnalysisRecord {
  id: number; // bigint, primary key
  user_id: string; // uuid, foreign key to auth.users
  dog_id: string; // uuid, foreign key to dogs
  created_at: string; // timestamp with time zone
  is_baseline: boolean; // boolean
  original_video_filename: string; // text
  processed_video_url: string; // text
  analysis_results?: AnalysisData; // jsonb, optional
  notes?: string; // text, optional

  // --- 프론트엔드에서 JOIN 또는 가공해서 사용하는 데이터 ---
  dog_name?: string; // dogs 테이블에서 join하여 가져온 이름
  thumbnail_url?: string; // processed_video_url에서 파생된 썸네일
  stability_score?: number; // analysis_results에서 추출한 안정성 점수
}

/**
 * analysis_results JSONB 컬럼의 데이터 구조를 정의합니다.
 * overview.md 및 일반적인 분석 데이터 구조를 기반으로 추정합니다.
 */
export interface AnalysisData {
  frames: FrameData[];
  metadata: VideoMetadata;
  scores: AnalysisScores;
}

/**
 * 다양한 분석 점수를 포함합니다.
 */
export interface AnalysisScores {
  curvature: any;
  stability: number;
  symmetry?: number; // 향후 확장
  gait?: number; // 향후 확장
}

/**
 * 각 프레임의 관절 좌표 데이터를 담습니다.
 */
export interface FrameData {
  frame_index: number;
  keypoints: Keypoint[];
}

/**
 * 단일 관절(keypoint)의 좌표와 신뢰도를 나타냅니다.
 */
export interface Keypoint {
  confidence: number;
  x: number;
  y: number;
  score: number;
  name: string; // e.g., "nose", "left_eye"
}

/**
 * 원본 비디오의 메타데이터를 정의합니다.
 */
export interface VideoMetadata {
  width: number;
  height: number;
  frame_count: number;
  fps: number;
}

/**
 * analysis_results에 keypoints_data가 있을 수 있음을 명시하는 확장된 타입
 */
export interface AnalysisDataWithKeypoints extends AnalysisData {
    keypoints_data?: number[][][][];
    metadata?: {
        fps?: number;
        width?: number;
        height?: number;
        frame_count?: number;
    };
}
