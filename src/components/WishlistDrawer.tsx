import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useUIStore } from "@/stores/uiStore";
import { useCartFacade } from "@/hooks/useCartFacade";

const WishlistDrawer = () => {
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const isWishlistOpen = useUIStore((s) => s.isWishlistOpen);
  const setIsWishlistOpen = (open: boolean) => open ? useUIStore.getState().openWishlist() : useUIStore.getState().closeWishlist();
  const { addItem: addToCart } = useCartFacade();

  const handleMoveToCart = (item: typeof items[0]) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      unit: item.unit,
      image: item.image,
      category: item.category,
    });
    removeItem(item.id);
  };

  return (
    <Sheet open={isWishlistOpen} onOpenChange={setIsWishlistOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader className="border-b border-border pb-4">
          <SheetTitle className="flex items-center gap-2 font-display text-xl">
            <Heart className="h-5 w-5 text-primary" />
            Your Wishlist
            <span className="ml-auto text-sm font-normal text-muted-foreground">
              {items.length} {items.length === 1 ? "item" : "items"}
            </span>
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
              <Heart className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="font-display text-lg font-semibold text-foreground mb-2">
              Your wishlist is empty
            </h3>
            <p className="font-body text-sm text-muted-foreground mb-6">
              Save items you love by clicking the heart icon on any product.
            </p>
            <Button asChild onClick={() => setIsWishlistOpen(false)}>
              <Link to="/products">Browse Products</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4">
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex gap-4 py-4 border-b border-border last:border-0"
                  >
                    <Link
                      to={`/products/${item.id}`}
                      onClick={() => setIsWishlistOpen(false)}
                      className="w-20 h-20 rounded-xl overflow-hidden bg-muted flex-shrink-0"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/products/${item.id}`}
                        onClick={() => setIsWishlistOpen(false)}
                      >
                        <p className="font-body text-xs uppercase tracking-wider text-muted-foreground">
                          {item.category}
                        </p>
                        <h4 className="font-display font-semibold text-foreground truncate hover:text-primary transition-colors">
                          {item.name}
                        </h4>
                      </Link>
                      <p className="font-body text-sm font-bold text-foreground mt-1">
                        ${item.price.toFixed(2)}
                        <span className="text-muted-foreground font-normal">
                          {" "}
                          / {item.unit}
                        </span>
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 text-xs"
                          onClick={() => handleMoveToCart(item)}
                        >
                          <ShoppingBag className="h-3 w-3 mr-1" />
                          Add to Cart
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="border-t border-border pt-4 space-y-3">
              <Button
                variant="outline"
                className="w-full"
                onClick={clearWishlist}
              >
                Clear Wishlist
              </Button>
              <Button
                className="w-full"
                asChild
                onClick={() => setIsWishlistOpen(false)}
              >
                <Link to="/wishlist">View Full Wishlist</Link>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default WishlistDrawer;
