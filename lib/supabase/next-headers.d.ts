declare module 'next/headers' {
  export interface ResponseCookie {
    name: string;
    value: string;
    domain?: string;
    expires?: Date | number;
    httpOnly?: boolean;
    maxAge?: number;
    path?: string;
    sameSite?: boolean | 'lax' | 'strict' | 'none';
    secure?: boolean;
  }

  export interface RequestCookie {
    name: string;
    value: string;
  }

  export interface CookieStore {
    getAll(): RequestCookie[];
    set(
      name: string,
      value: string,
      options?: Partial<Omit<ResponseCookie, 'name' | 'value'>>,
    ): void;
  }

  export function cookies(): Promise<CookieStore>;
}
