import { Home, ShoppingCart, Heart, ShoppingBag } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useCartFacade } from "@/hooks/useCartFacade";
import { useWishlistStore } from "@/stores/wishlistStore";
import { cn } from "@/lib/utils";

const MobileBottomNav = () => {
  const location = useLocation();
  const { totalItems, setIsCartOpen } = useCartFacade();
  const wishlistItems = useWishlistStore((s) => s.items.length);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: ShoppingCart, label: "Products", path: "/products" },
    { icon: Heart, label: "Wishlist", path: "/wishlist", badge: wishlistItems },
    { icon: ShoppingBag, label: "Cart", action: () => setIsCartOpen(true), badge: totalItems },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isCurrentActive = item.path ? isActive(item.path) : false;

          if (item.action) {
            return (
              <button
                key={item.label}
                onClick={item.action}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 flex-1 h-full relative transition-colors",
                  "text-muted-foreground hover:text-primary"
                )}
              >
                <div className="relative">
                  <Icon className="h-5 w-5" />
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-semibold">
                      {item.badge > 9 ? "9+" : item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          }

          return (
            <Link
              key={item.label}
              to={item.path!}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 h-full relative transition-colors",
                isCurrentActive ? "text-primary" : "text-muted-foreground hover:text-primary"
              )}
            >
              <div className="relative">
                <Icon className="h-5 w-5" />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-semibold">
                    {item.badge > 9 ? "9+" : item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
              {isCurrentActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
