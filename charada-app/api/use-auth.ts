import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  authService,
  type LoginPayload,
  type RegisterPayload,
} from '@/services/auth.service';
import { queryKeys } from '@/lib/query-client';

/** Obtiene el usuario actual (GET /auth/me). Solo ejecuta si enabled es true. */
export function useAuthMe(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: () => authService.getMe(),
    enabled: options?.enabled ?? true,
  });
}

/** Mutación de login. En éxito invalida la query del usuario actual. */
export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
    },
  });
}

/** Mutación de registro. En éxito invalida la query del usuario actual. */
export function useRegister() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: RegisterPayload) => authService.register(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
    },
  });
}

/** Mutación de logout. Limpia caché de auth tras cerrar sesión. */
export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      void queryClient.removeQueries({ queryKey: queryKeys.auth.all });
    },
  });
}
