const AUTH_TOKEN_KEY = 'nnd_owner_token_v1';
const AUTH_USER_KEY = 'nnd_owner_user_v1';
const CUSTOM_PWD_KEY = 'nnd_owner_custom_pwd_v1';

export const OWNER_DEFAULT_EMAIL = 'videographics27@gmail.com';
export const OWNER_DEFAULT_PWD = 'newnepaldigitalNND';

// Production API Base URL:
// - If deployed on Vercel as a fullstack app or in Cloud Run, API_BASE_URL is empty (''), using same-origin relative URLs.
// - If the frontend is hosted separately on Vercel and backend is hosted elsewhere, configure VITE_API_BASE_URL in Vercel settings.
export const API_BASE_URL = (
  (import.meta.env.VITE_API_BASE_URL as string) ||
  (import.meta.env.VITE_API_URL as string) ||
  ''
).replace(/\/$/, '');

export function getStoredOwnerPassword(): string {
  try {
    return localStorage.getItem(CUSTOM_PWD_KEY) || OWNER_DEFAULT_PWD;
  } catch {
    return OWNER_DEFAULT_PWD;
  }
}

export function setStoredOwnerPassword(newPassword: string) {
  try {
    localStorage.setItem(CUSTOM_PWD_KEY, newPassword);
  } catch (err) {
    console.error('Storage error for owner password', err);
  }
}

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY) || sessionStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStoredAuth(token: string, user: any, remember: boolean = true) {
  try {
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem(AUTH_TOKEN_KEY, token);
    storage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  } catch (err) {
    console.error('Storage error', err);
  }
}

export function clearStoredAuth() {
  try {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
    sessionStorage.removeItem(AUTH_USER_KEY);
  } catch (err) {
    console.error('Storage clear error', err);
  }
}

export function getStoredUser(): any | null {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY) || sessionStorage.getItem(AUTH_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// Build URL: Handles production API base URLs and AI Studio iframe reverse-proxy query parameters
export function buildApiUrl(path: string): string {
  try {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;

    if (API_BASE_URL) {
      return `${API_BASE_URL}${cleanPath}`;
    }

    if (typeof window === 'undefined') return cleanPath;

    const url = new URL(cleanPath, window.location.origin);
    const currentParams = new URLSearchParams(window.location.search);

    const token = currentParams.get('___aistudio_auth_token');
    const sessionIndex = currentParams.get('___session_index');
    if (token && !url.searchParams.has('___aistudio_auth_token')) {
      url.searchParams.set('___aistudio_auth_token', token);
    }
    if (sessionIndex && !url.searchParams.has('___session_index')) {
      url.searchParams.set('___session_index', sessionIndex);
    }

    return url.pathname + url.search;
  } catch {
    return path;
  }
}

// Safely parse JSON from response, preventing crashes when server returns HTML error pages
export async function safeJsonResponse(response: Response): Promise<{ ok: boolean; data: any; isHtml?: boolean }> {
  try {
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      const text = await response.text();
      return { ok: false, data: null, isHtml: text.includes('<html') || text.includes('<!DOCTYPE') };
    }
    const data = await response.json();
    return { ok: true, data };
  } catch (err) {
    return { ok: false, data: null };
  }
}

// Authenticated fetch wrapper with full CORS, credentials and error resilience
export async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getStoredToken();
  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  headers.set('Accept', 'application/json');

  const resolvedUrl = buildApiUrl(url);

  try {
    const response = await fetch(resolvedUrl, {
      credentials: 'include',
      ...options,
      headers
    });

    if (response.status === 401) {
      clearStoredAuth();
      window.dispatchEvent(new CustomEvent('owner-auth-invalidated'));
    }

    return response;
  } catch (err) {
    console.warn(`authFetch connection attempt to ${resolvedUrl} failed:`, err);
    return new Response(JSON.stringify({ error: 'Network communication interrupted. Please check backend connection.' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export interface LoginResult {
  success: boolean;
  token?: string;
  user?: any;
  mustChangePassword?: boolean;
  error?: string;
}

// Real Cryptographic Authentication Flow against Backend API (No fake/mock auth)
export async function performOwnerLogin(
  usernameOrEmail: string,
  password: string,
  rememberMe: boolean = true
): Promise<LoginResult> {
  const cleanId = String(usernameOrEmail || '').trim();
  const cleanPwd = String(password || '').trim();

  if (!cleanId || !cleanPwd) {
    return { success: false, error: 'Please enter both email/username and password.' };
  }

  const url = buildApiUrl('/api/auth/login');

  try {
    const res = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ usernameOrEmail: cleanId, password: cleanPwd })
    });

    const parsed = await safeJsonResponse(res);

    if (parsed.ok && parsed.data) {
      if (res.ok && parsed.data.success) {
        setStoredAuth(parsed.data.token, parsed.data.user, rememberMe);
        return {
          success: true,
          token: parsed.data.token,
          user: parsed.data.user,
          mustChangePassword: Boolean(parsed.data.mustChangePassword)
        };
      } else {
        // Return clear, exact authentication error from server
        return {
          success: false,
          error: parsed.data.error || 'Authentication failed. Please verify your credentials.'
        };
      }
    } else {
      if (parsed.isHtml || res.status === 404) {
        return {
          success: false,
          error: `Backend API endpoint not found (HTTP ${res.status} at ${url}). If deploying on Vercel, ensure the API routes / serverless functions are deployed.`
        };
      }
      return {
        success: false,
        error: `Server responded with status ${res.status}. Please check backend logs.`
      };
    }
  } catch (netErr: any) {
    console.error('Owner login network failure:', netErr);
    return {
      success: false,
      error: `Server connection error: Unable to reach backend at ${url}. Check your network connection or API URL configuration.`
    };
  }
}
