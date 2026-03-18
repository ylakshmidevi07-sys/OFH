// ============================================================
// Shared TypeScript Types for the OFH E-Commerce Platform
// ============================================================

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

// --- API Response ---
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: Pagination;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// --- User ---
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
}

// --- Auth ---
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

// --- Category ---
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  children?: Category[];
  _count?: { products: number };
}

// --- Product ---
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  details: string[];
  price: number;
  compareAtPrice?: number;
  unit: string;
  images: string[];
  sku?: string;
  tags?: string[];
  isNew: boolean;
  isFeatured: boolean;
  isTrending: boolean;
  isHidden: boolean;
  isActive: boolean;
  categoryId: string;
  category?: Category;
  inventory?: Inventory;
  reviews?: Review[];
  avgRating?: number;
  reviewCount?: number;
  createdAt: string;
}

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  isNew?: boolean;
}

export interface ProductsResponse {
  products: Product[];
  pagination: Pagination;
}

// --- Inventory ---
export interface Inventory {
  id: string;
  productId: string;
  stock: number;
  reservedStock: number;
  lowStockThreshold: number;
  product?: Pick<Product, 'id' | 'name' | 'slug' | 'price' | 'images'>;
}

// --- Cart ---
export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  itemCount: number;
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  product: Product;
  quantity: number;
}

// --- Order ---
export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  user?: Pick<User, 'id' | 'email' | 'firstName' | 'lastName'>;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  shippingAddress?: Record<string, any>;
  promoCode?: string;
  estimatedDelivery?: string;
  payment?: Payment;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
  unit: string;
}

export interface CreateOrderPayload {
  shippingAddress?: Record<string, any>;
  promoCode?: string;
  paymentMethod?: string;
}

export interface OrdersResponse {
  orders: Order[];
  pagination: Pagination;
}

// --- Payment ---
export interface Payment {
  id: string;
  orderId: string;
  paymentProvider: string;
  transactionId?: string;
  paymentStatus: PaymentStatus;
  amount: number;
  createdAt: string;
}

// --- Review ---
export interface Review {
  id: string;
  productId: string;
  userId: string;
  user?: Pick<User, 'id' | 'firstName' | 'lastName'>;
  rating: number;
  comment?: string;
  verified: boolean;
  createdAt: string;
}

export interface ReviewsResponse {
  reviews: Review[];
  avgRating: number;
  totalReviews: number;
}

export interface CreateReviewPayload {
  productId: string;
  rating: number;
  comment?: string;
}

// --- Admin Dashboard ---
export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  pendingOrders: number;
  newUsersToday: number;
}

export interface DashboardData {
  stats: DashboardStats;
  recentOrders: Order[];
  lowStockItems: Inventory[];
  monthlyRevenue: MonthlyRevenue[];
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
  orders: number;
}

// --- Analytics ---
export interface SalesAnalytics {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  ordersByStatus: { status: string; count: number }[];
  dailySales: { date: string; revenue: number; orders: number }[];
}

export interface TopProduct {
  product: Pick<Product, 'id' | 'name' | 'slug' | 'images' | 'price'>;
  totalQuantitySold: number;
  totalRevenue: number;
  orderCount: number;
}

export interface CustomerAnalytics {
  totalCustomers: number;
  newCustomersThisMonth: number;
  topCustomers: {
    user: Pick<User, 'id' | 'email' | 'firstName' | 'lastName'>;
    totalSpent: number;
    orderCount: number;
  }[];
}

// --- Promo Code ---
export interface PromoCode {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue?: number | null;
  maxDiscount?: number | null;
  usageLimit?: number | null;
  usedCount: number;
  description: string;
  isActive: boolean;
  startDate: string;
  endDate?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

// --- Featured Product ---
export interface FeaturedProduct {
  id: string;
  productId: string;
  product: Product;
  position: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// --- Activity Log ---
export interface ActivityLogEntry {
  id: string;
  userId: string;
  eventType: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: string;
  user?: { email: string };
}

// ── Enterprise Types ──────────────────────────────────────────────────

// --- Homepage Section ---
export type HomepageSectionType = 'HERO' | 'FEATURED_PRODUCTS' | 'BANNER' | 'CATEGORIES' | 'NEWSLETTER' | 'CUSTOM';

export interface HomepageSection {
  id: string;
  type: HomepageSectionType;
  title?: string;
  subtitle?: string;
  position: number;
  isActive: boolean;
  config?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// --- Banner ---
export type BannerPlacement = 'HOMEPAGE' | 'CATEGORY_PAGE' | 'CHECKOUT' | 'SIDEBAR';

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  linkUrl?: string;
  placement: BannerPlacement;
  position: number;
  startDate?: string | null;
  endDate?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// --- Pricing Rule ---
export type PricingRuleType = 'PERCENTAGE' | 'FIXED' | 'TIERED';
export type PricingTargetType = 'PRODUCT' | 'CATEGORY' | 'CART';

export interface PricingRule {
  id: string;
  name: string;
  type: PricingRuleType;
  targetType: PricingTargetType;
  targetId?: string;
  productId?: string;
  product?: Pick<Product, 'id' | 'name'>;
  categoryId?: string;
  category?: Pick<Category, 'id' | 'name'>;
  value: number;
  minQuantity?: number;
  priority: number;
  startDate?: string | null;
  endDate?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// --- Email Campaign ---
export type CampaignType = 'PROMOTION' | 'ABANDONED_CART' | 'ANNOUNCEMENT';
export type CampaignStatus = 'DRAFT' | 'SCHEDULED' | 'SENDING' | 'SENT' | 'FAILED';

export interface EmailCampaign {
  id: string;
  name: string;
  type: CampaignType;
  subject?: string;
  htmlContent?: string;
  templateId?: string;
  triggerEvent?: string;
  isActive: boolean;
  status: CampaignStatus;
  scheduledAt?: string | null;
  sentAt?: string | null;
  sentCount: number;
  openCount: number;
  clickCount: number;
  createdAt: string;
  updatedAt: string;
}

// --- Store Settings ---
export interface StoreSettings {
  id: string;
  storeName: string;
  currency: string;
  taxRate: number;
  shippingBaseCost: number;
  freeShippingMin: number;
  supportEmail: string;
  supportPhone?: string;
  themeConfig?: Record<string, any>;
  metaTitle?: string;
  metaDescription?: string;
  socialLinks?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// --- Advanced Analytics ---
export interface RevenueBreakdown {
  revenueByCategory: { category: string; revenue: number }[];
  revenueByMonth: { month: string; revenue: number; orders: number }[];
  summary: {
    totalRevenue: number;
    totalTax: number;
    totalShipping: number;
    totalDiscount: number;
    averageOrderValue: number;
    totalOrders: number;
  };
}

export interface ProductAnalytics {
  totalProducts: number;
  activeProducts: number;
  hiddenProducts: number;
  outOfStockCount: number;
  productsByCategory: { category: string; count: number }[];
}

export interface ConversionRate {
  totalRegisteredUsers: number;
  activeCustomers30d: number;
  activeCarts: number;
  completedOrders30d: number;
  cancelledOrders30d: number;
  cartToOrderRate: number;
  userToCustomerRate: number;
}

// --- System Metrics ---
export interface SystemMetrics {
  timestamp: string;
  uptime: number;
  memory: {
    rss: string;
    heapUsed: string;
    heapTotal: string;
    external: string;
  };
  cpu: { user: string; system: string };
  pid: number;
  nodeVersion: string;
  throughput: {
    orders24h: number;
    inventoryRecords: number;
  };
}

export interface HealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  checks: Record<string, { status: string; latency?: number; error?: string }>;
}

