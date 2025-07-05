-- 1. 'plan_type'이라는 새로운 타입을 만듭니다. (실수를 방지하기 위함)
CREATE TYPE public.plan_type AS ENUM ('free', 'pro');

-- 2. user_profiles 테이블을 생성합니다.
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan public.plan_type NOT NULL DEFAULT 'free',
  plan_expiry_date TIMESTAMPTZ,
  stripe_customer_id TEXT -- 결제 시스템 연동을 위해 미리 만들어 둡니다.
);

-- 3. 테이블에 대한 설명을 추가합니다. (선택사항이지만 권장)
COMMENT ON TABLE public.user_profiles IS 'Stores user-specific data like subscription plans.';

-- 4. 새로 생성된 테이블에 RLS(Row Level Security)를 활성화합니다. (보안 필수)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- 5. 사용자가 자신의 프로필 정보만 보고 수정할 수 있도록 정책을 만듭니다.
CREATE POLICY "Users can view and update their own profile"
ON public.user_profiles
FOR ALL
USING (auth.uid() = id);