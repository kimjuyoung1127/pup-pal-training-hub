
-- 훈련 기록을 저장할 테이블 생성
CREATE TABLE public.training_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dog_id UUID NOT NULL REFERENCES public.dogs(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    session_date DATE NOT NULL DEFAULT CURRENT_DATE,
    duration_minutes INT,
    success_rate NUMERIC(5, 2) CHECK (success_rate >= 0 AND success_rate <= 100),
    training_type TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- training_history 테이블에 대한 RLS (Row Level Security) 설정
ALTER TABLE public.training_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own dog's training history"
ON public.training_history
FOR ALL
USING (auth.uid() = user_id);


-- 획득 가능한 뱃지 목록을 저장할 테이블 생성
CREATE TABLE public.badges (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT
);

-- badges 테이블에 대한 RLS 설정
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view all badges"
ON public.badges
FOR SELECT
USING (true);

-- 샘플 뱃지 데이터 삽입
INSERT INTO public.badges (name, description, icon) VALUES
('첫 훈련 파트너', '첫 훈련 세션을 완료했어요!', '🤝'),
('꾸준함의 상징', '7일 연속으로 훈련했어요.', '📅'),
('성공의 맛', '첫 훈련에서 100% 성공률을 달성했어요.', '🏆'),
('훈련 마스터', '10개의 훈련 목표를 달성했어요.', '⭐');


-- 강아지가 획득한 뱃지를 저장할 테이블 생성
CREATE TABLE public.dog_badges (
    id SERIAL PRIMARY KEY,
    dog_id UUID NOT NULL REFERENCES public.dogs(id) ON DELETE CASCADE,
    badge_id INT NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
    achieved_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(dog_id, badge_id) -- 강아지는 같은 뱃지를 중복해서 획득할 수 없음
);

-- dog_badges 테이블에 대한 RLS 설정
ALTER TABLE public.dog_badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view and add badges for their own dog"
ON public.dog_badges
FOR ALL
USING (EXISTS (SELECT 1 FROM dogs WHERE dogs.id = dog_badges.dog_id AND dogs.user_id = auth.uid()));

