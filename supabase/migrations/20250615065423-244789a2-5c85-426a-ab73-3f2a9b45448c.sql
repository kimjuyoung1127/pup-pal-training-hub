
-- 오늘의 훈련 팁을 저장할 테이블
CREATE TABLE public.training_tips (
    id SERIAL PRIMARY KEY,
    tip TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 모든 사용자가 팁을 볼 수 있도록 RLS 정책 설정
ALTER TABLE public.training_tips ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Training tips are viewable by everyone"
ON public.training_tips FOR SELECT USING (true);

-- 샘플 팁 데이터 삽입
INSERT INTO public.training_tips (tip) VALUES
('기다려 훈련은 간식 타이밍이 중요해요!'),
('긍정 강화는 강아지의 자신감을 키워줍니다. 칭찬을 아끼지 마세요!'),
('산책 중 다른 강아지를 만나면, 바로 다가가기보다 거리를 두고 관찰할 시간을 주세요.'),
('노즈워크는 강아지의 스트레스 해소에 아주 효과적인 활동이에요.'),
('새로운 환경에 적응할 때는 강아지에게 충분한 시간과 안정감을 제공해주세요.');


-- 추천 훈련 영상을 저장할 테이블
CREATE TABLE public.recommended_videos (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    youtube_video_id TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 모든 사용자가 추천 영상을 볼 수 있도록 RLS 정책 설정
ALTER TABLE public.recommended_videos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Recommended videos are viewable by everyone"
ON public.recommended_videos FOR SELECT USING (true);

-- 샘플 영상 데이터 삽입
INSERT INTO public.recommended_videos (title, youtube_video_id, description) VALUES
('강아지 ''앉아'' 훈련, 5분 완성!', 'DF-t2Y67k1s', '가장 기본적인 앉아 훈련을 쉽고 재미있게 가르쳐보세요.'),
('천재견 만드는 ''기다려'' 훈련법', '6a-c_4t2a_E', '강아지의 인내심과 집중력을 길러주는 기다려 훈련 마스터하기.'),
('사회성 UP! 강아지 산책 예절 교육', 'O5iAFc-1i7c', '다른 강아지나 사람을 만났을 때 짖지 않고 차분하게 지나가는 법을 배워요.');


-- 오늘의 미션을 저장할 테이블
CREATE TABLE public.daily_missions (
    id SERIAL PRIMARY KEY,
    mission TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 모든 사용자가 오늘의 미션을 볼 수 있도록 RLS 정책 설정
ALTER TABLE public.daily_missions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Daily missions are viewable by everyone"
ON public.daily_missions FOR SELECT USING (true);

-- 샘플 미션 데이터 삽입
INSERT INTO public.daily_missions (mission) VALUES
('산책 전에 ‘앉아’ 3회 시도해보세요!'),
('새로운 장난감으로 5분 동안 함께 놀아주세요.'),
('집 안에서 간식을 숨기고 ‘찾아’ 놀이를 해보세요.'),
('강아지에게 1분 동안 부드럽게 마사지를 해주세요.'),
('아이 컨택 훈련! 눈을 마주치면 간식을 주세요.');
