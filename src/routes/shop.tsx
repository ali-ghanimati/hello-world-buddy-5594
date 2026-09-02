import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SearchX, SlidersHorizontal } from "lucide-react";
import { filterProducts, getPriceBounds, getProducts } from "@/services/catalog";
import { categories } from "@/data/products";
import type { CategorySlug, SortKey } from "@/lib/types";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { ProductFilter, type FilterState } from "@/components/shop/ProductFilter";
import { Breadcrumbs } from "@/components/base/Breadcrumbs";
import { EmptyState } from "@/components/base/EmptyState";
import { Modal } from "@/components/base/Modal";
import { Button } from "@/components/base/Button";
import { toPersianDigits } from "@/lib/format";

interface ShopSearch {
  q?: string;
  category?: CategorySlug | "all";
  sort?: SortKey;
  max?: number;
}

const CATEGORY_SLUGS: CategorySlug[] = ["tshirt", "shirt", "pants", "shoes"];
const SORTS: SortKey[] = ["newest", "popular", "price-asc", "price-desc"];

const SORT_LABEL: Record<SortKey, string> = {
  newest: "جدیدترین",
  popular: "محبوب‌ترین",
  "price-asc": "ارزان‌ترین",
  "price-desc": "گران‌ترین",
};

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>): ShopSearch => {
    const category = search["category"] as CategorySlug | "all" | undefined;
    const sort = search["sort"] as SortKey | undefined;
    const max = Number(search["max"]);
    return {
      ...(typeof search["q"] === "string" && search["q"] ? { q: search["q"] } : {}),
      ...(category && (category === "all" || CATEGORY_SLUGS.includes(category)) ? { category } : {}),
      ...(sort && SORTS.includes(sort) ? { sort } : {}),
      ...(Number.isFinite(max) && max > 0 ? { max } : {}),
    };
  },
  head: () => ({
    meta: [
      { title: "فروشگاه شیکو | تیشرت، پیراهن، شلوار و کفش مردانه" },
      {
        name: "description",
        content:
          "همه محصولات شیکو در یک صفحه: فیلتر بر اساس دسته‌بندی و قیمت، مرتب‌سازی و جست‌وجوی سریع میان پوشاک مردانه.",
      },
      { property: "og:title", content: "فروشگاه شیکو" },
      { property: "og:description", content: "پوشاک مردانه شیکو با امکان فیلتر دسته‌بندی و قیمت." },
      { property: "og:url", content: "/shop" },
    ],
    links: [{ rel: "canonical", href: "/shop" }],
  }),
  loader: async () => ({ products: await getProducts() }),
  component: ShopPage,
});

function ShopPage() {
  const { products } = Route.useLoaderData();
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/shop" });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const bounds = useMemo(() => getPriceBounds(products), [products]);

  const state: FilterState = {
    q: search.q ?? "",
    category: search.category ?? "all",
    maxPrice: search.max ?? bounds[1],
    sort: search.sort ?? "newest",
  };

  const activeCategory = categories.find((c) => c.slug === state.category);

  const results = useMemo(
    () =>
      filterProducts(products, {
        search: state.q,
        category: state.category,
        maxPrice: state.maxPrice,
        orderBy: state.sort,
      }),
    [products, state.q, state.category, state.maxPrice, state.sort],
  );

  const patch = (p: Partial<FilterState>) => {
    const next = { ...state, ...p };
    navigate({
      search: {
        ...(next.q ? { q: next.q } : {}),
        ...(next.category !== "all" ? { category: next.category } : {}),
        ...(next.sort !== "newest" ? { sort: next.sort } : {}),
        ...(next.maxPrice < bounds[1] ? { max: next.maxPrice } : {}),
      },
      replace: true,
    });
  };

  const reset = () => navigate({ search: {}, replace: true });

  const filters = (
    <ProductFilter value={state} bounds={bounds} onChange={patch} onReset={reset} />
  );

  return (
    <div className="container-shiko py-8 sm:py-10">
      <Breadcrumbs
        items={[
          { label: "خانه", to: "/" },
          ...(activeCategory
            ? [{ label: "فروشگاه", to: "/shop" }, { label: activeCategory.name }]
            : [{ label: "فروشگاه" }]),
        ]}
      />

      <header className="mt-5 max-w-2xl">
        <h1 className="text-2xl font-black sm:text-3xl">
          {activeCategory ? activeCategory.name : "فروشگاه شیکو"}
        </h1>
        <p className="mt-3 text-sm leading-8 text-muted-foreground">
          {activeCategory
            ? activeCategory.description
            : "همه قطعات مجموعه؛ از تیشرت‌های روزمره تا کفش‌های چرم. با فیلتر دسته‌بندی و قیمت سریع‌تر به انتخاب برسید."}
        </p>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[16rem_minmax(0,1fr)]">
        <aside className="hidden lg:block" aria-label="فیلتر محصولات">
          {filters}
        </aside>

        <div>
          <div className="mb-6 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border pb-4">
            <p className="min-w-0 text-xs text-muted-foreground sm:text-sm">
              {toPersianDigits(results.length)} محصول
              {state.q && <span> برای «{state.q}»</span>}
            </p>
            <div className="flex shrink-0 items-center gap-2">
              <label className="sr-only" htmlFor="sort">
                مرتب‌سازی
              </label>
              <select
                id="sort"
                value={state.sort}
                onChange={(e) => patch({ sort: e.target.value as SortKey })}
                className="h-10 rounded-sm border border-input bg-card px-2 text-xs"
              >
                {SORTS.map((s) => (
                  <option key={s} value={s}>
                    {SORT_LABEL[s]}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="flex h-10 items-center gap-1.5 rounded-sm border border-input px-3 text-xs lg:hidden"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                فیلترها
              </button>
            </div>
          </div>

          {results.length > 0 ? (
            <ProductGrid products={results} columns={3} />
          ) : (
            <EmptyState
              icon={SearchX}
              title="محصولی پیدا نشد"
              description="با این فیلترها محصولی موجود نیست. جست‌وجو را ساده‌تر کنید یا فیلترها را بردارید."
              action={
                <Button variant="outline" onClick={reset}>
                  حذف فیلترها
                </Button>
              }
            />
          )}
        </div>
      </div>

      <Modal open={drawerOpen} onClose={() => setDrawerOpen(false)} title="فیلترها" side>
        {filters}
        <Button className="mt-8 w-full" onClick={() => setDrawerOpen(false)}>
          نمایش {toPersianDigits(results.length)} محصول
        </Button>
      </Modal>
    </div>
  );
}
