import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { listsService, type ListFilterParams } from '@/services/lists.service';
import { queryKeys } from '@/lib/query-client';
import type { ListWithPlays } from '@/services/lists.service';

/** Lista de un boss con jugadas (GET /lists/boss/:bossId). 404 = no hay lista (retorna null). */
export function useListByBossId(
  bossId: number | undefined,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: queryKeys.lists.byBoss(bossId ?? 0),
    queryFn: async (): Promise<ListWithPlays | null> => {
      try {
        return await listsService.getByBossId(bossId!);
      } catch (err: unknown) {
        const status = (err as { status?: number })?.status;
        if (status === 404) return null;
        throw err;
      }
    },
    enabled: (options?.enabled ?? true) && typeof bossId === 'number',
  });
}

/** Listas filtradas (GET /lists?bossId=&userId=) para enriquecer listeros con jugadas. */
export function useListsFiltered(
  filters: ListFilterParams,
  options?: { enabled?: boolean }
) {
  const hasFilter = filters.bossId != null || filters.userId != null;
  return useQuery({
    queryKey: queryKeys.lists.filtered(filters),
    queryFn: () => listsService.listFiltered(filters),
    enabled: (options?.enabled ?? true) && hasFilter,
  });
}

/** Mutación para crear lista (POST /lists). Invalida listas del boss actual. */
export function useCreateList(options?: { onSuccess?: (listId: number) => void }) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => listsService.create(),
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.lists.all });
      options?.onSuccess?.(data.id);
    },
  });
}
