import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Minus, Plus, Ruler, Truck } from "lucide-react";
import { getProductBySlug, getRelatedProducts } from "@/services/catalog";
import { discountPercent, formatToman, toPersianDigits } from "@/lib/format";
import { Breadcrumbs } from "@/components/base/Breadcrumbs";
import { Button } from "@/components/base/Button";
import { ProductGallery } from "@/components/shop/ProductGallery";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { SizeGuide } from "@/components/shop/SizeGuide";
import { useCart } from "@/store/cart";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/product/$slug")({
  loader: async ({ params }) => {
    const product = await getProductBySlug(params.slug);
    if (!product) throw notFound();
    return { product, related: await getRelatedProducts(product) };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "محصول در دسترس نیست | شیکو" }, { name: "robots", content: "noindex" }] };
    }
    const p = loaderData.product;
    const title = `${p.name} | شیکو`;
    return {
      meta: [
        { title },
        { name: "description", content: `${p.shortDescription} — خرید ${p.name} از فروشگاه شیکو.` },
        { property: "og:title", content: title },
        { property: "og:description", content: p.shortDescription },
        { property: "og:type", content: "product" },
        { property: "og:url", content: `/product/${params.slug}` },
      ],
      links: [{ rel: "canonical", href: `/product/${params.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: p.name,
            sku: p.sku,
            description: p.shortDescription,
            category: p.categoryName,
            offers: {
              "@type": "Offer",
              price: p.price,
              priceCurrency: "IRR",
              availability:
                p.stockStatus === "instock"
                  ? "https://schema.org/InStock"
                  : "https://schema.org/OutOfStock",
            },
          }),
        },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { product, related } = Route.useLoaderData();
  const { addItem } = useCart();
  const [size, setSize] = useState<string | null>(null);
  const [color, setColor] = useState(product.colors[0]?.label ?? "");
  const [qty, setQty] = useState(1);
  const [guideOpen, setGuideOpen] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState("");

  const outOfStock = product.stockStatus === "outofstock";
  const off = product.salePrice ? discountPercent(product.regularPrice, product.salePrice) : 0;

  const handleAdd = () => {
    if (!size) {
      setError("لطفاً یک سایز انتخاب کنید.");
      return;
    }
    setError("");
    addItem(product, size, color, qty);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className="container-shiko py-8 sm:py-10">
      <Breadcrumbs
        items={[
          { label: "خانه", to: "/" },
          { label: "فروشگاه", to: "/shop" },
          { label: product.categoryName, to: "/shop", search: { category: product.categorySlug } },
          { label: product.name },
        ]}
      />

      <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-14">
        <ProductGallery images={product.images} name={product.name} />

        <div>
          <span className="eyebrow">{product.categoryName}</span>
          <h1 className="mt-2 text-2xl font-black leading-10 sm:text-3xl">{product.name}</h1>
          <p className="mt-2 text-xs text-muted-foreground">کد کالا: {product.sku}</p>

          <div className="mt-5 flex flex-wrap items-baseline gap-3">
            <span className="text-xl font-bold">{formatToman(product.price)}</span>
            {product.salePrice && (
              <>
                <span className="text-sm text-muted-foreground line-through">
                  {formatToman(product.regularPrice)}
                </span>
                <span className="rounded-sm bg-primary px-2 py-1 text-[0.7rem] font-bold text-primary-foreground">
                  ٪{toPersianDigits(off)} تخفیف
                </span>
              </>
            )}
          </div>

          <p className="mt-6 text-sm leading-8 text-muted-foreground">{product.description}</p>

          <div className="mt-8">
            <h2 className="text-sm font-bold">رنگ: {color}</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.colors.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.label)}
                  aria-pressed={color === c.label}
                  aria-label={`رنگ ${c.label}`}
                  className={cn(
                    "flex items-center gap-2 rounded-sm border px-3 py-2 text-xs transition-colors",
                    color === c.label ? "border-foreground" : "border-border hover:border-foreground/40",
                  )}
                >
                  <span
                    className="h-4 w-4 rounded-full border border-border"
                    style={{ backgroundColor: c.hex }}
                  />
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-7">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold">انتخاب سایز</h2>
              <button
                type="button"
                onClick={() => setGuideOpen(true)}
                className="flex items-center gap-1 text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                <Ruler className="h-3.5 w-3.5" />
                راهنمای سایز
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => {
                    setSize(s.label);
                    setError("");
                  }}
                  aria-pressed={size === s.label}
                  className={cn(
                    "h-11 min-w-12 rounded-sm border px-3 text-sm transition-colors",
                    size === s.label
                      ? "border-foreground bg-primary text-primary-foreground"
                      : "border-border hover:border-foreground/40",
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
            {error && (
              <p role="alert" className="mt-2 text-xs text-destructive">
                {error}
              </p>
            )}
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <div className="flex h-12 items-center rounded-sm border border-border">
              <button
                type="button"
                aria-label="کاهش تعداد"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="grid h-full w-11 place-items-center hover:bg-secondary"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center text-sm">{toPersianDigits(qty)}</span>
              <button
                type="button"
                aria-label="افزایش تعداد"
                onClick={() => setQty((q) => Math.min(10, q + 1))}
                className="grid h-full w-11 place-items-center hover:bg-secondary"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <Button size="lg" onClick={handleAdd} disabled={outOfStock} className="flex-1 min-w-40">
              {outOfStock ? "این محصول ناموجود است" : added ? "به سبد اضافه شد" : "افزودن به سبد خرید"}
            </Button>
          </div>

          {added && (
            <p className="mt-3 flex items-center gap-1.5 text-xs text-[var(--color-success)]">
              <Check className="h-4 w-4" />
              محصول به سبد اضافه شد.{" "}
              <Link to="/cart" className="underline underline-offset-4">
                مشاهده سبد خرید
              </Link>
            </p>
          )}

          <ul className="mt-8 space-y-2.5 border-t border-border pt-6 text-xs text-muted-foreground">
            <li className="flex items-center gap-2">
              <Truck className="h-4 w-4 shrink-0" /> ارسال دو تا چهار روز کاری به سراسر ایران
            </li>
            <li>
              وضعیت موجودی:{" "}
              {outOfStock ? "ناموجود" : `${toPersianDigits(product.stockQuantity)} عدد در انبار`}
            </li>
          </ul>
        </div>
      </div>

      <section className="mt-20" aria-labelledby="related-title">
        <h2 id="related-title" className="mb-8 text-xl font-bold">
          پیشنهاد برای تکمیل ست
        </h2>
        <ProductGrid products={related} />
      </section>

      <SizeGuide open={guideOpen} onClose={() => setGuideOpen(false)} category={product.categorySlug} />
    </div>
  );
}
