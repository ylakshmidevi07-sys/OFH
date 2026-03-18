import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pricingRulesApi } from '../../api/pricing-rules.api';
import { useAuthStore } from '../../stores/authStore';
import type { PricingRule } from '../../types';

export const pricingRuleKeys = {
  all: ['pricingRules'] as const,
};

export function usePricingRules() {
  const isAdmin = useAuthStore((s) => s.isAdmin);
  return useQuery({
    queryKey: pricingRuleKeys.all,
    queryFn: () => pricingRulesApi.getRules(),
    enabled: isAdmin,
  });
}

export function useCreatePricingRule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<PricingRule>) => pricingRulesApi.createRule(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pricingRuleKeys.all });
    },
  });
}

export function useUpdatePricingRule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & Partial<PricingRule>) =>
      pricingRulesApi.updateRule(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pricingRuleKeys.all });
    },
  });
}

export function useDeletePricingRule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => pricingRulesApi.deleteRule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pricingRuleKeys.all });
    },
  });
}

