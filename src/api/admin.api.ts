import apiClient from './client';
import type {
  ApiResponse,
  DashboardData,
  SalesAnalytics,
  TopProduct,
  CustomerAnalytics,
  RevenueBreakdown,
  ProductAnalytics,
  ConversionRate,
  Inventory,
  User,
  Pagination,
  PromoCode,
  FeaturedProduct,
  Product,
  Review,
  ActivityLogEntry,
} from '../types';

export const adminApi = {
  // Dashboard
  getDashboard: async (): Promise<DashboardData> => {
    const { data } = await apiClient.get<ApiResponse<DashboardData>>('/admin/dashboard');
    return data.data;
  },

  // Analytics
  getSalesAnalytics: async (startDate?: string, endDate?: string): Promise<SalesAnalytics> => {
    const { data } = await apiClient.get<ApiResponse<SalesAnalytics>>('/analytics/sales', {
      params: { startDate, endDate },
    });
    return data.data;
  },

  getTopProducts: async (limit?: number): Promise<TopProduct[]> => {
    const { data } = await apiClient.get<ApiResponse<TopProduct[]>>('/analytics/top-products', {
      params: { limit },
    });
    return data.data;
  },

  getCustomerAnalytics: async (): Promise<CustomerAnalytics> => {
    const { data } = await apiClient.get<ApiResponse<CustomerAnalytics>>('/analytics/customers');
    return data.data;
  },

  // Inventory
  getInventory: async (): Promise<Inventory[]> => {
    const { data } = await apiClient.get<ApiResponse<Inventory[]>>('/inventory');
    return data.data;
  },

  updateInventory: async (productId: string, payload: { stock?: number; lowStockThreshold?: number }): Promise<Inventory> => {
    const { data } = await apiClient.patch<ApiResponse<Inventory>>(`/inventory/${productId}`, payload);
    return data.data;
  },

  getLowStock: async (): Promise<Inventory[]> => {
    const { data } = await apiClient.get<ApiResponse<Inventory[]>>('/inventory/low-stock');
    return data.data;
  },

  // Users
  getUsers: async (params?: { page?: number; limit?: number }): Promise<{ users: User[]; pagination: Pagination }> => {
    const { data } = await apiClient.get<ApiResponse<{ users: User[]; pagination: Pagination }>>('/users', { params });
    return data.data;
  },

  updateUserRole: async (id: string, payload: { role?: string; isActive?: boolean }): Promise<User> => {
    const { data } = await apiClient.patch<ApiResponse<User>>(`/users/${id}/role`, payload);
    return data.data;
  },

  blockUser: async (id: string): Promise<User> => {
    const { data } = await apiClient.patch<ApiResponse<User>>(`/users/${id}/block`);
    return data.data;
  },

  // Activity log
  getActivityLog: async (params?: { page?: number; pageSize?: number; email?: string; eventType?: string }): Promise<{ logs: ActivityLogEntry[]; total: number }> => {
    const { data } = await apiClient.get<ApiResponse<{ logs: ActivityLogEntry[]; total: number }>>('/admin/activity-log', { params });
    return data.data;
  },

  // Admin setup
  checkSetup: async (): Promise<{ hasAdmin: boolean }> => {
    const { data } = await apiClient.get<ApiResponse<{ hasAdmin: boolean }>>('/admin/setup');
    return data.data;
  },

  createFirstAdmin: async (email: string, password: string): Promise<any> => {
    const { data } = await apiClient.post<ApiResponse<any>>('/admin/setup', { email, password });
    return data.data;
  },

  // Weekly summary
  sendWeeklySummary: async (): Promise<any> => {
    const { data } = await apiClient.post<ApiResponse<any>>('/admin/weekly-summary');
    return data.data;
  },

  // Reviews (admin)
  getAdminReviews: async (params?: { page?: number; limit?: number; status?: string }): Promise<{
    reviews: (Review & { product?: { name: string; images: string[] } })[];
    pagination: Pagination;
  }> => {
    const { data } = await apiClient.get<ApiResponse<any>>('/admin/reviews', { params });
    return data.data;
  },

  updateReviewStatus: async (id: string, verified: boolean): Promise<Review> => {
    const { data } = await apiClient.patch<ApiResponse<Review>>(`/admin/reviews/${id}`, { verified });
    return data.data;
  },

  // Promo codes
  getPromoCodes: async (): Promise<PromoCode[]> => {
    const { data } = await apiClient.get<ApiResponse<PromoCode[]>>('/admin/promo-codes');
    return data.data;
  },

  createPromoCode: async (payload: Omit<PromoCode, 'id' | 'usedCount' | 'createdAt' | 'updatedAt'>): Promise<PromoCode> => {
    const { data } = await apiClient.post<ApiResponse<PromoCode>>('/admin/promo-codes', payload);
    return data.data;
  },

  updatePromoCode: async (id: string, payload: Partial<PromoCode>): Promise<PromoCode> => {
    const { data } = await apiClient.patch<ApiResponse<PromoCode>>(`/admin/promo-codes/${id}`, payload);
    return data.data;
  },

  deletePromoCode: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/promo-codes/${id}`);
  },

  // Featured products (admin)
  getFeaturedProducts: async (): Promise<FeaturedProduct[]> => {
    const { data } = await apiClient.get<ApiResponse<FeaturedProduct[]>>('/admin/featured-products');
    return data.data;
  },

  addFeaturedProduct: async (productId: string, position?: number): Promise<FeaturedProduct> => {
    const { data } = await apiClient.post<ApiResponse<FeaturedProduct>>('/admin/featured-products', { productId, position });
    return data.data;
  },

  updateFeaturedProduct: async (id: string, payload: { position?: number; isActive?: boolean }): Promise<FeaturedProduct> => {
    const { data } = await apiClient.patch<ApiResponse<FeaturedProduct>>(`/admin/featured-products/${id}`, payload);
    return data.data;
  },

  removeFeaturedProduct: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/featured-products/${id}`);
  },

  // Public featured products (storefront)
  getPublicFeaturedProducts: async (): Promise<Product[]> => {
    const { data } = await apiClient.get<ApiResponse<Product[]>>('/featured-products');
    return data.data;
  },

  // Advanced analytics
  getRevenueBreakdown: async (startDate?: string, endDate?: string): Promise<RevenueBreakdown> => {
    const { data } = await apiClient.get<ApiResponse<RevenueBreakdown>>('/analytics/revenue', {
      params: { startDate, endDate },
    });
    return data.data;
  },

  getProductAnalytics: async (): Promise<ProductAnalytics> => {
    const { data } = await apiClient.get<ApiResponse<ProductAnalytics>>('/analytics/products');
    return data.data;
  },

  getConversionRate: async (): Promise<ConversionRate> => {
    const { data } = await apiClient.get<ApiResponse<ConversionRate>>('/analytics/conversion-rate');
    return data.data;
  },
};
