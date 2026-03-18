import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Bell,
  Search,
  Moon,
  Sun,
  AlertTriangle,
  Truck,
  Tag,
  Star,
  RotateCcw,
  Boxes,
  ChevronLeft,
  Home,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import NotificationCenter from "./NotificationCenter";
import LiveActivityBanner from "./LiveActivityBanner";

interface AdminLayoutProps {
  children: ReactNode;
}

type NavItem = {
  icon: any;
  label: string;
  path: string;
  badge?: number;
  roles: ("admin" | "moderator")[];
};

const allNavItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin", roles: ["admin", "moderator"] },
  { icon: Package, label: "Products", path: "/admin/products", roles: ["admin"] },
  { icon: Boxes, label: "Inventory", path: "/admin/inventory", roles: ["admin"] },
  { icon: ShoppingCart, label: "Orders", path: "/admin/orders", badge: 3, roles: ["admin"] },
  { icon: Truck, label: "Shipping", path: "/admin/shipping", roles: ["admin"] },
  { icon: Users, label: "Customers", path: "/admin/customers", roles: ["admin"] },
  { icon: Tag, label: "Coupons", path: "/admin/coupons", roles: ["admin"] },
  { icon: Star, label: "Reviews", path: "/admin/reviews", roles: ["admin", "moderator"] },
  { icon: RotateCcw, label: "Returns", path: "/admin/returns", roles: ["admin"] },
  { icon: FileText, label: "Content", path: "/admin/content", roles: ["admin", "moderator"] },
  { icon: Bell, label: "Notifications", path: "/admin/notifications", roles: ["admin", "moderator"] },
  { icon: BarChart3, label: "Analytics", path: "/admin/analytics", roles: ["admin"] },
  { icon: Settings, label: "Settings", path: "/admin/settings", roles: ["admin"] },
];

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const roles = useAuthStore((s) => s.roles);
  const isAdmin = useAuthStore((s) => s.isAdmin);
  const userEmail = user?.email ?? null;
  const isModerator = roles.includes("moderator");
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const isMobile = useIsMobile();

  // Filter nav items based on user roles
  const navItems = allNavItems.filter((item) =>
    item.roles.some((role) => roles.includes(role))
  );

  const roleLabel = isAdmin ? "Administrator" : isModerator ? "Moderator" : "User";

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Get current page title
  const currentPage = navItems.find((item) => item.path === location.pathname);
  const pageTitle = currentPage?.label || "Admin";

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Admin panel ready */}
      {false && (
        <div className="bg-amber-500/90 text-amber-950 px-4 py-2 text-center text-xs md:text-sm font-medium flex items-center justify-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          <span>Admin Panel</span>
        </div>
      )}

      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(true)}
              className="h-9 w-9"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex flex-col">
              <span className="font-bold text-primary text-sm">OFH Admin</span>
              <span className="text-xs text-muted-foreground">{pageTitle}</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(!searchOpen)}
              className="h-9 w-9"
            >
              <Search className="h-5 w-5" />
            </Button>
            
            <NotificationCenter />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="text-xs">
                      {userEmail?.charAt(0)?.toUpperCase() || "A"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-popover z-50">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span>{userEmail || "Admin"}</span>
                    <span className="text-xs text-muted-foreground font-normal">
                      {roleLabel}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/" className="cursor-pointer">
                    <Home className="h-4 w-4 mr-2" />
                    View Store
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  {theme === "dark" ? (
                    <Sun className="h-4 w-4 mr-2" />
                  ) : (
                    <Moon className="h-4 w-4 mr-2" />
                  )}
                  {theme === "dark" ? "Light Mode" : "Dark Mode"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t overflow-hidden"
            >
              <div className="p-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    className="pl-10"
                    autoFocus
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-[280px] bg-background z-50 shadow-xl flex flex-col"
            >
              {/* Sidebar Header */}
              <div className="p-4 border-b flex items-center justify-between flex-shrink-0">
                <Link to="/admin" className="font-bold text-xl text-primary">
                  OFH Admin
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(false)}
                  className="h-9 w-9"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* User Info */}
              <div className="p-4 border-b flex-shrink-0">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>{userEmail?.charAt(0)?.toUpperCase() || "A"}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="font-semibold truncate">{userEmail || "Admin"}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {roleLabel}
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={cn(
                        "flex items-center gap-3 px-3 py-3 rounded-lg transition-all",
                        "active:scale-[0.98]",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      )}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <Badge
                          variant={isActive ? "secondary" : "default"}
                          className="h-5 min-w-5 px-1.5 flex items-center justify-center text-xs"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* Bottom Actions */}
              <div className="p-3 border-t flex-shrink-0 space-y-1">
                <Link
                  to="/"
                  className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <Home className="h-5 w-5" />
                  <span>View Store</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-muted transition-colors w-full text-left text-destructive"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside
          className={cn(
            "hidden lg:flex flex-col fixed left-0 top-0 bottom-0 bg-background border-r z-40 transition-all duration-300 overflow-hidden",
            sidebarOpen ? "w-64" : "w-20"
          )}
        >
          <div className="p-4 border-b flex items-center justify-between flex-shrink-0">
            {sidebarOpen && (
              <Link to="/admin" className="font-bold text-xl text-primary">
                OFH Admin
              </Link>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={cn(!sidebarOpen && "mx-auto")}
            >
              {sidebarOpen ? (
                <ChevronLeft className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>

          <nav className="flex-1 p-2 space-y-0.5 overflow-hidden">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors relative text-sm",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted",
                    !sidebarOpen && "justify-center"
                  )}
                  title={!sidebarOpen ? item.label : undefined}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {sidebarOpen && <span>{item.label}</span>}
                  {item.badge && sidebarOpen && (
                    <Badge
                      variant={isActive ? "secondary" : "default"}
                      className="ml-auto h-5 min-w-5 px-1.5 flex items-center justify-center text-xs"
                    >
                      {item.badge}
                    </Badge>
                  )}
                  {item.badge && !sidebarOpen && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="p-3 border-t space-y-1 flex-shrink-0">
            <Link
              to="/"
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors",
                !sidebarOpen && "justify-center"
              )}
              title={!sidebarOpen ? "View Store" : undefined}
            >
              <Home className="h-5 w-5" />
              {sidebarOpen && <span>View Store</span>}
            </Link>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className={cn(
                "w-full justify-start gap-3 text-destructive hover:text-destructive",
                !sidebarOpen && "justify-center"
              )}
            >
              <LogOut className="h-5 w-5" />
              {sidebarOpen && <span>Logout</span>}
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main
          className={cn(
            "flex-1 min-h-screen transition-all duration-300 flex flex-col",
            sidebarOpen ? "lg:ml-64" : "lg:ml-20"
          )}
        >
          {/* Desktop Top Bar */}
          <header className="hidden lg:flex sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b px-6 h-[57px] items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative max-w-md flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search products, orders, customers..." className="pl-10" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>

              <NotificationCenter />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 ml-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{userEmail?.charAt(0)?.toUpperCase() || "A"}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{userEmail || "Admin"}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-popover z-50">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span>{userEmail || "Admin"}</span>
                      <span className="text-xs text-muted-foreground">{roleLabel}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/">View Store</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/admin/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</div>
        </main>
      </div>

      {/* Live Activity Banner */}
      <LiveActivityBanner />
    </div>
  );
};

export default AdminLayout;
