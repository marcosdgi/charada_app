/**
 * IDs de rol del backend. Usados para redirigir en /bolita/home.
 */
export const ROLE_ID = {
  SUPER_ADMIN: 1,
  BOSS: 2,
  LISTERO: 3,
} as const;

export type RoleId = (typeof ROLE_ID)[keyof typeof ROLE_ID];
