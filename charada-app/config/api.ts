/**
 * Constantes de API. Valores leídos desde variables de entorno (EXPO_PUBLIC_*).
 * Alineado con Postman: base_url_local, base_url_prod.
 * No referenciar process.env directamente en services ni en el resto de la app.
 */

const getApiBaseUrl = (): string => {
  const explicit = process.env.EXPO_PUBLIC_API_BASE_URL;
  if (explicit != null && explicit !== '') return explicit;
  const local = process.env.EXPO_PUBLIC_API_BASE_URL_LOCAL ?? 'http://localhost:3333';
  const prod = process.env.EXPO_PUBLIC_API_BASE_URL_PROD ?? '';
  return typeof __DEV__ !== 'undefined' && __DEV__ ? local : prod;
};

const getApiTimeout = (): number => {
  const raw = process.env.EXPO_PUBLIC_API_TIMEOUT;
  if (raw == null || raw === '') return 15_000;
  const n = Number.parseInt(raw, 10);
  return Number.isNaN(n) ? 15_000 : n;
};

const getDefaultRolId = (): number => {
  const raw = process.env.EXPO_PUBLIC_DEFAULT_ROL_ID;
  if (raw == null || raw === '') return 1;
  const n = Number.parseInt(raw, 10);
  return Number.isNaN(n) ? 1 : n;
};

export const API_CONFIG = {
  BASE_URL: getApiBaseUrl(),
  TIMEOUT_MS: getApiTimeout(),
  /** id por defecto (Postman: id), p. ej. rolId en registro */
  DEFAULT_ROL_ID: getDefaultRolId(),
} as const;

/** Nombres para documentación (Postman: base_url_local, base_url_prod, id) */
export const API_ENV_NAMES = {
  LOCAL: 'base_url_local',
  PROD: 'base_url_prod',
  ID: 'id',
} as const;

export const AUTH_STORAGE_KEYS = {
  TOKEN: 'auth_token',
  REFRESH_TOKEN: 'auth_refresh_token',
} as const;
