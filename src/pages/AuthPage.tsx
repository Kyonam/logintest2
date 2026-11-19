import { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { AuthCard } from '../components/AuthCard';

interface AuthPageProps {
  onNavigateHome: () => void;
}

export function AuthPage({ onNavigateHome }: AuthPageProps) {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      onNavigateHome();
    }
  }, [isAuthenticated, onNavigateHome]);

  return (
    <div className="flex min-h-screen flex-col bg-[#fafaf9] text-zinc-900">
      <header className="border-b border-stone-200/90 bg-[#fafaf9]">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
          <a
            href="/"
            onClick={(event) => {
              event.preventDefault();
              onNavigateHome();
            }}
            className="font-display text-lg font-semibold tracking-tight text-zinc-900 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1f3a3d]"
          >
            모노 오브제
          </a>

          <a
            href="/"
            onClick={(event) => {
              event.preventDefault();
              onNavigateHome();
            }}
            className="inline-flex min-h-[40px] items-center gap-1.5 text-sm font-medium text-zinc-600 whitespace-nowrap shrink-0 transition-colors duration-150 hover:text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1f3a3d]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>스토어로 돌아가기</span>
          </a>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-16 sm:px-6">
        <div className="w-full max-w-[420px] rounded-xl border border-stone-200 bg-white p-7 sm:p-9">
          <AuthCard />
        </div>
      </main>
    </div>
  );
}
