import { useEffect, useRef, useState } from 'react';
import { LogOut, ShoppingBag } from 'lucide-react';
import type { ProductCategory } from '../data/products';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenAuth: () => void;
  onNavigateCategory: (category: ProductCategory) => void;
}

export function Header({
  cartCount,
  onOpenCart,
  onOpenAuth,
  onNavigateCategory,
}: HeaderProps) {
  const { isAuthenticated, isLoading, profile, user, signOut } = useAuth();
  const [avatarFailed, setAvatarFailed] = useState(false);
  const [isPopoverPinned, setIsPopoverPinned] = useState(false);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  const avatarUrl = profile?.avatar_url ?? null;
  const displayName =
    profile?.full_name || user?.email?.split('@')[0] || '회원';
  const email = profile?.email || user?.email || '';
  const initial = displayName.trim().charAt(0).toUpperCase() || 'M';

  useEffect(() => {
    setAvatarFailed(false);
  }, [avatarUrl]);

  useEffect(() => {
    if (!isPopoverPinned) return;
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setIsPopoverPinned(false);
      }
    };
    window.addEventListener('mousedown', handleOutsideClick);
    return () => window.removeEventListener('mousedown', handleOutsideClick);
  }, [isPopoverPinned]);

  const handleSignOut = async () => {
    setIsPopoverPinned(false);
    await signOut();
  };

  return (
    <header className="sticky top-0 z-30 border-b border-stone-200/90 bg-[#fafaf9]/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        <a
          href="#top"
          className="font-display text-lg font-semibold tracking-tight text-zinc-900 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1f3a3d]"
        >
          모노 오브제
        </a>

        <nav
          aria-label="주요 메뉴"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-zinc-600"
        >
          <a
            href="#collection"
            onClick={() => onNavigateCategory('전체')}
            className="py-1 whitespace-nowrap shrink-0 transition-colors duration-150 hover:text-zinc-950 hover:underline hover:underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1f3a3d]"
          >
            전체 컬렉션
          </a>
          <a
            href="#collection"
            onClick={() => onNavigateCategory('테이블웨어')}
            className="py-1 whitespace-nowrap shrink-0 transition-colors duration-150 hover:text-zinc-950 hover:underline hover:underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1f3a3d]"
          >
            테이블웨어
          </a>
          <a
            href="#collection"
            onClick={() => onNavigateCategory('조명')}
            className="py-1 whitespace-nowrap shrink-0 transition-colors duration-150 hover:text-zinc-950 hover:underline hover:underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1f3a3d]"
          >
            조명
          </a>
          <a
            href="#story"
            className="py-1 whitespace-nowrap shrink-0 transition-colors duration-150 hover:text-zinc-950 hover:underline hover:underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1f3a3d]"
          >
            브랜드 소개
          </a>
        </nav>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onOpenCart}
            className="inline-flex min-h-[40px] items-center gap-2 rounded-md bg-[#1f3a3d] px-4 py-2 text-sm font-medium text-white whitespace-nowrap shrink-0 transition-colors duration-150 hover:bg-[#162b2d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f3a3d] cursor-pointer"
          >
            <ShoppingBag className="h-4 w-4 stroke-[1.75]" aria-hidden="true" />
            <span>장바구니</span>
            <span className="tabular-nums text-stone-200">({cartCount})</span>
          </button>

          {isAuthenticated ? (
            <div ref={popoverRef} className="group relative">
              <button
                type="button"
                onClick={() => setIsPopoverPinned((prev) => !prev)}
                aria-label={`${displayName} 프로필 메뉴`}
                aria-haspopup="menu"
                aria-expanded={isPopoverPinned}
                className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-stone-300 bg-white transition-colors duration-150 hover:border-[#1f3a3d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f3a3d] cursor-pointer"
              >
                {avatarUrl && !avatarFailed ? (
                  <img
                    src={avatarUrl}
                    alt={`${displayName} 프로필 사진`}
                    referrerPolicy="no-referrer"
                    onError={() => setAvatarFailed(true)}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center bg-[#1f3a3d] text-xs font-semibold text-white">
                    {initial}
                  </span>
                )}
              </button>

              <div
                role="menu"
                className={`absolute right-0 top-full z-40 pt-2 transition-all duration-150 ${
                  isPopoverPinned
                    ? 'pointer-events-auto visible translate-y-0 opacity-100'
                    : 'pointer-events-none invisible translate-y-1 opacity-0 group-hover:pointer-events-auto group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100'
                }`}
              >
                <div className="w-56 rounded-lg border border-stone-200 bg-white p-3 shadow-lg">
                  <div className="px-1.5 py-1">
                    <p className="truncate text-sm font-semibold text-zinc-900">
                      {displayName}
                    </p>
                    {email && (
                      <p className="mt-0.5 truncate text-xs text-zinc-500">
                        {email}
                      </p>
                    )}
                  </div>

                  <div className="my-2 border-t border-stone-200" />

                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => void handleSignOut()}
                    className="flex min-h-[38px] w-full items-center gap-2 rounded-md px-2 py-2 text-xs font-medium text-zinc-700 whitespace-nowrap transition-colors duration-150 hover:bg-stone-100 hover:text-zinc-950 focus-visible:outline-2 focus-visible:outline-[#1f3a3d] cursor-pointer"
                  >
                    <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button
              type="button"
              disabled={isLoading}
              onClick={(event) => {
                event.preventDefault();
                onOpenAuth();
              }}
              className="inline-flex min-h-[40px] items-center rounded-md border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-zinc-800 whitespace-nowrap shrink-0 transition-colors duration-150 hover:border-zinc-900 hover:text-zinc-950 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f3a3d] cursor-pointer"
            >
              로그인
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
