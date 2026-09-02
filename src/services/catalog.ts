/**
 * Data layer. Today it resolves from local mock data; tomorrow each function
 * can call the WooCommerce REST API (`/wp-json/wc/v3/products`, ...) with the
 * same signatures and return types. UI never imports the mock data directly.
 */
import { categories, products } from "@/data/products";
import type { Category, CategorySlug, Product, ProductQuery, SortKey } from "@/lib/types";

export async function getCategories(): Promise<Category[]> {
  return categories;
}

export async function getProducts(query: ProductQuery = {}): Promise<Product[]> {
  return filterProducts(products, query);
}

export function filterProducts(list: Product[], query: ProductQuery): Product[] {
  const { search, category, minPrice, maxPrice, orderBy } = query;
  let result = [...list];

  if (category && category !== "all") {
    result = result.filter((p) => p.categorySlug === category);
  }
  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.categoryName.includes(q) ||
        p.shortDescription.toLowerCase().includes(q),
    );
  }
  if (typeof minPrice === "number") result = result.filter((p) => p.price >= minPrice);
  if (typeof maxPrice === "number") result = result.filter((p) => p.price <= maxPrice);

  return sortProducts(result, orderBy ?? "newest");
}

export function sortProducts(list: Product[], key: SortKey): Product[] {
  const result = [...list];
  switch (key) {
    case "price-asc":
      return result.sort((a, b) => a.price - b.price);
    case "price-desc":
      return result.sort((a, b) => b.price - a.price);
    case "popular":
      return result.sort((a, b) => b.totalSales - a.totalSales);
    default:
      return result.sort((a, b) => Number(b.isNew) - Number(a.isNew) || b.id - a.id);
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return products.find((p) => p.slug === slug) ?? null;
}

export async function getNewArrivals(limit = 4): Promise<Product[]> {
  return sortProducts(products.filter((p) => p.isNew), "newest").slice(0, limit);
}

export async function getBestSellers(limit = 4): Promise<Product[]> {
  return sortProducts(products, "popular").slice(0, limit);
}

const COMPLEMENT: Record<CategorySlug, CategorySlug> = {
  shirt: "pants",
  tshirt: "pants",
  pants: "shirt",
  shoes: "shirt",
};

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const complementSlug = COMPLEMENT[product.categorySlug];
  const complements = products.filter((p) => p.categorySlug === complementSlug);
  const sameCategory = products.filter(
    (p) => p.categorySlug === product.categorySlug && p.id !== product.id,
  );
  return [...complements, ...sameCategory].slice(0, limit);
}

export function getPriceBounds(list: Product[] = products): [number, number] {
  const prices = list.map((p) => p.price);
  return [Math.min(...prices), Math.max(...prices)];
}
