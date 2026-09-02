/**
 * Domain models — intentionally shaped after WooCommerce REST resources so the
 * mock data layer can later be swapped for a real WP/Woo API without touching UI.
 */

export type CategorySlug = "tshirt" | "shirt" | "pants" | "shoes";

export interface Category {
  id: number;
  slug: CategorySlug;
  name: string;
  description: string;
  image: string;
}

export type StockStatus = "instock" | "outofstock";

export interface ProductImage {
  id: number;
  src: string;
  alt: string;
}

export interface ProductAttributeOption {
  value: string;
  label: string;
  /** optional CSS color for swatches */
  hex?: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  sku: string;
  description: string;
  shortDescription: string;
  /** effective price (Toman) */
  price: number;
  regularPrice: number;
  salePrice: number | null;
  onSale: boolean;
  categorySlug: CategorySlug;
  categoryName: string;
  images: ProductImage[];
  sizes: ProductAttributeOption[];
  colors: ProductAttributeOption[];
  stockStatus: StockStatus;
  stockQuantity: number;
  featured: boolean;
  isNew: boolean;
  totalSales: number;
}

export interface ProductQuery {
  search?: string;
  category?: CategorySlug | "all";
  minPrice?: number;
  maxPrice?: number;
  orderBy?: SortKey;
}

export type SortKey = "newest" | "popular" | "price-asc" | "price-desc";

export interface CartLine {
  key: string;
  productId: number;
  slug: string;
  name: string;
  image: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
}

export interface OrderSummaryTotals {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
}

export type OrderStatus = "processing" | "shipped" | "completed" | "cancelled";

export interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  items: { name: string; size: string; color: string; quantity: number; price: number }[];
  total: number;
  address: string;
}
