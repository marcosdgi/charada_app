import { apiClient } from "@/lib/axios-client";
import type { Play } from "@/services/plays.service";

export interface Employee {
  id: number;
  username?: string | null;
  email?: string;
  roleId?: number;
  // El backend devuelve las listas del listero; cada una puede traer sus jugadas.
  lists?: { id: number; plays?: Play[] }[];
}

export const employeesService = {
  /**
   * GET /auth/employees/:bossId – Devuelve los empleados (listeros) de un boss.
   */
  async listByBossId(bossId: number): Promise<Employee[]> {
    const { data } = await apiClient.get<Employee[]>(`/auth/employees/${bossId}`);
    return data;
  },
};

