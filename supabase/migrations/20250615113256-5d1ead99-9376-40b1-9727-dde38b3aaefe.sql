
ALTER TABLE public.dog_extended_profile
  ADD COLUMN IF NOT EXISTS known_behaviors TEXT[],
  ADD COLUMN IF NOT EXISTS leash_type TEXT,
  ADD COLUMN IF NOT EXISTS toilet_type TEXT,
  ADD COLUMN IF NOT EXISTS social_level TEXT,
  ADD COLUMN IF NOT EXISTS meal_habit TEXT,
  ADD COLUMN IF NOT EXISTS favorites TEXT[],
  ADD COLUMN IF NOT EXISTS owner_proximity TEXT,
  ADD COLUMN IF NOT EXISTS activity_level TEXT,
  ADD COLUMN IF NOT EXISTS past_experience TEXT,
  ADD COLUMN IF NOT EXISTS sensitive_items TEXT[],
  ADD COLUMN IF NOT EXISTS family_kids BOOLEAN,
  ADD COLUMN IF NOT EXISTS preferred_play TEXT[];

COMMENT ON COLUMN public.dog_extended_profile.known_behaviors IS '이미 잘하는 행동';
COMMENT ON COLUMN public.dog_extended_profile.leash_type IS '산책 장비 사용 여부';
COMMENT ON COLUMN public.dog_extended_profile.toilet_type IS '배변 위치';
COMMENT ON COLUMN public.dog_extended_profile.social_level IS '사회성 수준';
COMMENT ON COLUMN public.dog_extended_profile.meal_habit IS '식사 습관';
COMMENT ON COLUMN public.dog_extended_profile.favorites IS '좋아하는 간식/장난감';
COMMENT ON COLUMN public.dog_extended_profile.owner_proximity IS '보호자와의 거리감';
COMMENT ON COLUMN public.dog_extended_profile.activity_level IS '하루 활동량';
COMMENT ON COLUMN public.dog_extended_profile.past_experience IS '과거 경험 (입양/유기 등)';
COMMENT ON COLUMN public.dog_extended_profile.sensitive_items IS '민감한 자극 요소';
COMMENT ON COLUMN public.dog_extended_profile.family_kids IS '가족 구성에 아이가 있는지 여부';
COMMENT ON COLUMN public.dog_extended_profile.preferred_play IS '좋아하는 활동';
