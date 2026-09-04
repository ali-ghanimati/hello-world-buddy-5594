```tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { CheckCircle2, ShoppingBag } from "lucide-react";
import { useCart } from "@/store/cart";
import { formatToman, toPersianDigits } from "@/lib/format";
import { Breadcrumbs } from "@/components/base/Breadcrumbs";
import { Button } from "@/components/base/Button";
import { TextField } from "@/components/base/Input";
import { EmptyState } from "@/components/base/EmptyState";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "تکمیل سفارش | شیکو" },
      {
        name: "description",
        content:
          "ثبت اطلاعات ارسال و نهایی کردن سفارش در فروشگاه شیکو.",
      },
      {
        property: "og:title",
        content: "تکمیل سفارش | شیکو",
      },
      {
        property: "og:description",
        content: "ثبت اطلاعات ارسال و نهایی کردن سفارش.",
      },
      {
        property: "og:url",
        content: "/checkout",
      },
      {
        name: "robots",
        content: "noindex",
      },
    ],
    links: [
      {
        rel: "canonical",
        href: "/checkout",
      },
    ],
  }),

  component: CheckoutPage,
});

interface FormState {
  fullName: string;
  phone: string;
  city: string;
  address: string;
  postalCode: string;
}

interface CheckoutOrderItem {
  productId: number;
  variationId: number;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  size: string;
  color: string;
}

interface CheckoutOrderPayload {
  customer: {
    fullName: string;
    phone: string;
    city: string;
    address: string;
    postalCode: string;
  };

  paymentMethod: "online" | "cod";

  items: CheckoutOrderItem[];

  totals: {
    subtotal: number;
    shipping: number;
    total: number;
  };
}

const EMPTY: FormState = {
  fullName: "",
  phone: "",
  city: "",
  address: "",
  postalCode: "",
};

function CheckoutPage() {
  const { lines, totals, clear } = useCart();

  const [form, setForm] =
    useState<FormState>(EMPTY);

  const [errors, setErrors] =
    useState<Partial<FormState>>({});

  const [payment, setPayment] =
    useState<"online" | "cod">("online");

  const [orderId, setOrderId] =
    useState<string | null>(null);

  const [submitError, setSubmitError] =
    useState("");

  const [submitting, setSubmitting] =
    useState(false);

  const set =
    (key: keyof FormState) =>
    (e: { target: { value: string } }) =>
      setForm((current) => ({
        ...current,
        [key]: e.target.value,
      }));

  const validate = () => {
    const next: Partial<FormState> = {};

    if (form.fullName.trim().length < 3) {
      next.fullName =
        "نام و نام خانوادگی را کامل وارد کنید.";
    }

    if (!/^09\d{9}$/.test(form.phone.trim())) {
      next.phone =
        "شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود.";
    }

    if (!form.city.trim()) {
      next.city = "شهر را وارد کنید.";
    }

    if (form.address.trim().length < 10) {
      next.address =
        "نشانی را کامل‌تر بنویسید.";
    }

    if (!/^\d{10}$/.test(form.postalCode.trim())) {
      next.postalCode =
        "کد پستی باید ۱۰ رقم باشد.";
    }

    setErrors(next);

    return Object.keys(next).length === 0;
  };

  const buildOrderPayload =
    (): CheckoutOrderPayload => {
      return {
        customer: {
          fullName: form.fullName.trim(),
          phone: form.phone.trim(),
          city: form.city.trim(),
          address: form.address.trim(),
          postalCode: form.postalCode.trim(),
        },

        paymentMethod: payment,

        items: lines.map((line) => ({
          productId: line.productId,
          variationId: line.variationId,
          name: line.name,
          sku: line.sku,
          quantity: line.quantity,
          price: line.price,
          size: line.size,
          color: line.color,
        })),

        totals: {
          subtotal: totals.subtotal,
          shipping: totals.shipping,
          total: totals.total,
        },
      };
    };

  const submit = async (e: FormEvent) => {
    e.preventDefault();

    setSubmitError("");

    if (!validate()) {
      return;
    }

    if (lines.length === 0) {
      setSubmitError(
        "سبد خرید شما خالی است.",
      );
      return;
    }

    setSubmitting(true);

    try {
      /*
       * ساختار سفارش نهایی.
       *
       * این Payload در مرحله بعد مستقیماً
       * به Server/API Layer منتقل خواهد شد.
       *
       * مسیر نهایی:
       *
       * Checkout
       *   ↓
       * Server API
       *   ↓
       * WooCommerce
       */
      const orderPayload =
        buildOrderPayload();

      /*
       * فعلاً Mock
       *
       * در مرحله اتصال WooCommerce این قسمت
       * با چیزی شبیه این جایگزین می‌شود:
       *
       * await createWooCommerceOrder(orderPayload)
       *
       * توجه:
       * اطلاعات حساس WooCommerce نباید
       * در Browser قرار بگیرد.
       */

      console.log(
        "SHIKO Checkout Order:",
        orderPayload,
      );

      await new Promise((resolve) =>
        window.setTimeout(resolve, 700),
      );

      const generatedOrderId =
        `SHK-${Math.floor(
          100000 + Math.random() * 899999,
        )}`;

      setOrderId(generatedOrderId);

      clear();
    } catch {
      setSubmitError(
        "ثبت سفارش با خطا مواجه شد. لطفاً دوباره تلاش کنید.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (orderId) {
    return (
      <div className="container-shiko py-16">
        <div className="mx-auto max-w-md rounded-md border border-border bg-card p-8 text-center">
          <CheckCircle2 className="mx-auto h-10 w-10 text-[var(--color-success)]" />

          <h1 className="mt-5 text-xl font-bold">
            سفارش شما ثبت شد
          </h1>

          <p className="mt-3 text-sm leading-8 text-muted-foreground">
            شماره پیگیری سفارش:{" "}
            <span className="font-bold text-foreground">
              {toPersianDigits(orderId)}
            </span>

            <br />

            {payment === "online"
              ? "در مرحله اتصال درگاه، به صفحه پرداخت هدایت خواهید شد."
              : "سفارش شما برای پرداخت در محل ثبت شد."}
          </p>

          <div className="mt-7 flex flex-col gap-3">
            <Link to="/account">
              <Button className="w-full">
                پیگیری در حساب کاربری
              </Button>
            </Link>

            <Link to="/shop">
              <Button
                variant="outline"
                className="w-full"
              >
                ادامه خرید
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="container-shiko py-16">
        <h1 className="mb-6 text-2xl font-black">
          تکمیل سفارش
        </h1>

        <EmptyState
          icon={ShoppingBag}
          title="سبدی برای پرداخت وجود ندارد"
          description="ابتدا محصولی به سبد خرید اضافه کنید تا بتوانید سفارش را ثبت کنید."
          action={
            <Link to="/shop">
              <Button>
                مشاهده فروشگاه
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="container-shiko py-8 sm:py-10">
      <Breadcrumbs
        items={[
          {
            label: "خانه",
            to: "/",
          },
          {
            label: "سبد خرید",
            to: "/cart",
          },
          {
            label: "تکمیل سفارش",
          },
        ]}
      />

      <h1 className="mt-5 text-2xl font-black sm:text-3xl">
        تکمیل سفارش
      </h1>

      <form
        onSubmit={submit}
        noValidate
        className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]"
      >
        <div className="space-y-8">
          {/* اطلاعات خریدار */}
          <section
            aria-labelledby="customer-info"
            className="rounded-md border border-border bg-card p-5"
          >
            <h2
              id="customer-info"
              className="text-sm font-bold"
            >
              اطلاعات خریدار
            </h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <TextField
                label="نام و نام خانوادگی"
                value={form.fullName}
                onChange={set("fullName")}
                error={errors.fullName}
                autoComplete="name"
              />

              <TextField
                label="شماره موبایل"
                value={form.phone}
                onChange={set("phone")}
                error={errors.phone}
                inputMode="numeric"
                dir="ltr"
                placeholder="09xxxxxxxxx"
                autoComplete="tel"
              />

              <TextField
                label="شهر"
                value={form.city}
                onChange={set("city")}
                error={errors.city}
                autoComplete="address-level2"
              />

              <TextField
                label="کد پستی"
                value={form.postalCode}
                onChange={set("postalCode")}
                error={errors.postalCode}
                inputMode="numeric"
                dir="ltr"
                autoComplete="postal-code"
              />

              <div className="sm:col-span-2">
                <TextField
                  label="نشانی کامل"
                  value={form.address}
                  onChange={set("address")}
                  error={errors.address}
                  autoComplete="street-address"
                />
              </div>
            </div>
          </section>

          {/* روش ارسال */}
          <section
            aria-labelledby="shipping"
            className="rounded-md border border-border bg-card p-5"
          >
            <h2
              id="shipping"
              className="text-sm font-bold"
            >
              روش ارسال
            </h2>

            <p className="mt-4 rounded-sm bg-secondary px-4 py-3 text-sm leading-7 text-muted-foreground">
              ارسال با پست پیشتاز، دو تا چهار روز کاری.{" "}

              {totals.shipping === 0
                ? "برای این سفارش رایگان است."
                : formatToman(
                    totals.shipping,
                  )}
            </p>
          </section>

          {/* روش پرداخت */}
          <section
            aria-labelledby="payment"
            className="rounded-md border border-border bg-card p-5"
          >
            <h2
              id="payment"
              className="text-sm font-bold"
            >
              روش پرداخت
            </h2>

            <div className="mt-4 space-y-2">
              {[
                {
                  value: "online" as const,
                  label:
                    "پرداخت اینترنتی",
                },
                {
                  value: "cod" as const,
                  label:
                    "پرداخت در محل هنگام تحویل",
                },
              ].map((option) => (
                <label
                  key={option.value}
                  className="flex cursor-pointer items-center gap-3 rounded-sm border border-border px-4 py-3 text-sm"
                >
                  <input
                    type="radio"
                    name="payment"
                    value={option.value}
                    checked={
                      payment ===
                      option.value
                    }
                    onChange={() =>
                      setPayment(
                        option.value,
                      )
                    }
                    className="accent-[var(--color-accent)]"
                  />

                  {option.label}
                </label>
              ))}
            </div>

            <p className="mt-3 text-xs text-muted-foreground">
              پرداخت واقعی در مرحله اتصال
              WooCommerce و درگاه پرداخت
              فعال خواهد شد.
            </p>
          </section>

          {submitError && (
            <div
              role="alert"
              className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
            >
              {submitError}
            </div>
          )}
        </div>

        {/* خلاصه سفارش */}
        <aside className="h-fit rounded-md border border-border bg-card p-5 lg:sticky lg:top-24">
          <h2 className="text-sm font-bold">
            خلاصه سفارش
          </h2>

          <ul className="mt-4 space-y-3 text-xs">
            {lines.map((line) => (
              <li
                key={line.key}
                className="flex items-start justify-between gap-3"
              >
                <span className="min-w-0 text-muted-foreground">
                  {line.name} ×{" "}
                  {toPersianDigits(
                    line.quantity,
                  )}

                  <br />

                  سایز {line.size} —{" "}
                  {line.color}

                  <br />

                  کد: {line.sku}
                </span>

                <span className="shrink-0">
                  {formatToman(
                    line.price *
                      line.quantity,
                  )}
                </span>
              </li>
            ))}
          </ul>

          <dl className="mt-5 space-y-3 border-t border-border pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">
                جمع کالاها
              </dt>

              <dd>
                {formatToman(
                  totals.subtotal,
                )}
              </dd>
            </div>

            <div className="flex justify-between">
              <dt className="text-muted-foreground">
                ارسال
              </dt>

              <dd>
                {totals.shipping === 0
                  ? "رایگان"
                  : formatToman(
                      totals.shipping,
                    )}
              </dd>
            </div>

            <div className="flex justify-between border-t border-border pt-3 text-base font-bold">
              <dt>پرداخت نهایی</dt>

              <dd>
                {formatToman(
                  totals.total,
                )}
              </dd>
            </div>
          </dl>

          <Button
            type="submit"
            size="lg"
            className="mt-6 w-full"
            disabled={submitting}
          >
            {submitting
              ? "در حال ثبت سفارش..."
              : "ثبت سفارش"}
          </Button>
        </aside>
      </form>
    </div>
  );
}
```
