import { Link } from "@tanstack/react-router";
import { Instagram, Mail, MapPin, Phone } from "lucide-react";
import { categories } from "@/data/products";
import { toPersianDigits } from "@/lib/format";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-secondary/50">
      <div className="container-shiko grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <span className="text-lg font-black tracking-[0.32em]">SHIKO</span>
          <p className="mt-4 max-w-xs text-sm leading-7 text-muted-foreground">
            شیکو برندی تهرانی برای مردانی است که لباس را انتخابی بلندمدت می‌دانند؛ پارچه درست، برش
            دقیق و رنگ‌هایی که هیچ فصلی از مد نمی‌افتند.
          </p>
        </div>

        <nav aria-label="دسته‌بندی محصولات">
          <h2 className="text-sm font-bold">دسته‌بندی‌ها</h2>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link to="/shop" search={{ category: c.slug }} className="hover:text-foreground">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="خدمات مشتریان">
          <h2 className="text-sm font-bold">مشتریان</h2>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li>
              <Link to="/account" className="hover:text-foreground">حساب کاربری</Link>
            </li>
            <li>
              <Link to="/account" className="hover:text-foreground">پیگیری سفارش</Link>
            </li>
            <li>
              <Link to="/cart" className="hover:text-foreground">سبد خرید</Link>
            </li>
            <li>
              <Link to="/auth" className="hover:text-foreground">ورود و ثبت‌نام</Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-bold">تماس</h2>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
              <span>تهران، خیابان ولیعصر، نرسیده به پارک‌وی، پلاک {toPersianDigits(248)}</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0" />
              <span dir="ltr">{toPersianDigits("۰۲۱-۹۱۰۰۲۲۳۳")}</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0" />
              <span dir="ltr">hello@shiko.ir</span>
            </li>
            <li className="flex items-center gap-3 pt-1">
              <span className="grid h-9 w-9 place-items-center rounded-full border border-border" aria-label="اینستاگرام شیکو">
                <Instagram className="h-4 w-4" />
              </span>
              <span className="text-xs">shiko.official@</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-shiko flex flex-col gap-2 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {toPersianDigits(1404)} شیکو — تمامی حقوق محفوظ است.</p>
          <p>طراحی و تولید در تهران</p>
        </div>
      </div>
    </footer>
  );
}
