/**
 * Servicios de la aplicación. Todas las peticiones HTTP deben usar apiClient
 * para pasar por el interceptor (baseURL, auth, manejo de errores).
 * Endpoints según Charada-app Postman collection (ver docs/api-endpoints.md).
 */
export { apiClient } from '@/lib/axios-client';
export * from '@/services/auth.service';
export * from '@/services/lists.service';
export * from '@/services/plays.service';
