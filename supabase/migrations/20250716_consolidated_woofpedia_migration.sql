-- Mungai-Woofpedia 통합을 위한 최종 마이그레이션 스크립트
-- 모든 테이블 생성, 컬럼 추가, 함수 생성을 포함합니다.

-- 1. 테이블 생성
CREATE TABLE mbti_descriptions (
    mbti_type CHAR(4) PRIMARY KEY,
    title TEXT,
    description TEXT
);

CREATE TABLE breeds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_ko TEXT NOT NULL,
    name_en TEXT NOT NULL UNIQUE,
    thumbnail_url TEXT,
    summary TEXT,
    history TEXT,
    size_type TEXT,
    avg_life_expectancy INT4RANGE,
    avg_weight INT4RANGE,
    dog_mbti CHAR(4) REFERENCES mbti_descriptions(mbti_type),
    popularity_score INT DEFAULT 0
);

CREATE TABLE breed_details (
    breed_id UUID PRIMARY KEY REFERENCES breeds(id) ON DELETE CASCADE,
    adaptability SMALLINT,
    friendliness_with_kids SMALLINT,
    friendliness_with_pets SMALLINT,
    energy_level SMALLINT,
    grooming_needs SMALLINT,
    shedding_level SMALLINT,
    trainability SMALLINT
);

CREATE TABLE breed_diseases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    breed_id UUID NOT NULL REFERENCES breeds(id) ON DELETE CASCADE,
    disease_name TEXT NOT NULL,
    description TEXT
);

-- 2. 누락되었던 컬럼 추가 (ADD IF NOT EXISTS 사용으로 안전성 확보)
ALTER TABLE public.breed_details
ADD COLUMN IF NOT EXISTS barking_level SMALLINT,
ADD COLUMN IF NOT EXISTS friendliness_with_strangers SMALLINT,
ADD COLUMN IF NOT EXISTS exercise_needs SMALLINT,
ADD COLUMN IF NOT EXISTS playfulness SMALLINT,
ADD COLUMN IF NOT EXISTS affection_level SMALLINT;

-- 3. 필터링 마법사 RPC 함수 생성
CREATE OR REPLACE FUNCTION get_filtered_breeds(p_answers jsonb)
RETURNS TABLE(id uuid, name_ko text, name_en text, thumbnail_url text, size_type text)
AS $$
BEGIN
  RETURN QUERY
  SELECT
    b.id,
    b.name_ko,
    b.name_en,
    b.thumbnail_url,
    b.size_type
  FROM
    breeds b
  JOIN
    breed_details bd ON b.id = bd.breed_id
  WHERE
    -- 환경 (Environment)
    CASE
      WHEN p_answers->>'environment' = 'apartment' THEN bd.barking_level <= 3 AND b.size_type IN ('소형', '중형')
      WHEN p_answers->>'environment' = 'houseWithYard' THEN b.size_type IN ('중형', '대형')
      ELSE TRUE
    END
  AND
    -- 활동 (Activity)
    CASE
      WHEN p_answers->>'activity' = 'calm' THEN bd.energy_level <= 2
      WHEN p_answers->>'activity' = 'moderate' THEN bd.energy_level BETWEEN 3 AND 4
      WHEN p_answers->>'activity' = 'active' THEN bd.energy_level >= 4
      ELSE TRUE
    END
  AND
    -- 사회성 (Social)
    CASE
      WHEN p_answers->>'social' = 'alone' THEN bd.friendliness_with_strangers <= 2
      WHEN p_answers->>'social' = 'family' THEN bd.friendliness_with_kids >= 3
      WHEN p_answers->>'social' = 'socialButterfly' THEN bd.friendliness_with_strangers >= 4 AND bd.friendliness_with_pets >= 4
      ELSE TRUE
    END
  AND
    -- 관리 (Care)
    CASE
      WHEN p_answers->>'care' = 'easy' THEN bd.trainability >= 4 AND bd.grooming_needs <= 2
      WHEN p_answers->>'care' = 'medium' THEN bd.trainability >= 3
      WHEN p_answers->>'care' = 'hard' THEN TRUE -- 모든 경우 허용
      ELSE TRUE
    END
  ORDER BY
    b.popularity_score DESC;
END;
$$ LANGUAGE plpgsql;

-- 4. RLS 정책 및 함수 실행 권한 부여
ALTER TABLE mbti_descriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to mbti_descriptions" ON mbti_descriptions FOR SELECT USING (true);

ALTER TABLE breeds ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to breeds" ON breeds FOR SELECT USING (true);

ALTER TABLE breed_details ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to breed_details" ON breed_details FOR SELECT USING (true);

ALTER TABLE breed_diseases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to breed_diseases" ON breed_diseases FOR SELECT USING (true);

GRANT EXECUTE ON FUNCTION public.get_filtered_breeds(jsonb) TO anon, authenticated;
