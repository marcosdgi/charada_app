/**
 * Declaración de variables de entorno disponibles en la app.
 * Alineado con variables de Postman: base_url_local, base_url_prod.
 */
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_APP_NAME?: string;
      EXPO_PUBLIC_APP_VERSION?: string;
      /** Base URL API (usa LOCAL o PROD según NODE_ENV/__DEV__ si no está definida) */
      EXPO_PUBLIC_API_BASE_URL?: string;
      /** Local: p. ej. http://localhost:3333 */
      EXPO_PUBLIC_API_BASE_URL_LOCAL?: string;
      /** Producción: valor a rellenar en cada entorno */
      EXPO_PUBLIC_API_BASE_URL_PROD?: string;
      EXPO_PUBLIC_API_TIMEOUT?: string;
      /** id (p. ej. rolId por defecto, Postman: id) */
      EXPO_PUBLIC_DEFAULT_ROL_ID?: string;
    }
  }
}

export {};
