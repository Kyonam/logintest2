import { useEffect } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { AuthCard } from './AuthCard';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { isAuthenticated, clearAuthError } = useAuth();

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      onClose();
    }
  }, [isOpen, isAuthenticated, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        clearAuthError();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, clearAuthError]);

  if (!isOpen) return null;

  const handleClose = () => {
    clearAuthError();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/45 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-[420px] rounded-xl border border-stone-200/80 bg-[#fafaf9] p-7 shadow-xl sm:p-8"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleClose}
          aria-label="로그인 팝업 닫기"
          className="absolute top-4 right-4 inline-flex h-10 w-10 items-center justify-center rounded-md text-zinc-500 transition-colors duration-150 hover:bg-stone-200/70 hover:text-zinc-950 focus-visible:outline-2 focus-visible:outline-[#1f3a3d] cursor-pointer"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        <AuthCard />
      </div>
    </div>
  );
}
