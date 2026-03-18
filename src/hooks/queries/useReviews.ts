import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewsApi } from '../../api/reviews.api';
import { productKeys } from './useProducts';
import type { CreateReviewPayload } from '../../types';

export const reviewKeys = {
  all: ['reviews'] as const,
  product: (productId: string) => [...reviewKeys.all, productId] as const,
};

export function useProductReviews(productId: string) {
  return useQuery({
    queryKey: reviewKeys.product(productId),
    queryFn: () => reviewsApi.getProductReviews(productId),
    enabled: !!productId,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateReviewPayload) => reviewsApi.createReview(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.product(variables.productId) });
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => reviewsApi.deleteReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.all });
    },
  });
}

