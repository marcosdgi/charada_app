import { useQuery } from '@tanstack/react-query';
import { employeesService, type Employee } from '@/services/employees.service';
import { queryKeys } from '@/lib/query-client';

export function useEmployeesByBossId(
  bossId: number | undefined,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: queryKeys.employees.byBoss(bossId ?? 0),
    queryFn: (): Promise<Employee[]> => employeesService.listByBossId(bossId!),
    enabled: (options?.enabled ?? true) && typeof bossId === 'number',
  });
}

