import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart, FREE_SHIPPING_THRESHOLD } from "@/store/cart";
import { formatToman, toPersianDigits } from "@/lib/format";
import { Breadcrumbs } from "@/components/base/Breadcrumbs";
import { Button } from "@/components/base/Button";
import { EmptyState } from "@/components/base/EmptyState";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "سبد خرید | شیکو" },
      { name: "description", content: "بررسی و ویرایش کالاهای انتخاب‌شده پیش از تکمیل سفارش در شیکو." },
      { property: "og:title", content: "سبد خرید | شیکو" },
      { property: "og:description", content: "کالاهای انتخابی خود را بررسی و سفارش را نهایی کنید." },
      { property: "og:url", content: "/cart" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/cart" }],
  }),
  component: CartPage,
});

function CartPage() {
  const { lines, totals, updateQuantity, removeItem } = useCart();

  return (
    <div className="container-shiko py-8 sm:py-10">
      <Breadcrumbs items={[{ label: "خانه", to: "/" }, { label: "سبد خرید" }]} />
      <h1 className="mt-5 text-2xl font-black sm:text-3xl">سبد خرید</h1>

      {lines.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            icon={ShoppingBag}
            title="سبد خرید شما خالی است"
            description="هنوز محصولی انتخاب نکرده‌اید. نگاهی به مجموعه بیندازید و قطعه مورد نظرتان را اضافه کنید."
            action={
              <Link to="/shop">
                <Button>مشاهده فروشگاه</Button>
              </Link>
            }
          />
        </div>
      ) : (
        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <ul className="divide-y divide-border border-y border-border">
            {lines.map((line) => (
              <li key={line.key} className="grid grid-cols-[5rem_minmax(0,1fr)] gap-4 py-5 sm:grid-cols-[6.5rem_minmax(0,1fr)]">
                <Link to="/product/$slug" params={{ slug: line.slug }} className="block bg-secondary">
                  <img
                    src={line.image}
                    alt={line.name}
                    loading="lazy"
                    className="aspect-[4/5] w-full object-cover"
                  />
                </Link>
                <div className="min-w-0">
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3">
                    <h2 className="min-w-0 text-sm font-bold leading-6">
                      <Link to="/product/$slug" params={{ slug: line.slug }} className="hover:text-accent">
                        {line.name}
                      </Link>
                    </h2>
                    <button
                      type="button"
                      onClick={() => removeItem(line.key)}
                      aria-label={`حذف ${line.name}`}
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-sm text-muted-foreground hover:bg-secondary hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    سایز {line.size} — رنگ {line.color}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex h-10 items-center rounded-sm border border-border">
                      <button
                        type="button"
                        aria-label="کاهش تعداد"
                        onClick={() => updateQuantity(line.key, line.quantity - 1)}
                        className="grid h-full w-9 place-items-center hover:bg-secondary"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-9 text-center text-sm">{toPersianDigits(line.quantity)}</span>
                      <button
                        type="button"
                        aria-label="افزایش تعداد"
                        onClick={() => updateQuantity(line.key, line.quantity + 1)}
                        className="grid h-full w-9 place-items-center hover:bg-secondary"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <span className="text-sm font-bold">{formatToman(line.price * line.quantity)}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <aside className="h-fit rounded-md border border-border bg-card p-5 lg:sticky lg:top-24">
            <h2 className="text-sm font-bold">خلاصه سفارش</h2>
            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">جمع کالاها</dt>
                <dd>{formatToman(totals.subtotal)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">هزینه ارسال</dt>
                <dd>{totals.shipping === 0 ? "رایگان" : formatToman(totals.shipping)}</dd>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-3 text-base font-bold">
                <dt>مبلغ قابل پرداخت</dt>
                <dd>{formatToman(totals.total)}</dd>
              </div>
            </dl>
            {totals.shipping > 0 && (
              <p className="mt-3 text-xs leading-6 text-muted-foreground">
                با {formatToman(FREE_SHIPPING_THRESHOLD - totals.subtotal)} خرید بیشتر، ارسال رایگان
                می‌شود.
              </p>
            )}
            <Link to="/checkout" className="mt-6 block">
              <Button className="w-full" size="lg">
                ادامه و تکمیل سفارش
              </Button>
            </Link>
            <Link to="/shop" className="mt-3 block">
              <Button variant="outline" className="w-full">
                ادامه خرید
              </Button>
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
