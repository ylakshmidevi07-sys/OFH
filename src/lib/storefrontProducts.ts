import type { Product as ApiProduct, Review as ApiReview } from "@/types";

export interface StorefrontQuantityOption {
  quantity: string;
  price: number;
  label: string;
}

export interface StorefrontNutrition {
  servingSize: string;
  calories: number;
  protein: string;
  carbs: string;
  fat: string;
  fiber: string;
}

export interface StorefrontReview {
  id: number;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

export interface StorefrontProduct {
  id: number;
  slug: string;
  backendId: string;
  name: string;
  price: number;
  unit: string;
  image: string;
  category: string;
  isNew?: boolean;
  stock: number;
  description: string;
  details: string[];
  quantityOptions: StorefrontQuantityOption[];
  nutrition?: StorefrontNutrition;
  reviews: StorefrontReview[];
}

const PRODUCT_META: Record<string, { id: number; quantityOptions: StorefrontQuantityOption[]; nutrition?: StorefrontNutrition }> = {
  "organic-jaggery": {
    id: 1,
    quantityOptions: [
      { quantity: "250g", price: 89, label: "250g" },
      { quantity: "500g", price: 149, label: "500g" },
      { quantity: "1kg", price: 269, label: "1 Kg" },
      { quantity: "2kg", price: 499, label: "2 Kg (Best Value)" },
    ],
    nutrition: { servingSize: "10g", calories: 38, protein: "0g", carbs: "9.8g", fat: "0g", fiber: "0g" },
  },
  "organic-rice": {
    id: 2,
    quantityOptions: [
      { quantity: "500g", price: 119, label: "500g" },
      { quantity: "1kg", price: 199, label: "1 Kg" },
      { quantity: "2kg", price: 369, label: "2 Kg" },
      { quantity: "5kg", price: 849, label: "5 Kg (Best Value)" },
    ],
    nutrition: { servingSize: "100g (cooked)", calories: 130, protein: "2.7g", carbs: "28g", fat: "0.3g", fiber: "0.4g" },
  },
  "organic-jaggery-syrup": {
    id: 3,
    quantityOptions: [
      { quantity: "250ml", price: 149, label: "250ml" },
      { quantity: "500ml", price: 249, label: "500ml" },
      { quantity: "1L", price: 449, label: "1 Litre (Best Value)" },
    ],
  },
  "organic-jaggery-powder": {
    id: 4,
    quantityOptions: [
      { quantity: "250g", price: 99, label: "250g" },
      { quantity: "500g", price: 179, label: "500g" },
      { quantity: "1kg", price: 329, label: "1 Kg (Best Value)" },
    ],
    nutrition: { servingSize: "10g", calories: 38, protein: "0.1g", carbs: "9.7g", fat: "0g", fiber: "0g" },
  },
  "organic-tomatoes": {
    id: 5,
    quantityOptions: [
      { quantity: "250g", price: 29, label: "250g" },
      { quantity: "500g", price: 49, label: "500g" },
      { quantity: "1kg", price: 89, label: "1 Kg" },
      { quantity: "2kg", price: 159, label: "2 Kg (Best Value)" },
    ],
    nutrition: { servingSize: "100g", calories: 18, protein: "0.9g", carbs: "3.9g", fat: "0.2g", fiber: "1.2g" },
  },
  "organic-okra-bhindi": {
    id: 6,
    quantityOptions: [
      { quantity: "250g", price: 35, label: "250g" },
      { quantity: "500g", price: 59, label: "500g" },
      { quantity: "1kg", price: 109, label: "1 Kg (Best Value)" },
    ],
    nutrition: { servingSize: "100g", calories: 33, protein: "1.9g", carbs: "7.5g", fat: "0.2g", fiber: "3.2g" },
  },
  "organic-brinjal-eggplant": {
    id: 7,
    quantityOptions: [
      { quantity: "250g", price: 29, label: "250g" },
      { quantity: "500g", price: 45, label: "500g" },
      { quantity: "1kg", price: 79, label: "1 Kg (Best Value)" },
    ],
    nutrition: { servingSize: "100g", calories: 25, protein: "1g", carbs: "6g", fat: "0.2g", fiber: "3g" },
  },
  "organic-drumstick-moringa": {
    id: 8,
    quantityOptions: [
      { quantity: "250g", price: 69, label: "250g" },
      { quantity: "500g", price: 119, label: "500g" },
      { quantity: "1kg", price: 219, label: "1 Kg (Best Value)" },
    ],
    nutrition: { servingSize: "100g", calories: 37, protein: "2.1g", carbs: "8.5g", fat: "0.2g", fiber: "3.2g" },
  },
};

const toStorefrontReview = (review: ApiReview, index: number): StorefrontReview => ({
  id: index + 1,
  author: `${review.user?.firstName || ""} ${review.user?.lastName || ""}`.trim() || "Verified Customer",
  rating: review.rating,
  date: review.createdAt,
  comment: review.comment || "",
  verified: review.verified,
});

export const toStorefrontProduct = (product: ApiProduct): StorefrontProduct => {
  const meta = PRODUCT_META[product.slug];

  return {
    id: meta?.id || 0,
    slug: product.slug,
    backendId: product.id,
    name: product.name,
    price: product.price,
    unit: product.unit,
    image: product.images?.[0] || "/placeholder.svg",
    category: product.category?.name || "",
    isNew: product.isNew,
    stock: product.inventory?.stock || 0,
    description: product.description,
    details: product.details || [],
    quantityOptions:
      meta?.quantityOptions || [{ quantity: product.unit, price: product.price, label: product.unit }],
    nutrition: meta?.nutrition,
    reviews: (product.reviews || []).map(toStorefrontReview),
  };
};

