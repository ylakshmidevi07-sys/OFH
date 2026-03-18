// Query hooks barrel export
export { useLogin, useRegister, useLogout } from './useAuth';
export { useProducts, useProduct, useCreateProduct, useUpdateProduct, useDeleteProduct } from './useProducts';
export { useCategories, useCategory, useCreateCategory, useUpdateCategory, useDeleteCategory } from './useCategories';
export { useCart, useAddToCart, useUpdateCartItem, useRemoveCartItem, useClearCart } from './useCart';
export {
  useOrders, useOrder, useTrackOrder, useTrackOrderMutation,
  useCreateOrder, useCancelOrder, useAdminOrders, useUpdateOrderStatus,
} from './useOrders';
export { useProductReviews, useCreateReview, useDeleteReview } from './useReviews';
export {
  useDashboard,
  useSalesAnalytics,
  useTopProducts,
  useCustomerAnalytics,
  useInventory,
  useLowStock,
  useUpdateInventory,
  useAdminUsers,
  useBlockUser,
  useActivityLog,
  useUpdateUserRole,
  useInviteUsers,
  useAdminReviews,
  useUpdateReviewStatus,
  usePromoCodes,
  useCreatePromoCode,
  useUpdatePromoCode,
  useDeletePromoCode,
  useAdminFeaturedProducts,
  useFeaturedProducts,
  useAddFeaturedProduct,
  useUpdateFeaturedProduct,
  useRemoveFeaturedProduct,
  useRevenueBreakdown,
  useProductAnalytics,
  useConversionRate,
} from './useAdmin';
export {
  useAddresses, useCreateAddress, useUpdateAddress, useDeleteAddress,
  usePaymentMethods, useCreatePaymentMethod, useDeletePaymentMethod,
} from './useUsers';

// Enterprise hooks
export {
  useHomepageSections,
  usePublicHomepage,
  useCreateHomepageSection,
  useUpdateHomepageSection,
  useDeleteHomepageSection,
  useReorderHomepageSections,
} from './useHomepage';
export {
  useAdminBanners,
  usePublicBanners,
  useCreateBanner,
  useUpdateBanner,
  useDeleteBanner,
} from './useBanners';
export {
  usePricingRules,
  useCreatePricingRule,
  useUpdatePricingRule,
  useDeletePricingRule,
} from './usePricingRules';
export {
  useEmailCampaigns,
  useEmailCampaign,
  useCreateEmailCampaign,
  useUpdateEmailCampaign,
  useDeleteEmailCampaign,
  useSendEmailCampaign,
} from './useEmailCampaigns';
export {
  useStoreSettings,
  usePublicStoreSettings,
  useUpdateStoreSettings,
} from './useStoreSettings';
export {
  useHealthCheck,
  useSystemMetrics,
} from './useObservability';

