import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useState } from "react";
import { categories } from "@/data/products";
import { useCart } from "@/store/cart";
import { toPersianDigits } from "@/lib/format";

const navItems = [
  { label: "فروشگاه", to: "/shop" as const, search: {} },
  ...categories.map((c) => ({ label: c.name, to: "/shop" as const, search: { category: c.slug } })),
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [term, setTerm] = useState("");
  const { count } = useCart();
  const navigate = useNavigate();

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!term.trim()) return;
    setSearchOpen(false);
    setMenuOpen(false);
    navigate({ to: "/shop", search: { q: term.trim() } });
    setTerm("");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="container-shiko">
        <div className="grid h-16 grid-cols-[auto_1fr_auto] items-center gap-3 md:h-20">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="grid h-9 w-9 place-items-center rounded-sm md:hidden"
              aria-label="منو"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <Link to="/" className="flex flex-col leading-none" aria-label="صفحه اصلی شیکو">
              <span className="text-xl font-black tracking-[0.32em] text-foreground">SHIKO</span>
              <span className="mt-1 text-[0.6rem] tracking-[0.35em] text-muted-foreground">شیکو</span>
            </Link>
          </div>

          <nav aria-label="ناوبری اصلی" className="hidden justify-center md:flex">
            <ul className="flex items-center gap-7 text-sm">
              {navItems.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    search={item.search as never}
                    className="text-foreground/80 transition-colors hover:text-foreground"
                    activeOptions={{ exact: true, includeSearch: true }}
                    activeProps={{ className: "text-foreground font-bold" }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center justify-end gap-1">
            <button
              type="button"
              aria-label="جست‌وجو"
              onClick={() => setSearchOpen((v) => !v)}
              className="grid h-9 w-9 place-items-center rounded-sm hover:bg-secondary"
            >
              <Search className="h-[1.15rem] w-[1.15rem]" />
            </button>
            <Link
              to="/account"
              aria-label="حساب کاربری"
              className="grid h-9 w-9 place-items-center rounded-sm hover:bg-secondary"
            >
              <User className="h-[1.15rem] w-[1.15rem]" />
            </Link>
            <Link
              to="/cart"
              aria-label={`سبد خرید، ${count} کالا`}
              className="relative grid h-9 w-9 place-items-center rounded-sm hover:bg-secondary"
            >
              <ShoppingBag className="h-[1.15rem] w-[1.15rem]" />
              {count > 0 && (
                <span className="absolute -top-0.5 left-0 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-[0.6rem] font-bold text-accent-foreground">
                  {toPersianDigits(count)}
                </span>
              )}
            </Link>
          </div>
        </div>

        {searchOpen && (
          <form onSubmit={submitSearch} className="border-t border-border py-3" role="search">
            <div className="flex items-center gap-2">
              <input
                autoFocus
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="جست‌وجوی محصول یا دسته‌بندی…"
                aria-label="جست‌وجوی محصول"
                className="h-11 w-full rounded-sm border border-input bg-card px-3 text-sm"
              />
              <button type="submit" className="h-11 shrink-0 rounded-sm bg-primary px-5 text-sm text-primary-foreground">
                جست‌وجو
              </button>
            </div>
          </form>
        )}
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="بستن منو"
            className="absolute inset-0 bg-foreground/40"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 w-[80%] max-w-xs bg-card p-5">
            <div className="flex items-center justify-between">
              <span className="text-lg font-black tracking-[0.3em]">SHIKO</span>
              <button
                type="button"
                aria-label="بستن منو"
                onClick={() => setMenuOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-sm hover:bg-secondary"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav aria-label="ناوبری موبایل" className="mt-8">
              <ul className="space-y-1">
                {navItems.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      search={item.search as never}
                      onClick={() => setMenuOpen(false)}
                      className="block rounded-sm px-3 py-3 text-sm hover:bg-secondary"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-6 space-y-1 border-t border-border pt-6 text-sm">
                <Link to="/account" onClick={() => setMenuOpen(false)} className="block rounded-sm px-3 py-3 hover:bg-secondary">
                  حساب کاربری
                </Link>
                <Link to="/cart" onClick={() => setMenuOpen(false)} className="block rounded-sm px-3 py-3 hover:bg-secondary">
                  سبد خرید
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
