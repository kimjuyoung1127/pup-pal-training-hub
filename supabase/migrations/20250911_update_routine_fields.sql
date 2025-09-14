-- Migration to update routine and health related fields in dog_extended_profile
-- This migration improves user experience by changing text inputs to selectable options

-- Remove the old daily_schedule column
ALTER TABLE public.dog_extended_profile
DROP COLUMN IF EXISTS daily_schedule;

-- Add the new active_time column for peak activity hours
ALTER TABLE public.dog_extended_profile
ADD COLUMN IF NOT EXISTS active_time TEXT;

-- Update the sleep_pattern column to be more structured
-- (We'll keep it as TEXT but the application will now use predefined options)

-- Add comments for the updated columns
COMMENT ON COLUMN public.dog_extended_profile.active_time IS '하루중 활발한 시간대';
COMMENT ON COLUMN public.dog_extended_profile.sleep_pattern IS '하루 수면 시간과 패턴 (선택지: 새벽형, 올빼미형, 정규형, 낮잠을 많이 잔다, 잠이 적은 편이다)';

-- Note: We're keeping the health section as is since the request was to delete the last question item,
-- but the health section itself contains multiple items. We'll leave it for now and the application
-- will simply not display the energy_level and physical_limitations fields if desired.