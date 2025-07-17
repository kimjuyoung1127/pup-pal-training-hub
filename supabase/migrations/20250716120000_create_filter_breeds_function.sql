
-- supabase/migrations/YYYYMMDDHHMMSS_create_filter_breeds_function.sql

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
