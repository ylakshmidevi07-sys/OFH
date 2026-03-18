import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, ShoppingBag, Trash2, Sparkles, Bookmark, ShoppingCart, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartFacade } from "@/hooks/useCartFacade";
import { useSavedForLaterStore } from "@/stores/savedForLaterStore";
import { useNavigate } from "react-router-dom";
import { useProducts } from "@/hooks/queries/useProducts";
import { useMemo } from "react";

const CartDrawer = () => {
  const { items, isCartOpen, setIsCartOpen, updateQuantity, removeItem, addItem, totalPrice, totalItems } = useCartFacade();
  const savedItems = useSavedForLaterStore((s) => s.items);
  const saveForLater = useSavedForLaterStore((s) => s.addItem);
  const removeSavedItem = useSavedForLaterStore((s) => s.removeItem);
  const navigate = useNavigate();

  // Fetch live products for recommendations
  const { data: productsData } = useProducts({ limit: 20 });

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate("/checkout");
  };

  // Recommend products not already in cart (API-driven)
  const recommendations = useMemo(() => {
    const cartProductIds = new Set(items.map((item) => item.id));
    return (productsData?.products || [])
      .filter((p) => !cartProductIds.has(p.id))
      .slice(0, 4)
      .map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        unit: p.unit,
        image: p.images?.[0] || "/placeholder.svg",
        category: p.category?.name || "",
      }));
  }, [items, productsData]);

  const LOW_STOCK_THRESHOLD = 5;


  const handleSaveForLater = (item: typeof items[0]) => {
    removeItem(item.id);
    saveForLater({
      id: item.id,
      name: item.name,
      price: item.price,
      unit: item.unit,
      image: item.image,
      category: item.category,
    });
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  const handleMoveToCart = (item: typeof savedItems[0]) => {
    removeSavedItem(item.id);
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      unit: item.unit,
      image: item.image,
      category: item.category,
    });
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-foreground/20 backdrop-blur-sm cursor-pointer"
            onClick={() => setIsCartOpen(false)}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={{ left: 0, right: 0.5 }}
            onDragEnd={(_, info) => {
              if (info.offset.x > 100 || info.velocity.x > 500) {
                // Trigger haptic feedback on mobile devices
                if (navigator.vibrate) {
                  navigator.vibrate(10);
                }
                setIsCartOpen(false);
              }
            }}
            className="fixed right-0 top-0 z-[70] h-full w-full max-w-md bg-background shadow-2xl border-l border-border touch-pan-y"
          >
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border p-6">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="h-5 w-5 text-primary" />
                  <h2 className="font-display text-xl font-bold text-foreground">
                    Your Cart
                  </h2>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-sm font-semibold text-primary">
                    {totalItems}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsCartOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-6">
                {items.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center text-center">
                    <ShoppingBag className="h-16 w-16 text-muted-foreground/30 mb-4" />
                    <p className="font-display text-lg font-semibold text-foreground mb-2">
                      Your cart is empty
                    </p>
                    <p className="font-body text-sm text-muted-foreground">
                      Add some delicious organic products to get started!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        className="flex gap-4 rounded-xl bg-card p-4 shadow-soft"
                      >
                        <div className="relative">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-20 w-20 rounded-lg object-cover"
                          />
                        </div>
                        <div className="flex flex-1 flex-col justify-between">
                          <div>
                            <p className="font-body text-xs uppercase tracking-wider text-muted-foreground">
                              {item.category}
                            </p>
                            <h3 className="font-display font-semibold text-foreground">
                              {item.name}
                            </h3>
                            <p className="font-body text-sm text-primary font-bold">
                              ${item.price.toFixed(2)} / {item.unit}
                            </p>
                            <p className="font-body text-xs text-muted-foreground flex items-center gap-1 mt-1">
                              <Truck className="h-3 w-3" />
                              Standard delivery: 3–5 days
                            </p>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity - 1)
                                }
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center font-semibold">
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity + 1)
                                }
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                                onClick={() => handleSaveForLater(item)}
                                title="Save for later"
                              >
                                <Bookmark className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => removeItem(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Saved for Later Section */}
                {savedItems.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-border">
                    <div className="flex items-center gap-2 mb-4">
                      <Bookmark className="h-4 w-4 text-muted-foreground" />
                      <h3 className="font-display font-semibold text-foreground text-sm">
                        Saved for Later
                      </h3>
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">
                        {savedItems.length}
                      </span>
                    </div>
                    <div className="space-y-3">
                      {savedItems.map((item) => (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -100 }}
                          className="flex gap-3 rounded-lg bg-muted/50 p-3"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-14 w-14 rounded-md object-cover"
                          />
                          <div className="flex flex-1 flex-col justify-between">
                            <div>
                              <p className="font-display text-sm font-semibold text-foreground line-clamp-1">
                                {item.name}
                              </p>
                              <p className="font-body text-xs text-primary font-bold">
                                ${item.price.toFixed(2)} / {item.unit}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 text-xs"
                                onClick={() => handleMoveToCart(item)}
                              >
                                <ShoppingCart className="h-3 w-3 mr-1" />
                                Move to Cart
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => removeSavedItem(item.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations Section — API-driven */}
                {recommendations.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-border">
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <h3 className="font-display font-semibold text-foreground text-sm">
                        You might also like
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {recommendations.map((product) => (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="rounded-lg bg-card p-3 shadow-soft"
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-16 w-full rounded-md object-cover mb-2"
                          />
                          <p className="font-display text-xs font-semibold text-foreground line-clamp-1">
                            {product.name}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="font-body text-xs text-primary font-bold">
                              ${product.price.toFixed(2)}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => {
                                addItem({
                                  id: product.id,
                                  name: product.name,
                                  price: product.price,
                                  unit: product.unit,
                                  image: product.image,
                                  category: product.category,
                                });
                                if (navigator.vibrate) {
                                  navigator.vibrate(10);
                                }
                              }}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="border-t border-border p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-body text-muted-foreground">Subtotal</span>
                    <span className="font-display text-lg font-bold text-foreground">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>
                  <p className="font-body text-xs text-muted-foreground text-center">
                    Shipping and taxes calculated at checkout
                  </p>
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleCheckout}
                  >
                    Proceed to Checkout
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
