import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Clock, X, TrendingUp, Tag, Mic, MicOff } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useProducts } from "@/hooks/queries/useProducts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Check for Web Speech API support - do this safely
const getSpeechRecognition = () => {
  if (typeof window === "undefined") return null;
  return (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || null;
};

interface RecentSearch {
  type: "product" | "category" | "query";
  value: string;
  label: string;
  id?: string;
}

const STORAGE_KEY = "ofh-recent-searches";
const MAX_RECENT_SEARCHES = 5;

const getRecentSearches = (): RecentSearch[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveRecentSearch = (search: RecentSearch) => {
  const recent = getRecentSearches();
  // Remove duplicate if exists
  const filtered = recent.filter(
    (item) => !(item.type === search.type && item.value === search.value)
  );
  // Add new search at the beginning
  const updated = [search, ...filtered].slice(0, MAX_RECENT_SEARCHES);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

const clearRecentSearches = () => {
  localStorage.removeItem(STORAGE_KEY);
};

const SearchDialog = ({ open, onOpenChange }: SearchDialogProps) => {
  const { data: productsData } = useProducts({ limit: 100 });
  const navigate = useNavigate();
      const allProducts = useMemo(
        () =>
          (productsData?.products || []).map((p) => ({
            id: p.id,
            slug: p.slug,
            name: p.name,
            category: p.category?.name || "",
            description: p.description,
            image: p.images?.[0] || "/placeholder.svg",
            reviews: [],
          })),
        [productsData?.products],
      );

  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [hasSpeechSupport, setHasSpeechSupport] = useState(false);

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition = getSpeechRecognition();
    if (SpeechRecognition) {
      setHasSpeechSupport(true);
      try {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = false;
        recognitionInstance.interimResults = true;
        recognitionInstance.lang = "en-US";

        recognitionInstance.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0])
            .map((result: any) => result.transcript)
            .join("");
          setSearchQuery(transcript);
        };

        recognitionInstance.onend = () => {
          setIsListening(false);
        };

        recognitionInstance.onerror = (event: any) => {
          setIsListening(false);
          if (event.error === "not-allowed") {
            toast.error("Microphone access denied. Please allow microphone permissions.");
          } else if (event.error === "no-speech") {
            toast.info("No speech detected. Try again.");
          } else {
            toast.error("Voice search error: " + event.error);
          }
        };

        setRecognition(recognitionInstance);
      } catch (e) {
        console.error("Failed to initialize speech recognition:", e);
        setHasSpeechSupport(false);
      }
    }
  }, []);

  // Stop listening when dialog closes
  useEffect(() => {
    if (!open && isListening && recognition) {
      try {
        recognition.stop();
      } catch (e) {
        // Ignore errors when stopping
      }
      setIsListening(false);
    }
  }, [open, isListening, recognition]);

  const toggleVoiceSearch = useCallback(async () => {
    if (!recognition) {
      toast.error("Voice search is not supported in your browser.");
      return;
    }

    if (isListening) {
      try {
        recognition.stop();
      } catch (e) {
        // Ignore
      }
      setIsListening(false);
    } else {
      try {
        // Request microphone permission first
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setSearchQuery("");
        recognition.start();
        setIsListening(true);
        toast.info("Listening... Speak now!");
      } catch (e: any) {
        if (e.name === "NotAllowedError" || e.name === "PermissionDeniedError") {
          toast.error("Microphone access denied. Please allow microphone permissions in your browser.");
        } else {
          toast.error("Could not start voice search. Please try again.");
        }
        setIsListening(false);
      }
    }
  }, [recognition, isListening]);

  // Load recent searches when dialog opens
  useEffect(() => {
    if (open) {
      setRecentSearches(getRecentSearches());
    }
  }, [open]);

  // Get trending/popular products (highest rated or most reviewed)
  const trendingProducts = useMemo(() => {
    return allProducts
      .filter((product) => product.reviews && product.reviews.length > 0)
      .sort((a, b) => {
        const aAvgRating = a.reviews.reduce((sum, r) => sum + r.rating, 0) / a.reviews.length;
        const bAvgRating = b.reviews.reduce((sum, r) => sum + r.rating, 0) / b.reviews.length;
        return bAvgRating - aAvgRating;
      })
      .slice(0, 4);
  }, []);

  // Filter products based on search query
  const filteredProducts = allProducts.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // All unique categories (for Quick Categories section)
  const categories = useMemo(
    () => [...new Set(allProducts.map((p) => p.category).filter(Boolean))],
    [allProducts],
  );

  // Get unique categories that match the search
  const matchingCategories = [...new Set(
    allProducts
      .filter((product) =>
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .map((product) => product.category)
  )];

  const handleSelectProduct = (productSlug: string, productName: string) => {
    saveRecentSearch({ type: "product", value: productSlug, label: productName, id: productSlug });
    onOpenChange(false);
    setSearchQuery("");
    navigate(`/products/${productSlug}`);
  };

  const handleSelectCategory = (category: string) => {
    saveRecentSearch({ type: "category", value: category, label: category });
    onOpenChange(false);
    setSearchQuery("");
    navigate(`/products?category=${encodeURIComponent(category)}`);
  };

  const handleSearchAll = () => {
    if (searchQuery.trim()) {
      saveRecentSearch({ type: "query", value: searchQuery, label: searchQuery });
    }
    onOpenChange(false);
    navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    setSearchQuery("");
  };

  const handleRecentSearch = (recent: RecentSearch) => {
    if (recent.type === "product" && recent.id) {
      handleSelectProduct(recent.id, recent.label);
    } else if (recent.type === "category") {
      handleSelectCategory(recent.value);
    } else {
      setSearchQuery(recent.value);
      navigate(`/products?search=${encodeURIComponent(recent.value)}`);
      onOpenChange(false);
    }
  };

  const handleClearHistory = () => {
    clearRecentSearches();
    setRecentSearches([]);
  };

  // Reset search when dialog closes
  useEffect(() => {
    if (!open) {
      setSearchQuery("");
    }
  }, [open]);

  // Keyboard shortcut to open search
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <div className="flex items-center border-b">
        <div className="flex-1">
          <CommandInput
            placeholder={isListening ? "Listening..." : "Search products, categories..."}
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
        </div>
        {hasSpeechSupport && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleVoiceSearch}
            className={cn(
              "mr-2 h-9 w-9 shrink-0",
              isListening && "text-destructive animate-pulse"
            )}
            aria-label={isListening ? "Stop voice search" : "Start voice search"}
          >
            {isListening ? (
              <MicOff className="h-4 w-4" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>
      <CommandList>
        <CommandEmpty>
          {searchQuery ? (
            <div className="py-4 text-center">
              <p className="text-sm text-muted-foreground mb-2">No results found</p>
              <button
                onClick={handleSearchAll}
                className="text-sm text-primary hover:underline"
              >
                Search all products for "{searchQuery}"
              </button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Start typing to search...</p>
          )}
        </CommandEmpty>

        {/* Recent Searches - shown when no query */}
        {!searchQuery && recentSearches.length > 0 && (
          <CommandGroup heading={
            <div className="flex items-center justify-between">
              <span>Recent Searches</span>
              <button
                onClick={handleClearHistory}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                <X className="h-3 w-3" />
                Clear
              </button>
            </div>
          }>
            {recentSearches.map((recent, index) => (
              <CommandItem
                key={`${recent.type}-${recent.value}-${index}`}
                value={`recent-${recent.value}`}
                onSelect={() => handleRecentSearch(recent)}
                className="cursor-pointer"
              >
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{recent.label}</span>
                <span className="ml-auto text-xs text-muted-foreground capitalize">
                  {recent.type}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {/* Quick Category Filters - shown when no query */}
        {!searchQuery && (
          <div className="px-3 py-2 border-b">
            <div className="flex items-center gap-2 mb-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">Quick Categories</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant="secondary"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors text-xs px-3 py-1"
                  onClick={() => handleSelectCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Trending Products - shown when no query */}
        {!searchQuery && trendingProducts.length > 0 && (
          <CommandGroup heading={
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span>Trending Products</span>
            </div>
          }>
            {trendingProducts.map((product) => (
              <CommandItem
                key={`trending-${product.id}`}
                value={`trending-${product.name}`}
                onSelect={() => handleSelectProduct(product.id, product.name)}
                className="cursor-pointer"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="mr-2 h-8 w-8 rounded object-cover"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{product.name}</span>
                  <span className="text-xs text-muted-foreground">{product.category}</span>
                </div>
                <span className="ml-auto text-sm font-medium text-primary">
                  ${product.price.toFixed(2)}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {searchQuery && matchingCategories.length > 0 && (
          <CommandGroup heading="Categories">
            {matchingCategories.slice(0, 3).map((category) => (
              <CommandItem
                key={category}
                value={`category-${category}`}
                onSelect={() => handleSelectCategory(category)}
                className="cursor-pointer"
              >
                <Search className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{category}</span>
                <span className="ml-auto text-xs text-muted-foreground">Category</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {searchQuery && filteredProducts.length > 0 && (
          <CommandGroup heading="Products">
            {filteredProducts.slice(0, 6).map((product) => (
              <CommandItem
                key={product.id}
                value={product.name}
                onSelect={() => handleSelectProduct(product.id, product.name)}
                className="cursor-pointer"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="mr-2 h-8 w-8 rounded object-cover"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{product.name}</span>
                  <span className="text-xs text-muted-foreground">{product.category}</span>
                </div>
                <span className="ml-auto text-sm font-medium text-primary">
                  ${product.price.toFixed(2)}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {searchQuery && filteredProducts.length > 6 && (
          <div className="p-2 text-center border-t">
            <button
              onClick={handleSearchAll}
              className="text-sm text-primary hover:underline"
            >
              View all {filteredProducts.length} results
            </button>
          </div>
        )}
      </CommandList>
    </CommandDialog>
  );
};

export default SearchDialog;
