import { useState } from "react";
import { Menu, Search, User, Heart, ShoppingBag, Sun, Moon } from "lucide-react";
import { Link } from "react-router-dom";
import logoOFH from "@/assets/logo-ofh.png";
import { Button } from "@/components/ui/button";
import { useCartFacade } from "@/hooks/useCartFacade";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useUIStore } from "@/stores/uiStore";
import { useAuthStore } from "@/stores/authStore";
import { useTheme } from "next-themes";
import SearchDialog from "@/components/SearchDialog";

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { totalItems: cartItems, setIsCartOpen } = useCartFacade();
  const wishlistItems = useWishlistStore((s) => s.items.length);
  const setIsWishlistOpen = (open: boolean) => open ? useUIStore.getState().openWishlist() : useUIStore.getState().closeWishlist();
  const openSideMenu = useUIStore((s) => s.openSideMenu);
  const user = useAuthStore((s) => s.user);
  const { theme, setTheme } = useTheme();
  
  const navLinks = [
    { name: "Shop", href: "/products" },
    { name: "About", href: "/about" },
    { name: "Farms", href: "/farms" },
    { name: "Track Order", href: "/track" },
    { name: "Contact", href: "/contact" },
  ];

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Mobile Menu Button - Left Side */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => openSideMenu()}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src={logoOFH} alt="OFH - Organic Foods House" className="h-10 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="font-body text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-300"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hidden md:flex" asChild>
              <Link to={user ? "/account" : "/auth"}>
                <User className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="relative hidden md:flex" onClick={() => setIsWishlistOpen(true)}>
              <Heart className="h-5 w-5" />
              {wishlistItems > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-semibold">
                  {wishlistItems}
                </span>
              )}
            </Button>
            <Button variant="ghost" size="icon" className="relative hidden md:flex" onClick={() => setIsCartOpen(true)}>
              <ShoppingBag className="h-5 w-5" />
              {cartItems > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-semibold">
                  {cartItems}
                </span>
              )}
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </nav>
      
      <SearchDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </header>
  );
};

export default Navbar;