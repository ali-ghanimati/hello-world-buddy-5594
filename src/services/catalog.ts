/**
 * Catalog service layer.
 *
 * The UI should only communicate with this service.
 *
 * Current:
 *   UI → catalog service → local mock data
 *
 * Production:
 *   UI → catalog service → server/API layer → WooCommerce
 *
 * The public function signatures are intentionally kept stable
 * so the UI does not need to change when the data source changes.
 */

import { categories as MOCK_CATEGORIES, products as MOCK_PRODUCTS } from "@/data/products";

import type {
  Category,
  CategorySlug,
  Product,
  ProductQuery,
  SortKey,
} from "@/lib/types";

/* -------------------------------------------------------------------------- */
/* Categories                                                                 */
/* -------------------------------------------------------------------------- */

export async function getCategories(): Promise<Category[]> {
  return [...MOCK_CATEGORIES];
}

/* -------------------------------------------------------------------------- */
/* Products                                                                   */
/* -------------------------------------------------------------------------- */

export async function getProducts(
  query: ProductQuery = {},
): Promise<Product[]> {
  return filterProducts(MOCK_PRODUCTS, query);
}

export function filterProducts(
  list: Product[],
  query: ProductQuery,
): Product[] {
  const {
    search,
    category,
    minPrice,
    maxPrice,
    orderBy,
  } = query;

  let result = [...list];

  /* Category filter */
  if (category && category !== "all") {
    result = result.filter(
      (product) => product.categorySlug === category,
    );
  }

  /* Search */
  if (search && search.trim()) {
    const q = search.trim().toLowerCase();

    result = result.filter(
      (product) =>
        product.name.toLowerCase().includes(q) ||
        product.categoryName.toLowerCase().includes(q) ||
        product.shortDescription.toLowerCase().includes(q),
    );
  }

  /* Minimum price */
  if (typeof minPrice === "number") {
    result = result.filter(
      (product) => product.price >= minPrice,
    );
  }

  /* Maximum price */
  if (typeof maxPrice === "number") {
    result = result.filter(
      (product) => product.price <= maxPrice,
    );
  }

  return sortProducts(
    result,
    orderBy ?? "newest",
  );
}

/* -------------------------------------------------------------------------- */
/* Sorting                                                                    */
/* -------------------------------------------------------------------------- */

export function sortProducts(
  list: Product[],
  key: SortKey,
): Product[] {
  const result = [...list];

  switch (key) {
    case "price-asc":
      return result.sort(
        (a, b) => a.price - b.price,
      );

    case "price-desc":
      return result.sort(
        (a, b) => b.price - a.price,
      );

    case "popular":
      return result.sort(
        (a, b) => b.totalSales - a.totalSales,
      );

    case "newest":
    default:
      return result.sort(
        (a, b) =>
          Number(b.isNew) - Number(a.isNew) ||
          b.id - a.id,
      );
  }
}

/* -------------------------------------------------------------------------- */
/* Single product                                                             */
/* -------------------------------------------------------------------------- */

export async function getProductBySlug(
  slug: string,
): Promise<Product | null> {
  return (
    MOCK_PRODUCTS.find(
      (product) => product.slug === slug,
    ) ?? null
  );
}

/* -------------------------------------------------------------------------- */
/* Homepage sections                                                          */
/* -------------------------------------------------------------------------- */

export async function getNewArrivals(
  limit = 4,
): Promise<Product[]> {
  return sortProducts(
    MOCK_PRODUCTS.filter(
      (product) => product.isNew,
    ),
    "newest",
  ).slice(0, limit);
}

export async function getBestSellers(
  limit = 4,
): Promise<Product[]> {
  return sortProducts(
    MOCK_PRODUCTS,
    "popular",
  ).slice(0, limit);
}

/* -------------------------------------------------------------------------- */
/* Related products                                                           */
/* -------------------------------------------------------------------------- */

const COMPLEMENT: Record<
  CategorySlug,
  CategorySlug
> = {
  shirt: "pants",
  tshirt: "pants",
  pants: "shirt",
  shoes: "shirt",
};

export async function getRelatedProducts(
  product: Product,
  limit = 4,
): Promise<Product[]> {
  const complementSlug =
    COMPLEMENT[product.categorySlug];

  const complements = MOCK_PRODUCTS.filter(
    (item) =>
      item.categorySlug === complementSlug,
  );

  const sameCategory = MOCK_PRODUCTS.filter(
    (item) =>
      item.categorySlug === product.categorySlug &&
      item.id !== product.id,
  );

  return [
    ...complements,
    ...sameCategory,
  ].slice(0, limit);
}

/* -------------------------------------------------------------------------- */
/* Price bounds                                                               */
/* -------------------------------------------------------------------------- */

export function getPriceBounds(
  list: Product[] = MOCK_PRODUCTS,
): [number, number] {
  if (list.length === 0) {
    return [0, 0];
  }

  const prices = list.map(
    (product) => product.price,
  );

  return [
    Math.min(...prices),
    Math.max(...prices),
  ];
}
