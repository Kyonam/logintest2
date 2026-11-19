-- 1. public.users 테이블 생성 (auth.users와 1:1 연동)
CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  avatar_url text,
  provider text NOT NULL DEFAULT 'google',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 2. PostgREST API 접근을 위한 명시적 GRANT (AGENTS.md 규칙 준수)
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.users TO anon, authenticated;

-- 3. RLS 활성화
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 4. authenticated 유저만 본인 행을 읽고 쓸 수 있도록 Policy 작성
DROP POLICY IF EXISTS "Allow authenticated read own user" ON public.users;
CREATE POLICY "Allow authenticated read own user"
  ON public.users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Allow authenticated insert own user" ON public.users;
CREATE POLICY "Allow authenticated insert own user"
  ON public.users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Allow authenticated update own user" ON public.users;
CREATE POLICY "Allow authenticated update own user"
  ON public.users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Allow authenticated delete own user" ON public.users;
CREATE POLICY "Allow authenticated delete own user"
  ON public.users
  FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

-- 5. auth.users 로그인/가입 시 public.users 자동 동기화 트리거 함수
CREATE OR REPLACE FUNCTION public.handle_auth_user_sync()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url, provider, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(COALESCE(NEW.email, ''), '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture'),
    COALESCE(NEW.raw_app_meta_data->>'provider', 'google'),
    now()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, public.users.full_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, public.users.avatar_url),
    provider = COALESCE(EXCLUDED.provider, public.users.provider),
    updated_at = now();

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_auth_user_sync();

DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE OF email, raw_user_meta_data ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_auth_user_sync();

-- 6. 기존 auth.users 레코드가 있다면 public.users로 백필
INSERT INTO public.users (id, email, full_name, avatar_url, provider)
SELECT
  id,
  email,
  COALESCE(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name', split_part(COALESCE(email, ''), '@', 1)),
  COALESCE(raw_user_meta_data->>'avatar_url', raw_user_meta_data->>'picture'),
  COALESCE(raw_app_meta_data->>'provider', 'google')
FROM auth.users
ON CONFLICT (id) DO NOTHING;
