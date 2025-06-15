
-- Create a new storage bucket for user media
INSERT INTO storage.buckets (id, name, public)
VALUES ('media_storage', 'media_storage', true)
ON CONFLICT (id) DO NOTHING;

-- Set up policies for the media_storage bucket
-- Allow public read access
CREATE POLICY "Public read access for media"
ON storage.objects FOR SELECT
USING ( bucket_id = 'media_storage' );

-- Allow authenticated users to upload their own media
CREATE POLICY "Users can upload their own media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'media_storage' AND auth.uid()::text = (storage.foldername(name))[1] );

-- Allow authenticated users to delete their own media
CREATE POLICY "Users can delete their own media"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'media_storage' AND auth.uid()::text = (storage.foldername(name))[1] );

-- Create a table to store media metadata
CREATE TABLE public.media (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  file_url TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type VARCHAR(20) NOT NULL, -- e.g., 'image' or 'video'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for the media table
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

-- Policies for media table
CREATE POLICY "Users can view their own media"
ON public.media
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own media"
ON public.media
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own media"
ON public.media
FOR DELETE
USING (auth.uid() = user_id);
