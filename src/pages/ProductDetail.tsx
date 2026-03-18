import { useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
  Heart, ShoppingBag, Star, Minus, Plus, Check, Truck, Shield, Leaf, ArrowUpDown, Filter, MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import ReviewForm from "@/components/ReviewForm";
import ShareProductButton from "@/components/ShareProductButton";
import ReviewVoteButtons from "@/components/ReviewVoteButtons";
import { useCartFacade } from "@/hooks/useCartFacade";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useReviewVotes } from "@/hooks/useReviewVotes";
import { useProduct, useProducts } from "@/hooks/queries/useProducts";
import { toStorefrontProduct } from "@/lib/storefrontProducts";
import ProductCard from "@/components/ProductCard";

const ProductDetail = () => {
  const { id: slug } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCartFacade();
  const { isInWishlist, toggleItem } = useWishlistStore();
  const { getVotes } = useReviewVotes();
  const { data: productData } = useProduct(slug || "");
  const { data: productsData } = useProducts({ limit: 100 });
  const [quantity, setQuantity] = useState(1);
  const [selectedQtyIdx, setSelectedQtyIdx] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "highest" | "lowest" | "helpful">("newest");
  const [filterStars, setFilterStars] = useState<number | null>(null);

  const product = productData ? toStorefrontProduct(productData) : undefined;

  // Reviews come from the API via product data — no local review state
  const allReviews = product ? [...product.reviews] : [];

  const averageRating = allReviews.length > 0
    ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
    : 0;

  const starCounts = useMemo(() => {
    const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    allReviews.forEach((r) => {
      if (counts[r.rating] !== undefined) counts[r.rating]++;
    });
    return counts;
  }, [allReviews]);

  const filteredAndSortedReviews = useMemo(() => {
    let reviews = [...allReviews];
    if (filterStars !== null) reviews = reviews.filter((r) => r.rating === filterStars);
    reviews.sort((a, b) => {
      switch (sortBy) {
        case "newest": return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "oldest": return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "highest": return b.rating - a.rating;
        case "lowest": return a.rating - b.rating;
        case "helpful": {
          if (!product) return 0;
          const aVotes = getVotes(product.id, a.id);
          const bVotes = getVotes(product.id, b.id);
          return (bVotes.up - bVotes.down) - (aVotes.up - aVotes.down);
        }
        default: return 0;
      }
    });
    return reviews;
  }, [allReviews, sortBy, filterStars, product, getVotes]);

  if (!product) {
    return (
      <PageTransition>
        <Navbar />
        <main className="min-h-screen bg-background pt-24 pb-24 md:pb-16">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-4">Product Not Found</h1>
            <p className="font-body text-sm sm:text-base text-muted-foreground mb-6">The product you're looking for doesn't exist.</p>
            <Button onClick={() => navigate("/products")}>Browse All Products</Button>
          </div>
        </main>
        <Footer />
      </PageTransition>
    );
  }

  const selectedOption = product.quantityOptions?.[selectedQtyIdx] || { quantity: product.unit, price: product.price, label: product.unit };
  const unitPrice = selectedOption.price;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.backendId,
        name: `${product.name} (${selectedOption.label})`,
        price: unitPrice,
        unit: selectedOption.quantity,
        image: product.image,
        category: product.category,
      });
    }
    setQuantity(1);
  };

  const handleReviewAdded = () => setRefreshKey((prev) => prev + 1);

  const relatedProducts = (productsData?.products || [])
    .filter((p) => p.category?.name === product.category && p.slug !== product.slug)
    .slice(0, 4)
    .map((p) => {
      const mapped = toStorefrontProduct(p as any);
      return {
        id: p.id,
        slug: mapped.slug,
        name: mapped.name,
        price: mapped.price,
        unit: mapped.unit,
        image: mapped.image,
        category: mapped.category,
        isNew: mapped.isNew,
      };
    });

  return (
    <PageTransition>
      <Helmet>
        <title>{product.name} | OFH - The Organic Foods House</title>
        <meta name="description" content={product.description.substring(0, 160)} />
      </Helmet>

      <Navbar />

      <main className="min-h-screen bg-background pt-24 pb-24 md:pb-16">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Breadcrumb */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 sm:mb-8">
            <Breadcrumb>
              <BreadcrumbList className="text-xs sm:text-sm">
                <BreadcrumbItem><BreadcrumbLink asChild><Link to="/">Home</Link></BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem><BreadcrumbLink asChild><Link to="/products">Products</Link></BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem><BreadcrumbPage>{product.name}</BreadcrumbPage></BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </motion.div>

          {/* Product Section */}
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-12 mb-12 sm:mb-16">
            {/* Image */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <div className="relative aspect-square rounded-2xl sm:rounded-3xl overflow-hidden bg-card shadow-soft">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                {product.isNew && (
                  <span className="absolute top-4 left-4 sm:top-6 sm:left-6 bg-primary text-primary-foreground text-xs sm:text-sm font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full flex items-center gap-1.5">
                    <Leaf className="h-3 w-3 sm:h-4 sm:w-4" />
                    Fresh
                  </span>
                )}
              </div>
            </motion.div>

            {/* Details */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="flex flex-col">
              <p className="font-body text-xs sm:text-sm uppercase tracking-wider text-primary font-semibold mb-2">{product.category}</p>
              <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="flex items-center gap-0.5 sm:gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 sm:h-5 sm:w-5 ${i < Math.round(averageRating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`} />
                  ))}
                </div>
                <span className="font-body text-xs sm:text-sm text-muted-foreground">
                  {averageRating.toFixed(1)} ({allReviews.length} reviews)
                </span>
              </div>

              {/* Quantity Options */}
              {product.quantityOptions && product.quantityOptions.length > 0 && (
                <div className="mb-4 sm:mb-6">
                  <p className="font-body text-xs sm:text-sm font-semibold text-foreground mb-2 sm:mb-3">Select Size:</p>
                  <div className="flex flex-wrap gap-2">
                    {product.quantityOptions.map((opt, idx) => (
                      <button
                        key={opt.quantity}
                        onClick={() => { setSelectedQtyIdx(idx); setQuantity(1); }}
                        className={`px-3 sm:px-4 py-2 rounded-xl border text-xs sm:text-sm font-medium transition-all ${
                          selectedQtyIdx === idx
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-card text-muted-foreground hover:border-primary/50"
                        }`}
                      >
                        <span className="block font-semibold">{opt.label}</span>
                        <span className="block text-[10px] sm:text-xs">₹{opt.price}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Price */}
              <p className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-4 sm:mb-6">
                ₹{unitPrice}
                <span className="text-sm sm:text-lg text-muted-foreground font-normal ml-2">/ {selectedOption.quantity}</span>
              </p>

              {/* Description */}
              <p className="font-body text-sm sm:text-base text-muted-foreground leading-relaxed mb-6 sm:mb-8">{product.description}</p>

              {/* Quantity & Actions */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="flex items-center bg-card rounded-full border border-border">
                  <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 sm:h-10 sm:w-10" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                    <Minus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </Button>
                  <span className="w-8 sm:w-12 text-center font-semibold text-foreground text-sm sm:text-base">{quantity}</span>
                  <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 sm:h-10 sm:w-10" onClick={() => setQuantity(quantity + 1)}>
                    <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </Button>
                </div>

                <Button size="lg" className="flex-1 min-w-[140px] sm:min-w-[200px] text-sm sm:text-base" onClick={handleAddToCart}>
                  <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Add to Cart — ₹{totalPrice}
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 sm:h-12 sm:w-12 rounded-full"
                  onClick={() => toggleItem({ id: product.id, name: product.name, price: product.price, unit: product.unit, image: product.image, category: product.category })}
                >
                  <Heart className={`h-4 w-4 sm:h-5 sm:w-5 ${isInWishlist(product.id) ? "fill-destructive text-destructive" : "text-foreground"}`} />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 sm:h-12 sm:w-12 rounded-full text-[#25D366] border-[#25D366]/30 hover:bg-[#25D366]/10"
                  onClick={() => {
                    const msg = `Hi! I'd like to order *${product.name}* (${selectedOption.label}) × ${quantity} = ₹${totalPrice}`;
                    window.open(`https://wa.me/917799160272?text=${encodeURIComponent(msg)}`, "_blank");
                  }}
                >
                  <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>

                <ShareProductButton productId={product.id} productName={product.name} />
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 py-4 sm:py-6 border-t border-border">
                <div className="flex flex-col items-center text-center">
                  <Truck className="h-5 w-5 sm:h-6 sm:w-6 text-primary mb-1 sm:mb-2" />
                  <span className="font-body text-[10px] sm:text-xs text-muted-foreground">Free Shipping ₹499+</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-primary mb-1 sm:mb-2" />
                  <span className="font-body text-[10px] sm:text-xs text-muted-foreground">Freshness Guaranteed</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <Leaf className="h-5 w-5 sm:h-6 sm:w-6 text-primary mb-1 sm:mb-2" />
                  <span className="font-body text-[10px] sm:text-xs text-muted-foreground">100% Organic</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Tabs Section */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="mb-12 sm:mb-16">
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="w-full justify-start bg-card rounded-xl p-1 h-auto flex-wrap">
                <TabsTrigger value="details" className="px-3 sm:px-6 py-2 sm:py-3 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm">Product Details</TabsTrigger>
                {product.nutrition && (
                  <TabsTrigger value="nutrition" className="px-3 sm:px-6 py-2 sm:py-3 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm">Nutrition Facts</TabsTrigger>
                )}
                <TabsTrigger value="reviews" className="px-3 sm:px-6 py-2 sm:py-3 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm">Reviews ({allReviews.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="mt-4 sm:mt-6">
                <div className="bg-card rounded-2xl p-4 sm:p-8 shadow-soft">
                  <h3 className="font-display text-lg sm:text-xl font-bold text-foreground mb-4">Product Highlights</h3>
                  <ul className="space-y-2 sm:space-y-3">
                    {product.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2 sm:gap-3 font-body text-sm sm:text-base text-muted-foreground">
                        <Check className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0 mt-0.5" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>

              {product.nutrition && (
                <TabsContent value="nutrition" className="mt-4 sm:mt-6">
                  <div className="bg-card rounded-2xl p-4 sm:p-8 shadow-soft">
                    <h3 className="font-display text-lg sm:text-xl font-bold text-foreground mb-4">Nutrition Facts</h3>
                    <p className="font-body text-xs sm:text-sm text-muted-foreground mb-4">Serving Size: {product.nutrition.servingSize}</p>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-4">
                      {[
                        { label: "Calories", value: product.nutrition.calories },
                        { label: "Protein", value: product.nutrition.protein },
                        { label: "Carbs", value: product.nutrition.carbs },
                        { label: "Fat", value: product.nutrition.fat },
                        { label: "Fiber", value: product.nutrition.fiber },
                      ].map((item) => (
                        <div key={item.label} className="bg-background rounded-xl p-3 sm:p-4 text-center">
                          <p className="font-display text-lg sm:text-2xl font-bold text-foreground">{item.value}</p>
                          <p className="font-body text-xs sm:text-sm text-muted-foreground">{item.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              )}

              <TabsContent value="reviews" className="mt-4 sm:mt-6" key={refreshKey}>
                <div className="bg-card rounded-2xl p-4 sm:p-8 shadow-soft space-y-6 sm:space-y-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                    <h3 className="font-display text-lg sm:text-xl font-bold text-foreground">Customer Reviews</h3>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-0.5 sm:gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-4 w-4 sm:h-5 sm:w-5 ${i < Math.round(averageRating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`} />
                        ))}
                      </div>
                      <span className="font-body font-semibold text-foreground text-sm sm:text-base">{averageRating.toFixed(1)}</span>
                    </div>
                  </div>

                  {allReviews.length > 0 && (
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                      <div className="flex items-center gap-2">
                        <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                        <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
                          <SelectTrigger className="w-[140px] sm:w-[160px] bg-background text-xs sm:text-sm">
                            <SelectValue placeholder="Sort by" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="newest">Newest First</SelectItem>
                            <SelectItem value="oldest">Oldest First</SelectItem>
                            <SelectItem value="highest">Highest Rated</SelectItem>
                            <SelectItem value="lowest">Lowest Rated</SelectItem>
                            <SelectItem value="helpful">Most Helpful</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <Button variant={filterStars === null ? "default" : "outline"} size="sm" onClick={() => setFilterStars(null)} className="h-7 sm:h-8 text-xs">
                          All ({allReviews.length})
                        </Button>
                        {[5, 4, 3, 2, 1].map((stars) => (
                          <Button key={stars} variant={filterStars === stars ? "default" : "outline"} size="sm" onClick={() => setFilterStars(filterStars === stars ? null : stars)} className="h-7 sm:h-8 gap-0.5 sm:gap-1 text-xs" disabled={starCounts[stars] === 0}>
                            {stars}
                            <Star className="h-3 w-3 fill-current" />
                            <span className="text-[10px] sm:text-xs">({starCounts[stars]})</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  <ReviewForm productId={product.backendId} onReviewAdded={handleReviewAdded} />

                  <div className="space-y-4 sm:space-y-6">
                    {allReviews.length === 0 ? (
                      <p className="font-body text-sm text-muted-foreground text-center py-8">No reviews yet. Be the first!</p>
                    ) : filteredAndSortedReviews.length === 0 ? (
                      <p className="font-body text-sm text-muted-foreground text-center py-8">No reviews match your filter.</p>
                    ) : (
                      filteredAndSortedReviews.map((review, idx) => (
                        <div key={`${review.id}-${idx}`} className="border-b border-border pb-4 sm:pb-6 last:border-0 last:pb-0">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2 sm:gap-3">
                              <span className="font-display font-semibold text-foreground text-sm sm:text-base">{review.author}</span>
                              {review.verified && (
                                <span className="flex items-center gap-1 text-[10px] sm:text-xs text-primary font-medium">
                                  <Check className="h-3 w-3" />
                                  Verified
                                </span>
                              )}
                            </div>
                            <span className="font-body text-xs sm:text-sm text-muted-foreground">
                              {new Date(review.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                            </span>
                          </div>
                          <div className="flex items-center gap-0.5 sm:gap-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`} />
                            ))}
                          </div>
                          <p className="font-body text-sm text-muted-foreground">{review.comment}</p>
                          <ReviewVoteButtons productId={product.id} reviewId={review.id} />
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <motion.section initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground mb-6 sm:mb-8">You Might Also Like</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                {relatedProducts.map((relatedProduct, index) => (
                  <ProductCard key={relatedProduct.id} product={relatedProduct} index={index} />
                ))}
              </div>
            </motion.section>
          )}
        </div>
      </main>

      <Footer />

      {/* Sticky Mobile Add to Cart Bar */}
      <div className="fixed bottom-16 left-0 right-0 z-40 md:hidden bg-background/95 backdrop-blur-md border-t border-border px-3 py-2.5 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
        <div className="flex items-center gap-2">
          <div className="flex-1 min-w-0">
            <p className="font-display text-sm font-bold text-foreground truncate">
              ₹{totalPrice}
            </p>
            <p className="text-[10px] text-muted-foreground truncate">
              {selectedOption.label} × {quantity}
            </p>
          </div>
          <div className="flex items-center bg-card rounded-full border border-border shrink-0">
            <Button variant="ghost" size="icon" className="rounded-full h-7 w-7" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-6 text-center font-semibold text-foreground text-xs">{quantity}</span>
            <Button variant="ghost" size="icon" className="rounded-full h-7 w-7" onClick={() => setQuantity(quantity + 1)}>
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <Button size="sm" className="shrink-0 h-9 text-xs px-3" onClick={handleAddToCart}>
            <ShoppingBag className="h-3.5 w-3.5 mr-1" />
            Add to Cart
          </Button>
        </div>
      </div>
    </PageTransition>
  );
};

export default ProductDetail;
