import { Link, useLocation } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Home,
  ShoppingBag,
  Heart,
  User,
  Leaf,
  Phone,
  Info,
  Package,
  Download,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileSideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileSideMenu = ({ isOpen, onClose }: MobileSideMenuProps) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const mainNavItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Package, label: "Shop All", path: "/products" },
    { icon: Heart, label: "Wishlist", path: "/wishlist" },
    { icon: ShoppingBag, label: "Checkout", path: "/checkout" },
  ];

  const categories = [
    { label: "Fruits", href: "/products?category=Fruits" },
    { label: "Vegetables", href: "/products?category=Vegetables" },
    { label: "Dairy", href: "/products?category=Dairy" },
    { label: "Pantry", href: "/products?category=Pantry" },
  ];

  const secondaryNavItems = [
    { icon: Info, label: "About Us", href: "/about" },
    { icon: Phone, label: "Contact", href: "/contact" },
    { icon: User, label: "Account", href: "/account" },
    { icon: Download, label: "Install App", href: "/install" },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-[300px] p-0 bg-background">
        <SheetHeader className="p-6 pb-4">
          <div className="flex items-center justify-between">
            <Link to="/" onClick={onClose} className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <Leaf className="h-5 w-5 text-primary-foreground" />
              </div>
              <SheetTitle className="font-display text-xl font-bold text-foreground">
                OFH
              </SheetTitle>
            </Link>
          </div>
        </SheetHeader>

        <div className="px-4 pb-6 space-y-6 overflow-y-auto max-h-[calc(100vh-100px)]">
          {/* Main Navigation */}
          <div className="space-y-1">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors",
                    isActive(item.path)
                      ? "bg-primary/10 text-primary"
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-body font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>

          <Separator />

          {/* Categories */}
          <div>
            <h3 className="px-4 font-display text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Categories
            </h3>
            <div className="space-y-1">
              {categories.map((cat) => (
                <Link
                  key={cat.label}
                  to={cat.href}
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-foreground hover:bg-muted transition-colors"
                >
                  <span className="font-body">{cat.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <Separator />

          {/* Secondary Navigation */}
          <div className="space-y-1">
            {secondaryNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-body">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Promo Banner */}
          <div className="mx-2 p-4 rounded-2xl bg-primary/10 border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <Leaf className="h-5 w-5 text-primary" />
              <span className="font-display font-semibold text-foreground">
                Free Shipping
              </span>
            </div>
            <p className="font-body text-sm text-muted-foreground">
              On orders over $50. Shop now and save!
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSideMenu;
