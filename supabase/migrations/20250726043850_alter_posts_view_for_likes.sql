-- 1. 기존 VIEW를 안전하게 삭제합니다.
DROP VIEW IF EXISTS public.posts_with_author;

-- 2. 새로운 정의로 VIEW를 다시 생성합니다.
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
    up.avatar_url,
    p.like_count,
    EXISTS (
        SELECT 1
        FROM public.post_likes pl
        WHERE pl.post_id = p.id AND pl.user_id = auth.uid()
    ) AS is_liked_by_user
FROM
    public.posts p
LEFT JOIN
    public.user_profiles up ON p.user_id = up.id;
