import { useQuery } from '@tanstack/react-query';
import { observabilityApi } from '../../api/observability.api';
import { useAuthStore } from '../../stores/authStore';

export const observabilityKeys = {
  health: ['observability', 'health'] as const,
  metrics: ['observability', 'metrics'] as const,
};

export function useHealthCheck() {
  return useQuery({
    queryKey: observabilityKeys.health,
    queryFn: () => observabilityApi.getHealth(),
    refetchInterval: 30 * 1000, // 30s
  });
}

export function useSystemMetrics() {
  const isAdmin = useAuthStore((s) => s.isAdmin);
  return useQuery({
    queryKey: observabilityKeys.metrics,
    queryFn: () => observabilityApi.getMetrics(),
    enabled: isAdmin,
    refetchInterval: 15 * 1000, // 15s
  });
}

