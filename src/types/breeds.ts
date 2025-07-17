
// src/types/breeds.ts

export interface Breed {
  id: string; // UUID
  name_ko: string;
  name_en: string;
  thumbnail_url: string | null;
  summary: string | null;
  history: string | null;
  size_type: string | null;
  avg_life_expectancy: string | null; // Range type, e.g., "[10,15)"
  avg_weight: string | null; // Range type, e.g., "[3,7)"
  dog_mbti: string | null; // CHAR(4)
  popularity_score: number | null;
}

export interface BreedDetail extends Breed {
  // breeds 테이블의 모든 정보를 포함하고, 추가로 details 정보까지 가집니다.
  details: {
    adaptability: number | null;
    friendliness_with_kids: number | null;
    friendliness_with_pets: number | null;
    energy_level: number | null;
    grooming_needs: number | null;
    shedding_level: number | null;
    trainability: number | null;
  } | null;
}
