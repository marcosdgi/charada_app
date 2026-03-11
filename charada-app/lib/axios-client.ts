import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_CONFIG, AUTH_STORAGE_KEYS } from '@/config/api';

const LOG_TAG = '[API]';

const client = axios.create({
  baseURL: API_CONFIG.BASE_URL || undefined,
  timeout: API_CONFIG.TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
  },
});

client.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await SecureStore.getItemAsync(AUTH_STORAGE_KEYS.TOKEN);
    console.log(LOG_TAG, 'token from SecureStore', {
      hasToken: !!token,
      token,
    });
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    const url = [config.baseURL, config.url].filter(Boolean).join('');
    const isAuth = /\/auth\/(login|register)/.test(config.url ?? '');
    const body = config.data
      ? isAuth
        ? '[body omitido por seguridad]'
        : config.data
      : undefined;
    console.log(LOG_TAG, '→', config.method?.toUpperCase(), url, {
      params: config.params,
      ...(body !== undefined && { body }),
    });
    return config;
  },
  (error) => Promise.reject(error)
);

client.interceptors.response.use(
  (response) => {
    const url = [response.config.baseURL, response.config.url].filter(Boolean).join('');
    console.log(LOG_TAG, '←', response.status, response.config.method?.toUpperCase(), url, {
      data: response.data,
    });
    return response;
  },
  (error: AxiosError<{ message?: string; code?: string }>) => {
    const url = error.config
      ? [error.config.baseURL, error.config.url].filter(Boolean).join('')
      : '?';
    const statusCode = error.response?.status;
    const responseData = error.response?.data;
    console.log(LOG_TAG, '← ERROR', statusCode ?? error.code, error.config?.method?.toUpperCase(), url, {
      message: error.message,
      data: responseData,
    });
    if (statusCode === 422 && responseData && typeof responseData === 'object') {
      console.log(LOG_TAG, '422 validation errors:', JSON.stringify(responseData, null, 2));
    }
    const status = error.response?.status;
    const data = error.response?.data as
      | { message?: string; errors?: Array<{ message?: string }> }
      | undefined;
    const firstErrorMsg = data?.errors?.[0]?.message;
    const message =
      firstErrorMsg ?? data?.message ?? error.message ?? 'Error de red. Intenta de nuevo.';

    if (status === 401) {
      void SecureStore.deleteItemAsync(AUTH_STORAGE_KEYS.TOKEN);
      void SecureStore.deleteItemAsync(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
    }

    const enhancedError = new Error(message) as Error & {
      status?: number;
      code?: string;
      response?: unknown;
    };
    enhancedError.status = status;
    enhancedError.code = data?.code;
    enhancedError.response = error.response;
    return Promise.reject(enhancedError);
  }
);

export { client as apiClient };
