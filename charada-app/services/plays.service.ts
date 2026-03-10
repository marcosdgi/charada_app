import { apiClient } from "@/lib/axios-client";

/**
 * Servicio de jugadas. Endpoints según Postman: list-play > Plays.
 * Base: /api/v1 (ya incluida en apiClient).
 */

/** Body para crear una jugada. typePlayId: 1=fijo, 2=corrido, 3=parle. */
export interface CreatePlayPayload {
  listId: number;
  typePlayId: number;
  fijo: number;
  corrido?: number | null;
  parle?: number | null;
  amount: number;
  date: string; // YYYY-MM-DD
  /** Nombre de la persona a la que pertenece la jugada. */
  name?: string;
}

/** Body para actualizar una jugada. */
export interface UpdatePlayPayload {
  fijo: number;
  corrido?: number | null;
  parle?: number | null;
  amount: number;
}

/** Jugada devuelta por el backend (ajustar según API real). */
export interface Play {
  id: number;
  listId: number;
  typePlayId: number;
  fijo: number;
  corrido?: number | null;
  parle?: number | null;
  amount: number;
  date: string;
  /** Nombre de la persona a la que pertenece la jugada (si el backend lo devuelve). */
  name?: string | null;
  [key: string]: unknown;
}

/** Respuesta paginada (ajustar según API real). */
export interface PaginatedPlays {
  data?: Play[];
  meta?: { current_page?: number; last_page?: number; per_page?: number };
  [key: string]: unknown;
}

export const playsService = {
  /**
   * POST /plays – Crea una jugada (fijo, corrido y/o parle según typePlayId).
   */
  async create(payload: CreatePlayPayload): Promise<Play> {
    const { data } = await apiClient.post<Play>("/plays", payload);
    return data;
  },

  /**
   * PUT /plays/:id – Actualiza una jugada por ID.
   */
  async update(id: number, payload: UpdatePlayPayload): Promise<Play> {
    const { data } = await apiClient.put<Play>(`/plays/${id}`, payload);
    return data;
  },

  /**
   * DELETE /plays/:id – Elimina una jugada por ID.
   */
  async delete(id: number): Promise<void> {
    await apiClient.delete(`/plays/${id}`);
  },

  /**
   * GET /plays/date/:date?page=... – Jugadas paginadas por fecha (YYYY-MM-DD).
   */
  async listByDate(date: string, page = 1): Promise<PaginatedPlays> {
    const { data } = await apiClient.get<PaginatedPlays>(
      `/plays/date/${date}`,
      { params: { page } },
    );
    return data;
  },

  /**
   * GET /plays/list/:listId?page=... – Jugadas paginadas por listId.
   */
  async listByListId(listId: number, page = 1): Promise<PaginatedPlays> {
    const { data } = await apiClient.get<PaginatedPlays>(
      `/plays/list/${listId}`,
      { params: { page } },
    );
    return data;
  },
};
