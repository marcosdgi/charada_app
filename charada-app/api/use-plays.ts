import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  playsService,
  type CreatePlayPayload,
  type UpdatePlayPayload,
} from '@/services/plays.service';
import { queryKeys } from '@/lib/query-client';

/** Jugadas paginadas por fecha (GET /plays/date/:date). */
export function usePlaysByDate(
  date: string,
  page = 1,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: queryKeys.plays.byDate(date, page),
    queryFn: () => playsService.listByDate(date, page),
    enabled: (options?.enabled ?? true) && !!date,
  });
}

/** Jugadas paginadas por lista (GET /plays/list/:listId). */
export function usePlaysByListId(
  listId: number | undefined,
  page = 1,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: queryKeys.plays.byList(listId ?? 0, page),
    queryFn: () => playsService.listByListId(listId!, page),
    enabled: (options?.enabled ?? true) && typeof listId === 'number',
  });
}

/** Mutación para crear jugada (POST /plays). Invalida plays y listas. */
export function useCreatePlay() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePlayPayload) => playsService.create(payload),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.plays.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.lists.all });
    },
  });
}

/** Mutación para actualizar jugada (PUT /plays/:id). */
export function useUpdatePlay() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: { id: number; payload: UpdatePlayPayload }) =>
      playsService.update(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.plays.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.lists.all });
    },
  });
}

/** Mutación para eliminar jugada (DELETE /plays/:id). */
export function useDeletePlay() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => playsService.delete(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.plays.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.lists.all });
    },
  });
}
