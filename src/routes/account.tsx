import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { LogOut, MapPin, PackageOpen, UserRound } from "lucide-react";

import { getOrders, ORDER_STATUS_LABEL } from "@/services/orders";
import { formatToman, toPersianDigits } from "@/lib/format";
import { useAuth } from "@/store/auth";

import { Breadcrumbs } from "@/components/base/Breadcrumbs";
import { Button } from "@/components/base/Button";
import { EmptyState } from "@/components/base/EmptyState";
import { cn } from "@/lib/utils";

import type { Order } from "@/lib/types";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "حساب کاربری | شیکو" },
      {
        name: "description",
        content:
          "داشبورد مشتری شیکو: سفارش‌های اخیر، وضعیت ارسال و نشانی‌های ذخیره‌شده.",
      },
      { property: "og:title", content: "حساب کاربری | شیکو" },
      {
        property: "og:description",
        content: "سفارش‌ها، وضعیت ارسال و اطلاعات حساب شما.",
      },
      { property: "og:url", content: "/account" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/account" }],
  }),

  loader: async () => ({
    orders: await getOrders(),
  }),

  component: AccountPage,
});

const STATUS_STYLE: Record<Order["status"], string> = {
  completed:
    "bg-[var(--color-success)]/12 text-[var(--color-success)]",
  shipped: "bg-navy/10 text-navy",
  processing: "bg-accent/15 text-accent",
  cancelled: "bg-destructive/10 text-destructive",
};

function AccountPage() {
  const { orders } = Route.useLoaderData();

  const { user, ready, logout } = useAuth();

  const [tab, setTab] = useState<
    "orders" | "profile" | "addresses"
  >("orders");

  const [loggingOut, setLoggingOut] = useState(false);

  if (!ready) {
    return (
      <div className="container-shiko py-16">
        <div
          className="h-40 animate-pulse rounded-md bg-secondary"
          aria-label="در حال بارگذاری"
        />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container-shiko py-16">
        <h1 className="mb-6 text-2xl font-black">
          حساب کاربری
        </h1>

        <EmptyState
          icon={UserRound}
          title="هنوز وارد نشده‌اید"
          description="برای دیدن سفارش‌ها و اطلاعات حساب، ابتدا وارد شوید یا حساب جدید بسازید."
          action={
            <Link to="/auth">
              <Button>ورود و ثبت‌نام</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const tabs = [
    { key: "orders", label: "سفارش‌ها" },
    { key: "profile", label: "اطلاعات حساب" },
    { key: "addresses", label: "نشانی‌ها" },
  ] as const;

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      await logout();
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="container-shiko py-8 sm:py-10">
      <Breadcrumbs
        items={[
          { label: "خانه", to: "/" },
          { label: "حساب کاربری" },
        ]}
      />

      <header className="mt-5 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-black sm:text-3xl">
            سلام {user.name}
          </h1>

          <p
            className="mt-2 truncate text-sm text-muted-foreground"
            dir="ltr"
          >
            {user.identifier}
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          disabled={loggingOut}
          className="shrink-0"
        >
          <LogOut className="h-4 w-4" />

          {loggingOut ? "در حال خروج..." : "خروج"}
        </Button>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[14rem_minmax(0,1fr)]">
        <nav
          aria-label="بخش‌های حساب"
          className="overflow-x-auto"
        >
          <ul className="flex gap-2 lg:flex-col">
            {tabs.map((t) => (
              <li
                key={t.key}
                className="shrink-0 lg:shrink"
              >
                <button
                  type="button"
                  onClick={() => setTab(t.key)}
                  aria-current={
                    tab === t.key ? "page" : undefined
                  }
                  className={cn(
                    "w-full rounded-sm px-4 py-2.5 text-right text-sm transition-colors",
                    tab === t.key
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-secondary",
                  )}
                >
                  {t.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          {tab === "orders" &&
            (orders.length === 0 ? (
              <EmptyState
                icon={PackageOpen}
                title="هنوز سفارشی ثبت نکرده‌اید"
                description="پس از اولین خرید، سفارش‌ها و وضعیت ارسال آن‌ها اینجا نمایش داده می‌شود."
                action={
                  <Link to="/shop">
                    <Button>شروع خرید</Button>
                  </Link>
                }
              />
            ) : (
              <ul className="space-y-4">
                {orders.map((order) => (
                  <li
                    key={order.id}
                    className="rounded-md border border-border bg-card p-5"
                  >
                    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                      <div className="min-w-0">
                        <h2 className="text-sm font-bold">
                          سفارش {order.id}
                        </h2>

                        <p className="mt-1 text-xs text-muted-foreground">
                          ثبت شده در {order.date}
                        </p>
                      </div>

                      <span
                        className={cn(
                          "shrink-0 rounded-sm px-2.5 py-1 text-[0.7rem] font-bold",
                          STATUS_STYLE[order.status],
                        )}
                      >
                        {ORDER_STATUS_LABEL[order.status]}
                      </span>
                    </div>

                    <ul className="mt-4 space-y-2 border-t border-border pt-4 text-xs text-muted-foreground">
                      {order.items.map((item) => (
                        <li
                          key={`${order.id}-${item.productId}-${item.variationId}`}
                          className="flex flex-wrap justify-between gap-2"
                        >
                          <span>
                            {item.name} — سایز {item.size}،{" "}
                            {item.color} ×{" "}
                            {toPersianDigits(item.quantity)}
                          </span>

                          <span>
                            {formatToman(
                              item.price * item.quantity,
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4 text-sm">
                      <div className="text-xs text-muted-foreground">
                        <span>{order.address.city}، </span>
                        <span>{order.address.address}</span>
                      </div>

                      <span className="font-bold">
                        {formatToman(order.totals.total)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ))}

          {tab === "profile" && (
            <div className="rounded-md border border-border bg-card p-5">
              <h2 className="text-sm font-bold">
                اطلاعات حساب
              </h2>

              <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-xs text-muted-foreground">
                    نام
                  </dt>

                  <dd className="mt-1">
                    {user.name}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs text-muted-foreground">
                    موبایل / ایمیل
                  </dt>

                  <dd className="mt-1" dir="ltr">
                    {user.identifier}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs text-muted-foreground">
                    تعداد سفارش‌ها
                  </dt>

                  <dd className="mt-1">
                    {toPersianDigits(orders.length)}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs text-muted-foreground">
                    عضویت از
                  </dt>

                  <dd className="mt-1">
                    خرداد ۱۴۰۳
                  </dd>
                </div>
              </dl>
            </div>
          )}

          {tab === "addresses" && (
            <ul className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: "نشانی منزل",
                  body: "تهران، خیابان ولیعصر، کوچه بهار، پلاک ۱۲، واحد ۳",
                },
                {
                  title: "نشانی محل کار",
                  body: "تهران، سعادت‌آباد، بلوار دریا، پلاک ۴۵، طبقه ۲",
                },
              ].map((address) => (
                <li
                  key={address.title}
                  className="rounded-md border border-border bg-card p-5"
                >
                  <h2 className="flex items-center gap-2 text-sm font-bold">
                    <MapPin className="h-4 w-4 text-muted-foreground" />

                    {address.title}
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {address.body}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
