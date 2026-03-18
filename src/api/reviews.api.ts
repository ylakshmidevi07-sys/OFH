import apiClient from './client';
import type { ApiResponse, ReviewsResponse, Review, CreateReviewPayload } from '../types';

export const reviewsApi = {
  getProductReviews: async (productId: string): Promise<ReviewsResponse> => {
    const { data } = await apiClient.get<ApiResponse<ReviewsResponse>>(`/reviews/product/${productId}`);
    return data.data;
  },

  createReview: async (payload: CreateReviewPayload): Promise<Review> => {
    const { data } = await apiClient.post<ApiResponse<Review>>('/reviews', payload);
    return data.data;
  },

  updateReview: async (id: string, payload: { rating?: number; comment?: string }): Promise<Review> => {
    const { data } = await apiClient.patch<ApiResponse<Review>>(`/reviews/${id}`, payload);
    return data.data;
  },

  deleteReview: async (id: string): Promise<void> => {
    await apiClient.delete(`/reviews/${id}`);
  },
};

