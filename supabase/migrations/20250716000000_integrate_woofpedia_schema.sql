-- woofpedia-app의 정확한 스키마를 기반으로 생성된 최종 마이그레이션 스크립트
-- 순서: mbti_descriptions -> breeds -> breed_details -> breed_diseases

-- 1. mbti_descriptions 테이블 생성
CREATE TABLE mbti_descriptions (
    mbti_type CHAR(4) PRIMARY KEY,
    title TEXT,
    description TEXT
);

-- 2. breeds 테이블 생성
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

-- 3. breed_details 테이블 생성
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

-- 4. breed_diseases 테이블 생성
CREATE TABLE breed_diseases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    breed_id UUID NOT NULL REFERENCES breeds(id) ON DELETE CASCADE,
    disease_name TEXT NOT NULL,
    description TEXT
);

-- RLS(Row Level Security) 정책 활성화 및 설정
ALTER TABLE mbti_descriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated read access to mbti_descriptions" ON mbti_descriptions FOR SELECT TO authenticated USING (true);

ALTER TABLE breeds ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated read access to breeds" ON breeds FOR SELECT TO authenticated USING (true);

ALTER TABLE breed_details ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated read access to breed_details" ON breed_details FOR SELECT TO authenticated USING (true);

ALTER TABLE breed_diseases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated read access to breed_diseases" ON breed_diseases FOR SELECT TO authenticated USING (true);
