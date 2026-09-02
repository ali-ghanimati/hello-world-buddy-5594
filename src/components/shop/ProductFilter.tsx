import { categories } from "@/data/products";
import { formatToman, toPersianDigits } from "@/lib/format";
import type { CategorySlug, SortKey } from "@/lib/types";
import { cn } from "@/lib/utils";

export interface FilterState {
  q: string;
  category: CategorySlug | "all";
  maxPrice: number;
  sort: SortKey;
}

interface Props {
  value: FilterState;
  bounds: [number, number];
  onChange: (patch: Partial<FilterState>) => void;
  onReset: () => void;
}

export function ProductFilter({ value, bounds, onChange, onReset }: Props) {
  const [min, max] = bounds;

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-bold">جست‌وجو</h3>
        <input
          type="search"
          value={value.q}
          onChange={(e) => onChange({ q: e.target.value })}
          placeholder="نام محصول…"
          aria-label="جست‌وجو در محصولات"
          className="mt-3 h-11 w-full rounded-sm border border-input bg-card px-3 text-sm"
        />
      </div>

      <div>
        <h3 className="text-sm font-bold">دسته‌بندی</h3>
        <ul className="mt-3 space-y-1">
          {[{ slug: "all" as const, name: "همه محصولات" }, ...categories].map((c) => (
            <li key={c.slug}>
              <button
                type="button"
                onClick={() => onChange({ category: c.slug as FilterState["category"] })}
                aria-pressed={value.category === c.slug}
                className={cn(
                  "w-full rounded-sm px-3 py-2.5 text-right text-sm transition-colors",
                  value.category === c.slug
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-secondary",
                )}
              >
                {c.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-sm font-bold">حداکثر قیمت</h3>
        <input
          type="range"
          min={min}
          max={max}
          step={50000}
          value={value.maxPrice}
          onChange={(e) => onChange({ maxPrice: Number(e.target.value) })}
          aria-label="حداکثر قیمت"
          className="mt-4 w-full accent-[var(--color-accent)]"
        />
        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>تا {formatToman(value.maxPrice)}</span>
          <span>{toPersianDigits(min.toLocaleString("en-US"))} به بالا</span>
        </div>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="w-full rounded-sm border border-border py-2.5 text-xs hover:bg-secondary"
      >
        حذف فیلترها
      </button>
    </div>
  );
}
