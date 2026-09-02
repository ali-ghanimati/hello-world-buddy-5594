import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import type { Category } from "@/lib/types";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      to="/shop"
      search={{ category: category.slug }}
      className="group relative block overflow-hidden bg-secondary"
    >
      <img
        src={category.image}
        alt={`دسته‌بندی ${category.name} شیکو`}
        width={900}
        height={1100}
        loading="lazy"
        decoding="async"
        className="aspect-[3/4] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/70 to-transparent p-4">
        <h3 className="text-base font-bold text-background">{category.name}</h3>
        <span className="mt-1 flex items-center gap-1 text-xs text-background/85">
          مشاهده محصولات
          <ArrowLeft className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}
