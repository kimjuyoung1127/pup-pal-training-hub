-- 1. posts 테이블에 좋아요 수를 저장할 컬럼을 추가합니다.
ALTER TABLE public.posts
ADD COLUMN like_count INT NOT NULL DEFAULT 0;

-- 2. 어떤 유저가 어떤 글에 좋아요를 눌렀는지 기록하는 테이블을 생성합니다.
CREATE TABLE public.post_likes (
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (post_id, user_id)
);

-- 3. post_likes 테이블에 대한 RLS 정책을 활성화합니다.
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;

-- 4. 모든 사용자가 좋아요 기록을 읽을 수 있도록 허용합니다.
CREATE POLICY "Allow public read access" ON public.post_likes
FOR SELECT USING (true);

-- 5. 로그인한 사용자가 자신의 좋아요 기록을 추가/삭제할 수 있도록 허용합니다.
CREATE POLICY "Allow users to manage their own likes" ON public.post_likes
FOR ALL USING (auth.uid() = user_id);


-- 6. 좋아요를 토글하는 데이터베이스 함수를 생성합니다.
CREATE OR REPLACE FUNCTION public.toggle_like(p_post_id UUID)
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER -- 이 함��가 테이블 소유자의 권한으로 실행되도록 합니다.
AS $$
DECLARE
  current_user_id UUID := auth.uid();
  new_like_count INT;
BEGIN
  -- 사용자가 이미 좋아요를 눌렀는지 확인합니다.
  IF EXISTS (SELECT 1 FROM public.post_likes WHERE post_id = p_post_id AND user_id = current_user_id) THEN
    -- 이미 눌렀다면, 좋아요를 취소합니다 (DELETE).
    DELETE FROM public.post_likes WHERE post_id = p_post_id AND user_id = current_user_id;
  ELSE
    -- 누르지 않았다면, 좋아요를 추가합니다 (INSERT).
    INSERT INTO public.post_likes (post_id, user_id) VALUES (p_post_id, current_user_id);
  END IF;

  -- posts 테이블의 like_count를 업데이트합니다.
  UPDATE public.posts
  SET like_count = (SELECT count(*) FROM public.post_likes WHERE post_id = p_post_id)
  WHERE id = p_post_id
  RETURNING like_count INTO new_like_count;

  -- 새로운 좋아요 수를 반환합니다.
  RETURN new_like_count;
END;
$$;
