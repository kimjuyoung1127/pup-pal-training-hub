
-- Create table for extended dog profile information
CREATE TABLE public.dog_extended_profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dog_id UUID NOT NULL UNIQUE REFERENCES public.dogs(id) ON DELETE CASCADE,
  living_environment TEXT NULL,
  family_composition TEXT NULL,
  favorite_snacks TEXT NULL,
  sensitive_factors TEXT NULL,
  past_history TEXT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add comments to the table and columns
COMMENT ON TABLE public.dog_extended_profile IS 'Stores extended profile information for a dog.';
COMMENT ON COLUMN public.dog_extended_profile.living_environment IS 'The dog''s living environment (e.g., apartment, house).';
COMMENT ON COLUMN public.dog_extended_profile.family_composition IS 'Description of the family composition.';
COMMENT ON COLUMN public.dog_extended_profile.favorite_snacks IS 'The dog''s favorite snacks.';
COMMENT ON COLUMN public.dog_extended_profile.sensitive_factors IS 'Factors the dog is sensitive to (e.g., noise).';
COMMENT ON COLUMN public.dog_extended_profile.past_history IS 'The dog''s past history (e.g., adoption, training).';

-- Enable RLS
ALTER TABLE public.dog_extended_profile ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow users to view their own dog's extended profile"
ON public.dog_extended_profile FOR SELECT
USING (auth.uid() = (SELECT user_id FROM dogs WHERE id = dog_extended_profile.dog_id));

CREATE POLICY "Allow users to insert their own dog's extended profile"
ON public.dog_extended_profile FOR INSERT
WITH CHECK (auth.uid() = (SELECT user_id FROM dogs WHERE id = dog_extended_profile.dog_id));

CREATE POLICY "Allow users to update their own dog's extended profile"
ON public.dog_extended_profile FOR UPDATE
USING (auth.uid() = (SELECT user_id FROM dogs WHERE id = dog_extended_profile.dog_id));

CREATE POLICY "Allow users to delete their own dog's extended profile"
ON public.dog_extended_profile FOR DELETE
USING (auth.uid() = (SELECT user_id FROM dogs WHERE id = dog_extended_profile.dog_id));

