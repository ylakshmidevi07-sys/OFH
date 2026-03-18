import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingBag, Eye, Leaf, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartFacade } from "@/hooks/useCartFacade";
import { useWishlistStore } from "@/stores/wishlistStore";

interface Product {
  id: string | number;
  slug?: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  unit: string;
  image: string;
  category: string;
  isNew?: boolean;
}

interface ProductCardProps {
  product: Product;
  index: number;
}

const ProductCard = ({ product, index }: ProductCardProps) => {
  const { addItem, items, updateQuantity, removeItem } = useCartFacade();
  const { isInWishlist, toggleItem } = useWishlistStore();
  const normalizedId = String(product.id);
  const isWishlisted = isInWishlist(Number(product.id));

  const cartItem = items.find((item) => item.id === normalizedId);
  const quantity = cartItem?.quantity || 0;

  const handleAddToCart = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    addItem({
      id: normalizedId,
      name: product.name,
      price: product.price,
      unit: product.unit,
      image: product.image,
      category: product.category,
    });
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantity === 0) {
      handleAddToCart();
    } else {
      updateQuantity(normalizedId, quantity + 1);
    }
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantity <= 1) {
      removeItem(normalizedId);
    } else {
      updateQuantity(normalizedId, quantity - 1);
    }
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem({
      id: Number(product.id),
      name: product.name,
      price: product.price,
      unit: product.unit,
      image: product.image,
      category: product.category,
    });
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group"
    >
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-card shadow-soft">
        <img
          src={product.image}
          alt={`${product.name} - organic product`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-300" />

        {product.isNew && (
          <span className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-primary text-primary-foreground text-[10px] sm:text-xs font-semibold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full flex items-center gap-1">
            <Leaf className="h-3 w-3" />
            Fresh
          </span>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-background/80 backdrop-blur-sm hover:bg-background h-8 w-8 sm:h-10 sm:w-10"
          onClick={handleToggleWishlist}
        >
          <Heart
            className={`h-3.5 w-3.5 sm:h-4 sm:w-4 transition-colors ${
              isWishlisted ? "fill-destructive text-destructive" : "text-foreground"
            }`}
          />
        </Button>

        {/* Bottom actions: Add to Cart or Quantity Selector */}
        <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 flex gap-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <AnimatePresence mode="wait">
            {quantity === 0 ? (
              <motion.div
                key="add"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex-1"
              >
                <Button
                  variant="default"
                  className="w-full bg-primary/95 backdrop-blur-sm text-primary-foreground hover:bg-primary text-xs sm:text-sm h-8 sm:h-10"
                  onClick={handleAddToCart}
                >
                  <ShoppingBag className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Add to Cart
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="qty"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex-1 flex items-center gap-1 bg-primary/95 backdrop-blur-sm rounded-md h-8 sm:h-10 px-1"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 sm:h-8 sm:w-8 text-primary-foreground hover:bg-primary-foreground/20 shrink-0"
                  onClick={handleDecrement}
                >
                  <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
                <span className="flex-1 text-center text-primary-foreground font-bold text-xs sm:text-sm">
                  {quantity}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 sm:h-8 sm:w-8 text-primary-foreground hover:bg-primary-foreground/20 shrink-0"
                  onClick={handleIncrement}
                >
                  <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
          <Button
            variant="ghost"
            size="icon"
            className="bg-background/90 backdrop-blur-sm hover:bg-background h-8 w-8 sm:h-10 sm:w-10 shrink-0"
            asChild
          >
            <Link to={`/products/${product.slug || product.id}`}>
              <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <Link to={`/products/${product.slug || product.id}`} className="block mt-3 sm:mt-4 space-y-0.5 sm:space-y-1">
        <p className="font-body text-[10px] sm:text-xs uppercase tracking-wider text-muted-foreground font-medium">
          {product.category}
        </p>
        <h3 className="font-display text-sm sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
          {product.name}
        </h3>
        <div className="flex items-center justify-between">
          <p className="font-body text-foreground font-bold text-sm sm:text-base">
            ₹{product.price} <span className="text-muted-foreground font-normal text-xs sm:text-sm">/ {product.unit}</span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="ml-1 text-xs text-muted-foreground line-through">₹{product.compareAtPrice}</span>
            )}
          </p>
          {quantity > 0 && (
            <span className="text-[10px] sm:text-xs font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">
              {quantity} in cart
            </span>
          )}
        </div>
      </Link>
    </motion.article>
  );
};

export default ProductCard;
