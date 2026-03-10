import { apiClient } from "@/lib/axios-client";

/**
 * Servicio de listas. Endpoints según Postman: list-play > Lists.
 * Base: /api/v1 (ya incluida en apiClient).
 */

/** Respuesta del backend para una lista (ajustar según API real). */
export interface List {
  id: number;
  bossId?: number | null;
  /** ID del usuario/listero dueño de la lista (si el backend lo devuelve). */
  userId?: number | null;
  [key: string]: unknown;
}

/** Lista con jugadas (GET /lists/boss/:bossId). */
export interface ListWithPlays extends List {
  plays?: unknown[];
}

export type ListFilterParams = {
  bossId?: number;
  userId?: number;
};

export const listsService = {
  /**
   * POST /lists – Crea una nueva lista asociada al usuario autenticado.
   * No requiere body.
   */
  async create(): Promise<List> {
    const { data } = await apiClient.post<List>("/lists");
    return data;
  },

  /**
   * GET /lists/boss/:bossId – Retorna la lista de un boss con sus jugadas.
   */
  async getByBossId(bossId: number): Promise<ListWithPlays> {
    const { data } = await apiClient.get<ListWithPlays>(
      `/lists/boss/${bossId}`,
    );
    return data;
  },

  /**
   * GET /lists?bossId=&userId= – Lista de listas filtradas (para enriquecer listeros con jugadas).
   * El backend debe soportar query params opcionales bossId y/o userId.
   */
  async listFiltered(filters: ListFilterParams): Promise<ListWithPlays[]> {
    const params: Record<string, number> = {};
    if (filters.bossId != null) params.bossId = filters.bossId;
    if (filters.userId != null) params.userId = filters.userId;
    const { data } = await apiClient.get<ListWithPlays[]>("/lists", {
      params,
    });
    return Array.isArray(data) ? data : [];
  },
};
