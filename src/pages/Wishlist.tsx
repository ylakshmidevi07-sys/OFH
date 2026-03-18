import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useCartFacade } from "@/hooks/useCartFacade";

const Wishlist = () => {
  const { items, removeItem, clearWishlist } = useWishlistStore();
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

  const handleMoveAllToCart = () => {
    items.forEach((item) => {
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        unit: item.unit,
        image: item.image,
        category: item.category,
      });
    });
    clearWishlist();
  };

  return (
    <PageTransition>
      <Helmet>
        <title>My Wishlist | OFH - The Organic Foods House</title>
        <meta
          name="description"
          content="View and manage your saved products. Add items to your cart or continue browsing our organic selection."
        />
      </Helmet>

      <Navbar />

      <main className="min-h-screen bg-background pt-24 pb-24 md:pb-16">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
              <Heart className="h-8 w-8 text-primary" />
              My Wishlist
            </h1>
            <p className="font-body text-muted-foreground">
              {items.length} {items.length === 1 ? "item" : "items"} saved
            </p>
          </motion.div>

          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                <Heart className="h-12 w-12 text-muted-foreground" />
              </div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-3">
                Your wishlist is empty
              </h2>
              <p className="font-body text-muted-foreground mb-8 max-w-md mx-auto">
                Start adding products you love by clicking the heart icon on any product.
                Your saved items will appear here.
              </p>
              <Button size="lg" asChild>
                <Link to="/products">
                  Browse Products
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
            </motion.div>
          ) : (
            <>
              {/* Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-wrap gap-4 mb-8"
              >
                <Button onClick={handleMoveAllToCart}>
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Add All to Cart
                </Button>
                <Button variant="outline" onClick={clearWishlist}>
                  Clear Wishlist
                </Button>
              </motion.div>

              {/* Wishlist Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-card rounded-2xl overflow-hidden shadow-soft group"
                  >
                    <Link to={`/products/${item.id}`} className="block relative aspect-square">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm hover:bg-destructive hover:text-destructive-foreground"
                        onClick={(e) => {
                          e.preventDefault();
                          removeItem(item.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </Link>
                    <div className="p-4">
                      <p className="font-body text-xs uppercase tracking-wider text-muted-foreground mb-1">
                        {item.category}
                      </p>
                      <Link to={`/products/${item.id}`}>
                        <h3 className="font-display font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="font-body font-bold text-foreground mb-4">
                        ${item.price.toFixed(2)}
                        <span className="text-muted-foreground font-normal text-sm">
                          {" "}/ {item.unit}
                        </span>
                      </p>
                      <Button
                        className="w-full"
                        onClick={() => handleMoveToCart(item)}
                      >
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </PageTransition>
  );
};

export default Wishlist;
