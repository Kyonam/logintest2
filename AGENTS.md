# AGENTS.md

## Supabase 테이블 생성 및 접근 규칙

앞으로 Supabase(PostgreSQL)에서 테이블을 생성하거나 접근 권한을 구성할 때 아래 규칙을 항상 적용한다.

### 1. 명시적 GRANT SQL 문 필수 포함
- `anon` 및 `authenticated` 역할(Role)이 PostgREST API를 통해 테이블에 접근할 수 있도록 명시적인 `GRANT` SQL 문(`SELECT`, `INSERT`, `UPDATE`, `DELETE` 등)을 반드시 포함한다.
- 시퀀스(예: `SERIAL` / `BIGSERIAL`)를 사용하는 테이블이라면 필요한 `USAGE, SELECT` 시퀀스 권한도 함께 부여한다.

### 2. RLS(Row Level Security) 활성화 및 Policy 작성 필수
- 모든 새 테이블에 대해 `ALTER TABLE ... ENABLE ROW LEVEL SECURITY;`로 RLS를 반드시 활성화한다.
- 인증된 유저(`authenticated`)만 읽고 쓸 수 있도록 `SELECT`, `INSERT`, `UPDATE`, `DELETE` 정책(Policy)을 함께 작성한다. (특정 요구사항이 없는 한 `anon` 역할에는 읽기/쓰기 정책을 열어두지 않는다.)

### 기본 SQL 템플릿

```sql
-- 1. 테이블 생성
CREATE TABLE IF NOT EXISTS public.<table_name> (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 2. PostgREST API 접근을 위한 명시적 GRANT
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.<table_name> TO anon, authenticated;

-- 3. RLS 활성화
ALTER TABLE public.<table_name> ENABLE ROW LEVEL SECURITY;

-- 4. authenticated 유저만 읽기/쓰기 가능하도록 Policy 작성
CREATE POLICY "Allow authenticated read"
  ON public.<table_name>
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated insert"
  ON public.<table_name>
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update"
  ON public.<table_name>
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated delete"
  ON public.<table_name>
  FOR DELETE
  TO authenticated
  USING (true);
```
