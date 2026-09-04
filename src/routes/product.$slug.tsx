```tsx
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
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

    if (!product) {
      throw notFound();
    }

    return {
      product,
      related: await getRelatedProducts(product),
    };
  },

  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "محصول در دسترس نیست | شیکو" },
          { name: "robots", content: "noindex" },
        ],
      };
    }

    const p = loaderData.product;
    const title = `${p.name} | شیکو`;

    return {
      meta: [
        { title },
        {
          name: "description",
          content: `${p.shortDescription} — خرید ${p.name} از فروشگاه شیکو.`,
        },
        { property: "og:title", content: title },
        { property: "og:description", content: p.shortDescription },
        { property: "og:type", content: "product" },
        { property: "og:url", content: `/product/${params.slug}` },
      ],

      links: [
        {
          rel: "canonical",
          href: `/product/${params.slug}`,
        },
      ],

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

  /*
   * پیدا کردن Variation بر اساس سایز و رنگ انتخاب‌شده
   */
  const selectedVariation = useMemo(() => {
    if (!size || !color) {
      return null;
    }

    return (
      product.variations.find(
        (variation) =>
          variation.attributes.size?.label === size &&
          variation.attributes.color?.label === color,
      ) ?? null
    );
  }, [product.variations, size, color]);

  /*
   * قیمت فعلی محصول
   *
   * اگر Variation انتخاب شده باشد،
   * قیمت Variation معتبرتر از قیمت اصلی Product است.
   */
  const currentPrice = selectedVariation?.price ?? product.price;

  const currentRegularPrice =
    selectedVariation?.regularPrice ?? product.regularPrice;

  const currentSalePrice =
    selectedVariation?.salePrice ?? product.salePrice;

  const currentOnSale =
    selectedVariation?.onSale ?? Boolean(product.salePrice);

  const off =
    currentOnSale && currentSalePrice
      ? discountPercent(currentRegularPrice, currentSalePrice)
      : 0;

  /*
   * وضعیت موجودی Variation انتخاب‌شده
   */
  const currentStockStatus =
    selectedVariation?.stockStatus ?? product.stockStatus;

  const currentStockQuantity =
    selectedVariation?.stockQuantity ?? product.stockQuantity;

  const outOfStock = currentStockStatus === "outofstock";

  /*
   * بررسی اینکه آیا یک سایز + رنگ خاص Variation معتبر دارد یا نه
   */
  const isVariationAvailable = (
    sizeLabel: string,
    colorLabel: string,
  ) => {
    const variation = product.variations.find(
      (item) =>
        item.attributes.size?.label === sizeLabel &&
        item.attributes.color?.label === colorLabel,
    );

    if (!variation) {
      return false;
    }

    if (variation.stockStatus === "outofstock") {
      return false;
    }

    if (
      variation.stockQuantity !== null &&
      variation.stockQuantity <= 0
    ) {
      return false;
    }

    return true;
  };

  /*
   * آیا رنگ انتخاب‌شده برای سایز موردنظر موجود است؟
   */
  const isColorAvailable = (colorLabel: string) => {
    if (!size) {
      return true;
    }

    return isVariationAvailable(size, colorLabel);
  };

  /*
   * آیا سایز انتخاب‌شده برای رنگ موردنظر موجود است؟
   */
  const isSizeAvailable = (sizeLabel: string) => {
    if (!color) {
      return true;
    }

    return isVariationAvailable(sizeLabel, color);
  };

  /*
   * انتخاب رنگ
   */
  const handleColorChange = (colorLabel: string) => {
    setColor(colorLabel);
    setError("");

    /*
     * اگر سایز فعلی با رنگ جدید موجود نباشد،
     * سایز را پاک می‌کنیم تا کاربر مجبور شود
     * یک ترکیب معتبر انتخاب کند.
     */
    if (
      size &&
      !isVariationAvailable(size, colorLabel)
    ) {
      setSize(null);
    }
  };

  /*
   * انتخاب سایز
   */
  const handleSizeChange = (sizeLabel: string) => {
    if (!isSizeAvailable(sizeLabel)) {
      return;
    }

    setSize(sizeLabel);
    setError("");
  };

  /*
   * افزودن محصول به سبد
   */
  const handleAdd = () => {
    if (!size) {
      setError("لطفاً یک سایز انتخاب کنید.");
      return;
    }

    if (!selectedVariation) {
      setError("ترکیب انتخاب‌شده موجود نیست.");
      return;
    }

    if (outOfStock) {
      setError("این ترکیب از محصول در حال حاضر ناموجود است.");
      return;
    }

    if (
      currentStockQuantity !== null &&
      currentStockQuantity < qty
    ) {
      setError(
        `حداکثر ${toPersianDigits(
          currentStockQuantity,
        )} عدد از این ترکیب موجود است.`,
      );
      return;
    }

    setError("");

    addItem(product, size, color, qty);

    setAdded(true);

    window.setTimeout(() => {
      setAdded(false);
    }, 2500);
  };

  /*
   * محدود کردن تعداد خرید بر اساس موجودی Variation
   */
  const maxQuantity =
    currentStockQuantity !== null
      ? Math.min(10, Math.max(1, currentStockQuantity))
      : 10;

  /*
   * اگر Variation انتخاب‌شده موجودی کمتری از
   * تعداد فعلی داشته باشد، quantity را اصلاح می‌کنیم.
   */
  const safeQty = Math.min(qty, maxQuantity);

  return (
    <div className="container-shiko py-8 sm:py-10">
      <Breadcrumbs
        items={[
          { label: "خانه", to: "/" },
          { label: "فروشگاه", to: "/shop" },
          {
            label: product.categoryName,
            to: "/shop",
            search: {
              category: product.categorySlug,
            },
          },
          { label: product.name },
        ]}
      />

      <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-14">
        <ProductGallery
          images={product.images}
          name={product.name}
        />

        <div>
          <span className="eyebrow">
            {product.categoryName}
          </span>

          <h1 className="mt-2 text-2xl font-black leading-10 sm:text-3xl">
            {product.name}
          </h1>

          <p className="mt-2 text-xs text-muted-foreground">
            کد کالا:{" "}
            {selectedVariation?.sku ?? product.sku}
          </p>

          {/* قیمت */}
          <div className="mt-5 flex flex-wrap items-baseline gap-3">
            <span className="text-xl font-bold">
              {formatToman(
                currentOnSale && currentSalePrice
                  ? currentSalePrice
                  : currentPrice,
              )}
            </span>

            {currentOnSale && currentSalePrice && (
              <>
                <span className="text-sm text-muted-foreground line-through">
                  {formatToman(currentRegularPrice)}
                </span>

                <span className="rounded-sm bg-primary px-2 py-1 text-[0.7rem] font-bold text-primary-foreground">
                  ٪{toPersianDigits(off)} تخفیف
                </span>
              </>
            )}
          </div>

          <p className="mt-6 text-sm leading-8 text-muted-foreground">
            {product.description}
          </p>

          {/* رنگ */}
          <div className="mt-8">
            <h2 className="text-sm font-bold">
              رنگ: {color || "انتخاب نشده"}
            </h2>

            <div className="mt-3 flex flex-wrap gap-2">
              {product.colors.map((c) => {
                const available = isColorAvailable(c.label);

                return (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => {
                      if (available) {
                        handleColorChange(c.label);
                      }
                    }}
                    disabled={!available}
                    aria-pressed={color === c.label}
                    aria-label={`رنگ ${c.label}`}
                    className={cn(
                      "flex items-center gap-2 rounded-sm border px-3 py-2 text-xs transition-colors",
                      color === c.label
                        ? "border-foreground"
                        : "border-border hover:border-foreground/40",
                      !available &&
                        "cursor-not-allowed opacity-40 line-through",
                    )}
                  >
                    <span
                      className="h-4 w-4 rounded-full border border-border"
                      style={{
                        backgroundColor: c.hex,
                      }}
                    />

                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* سایز */}
          <div className="mt-7">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold">
                انتخاب سایز
              </h2>

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
              {product.sizes.map((s) => {
                const available = isSizeAvailable(s.label);

                return (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => {
                      if (available) {
                        handleSizeChange(s.label);
                      }
                    }}
                    disabled={!available}
                    aria-pressed={size === s.label}
                    className={cn(
                      "h-11 min-w-12 rounded-sm border px-3 text-sm transition-colors",
                      size === s.label
                        ? "border-foreground bg-primary text-primary-foreground"
                        : "border-border hover:border-foreground/40",
                      !available &&
                        "cursor-not-allowed opacity-40 line-through",
                    )}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>

            {selectedVariation && (
              <p className="mt-2 text-xs text-muted-foreground">
                کد این ترکیب:{" "}
                {selectedVariation.sku}
              </p>
            )}

            {error && (
              <p
                role="alert"
                className="mt-2 text-xs text-destructive"
              >
                {error}
              </p>
            )}
          </div>

          {/* تعداد + افزودن به سبد */}
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <div className="flex h-12 items-center rounded-sm border border-border">
              <button
                type="button"
                aria-label="کاهش تعداد"
                onClick={() =>
                  setQty((q) => Math.max(1, q - 1))
                }
                className="grid h-full w-11 place-items-center hover:bg-secondary"
              >
                <Minus className="h-4 w-4" />
              </button>

              <span className="w-10 text-center text-sm">
                {toPersianDigits(safeQty)}
              </span>

              <button
                type="button"
                aria-label="افزایش تعداد"
                onClick={() =>
                  setQty((q) =>
                    Math.min(maxQuantity, q + 1),
                  )
                }
                disabled={safeQty >= maxQuantity}
                className="grid h-full w-11 place-items-center hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <Button
              size="lg"
              onClick={handleAdd}
              disabled={outOfStock || !selectedVariation}
              className="flex-1 min-w-40"
            >
              {outOfStock
                ? "این ترکیب ناموجود است"
                : added
                  ? "به سبد اضافه شد"
                  : "افزودن به سبد خرید"}
            </Button>
          </div>

          {/* موفقیت */}
          {added && (
            <p className="mt-3 flex items-center gap-1.5 text-xs text-[var(--color-success)]">
              <Check className="h-4 w-4" />

              محصول به سبد اضافه شد.{" "}

              <Link
                to="/cart"
                className="underline underline-offset-4"
              >
                مشاهده سبد خرید
              </Link>
            </p>
          )}

          {/* اطلاعات ارسال و موجودی */}
          <ul className="mt-8 space-y-2.5 border-t border-border pt-6 text-xs text-muted-foreground">
            <li className="flex items-center gap-2">
              <Truck className="h-4 w-4 shrink-0" />

              ارسال دو تا چهار روز کاری به سراسر ایران
            </li>

            <li>
              وضعیت موجودی:{" "}

              {outOfStock
                ? "ناموجود"
                : currentStockQuantity !== null
                  ? `${toPersianDigits(
                      currentStockQuantity,
                    )} عدد از این ترکیب در انبار`
                  : "موجود"}
            </li>
          </ul>
        </div>
      </div>

      {/* محصولات مرتبط */}
      <section
        className="mt-20"
        aria-labelledby="related-title"
      >
        <h2
          id="related-title"
          className="mb-8 text-xl font-bold"
        >
          پیشنهاد برای تکمیل ست
        </h2>

        <ProductGrid products={related} />
      </section>

      <SizeGuide
        open={guideOpen}
        onClose={() => setGuideOpen(false)}
        category={product.categorySlug}
      />
    </div>
  );
}
```
