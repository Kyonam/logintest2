import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

declare const __APP_URL__: string;

export interface UserProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  provider: string;
}

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isSigningIn: boolean;
  isAuthenticated: boolean;
  authError: string | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function extractProfileFromAuthUser(authUser: User): UserProfile {
  const metadata = authUser.user_metadata ?? {};
  const email = authUser.email ?? null;
  const fallbackName = email ? email.split('@')[0] : null;

  return {
    id: authUser.id,
    email,
    full_name:
      (typeof metadata.full_name === 'string' && metadata.full_name) ||
      (typeof metadata.name === 'string' && metadata.name) ||
      fallbackName,
    avatar_url:
      (typeof metadata.avatar_url === 'string' && metadata.avatar_url) ||
      (typeof metadata.picture === 'string' && metadata.picture) ||
      null,
    provider:
      (typeof authUser.app_metadata?.provider === 'string' &&
        authUser.app_metadata.provider) ||
      'google',
  };
}

async function syncUserToDatabase(authUser: User): Promise<UserProfile> {
  const fallbackProfile = extractProfileFromAuthUser(authUser);
  if (!supabase) return fallbackProfile;

  const { data, error } = await supabase
    .from('users')
    .upsert(
      {
        id: fallbackProfile.id,
        email: fallbackProfile.email,
        full_name: fallbackProfile.full_name,
        avatar_url: fallbackProfile.avatar_url,
        provider: fallbackProfile.provider,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' },
    )
    .select('id, email, full_name, avatar_url, provider')
    .single();

  if (error || !data) {
    return fallbackProfile;
  }

  return data as UserProfile;
}

function redirectToHomeIfNeeded() {
  if (typeof window === 'undefined') return;
  const hasAuthParams =
    window.location.search.includes('code=') ||
    window.location.hash.includes('access_token=');

  if (window.location.pathname !== '/' || hasAuthParams) {
    window.history.replaceState({}, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const popupWatcherRef = useRef<number | null>(null);

  const clearPopupWatcher = useCallback(() => {
    if (popupWatcherRef.current) {
      window.clearInterval(popupWatcherRef.current);
      popupWatcherRef.current = null;
    }
  }, []);

  const applySession = useCallback(async (nextSession: Session | null) => {
    setSession(nextSession);
    const nextUser = nextSession?.user ?? null;
    setUser(nextUser);

    if (nextUser) {
      setProfile(extractProfileFromAuthUser(nextUser));
      const synced = await syncUserToDatabase(nextUser);
      setProfile(synced);
    } else {
      setProfile(null);
    }
  }, []);

  useEffect(() => {
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    supabase.auth
      .getSession()
      .then(async ({ data, error }) => {
        if (!isMounted) return;
        if (error) {
          setAuthError(error.message);
        }
        await applySession(data.session ?? null);
        if (data.session) {
          redirectToHomeIfNeeded();
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (!isMounted) return;
      void applySession(nextSession).then(() => {
        if (event === 'SIGNED_IN' && nextSession) {
          setIsSigningIn(false);
          setAuthError(null);
          clearPopupWatcher();
          redirectToHomeIfNeeded();
        }
      });
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
      clearPopupWatcher();
    };
  }, [applySession, clearPopupWatcher]);

  useEffect(() => {
    const client = supabase;
    if (!client) return;

    const handleOAuthMessage = async (event: MessageEvent) => {
      const origin = event.origin;
      const isTrustedOrigin =
        origin === window.location.origin ||
        origin.endsWith('.run.app') ||
        origin.includes('localhost');

      if (!isTrustedOrigin) return;
      if (event.data?.type !== 'SUPABASE_OAUTH_CALLBACK') return;

      clearPopupWatcher();

      const { code, error, hash } = event.data as {
        code?: string | null;
        error?: string | null;
        hash?: string | null;
      };

      if (error) {
        setAuthError(error);
        setIsSigningIn(false);
        return;
      }

      try {
        if (code) {
          const { data, error: exchangeError } =
            await client.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            setAuthError(exchangeError.message);
            setIsSigningIn(false);
            return;
          }
          await applySession(data.session ?? null);
          redirectToHomeIfNeeded();
          setIsSigningIn(false);
          return;
        }

        if (hash && hash.includes('access_token=')) {
          const hashParams = new URLSearchParams(hash.replace(/^#/, ''));
          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token');

          if (accessToken && refreshToken) {
            const { data, error: setSessionError } =
              await client.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken,
              });
            if (setSessionError) {
              setAuthError(setSessionError.message);
              setIsSigningIn(false);
              return;
            }
            await applySession(data.session ?? null);
            redirectToHomeIfNeeded();
            setIsSigningIn(false);
          }
        }
      } catch (err) {
        setAuthError(
          err instanceof Error
            ? err.message
            : 'Google 로그인 처리 중 오류가 발생했습니다.',
        );
        setIsSigningIn(false);
      }
    };

    window.addEventListener('message', handleOAuthMessage);
    return () => window.removeEventListener('message', handleOAuthMessage);
  }, [applySession, clearPopupWatcher]);

  const signInWithGoogle = useCallback(async () => {
    setAuthError(null);

    if (!supabase) {
      setAuthError('Supabase 환경 변수가 설정되지 않았습니다.');
      return;
    }

    setIsSigningIn(true);
    const runtimeOrigin =
      window.location.hostname === 'localhost' && __APP_URL__
        ? __APP_URL__.replace(/\/+$/, '')
        : window.location.origin;
    const redirectTo = `${runtimeOrigin}/auth/callback`;

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        skipBrowserRedirect: true,
        queryParams: {
          access_type: 'offline',
          prompt: 'select_account',
        },
      },
    });

    if (error || !data?.url) {
      setAuthError(
        error?.message || 'Google 로그인 URL을 생성하지 못했습니다.',
      );
      setIsSigningIn(false);
      return;
    }

    const width = 520;
    const height = 640;
    const left = window.screenX + Math.max(0, (window.outerWidth - width) / 2);
    const top = window.screenY + Math.max(0, (window.outerHeight - height) / 2);

    const popup = window.open(
      data.url,
      'mono_objet_google_oauth',
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`,
    );

    if (!popup) {
      const isInIframe = window.self !== window.top;
      if (!isInIframe) {
        window.location.assign(data.url);
        return;
      }
      setAuthError(
        '브라우저에서 팝업이 차단되었습니다. 팝업 허용 후 다시 시도해 주세요.',
      );
      setIsSigningIn(false);
      return;
    }

    clearPopupWatcher();
    popupWatcherRef.current = window.setInterval(() => {
      if (popup.closed) {
        clearPopupWatcher();
        setIsSigningIn(false);
      }
    }, 500);
  }, [clearPopupWatcher]);

  const signOut = useCallback(async () => {
    setAuthError(null);
    if (!supabase) return;

    const { error } = await supabase.auth.signOut();
    if (error) {
      setAuthError(error.message);
      return;
    }
    setSession(null);
    setUser(null);
    setProfile(null);
  }, []);

  const clearAuthError = useCallback(() => {
    setAuthError(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user,
      profile,
      isLoading,
      isSigningIn,
      isAuthenticated: Boolean(user),
      authError,
      signInWithGoogle,
      signOut,
      clearAuthError,
    }),
    [
      session,
      user,
      profile,
      isLoading,
      isSigningIn,
      authError,
      signInWithGoogle,
      signOut,
      clearAuthError,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
