-- Add new columns to dog_extended_profile table for enhanced training recommendations
ALTER TABLE public.dog_extended_profile
ADD COLUMN IF NOT EXISTS daily_schedule TEXT[],
ADD COLUMN IF NOT EXISTS separation_anxiety TEXT,
ADD COLUMN IF NOT EXISTS sleep_pattern TEXT,
ADD COLUMN IF NOT EXISTS known_commands TEXT[],
ADD COLUMN IF NOT EXISTS training_challenges TEXT[],
ADD COLUMN IF NOT EXISTS reward_preference TEXT,
ADD COLUMN IF NOT EXISTS training_consistency TEXT,
ADD COLUMN IF NOT EXISTS energy_level TEXT,
ADD COLUMN IF NOT EXISTS physical_limitations TEXT,
ADD COLUMN IF NOT EXISTS vaccination_status BOOLEAN;

-- Add comments for the new columns
COMMENT ON COLUMN public.dog_extended_profile.daily_schedule IS '하루 일과 중 중요한 시간대';
COMMENT ON COLUMN public.dog_extended_profile.separation_anxiety IS '보호자가 외출할 때 반응';
COMMENT ON COLUMN public.dog_extended_profile.sleep_pattern IS '하루 수면 시간과 패턴';
COMMENT ON COLUMN public.dog_extended_profile.known_commands IS '지금까지 배운 명령어들';
COMMENT ON COLUMN public.dog_extended_profile.training_challenges IS '훈련에서 어려움을 겪는 부분';
COMMENT ON COLUMN public.dog_extended_profile.reward_preference IS '훈련할 때 선호하는 보상';
COMMENT ON COLUMN public.dog_extended_profile.training_consistency IS '가족 구성원들의 훈련 방식 일관성';
COMMENT ON COLUMN public.dog_extended_profile.energy_level IS '에너지가 가장 왕성한 시간대';
COMMENT ON COLUMN public.dog_extended_profile.physical_limitations IS '신체적으로 제한이 있거나 주의해야 할 사항';
COMMENT ON COLUMN public.dog_extended_profile.vaccination_status IS '필수 예방접종 완료 여부';