import { useAuth } from '../contexts/AuthContext';

function GoogleIcon() {
  return (
    <svg
      className="h-[18px] w-[18px] shrink-0"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.54 5.54 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.54-5.17 3.54-8.87z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.94-2.91l-3.88-3c-1.08.72-2.45 1.16-4.06 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.09A12 12 0 0 0 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.29A7.2 7.2 0 0 1 4.9 12c0-.8.14-1.57.38-2.29V6.62H1.29A12 12 0 0 0 0 12c0 1.94.46 3.77 1.29 5.38l3.99-3.09z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.29 6.62l3.99 3.09C6.23 6.86 8.88 4.75 12 4.75z"
      />
    </svg>
  );
}

export function AuthCard() {
  const { signInWithGoogle, isSigningIn, authError } = useAuth();

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
        <span>모노 오브제</span>
        <span aria-hidden="true">·</span>
        <span>간편 로그인</span>
      </div>

      <h2
        id="auth-modal-title"
        className="font-display mt-3 text-2xl font-medium tracking-tight text-zinc-950"
        style={{ textWrap: 'balance' }}
      >
        Google 계정으로 시작하기
      </h2>

      <p className="mt-2.5 text-sm leading-relaxed text-zinc-600">
        별도의 회원가입 절차 없이 Google 계정 하나로 바로 로그인하고,
        장바구니와 주문 내역을 간편하게 확인하실 수 있습니다.
      </p>

      <div className="mt-7 border-t border-stone-200 pt-7">
        <button
          type="button"
          disabled={isSigningIn}
          onClick={() => void signInWithGoogle()}
          className="inline-flex min-h-[48px] w-full items-center justify-center gap-3 rounded-md border border-stone-300 bg-white px-5 py-3 text-sm font-medium text-zinc-900 whitespace-nowrap transition-colors duration-150 hover:border-[#1f3a3d] hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f3a3d] cursor-pointer"
        >
          <GoogleIcon />
          <span>{isSigningIn ? 'Google로 연결 중...' : 'Google로 계속하기'}</span>
        </button>

        {authError && (
          <p
            role="alert"
            className="mt-3 text-center text-xs font-medium text-red-700"
          >
            {authError}
          </p>
        )}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs text-zinc-500">
        <span>주문 및 배송 조회</span>
        <span aria-hidden="true">·</span>
        <span>장바구니 자동 보관</span>
        <span aria-hidden="true">·</span>
        <span>간편 재주문</span>
      </div>

      <p className="mt-5 text-center text-[11px] leading-relaxed text-zinc-400">
        계속 진행하시면 모노 오브제의 이용약관 및 개인정보처리방침에 동의하게
        됩니다.
      </p>
    </div>
  );
}
