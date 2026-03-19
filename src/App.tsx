import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigationType } from "react-router-dom";
import { useEffect } from "react";
import { HelmetProvider } from "react-helmet-async";
import { AnimatePresence } from "framer-motion";
import { ThemeProvider } from "next-themes";
import { useAuthStore } from "@/stores/authStore";
import { AxiosError } from "axios";
import CartDrawer from "@/components/CartDrawer";
import WishlistDrawer from "@/components/WishlistDrawer";
import MobileLayout from "@/components/MobileLayout";
import WhatsAppFloatingButton from "@/components/WhatsAppFloatingButton";
import Index from "./pages/Index";
import Checkout from "./pages/Checkout";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Wishlist from "./pages/Wishlist";
import OrderHistory from "./pages/OrderHistory";
import OrderDetail from "./pages/OrderDetail";
import Auth from "./pages/Auth";
import Account from "./pages/Account";
import AccountOrders from "./pages/AccountOrders";
import AccountAddresses from "./pages/AccountAddresses";
import AccountPayments from "./pages/AccountPayments";
import AccountProfile from "./pages/AccountProfile";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Delivery from "./pages/Delivery";
import Returns from "./pages/Returns";
import FAQ from "./pages/FAQ";
import Farms from "./pages/Farms";
import Sustainability from "./pages/Sustainability";
import Careers from "./pages/Careers";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";
import Install from "./pages/Install";
import TrackOrder from "./pages/TrackOrder";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminSetup from "./pages/admin/AdminSetup";
import AdminForgotPassword from "./pages/admin/AdminForgotPassword";
import AdminResetPassword from "./pages/admin/AdminResetPassword";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import AdminShellLayout from "./layouts/AdminLayout";
import EnterpriseDashboard from "./pages/enterprise/admin/Dashboard";
import EnterpriseProductsManagement from "./pages/enterprise/admin/ProductsManagement";
import EnterpriseOrdersManagement from "./pages/enterprise/admin/OrdersManagement";
import EnterpriseUsersManagement from "./pages/enterprise/admin/UsersManagement";
import EnterpriseAnalytics from "./pages/enterprise/admin/Analytics";
import EnterpriseInventoryManagement from "./pages/enterprise/admin/InventoryManagement";
import EnterpriseCategoriesManagement from "./pages/enterprise/admin/CategoriesManagement";
import EnterpriseReviewsModeration from "./pages/enterprise/admin/ReviewsModeration";
import EnterprisePromoCodesManagement from "./pages/enterprise/admin/PromoCodesManagement";
import EnterpriseFeaturedProducts from "./pages/enterprise/admin/FeaturedProductsManagement";
import EnterpriseHomepageEditor from "./pages/enterprise/admin/HomepageEditor";
import EnterpriseBannersManagement from "./pages/enterprise/admin/BannersManagement";
import EnterprisePricingRules from "./pages/enterprise/admin/PricingRulesManagement";
import EnterpriseEmailCampaigns from "./pages/enterprise/admin/EmailCampaignsManagement";
import EnterpriseStoreSettings from "./pages/enterprise/admin/StoreSettingsPage";
import EnterpriseObservability from "./pages/enterprise/admin/ObservabilityDashboard";

const QUERY_RETRY_MAX = 3;
const QUERY_RETRY_BASE_DELAY_MS = 1000;

const shouldRetryQuery = (failureCount: number, error: unknown): boolean => {
  if (failureCount >= QUERY_RETRY_MAX) return false;
  if (error instanceof AxiosError && error.response) {
    const status = error.response.status;
    // Never retry client errors (4xx) — they won't resolve on their own
    if (status >= 400 && status <= 499) return false;
  }
  return true;
};

const queryRetryDelay = (attemptIndex: number): number =>
  QUERY_RETRY_BASE_DELAY_MS * Math.pow(2, attemptIndex);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60 * 1000,  // 2 min default stale time
      retry: shouldRetryQuery,
      retryDelay: queryRetryDelay,
      refetchOnWindowFocus: false,
    },
  },
});

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Index />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<OrderHistory />} />
        <Route path="/orders/:id" element={<OrderDetail />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/account" element={<Account />} />
        <Route path="/account/orders" element={<AccountOrders />} />
        <Route path="/account/orders/:orderNumber" element={<OrderDetail />} />
        <Route path="/account/addresses" element={<AccountAddresses />} />
        <Route path="/account/payments" element={<AccountPayments />} />
        <Route path="/account/profile" element={<AccountProfile />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/delivery" element={<Delivery />} />
        <Route path="/returns" element={<Returns />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/farms" element={<Farms />} />
        <Route path="/sustainability" element={<Sustainability />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/install" element={<Install />} />
        <Route path="/track" element={<TrackOrder />} />
        {/* Admin Routes */}
        <Route path="/admin/setup" element={<AdminSetup />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
        <Route path="/admin/reset-password" element={<AdminResetPassword />} />
        <Route
          path="/admin"
          element={(
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminShellLayout />
            </ProtectedRoute>
          )}
        >
          <Route index element={<EnterpriseDashboard />} />
          <Route path="dashboard" element={<EnterpriseDashboard />} />
          <Route path="products" element={<EnterpriseProductsManagement />} />
          <Route path="orders" element={<EnterpriseOrdersManagement />} />
          <Route path="users" element={<EnterpriseUsersManagement />} />
          <Route path="analytics" element={<EnterpriseAnalytics />} />
          <Route path="inventory" element={<EnterpriseInventoryManagement />} />
          <Route path="categories" element={<EnterpriseCategoriesManagement />} />
          <Route path="reviews" element={<EnterpriseReviewsModeration />} />
          <Route path="promo-codes" element={<EnterprisePromoCodesManagement />} />
          <Route path="featured-products" element={<EnterpriseFeaturedProducts />} />
          <Route path="homepage" element={<EnterpriseHomepageEditor />} />
          <Route path="banners" element={<EnterpriseBannersManagement />} />
          <Route path="pricing-rules" element={<EnterprisePricingRules />} />
          <Route path="email-campaigns" element={<EnterpriseEmailCampaigns />} />
          <Route path="store-settings" element={<EnterpriseStoreSettings />} />
          <Route path="observability" element={<EnterpriseObservability />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

// Bootstrap auth session from stored tokens on app mount
const AuthBootstrap = () => {
  const bootstrap = useAuthStore((s) => s.bootstrap);
  useEffect(() => {
    bootstrap();
  }, [bootstrap]);
  return null;
};

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthBootstrap />
            <ScrollToTop />
            <MobileLayout>
              <CartDrawer />
              <WishlistDrawer />
              <AnimatedRoutes />
              <WhatsAppFloatingButton />
            </MobileLayout>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
