-- 1. user_profiles 테이블에 사용자 이름과 프로필 사진 URL 컬럼을 추가합니다.
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS username TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- 2. 모든 사용자가 다른 사람의 기본 프로필 정보(username, avatar_url)를 읽을 수 있도록 허용하는 정책을 추가합니다.
-- DROP POLICY IF EXISTS를 사용하여 중복 생성을 방지합니다.
DROP POLICY IF EXISTS "Allow public read access to usernames and avatars" ON public.user_profiles;
CREATE POLICY "Allow public read access to usernames and avatars"
ON public.user_profiles FOR SELECT
USING (true);


-- 3. 게시글과 확장된 사용자 프로필을 조인하는 VIEW를 생성합니다.
CREATE OR REPLACE VIEW public.posts_with_author AS
SELECT
    p.id,
    p.created_at,
    p.user_id,
    p.category,
    p.title,
    p.content,
    p.view_count,
    up.username,
    up.avatar_url
FROM
    public.posts p
LEFT JOIN
    public.user_profiles up ON p.user_id = up.id;

-- 4. 댓글과 확장된 사용자 프로필을 조인하는 VIEW를 생성합니다.
CREATE OR REPLACE VIEW public.comments_with_author AS
SELECT
    c.id,
    c.created_at,
    c.user_id,
    c.post_id,
    c.content,
    up.username,
    up.avatar_url
FROM
    public.comments c
LEFT JOIN
    public.user_profiles up ON c.user_id = up.id;
