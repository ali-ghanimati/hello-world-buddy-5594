/**
 * Domain models for SHIKO.
 *
 * These models intentionally resemble the data we need from
 * WooCommerce, while remaining independent from the raw
 * WooCommerce REST API response shape.
 *
 * The Service Layer will later map WooCommerce responses
 * into these domain models.
 */

export type CategorySlug =
  | "tshirt"
  | "shirt"
  | "pants"
  | "shoes";

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

  /** Optional CSS color used by color swatches. */
  hex?: string;
}

export interface ProductVariation {
  id: number;
  sku: string;

  price: number;
  regularPrice: number;
  salePrice: number | null;
  onSale: boolean;

  attributes: {
    size?: ProductAttributeOption;
    color?: ProductAttributeOption;
  };

  stockStatus: StockStatus;
  stockQuantity: number | null;

  image?: ProductImage;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  sku: string;

  description: string;
  shortDescription: string;

  /** Effective selling price in Toman. */
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

  variations: ProductVariation[];
}

export interface ProductQuery {
  search?: string;
  category?: CategorySlug | "all";
  minPrice?: number;
  maxPrice?: number;
  orderBy?: SortKey;
}

export type SortKey =
  | "newest"
  | "popular"
  | "price-asc"
  | "price-desc";

export interface CartLine {
  key: string;

  productId: number;
  variationId: number;

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

export type OrderStatus =
  | "processing"
  | "shipped"
  | "completed"
  | "cancelled";

export interface OrderItem {
  productId: number;
  variationId: number;

  name: string;
  sku: string;

  size: string;
  color: string;

  quantity: number;
  price: number;
}

export interface OrderAddress {
  fullName: string;
  phone: string;
  city: string;
  address: string;
  postalCode: string;
}

export interface Order {
  id: string;

  date: string;
  status: OrderStatus;

  items: OrderItem[];

  totals: OrderSummaryTotals;

  address: OrderAddress;
}
