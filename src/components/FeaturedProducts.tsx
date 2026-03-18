import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useFeaturedProducts } from "@/hooks/queries/useAdmin";
import { useProducts } from "@/hooks/queries/useProducts";

const FeaturedProducts = () => {
  // Try admin-curated featured products first; fall back to latest products
  const { data: featuredData } = useFeaturedProducts();
  const { data: fallbackData } = useProducts({ limit: 6, sortBy: "createdAt", sortOrder: "desc" });

  const rawProducts = (featuredData && featuredData.length > 0)
    ? featuredData
    : (fallbackData?.products || []);

  const products = rawProducts.slice(0, 6).map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    price: p.price,
    unit: p.unit,
    image: p.images?.[0] || "/placeholder.svg",
    category: p.category?.name || "",
    isNew: p.isNew,
  }));

  return (
    <section id="shop" className="py-16 sm:py-24 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-16"
        >
          <p className="font-body text-xs sm:text-sm uppercase tracking-[0.2em] text-primary mb-3 sm:mb-4 font-semibold">
            Handpicked For You
          </p>
          <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-bold text-foreground mb-3 sm:mb-4">
            Featured Products
          </h2>
          <p className="font-body text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            Organic jaggery, rice, and farm-fresh vegetables — sourced directly from certified organic farms.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-10 sm:mt-16"
        >
          <Button variant="heroOutline" size="lg" className="group" asChild>
            <Link to="/products">
              View All Products
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
