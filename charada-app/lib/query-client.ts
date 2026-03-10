import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
    },
  },
});

/** Query keys centralizados para invalidaciones */
export const queryKeys = {
  auth: {
    all: ['auth'] as const,
    me: () => [...queryKeys.auth.all, 'me'] as const,
  },
  lists: {
    all: ['lists'] as const,
    byBoss: (bossId: number) => [...queryKeys.lists.all, 'boss', bossId] as const,
    filtered: (params: { bossId?: number; userId?: number }) =>
      [...queryKeys.lists.all, 'filtered', params] as const,
  },
  employees: {
    all: ['employees'] as const,
    byBoss: (bossId: number) =>
      [...queryKeys.employees.all, 'boss', bossId] as const,
  },
  plays: {
    all: ['plays'] as const,
    byDate: (date: string, page: number) =>
      [...queryKeys.plays.all, 'date', date, page] as const,
    byList: (listId: number, page: number) =>
      [...queryKeys.plays.all, 'list', listId, page] as const,
  },
} as const;
