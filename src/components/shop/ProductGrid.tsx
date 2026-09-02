import type { Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";

export function ProductGrid({ products, columns = 4 }: { products: Product[]; columns?: 3 | 4 }) {
  return (
    <div
      className={`grid grid-cols-2 gap-x-4 gap-y-10 ${
        columns === 3 ? "lg:grid-cols-3" : "md:grid-cols-3 lg:grid-cols-4"
      } sm:gap-x-6`}
    >
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} priority={i < 2} />
      ))}
    </div>
  );
}
