import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import PullToRefresh from "@/components/PullToRefresh";
import bannerProducts from "@/assets/banner-products.jpg";
import { useProducts } from "@/hooks/queries/useProducts";
import { useCategories } from "@/hooks/queries/useCategories";

type SortOption = "featured" | "price-low" | "price-high" | "name-asc" | "name-desc";

const Products = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [showFilters, setShowFilters] = useState(false);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSearchQuery("");
    setSortBy("featured");
  };

  const { data: productsData, refetch, isFetching } = useProducts({ limit: 100 });
  const { data: categoriesData } = useCategories();

  const categoryNames = useMemo(() => (categoriesData || []).map((c) => c.name), [categoriesData]);

  const mappedProducts = useMemo(
    () =>
      (productsData?.products || []).map((p) => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        price: p.price,
        unit: p.unit,
        image: p.images?.[0] || "/placeholder.svg",
        category: p.category?.name || "Uncategorized",
        isNew: p.isNew,
      })),
    [productsData?.products],
  );

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...mappedProducts];
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query));
    }
    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.category));
    }
    switch (sortBy) {
      case "price-low": result.sort((a, b) => a.price - b.price); break;
      case "price-high": result.sort((a, b) => b.price - a.price); break;
      case "name-asc": result.sort((a, b) => a.name.localeCompare(b.name)); break;
      case "name-desc": result.sort((a, b) => b.name.localeCompare(a.name)); break;
    }
    return result;
  }, [mappedProducts, searchQuery, selectedCategories, sortBy]);

  const hasActiveFilters = selectedCategories.length > 0 || searchQuery.trim() !== "";

  const handleRefresh = async () => {
    await refetch();
    clearFilters();
  };

  return (
    <PageTransition>
      <Helmet>
        <title>Shop All Products | OFH - The Organic Foods House</title>
        <meta name="description" content="Browse our organic jaggery, rice, and farm-fresh vegetables. Filter by category and find what you need." />
      </Helmet>

      <Navbar />

      <PullToRefresh onRefresh={handleRefresh}>
        <main className="min-h-screen bg-background">
          {/* Banner */}
          <section className="relative h-[35vh] sm:h-[45vh] flex items-center justify-center">
            <img src={bannerProducts} alt="Organic jaggery, rice and vegetables" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-foreground/50" />
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 text-center px-4">
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-primary-foreground mb-2 sm:mb-4">
                Our Products
              </h1>
              <p className="font-body text-sm sm:text-lg text-primary-foreground/80">
                {isFetching ? "Refreshing..." : `${filteredAndSortedProducts.length} organic products available`}
              </p>
            </motion.div>
          </section>

          <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-24 md:pb-16">
            {/* Search and Controls */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input type="text" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 bg-card text-sm" />
                {searchQuery && (
                  <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8" onClick={() => setSearchQuery("")}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                <SelectTrigger className="w-full sm:w-48 bg-card text-sm">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border z-50">
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="name-asc">Name: A to Z</SelectItem>
                  <SelectItem value="name-desc">Name: Z to A</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="md:hidden text-sm" onClick={() => setShowFilters(!showFilters)}>
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
                {selectedCategories.length > 0 && (
                  <span className="ml-2 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">{selectedCategories.length}</span>
                )}
              </Button>
            </motion.div>

            <div className="flex gap-6 sm:gap-8">
              {/* Filters Sidebar - Desktop */}
              <motion.aside initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="hidden md:block w-56 lg:w-64 shrink-0">
                <div className="bg-card rounded-2xl p-5 sm:p-6 shadow-soft sticky top-28">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-display text-lg font-bold text-foreground">Filters</h2>
                    {hasActiveFilters && (
                      <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs text-muted-foreground hover:text-primary">Clear all</Button>
                    )}
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-foreground mb-4">Categories</h3>
                    <div className="space-y-3">
                      {categoryNames.map((category) => (
                        <label key={category} className="flex items-center gap-3 cursor-pointer group">
                          <Checkbox checked={selectedCategories.includes(category)} onCheckedChange={() => toggleCategory(category)} />
                          <span className="font-body text-sm text-muted-foreground group-hover:text-foreground transition-colors">{category}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.aside>

              {/* Mobile Filters */}
              {showFilters && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="md:hidden fixed inset-x-0 top-20 z-40 bg-background border-b border-border p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-display text-lg font-bold text-foreground">Filters</h2>
                    <div className="flex gap-2">
                      {hasActiveFilters && <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs">Clear all</Button>}
                      <Button variant="ghost" size="icon" onClick={() => setShowFilters(false)}><X className="h-4 w-4" /></Button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {categoryNames.map((category) => (
                      <Button key={category} variant={selectedCategories.includes(category) ? "default" : "outline"} size="sm" onClick={() => toggleCategory(category)} className="text-xs">{category}</Button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Products Grid */}
              <div className="flex-1">
                {filteredAndSortedProducts.length === 0 ? (
                  <div className="text-center py-16">
                    <p className="font-display text-lg sm:text-xl font-semibold text-foreground mb-2">No products found</p>
                    <p className="font-body text-sm text-muted-foreground mb-6">Try adjusting your search or filters</p>
                    <Button onClick={clearFilters}>Clear Filters</Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                    {filteredAndSortedProducts.map((product, index) => (
                      <ProductCard key={product.id} product={product} index={index} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </PullToRefresh>

      <Footer />
    </PageTransition>
  );
};

export default Products;
