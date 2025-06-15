
-- 건강 상태 옵션 데이터 추가
INSERT INTO public.health_status_options (id, name) VALUES
(1, '건강함'),
(2, '관절 문제'),
(3, '알레르기'),
(4, '소화 문제'),
(5, '피부 질환'),
(6, '과체중'),
(7, '저체중'),
(8, '기타')
ON CONFLICT (id) DO NOTHING;

-- 훈련 목표 옵션 데이터 추가
INSERT INTO public.behavior_options (id, name) VALUES
(1, '기본 예절 훈련'),
(2, '배변 훈련'),
(3, '짖음 줄이기'),
(4, '산책 훈련'),
(5, '사회성 훈련'),
(6, '분리불안 해결'),
(7, '물어뜯기 교정'),
(8, '손 올리기/앉기'),
(9, '기다려'),
(10, '이리와')
ON CONFLICT (id) DO NOTHING;

-- RLS (Row Level Security) 활성화
ALTER TABLE public.dogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_status_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.behavior_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dog_health_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dog_desired_behaviors ENABLE ROW LEVEL SECURITY;

-- dogs 테이블 정책: 자신의 강아지 정보만 관리
CREATE POLICY "Users can view their own dogs" ON public.dogs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own dogs" ON public.dogs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own dogs" ON public.dogs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own dogs" ON public.dogs FOR DELETE USING (auth.uid() = user_id);

-- 옵션 테이블 정책: 로그인한 사용자는 옵션 조회 가능
CREATE POLICY "Authenticated users can view health status options" ON public.health_status_options FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can view behavior options" ON public.behavior_options FOR SELECT TO authenticated USING (true);

-- 연결 테이블 정책: 자신의 강아지에 대한 정보만 관리
CREATE POLICY "Users can manage health status for their own dogs" ON public.dog_health_status FOR ALL
USING ((EXISTS ( SELECT 1
   FROM dogs
  WHERE ((dogs.id = dog_health_status.dog_id) AND (dogs.user_id = auth.uid())))));

CREATE POLICY "Users can manage desired behaviors for their own dogs" ON public.dog_desired_behaviors FOR ALL
USING ((EXISTS ( SELECT 1
   FROM dogs
  WHERE ((dogs.id = dog_desired_behaviors.dog_id) AND (dogs.user_id = auth.uid())))));

