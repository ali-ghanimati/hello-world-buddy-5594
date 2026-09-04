```tsx
import { Link } from "@tanstack/react-router";
import type { Product } from "@/lib/types";
import {
  discountPercent,
  formatToman,
  toPersianDigits,
} from "@/lib/format";

export function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const off = product.salePrice
    ? discountPercent(product.regularPrice, product.salePrice)
    : 0;

  const outOfStock = product.stockStatus === "outofstock";

  return (
    <article className="group flex h-full flex-col">
      {/* Product Image */}
      <Link
        to="/product/$slug"
        params={{ slug: product.slug }}
        className="relative block overflow-hidden bg-secondary"
        aria-label={product.name}
      >
        <img
          src={product.images[0]?.src}
          alt={product.images[0]?.alt ?? product.name}
          width={900}
          height={1100}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />

        {/* Badges */}
        <div className="absolute right-3 top-3 flex flex-col gap-1.5">
          {off > 0 && (
            <span className="rounded-sm bg-primary px-2 py-1 text-[0.65rem] font-bold text-primary-foreground">
              ٪{toPersianDigits(off)} تخفیف
            </span>
          )}

          {product.isNew && off === 0 && (
            <span className="rounded-sm bg-card px-2 py-1 text-[0.65rem] font-bold text-foreground">
              جدید
            </span>
          )}
        </div>

        {/* Out of stock */}
        {outOfStock && (
          <span className="absolute inset-x-0 bottom-0 bg-foreground/80 py-2 text-center text-xs text-primary-foreground">
            ناموجود
          </span>
        )}
      </Link>

      {/* Product Information */}
      <div className="flex flex-1 flex-col pt-3">
        <span className="eyebrow">{product.categoryName}</span>

        <h3 className="mt-1 text-sm font-bold leading-6">
          <Link
            to="/product/$slug"
            params={{ slug: product.slug }}
            className="hover:text-accent"
          >
            {product.name}
          </Link>
        </h3>

        <p className="mt-1 text-xs text-muted-foreground">
          سایز: {product.sizes.map((s) => s.label).join("، ")}
        </p>

        {/* Price */}
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-sm font-bold">
            {formatToman(
              product.salePrice ?? product.price,
            )}
          </span>

          {product.salePrice && (
            <span className="text-xs text-muted-foreground line-through">
              {formatToman(product.regularPrice)}
            </span>
          )}
        </div>

        {/* Product CTA */}
        <Link
          to="/product/$slug"
          params={{ slug: product.slug }}
          className="mt-3 flex h-10 w-full items-center justify-center rounded-sm border border-foreground/20 text-xs font-medium transition-colors hover:bg-primary hover:text-primary-foreground"
          aria-label={
            outOfStock
              ? `مشاهده ${product.name}`
              : `انتخاب سایز و رنگ ${product.name}`
          }
        >
          {outOfStock
            ? "مشاهده محصول"
            : "انتخاب سایز و رنگ"}
        </Link>
      </div>
    </article>
  );
}
```
