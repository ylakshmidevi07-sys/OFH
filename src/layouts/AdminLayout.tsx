import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Boxes,
  LogOut,
  ChevronLeft,
  FolderTree,
  Star,
  Tag,
  Sparkles,
  LayoutTemplate,
  Image,
  DollarSign,
  Mail,
  Settings,
  Activity,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';

const navSections = [
  {
    label: '',
    items: [
      { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Store',
    items: [
      { path: '/admin/products', label: 'Products', icon: Package },
      { path: '/admin/categories', label: 'Categories', icon: FolderTree },
      { path: '/admin/orders', label: 'Orders', icon: ShoppingCart },
      { path: '/admin/inventory', label: 'Inventory', icon: Boxes },
    ],
  },
  {
    label: 'Merchandising',
    items: [
      { path: '/admin/featured-products', label: 'Featured', icon: Sparkles },
      { path: '/admin/promo-codes', label: 'Promo Codes', icon: Tag },
      { path: '/admin/pricing-rules', label: 'Pricing Rules', icon: DollarSign },
      { path: '/admin/banners', label: 'Banners', icon: Image },
    ],
  },
  {
    label: 'Content',
    items: [
      { path: '/admin/homepage', label: 'Homepage', icon: LayoutTemplate },
      { path: '/admin/reviews', label: 'Reviews', icon: Star },
      { path: '/admin/email-campaigns', label: 'Campaigns', icon: Mail },
    ],
  },
  {
    label: 'Platform',
    items: [
      { path: '/admin/users', label: 'Users', icon: Users },
      { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
      { path: '/admin/store-settings', label: 'Settings', icon: Settings },
      { path: '/admin/observability', label: 'System', icon: Activity },
    ],
  },
];

const SidebarContent = ({ onNavigate }: { onNavigate?: () => void }) => {
  const location = useLocation();

  return (
    <>
      {navSections.map((section, sIdx) => (
        <div key={sIdx} className={section.label ? 'mt-4' : ''}>
          {section.label && (
            <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
              {section.label}
            </p>
          )}
          <div className="space-y-0.5">
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onNavigate}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </>
  );
};

const AdminLayout = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuthStore();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="hidden w-60 flex-col border-r bg-white shadow-sm md:flex">
        <div className="flex h-14 items-center gap-2 border-b px-5">
          <Link to="/" className="flex items-center gap-2 text-primary hover:opacity-80">
            <ChevronLeft className="h-4 w-4" />
            <span className="text-sm">Back to Store</span>
          </Link>
        </div>

        <div className="px-5 py-3">
          <h2 className="font-display text-base font-bold text-gray-800">Admin Panel</h2>
          <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 pb-3">
          <SidebarContent />
        </nav>

        <div className="border-t p-3">
          <button
            onClick={() => logout()}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-xl transition-transform duration-200 md:hidden ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-14 items-center justify-between border-b px-5">
          <h2 className="font-display text-base font-bold text-gray-800">Admin</h2>
          <button onClick={() => setMobileMenuOpen(false)} className="p-1">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-2" style={{ maxHeight: 'calc(100vh - 112px)' }}>
          <SidebarContent onNavigate={() => setMobileMenuOpen(false)} />
        </nav>
        <div className="border-t p-3">
          <button
            onClick={() => logout()}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar for mobile */}
        <header className="flex h-14 items-center justify-between border-b bg-white px-4 md:hidden">
          <button onClick={() => setMobileMenuOpen(true)} className="p-1.5 rounded-lg hover:bg-gray-100">
            <Menu className="h-5 w-5" />
          </button>
          <h2 className="font-display font-bold text-sm">Admin Panel</h2>
          <Link to="/" className="text-xs text-primary">
            Store
          </Link>
        </header>

        {/* Top bar for desktop */}
        <header className="hidden md:flex h-14 items-center justify-between border-b bg-white px-6">
          <h2 className="font-display text-sm font-semibold text-gray-700">
            {navSections
              .flatMap((s) => s.items)
              .find((item) => item.path === location.pathname)?.label || 'Admin Panel'}
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground">{user?.email}</span>
            <Link to="/" className="text-xs text-primary hover:underline">
              Back to Store
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

