import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';

const Dashboard = lazy(() => import('../pages/enterprise/admin/Dashboard'));
const ProductsManagement = lazy(() => import('../pages/enterprise/admin/ProductsManagement'));
const OrdersManagement = lazy(() => import('../pages/enterprise/admin/OrdersManagement'));
const UsersManagement = lazy(() => import('../pages/enterprise/admin/UsersManagement'));
const Analytics = lazy(() => import('../pages/enterprise/admin/Analytics'));
const InventoryManagement = lazy(() => import('../pages/enterprise/admin/InventoryManagement'));
const CategoriesManagement = lazy(() => import('../pages/enterprise/admin/CategoriesManagement'));
const ReviewsModeration = lazy(() => import('../pages/enterprise/admin/ReviewsModeration'));
const PromoCodesManagement = lazy(() => import('../pages/enterprise/admin/PromoCodesManagement'));
const FeaturedProductsManagement = lazy(() => import('../pages/enterprise/admin/FeaturedProductsManagement'));

// Enterprise modules
const HomepageEditor = lazy(() => import('../pages/enterprise/admin/HomepageEditor'));
const BannersManagement = lazy(() => import('../pages/enterprise/admin/BannersManagement'));
const PricingRulesManagement = lazy(() => import('../pages/enterprise/admin/PricingRulesManagement'));
const EmailCampaignsManagement = lazy(() => import('../pages/enterprise/admin/EmailCampaignsManagement'));
const StoreSettingsPage = lazy(() => import('../pages/enterprise/admin/StoreSettingsPage'));
const ObservabilityDashboard = lazy(() => import('../pages/enterprise/admin/ObservabilityDashboard'));

export const enterpriseAdminRoutes: RouteObject = {
  path: '/admin',
  element: <AdminLayout />,
  children: [
    { index: true, element: <Dashboard /> },
    { path: 'dashboard', element: <Dashboard /> },
    { path: 'products', element: <ProductsManagement /> },
    { path: 'categories', element: <CategoriesManagement /> },
    { path: 'orders', element: <OrdersManagement /> },
    { path: 'users', element: <UsersManagement /> },
    { path: 'inventory', element: <InventoryManagement /> },
    { path: 'reviews', element: <ReviewsModeration /> },
    { path: 'promo-codes', element: <PromoCodesManagement /> },
    { path: 'featured-products', element: <FeaturedProductsManagement /> },
    { path: 'analytics', element: <Analytics /> },

    // Enterprise routes
    { path: 'homepage', element: <HomepageEditor /> },
    { path: 'banners', element: <BannersManagement /> },
    { path: 'pricing-rules', element: <PricingRulesManagement /> },
    { path: 'email-campaigns', element: <EmailCampaignsManagement /> },
    { path: 'store-settings', element: <StoreSettingsPage /> },
    { path: 'observability', element: <ObservabilityDashboard /> },
  ],
};

