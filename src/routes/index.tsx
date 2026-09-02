import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, PackageCheck, RefreshCcw, ShieldCheck } from "lucide-react";
import { getBestSellers, getCategories, getNewArrivals } from "@/services/catalog";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { CategoryCard } from "@/components/shop/CategoryCard";
import heroImg from "@/assets/hero.jpg";
import editorialImg from "@/assets/editorial.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "شیکو | پوشاک مردانه کلاسیک و ماندگار" },
      {
        name: "description",
        content:
          "شیکو، پوشاک مردانه با طراحی آرام و ماندگار: تیشرت، پیراهن، شلوار و کفش با پارچه و دوخت باکیفیت. ارسال به سراسر ایران.",
      },
      { property: "og:title", content: "شیکو | پوشاک مردانه کلاسیک و ماندگار" },
      {
        property: "og:description",
        content: "تیشرت، پیراهن، شلوار و کفش مردانه با طراحی ساده، رنگ‌های خنثی و کیفیت ماندگار.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  loader: async () => ({
    categories: await getCategories(),
    newArrivals: await getNewArrivals(4),
    bestSellers: await getBestSellers(4),
  }),
  component: HomePage,
});

function SectionHeading({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string;
  title: string;
  action?: { label: string; search?: Record<string, unknown> };
}) {
  return (
    <div className="mb-8 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
      <div className="min-w-0">
        <span className="eyebrow">{eyebrow}</span>
        <h2 className="mt-2 text-xl font-bold sm:text-2xl">{title}</h2>
      </div>
      {action && (
        <Link
          to="/shop"
          search={(action.search ?? {}) as never}
          className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          {action.label}
          <ArrowLeft className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}

function HomePage() {
  const { categories, newArrivals, bestSellers } = Route.useLoaderData();

  return (
    <>
      <section className="border-b border-border bg-secondary/40">
        <div className="container-shiko grid items-center gap-8 py-10 lg:grid-cols-2 lg:gap-14 lg:py-16">
          <div className="order-2 lg:order-1">
            <span className="eyebrow">مجموعه پاییز — تهران</span>
            <h1 className="mt-4 text-3xl font-black leading-[1.35] sm:text-4xl lg:text-[2.7rem]">
              استایل ماندگار، انتخاب امروز
            </h1>
            <p className="mt-5 max-w-md text-sm leading-8 text-muted-foreground sm:text-base">
              لباس‌هایی که هر سال دوباره می‌پوشید؛ پارچه‌ای که دوام می‌آورد، برشی که روی بدن می‌نشیند
              و رنگ‌هایی که با بقیه کمد شما جور در می‌آید.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/shop"
                className="inline-flex h-12 items-center rounded-sm bg-primary px-7 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                مشاهده مجموعه
              </Link>
              <Link
                to="/shop"
                search={{ category: "shirt" }}
                className="inline-flex h-12 items-center rounded-sm border border-foreground/25 px-7 text-sm font-medium transition-colors hover:bg-secondary"
              >
                پیراهن‌های جدید
              </Link>
            </div>
          </div>
          <div className="order-1 overflow-hidden lg:order-2">
            <img
              src={heroImg}
              alt="مرد جوان با کت بژ، پیراهن سفید و شلوار سرمه‌ای در نور طبیعی"
              width={1600}
              height={1104}
              fetchPriority="high"
              className="aspect-[4/3] w-full object-cover lg:aspect-[5/4]"
            />
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <ul className="container-shiko grid gap-4 py-6 text-xs text-muted-foreground sm:grid-cols-3 sm:text-sm">
          <li className="flex items-center gap-2">
            <PackageCheck className="h-4 w-4 shrink-0" /> ارسال رایگان سفارش‌های بالای ۳ میلیون تومان
          </li>
          <li className="flex items-center gap-2">
            <RefreshCcw className="h-4 w-4 shrink-0" /> هفت روز مهلت تعویض سایز
          </li>
          <li className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 shrink-0" /> ضمانت اصالت پارچه و دوخت
          </li>
        </ul>
      </section>

      <section className="container-shiko py-14 sm:py-16" aria-labelledby="categories-title">
        <div className="mb-8">
          <span className="eyebrow">دسته‌بندی‌ها</span>
          <h2 id="categories-title" className="mt-2 text-xl font-bold sm:text-2xl">
            از کجا شروع کنیم؟
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {categories.map((c) => (
            <CategoryCard key={c.slug} category={c} />
          ))}
        </div>
      </section>

      <section className="container-shiko py-4 sm:py-6" aria-labelledby="new-title">
        <SectionHeading eyebrow="تازه‌ها" title="جدیدترین محصولات" action={{ label: "همه محصولات جدید" }} />
        <h2 id="new-title" className="sr-only">
          جدیدترین محصولات
        </h2>
        <ProductGrid products={newArrivals} />
      </section>

      <section className="mt-20 border-y border-border bg-secondary/40">
        <div className="container-shiko grid items-center gap-8 py-12 lg:grid-cols-2 lg:gap-16 lg:py-16">
          <div className="overflow-hidden">
            <img
              src={editorialImg}
              alt="دست مردی که سردست پیراهن کتانی خود را مرتب می‌کند"
              width={1408}
              height={1008}
              loading="lazy"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
          <div>
            <span className="eyebrow">فلسفه شیکو</span>
            <h2 className="mt-3 text-xl font-bold leading-9 sm:text-2xl">
              کمتر بخرید، بهتر بپوشید
            </h2>
            <p className="mt-5 text-sm leading-8 text-muted-foreground">
              ما دنبال مد فصلی نیستیم. هر قطعه شیکو با پارچه‌ای انتخاب می‌شود که بعد از ده‌ها بار
              شست‌وشو هم فرم خود را نگه دارد و با الگویی دوخته می‌شود که روی اندام واقعی مردان ایرانی
              تست شده است.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-foreground">
              <li className="border-r-2 border-accent pr-3">پارچه‌های طبیعی و نفس‌گیر</li>
              <li className="border-r-2 border-accent pr-3">رنگ‌بندی خنثی و قابل ترکیب</li>
              <li className="border-r-2 border-accent pr-3">تولید محدود در کارگاه‌های تهران</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="container-shiko py-14 sm:py-16" aria-labelledby="best-title">
        <SectionHeading
          eyebrow="محبوب‌ترین‌ها"
          title="پرفروش‌های این فصل"
          action={{ label: "مرتب‌سازی بر اساس محبوبیت", search: { sort: "popular" } }}
        />
        <h2 id="best-title" className="sr-only">
          پرفروش‌ترین محصولات
        </h2>
        <ProductGrid products={bestSellers} />
      </section>

      <section className="container-shiko">
        <div className="rounded-md bg-primary px-6 py-12 text-center text-primary-foreground sm:px-12">
          <h2 className="text-xl font-bold sm:text-2xl">مجموعه کامل را ببینید</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-8 opacity-80">
            بیش از پنجاه قطعه انتخاب‌شده در چهار دسته‌بندی، آماده ارسال به سراسر ایران.
          </p>
          <Link
            to="/shop"
            className="mt-7 inline-flex h-12 items-center rounded-sm bg-background px-8 text-sm font-medium text-foreground transition-opacity hover:opacity-90"
          >
            ورود به فروشگاه
          </Link>
        </div>
      </section>
    </>
  );
}
