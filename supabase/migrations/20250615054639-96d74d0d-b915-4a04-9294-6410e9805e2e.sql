
-- dogs 테이블에 이미지 URL을 저장할 컬럼 추가
ALTER TABLE public.dogs ADD COLUMN image_url TEXT;

-- 강아지 프로필 이미지를 위한 스토리지 버킷 생성
INSERT INTO storage.buckets (id, name, public)
VALUES ('dog-profiles', 'dog-profiles', true)
ON CONFLICT (id) DO NOTHING;

-- 스토리지 버킷에 대한 정책 설정
-- 모든 사용자가 프로필 이미지를 볼 수 있도록 허용
CREATE POLICY "Public read access for dog profiles"
ON storage.objects FOR SELECT
USING ( bucket_id = 'dog-profiles' );

-- 로그인한 사용자가 자신의 프로필 이미지를 업로드할 수 있도록 허용
-- 파일 경로는 /user_id/파일 형식으로 저장됩니다.
CREATE POLICY "Users can upload their own dog profile image"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'dog-profiles' AND (storage.foldername(name))[1] = auth.uid()::text );

-- 로그인한 사용자가 자신의 프로필 이미지를 수정할 수 있도록 허용
CREATE POLICY "Users can update their own dog profile image"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'dog-profiles' AND (storage.foldername(name))[1] = auth.uid()::text );

-- 로그인한 사용자가 자신의 프로필 이미지를 삭제할 수 있도록 허용
CREATE POLICY "Users can delete their own dog profile image"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'dog-profiles' AND (storage.foldername(name))[1] = auth.uid()::text );
