import * as SecureStore from 'expo-secure-store';
import { apiClient } from '@/lib/axios-client';
import { AUTH_STORAGE_KEYS, API_CONFIG } from '@/config/api';

const LOG_TAG = '[AuthService]';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
  /** Por defecto usa EXPO_PUBLIC_DEFAULT_ROL_ID (Postman: id) */
  rolId?: number;
}

export interface AuthUser {
  id: string;
  email: string;
  username?: string;
  /** 1 = super admin, 2 = boss, 3 = listero */
  roleId?: number;
  /** Solo listeros: ID del boss al que pertenecen. */
  bossId?: number | null;
}

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  user?: AuthUser;
}

/** Respuesta real del backend: token es objeto con el JWT en .token */
interface LoginApiResponse {
  user?: {
    id: number;
    username?: string;
    email: string;
    roleId?: number;
    createdAt?: string;
    updatedAt?: string;
    bossId?: number | null;
  };
  token:
    | string
    | {
        type?: string;
        token: string;
        abilities?: string[];
        expiresAt?: string | null;
      };
}

function getTokenString(raw: LoginApiResponse['token']): string | undefined {
  if (typeof raw === 'string') return raw;
  return raw?.token;
}

function normalizeUser(
  u: LoginApiResponse['user']
): AuthUser | undefined {
  if (!u) return undefined;
  return {
    id: String(u.id),
    email: u.email,
    username: u.username,
    roleId: u.roleId,
    bossId: u.bossId ?? undefined,
  };
}

export const authService = {
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const body = {
      ...payload,
      rolId: payload.rolId ?? API_CONFIG.DEFAULT_ROL_ID,
    };
    const { data } = await apiClient.post<LoginApiResponse>('/auth/register', body);
    const tokenString = getTokenString(data.token);
    const user = normalizeUser(data.user);
    if (tokenString) {
      await SecureStore.setItemAsync(AUTH_STORAGE_KEYS.TOKEN, tokenString);
    }
    return { token: tokenString ?? '', user, refreshToken: undefined };
  },

  async login(payload: LoginPayload): Promise<AuthResponse> {
    const url = `${API_CONFIG.BASE_URL}/auth/login`;
    console.log(LOG_TAG, 'login request', {
      url,
      email: payload.email,
      hasPassword: !!payload.password,
    });

    try {
      const { data } = await apiClient.post<LoginApiResponse>('/auth/login', payload);
      const tokenString = getTokenString(data.token);
      const user = normalizeUser(data.user);
      console.log(LOG_TAG, 'login success', {
        hasToken: !!tokenString,
        hasUser: !!user,
      });
      if (tokenString) {
        await SecureStore.setItemAsync(AUTH_STORAGE_KEYS.TOKEN, tokenString);
      }
      return { token: tokenString ?? '', user, refreshToken: undefined };
    } catch (err) {
      const e = err as Error & { status?: number; response?: { status?: number; data?: unknown } };
      const res = e.response;
      console.warn(LOG_TAG, 'login failed', {
        message: e.message,
        status: e.status ?? res?.status,
        responseData: res?.data,
        fullError: String(err),
      });
      throw err;
    }
  },

  async getMe(): Promise<AuthUser> {
    const { data } = await apiClient.get<LoginApiResponse['user']>('/auth/me');
    const user = normalizeUser(data);
    if (!user) throw new Error('Usuario no encontrado');
    return user;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      await SecureStore.deleteItemAsync(AUTH_STORAGE_KEYS.TOKEN);
      await SecureStore.deleteItemAsync(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
    }
  },

  async getStoredToken(): Promise<string | null> {
    return SecureStore.getItemAsync(AUTH_STORAGE_KEYS.TOKEN);
  },
};
