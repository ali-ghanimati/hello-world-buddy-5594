import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";

export interface Crumb {
  label: string;
  to?: string;
  search?: Record<string, unknown>;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="مسیر صفحه" className="text-xs text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-1.5">
            {item.to ? (
              <Link
                to={item.to}
                search={item.search as never}
                className="transition-colors hover:text-foreground"
              >
                {item.label as ReactNode}
              </Link>
            ) : (
              <span className="text-foreground">{item.label}</span>
            )}
            {i < items.length - 1 && <ChevronLeft className="h-3 w-3 opacity-60" />}
          </li>
        ))}
      </ol>
    </nav>
  );
}
