const AUTH_TOKEN_KEY = 'nnd_owner_token_v1';
const AUTH_USER_KEY = 'nnd_owner_user_v1';

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

// Authenticated fetch wrapper
export async function authFetch(url: string, options: RequestInit = {}) {
  const token = getStoredToken();
  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  headers.set('Content-Type', 'application/json');

  const response = await fetch(url, {
    ...options,
    headers
  });

  if (response.status === 401) {
    clearStoredAuth();
    window.dispatchEvent(new CustomEvent('owner-auth-invalidated'));
  }

  return response;
}
