import { useState } from "react";
import type { ProductImage } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ProductGallery({ images, name }: { images: ProductImage[]; name: string }) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];

  return (
    <div className="flex flex-col-reverse gap-3 md:flex-row">
      <div className="flex gap-3 md:flex-col">
        {images.map((img, i) => (
          <button
            key={img.id}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`تصویر ${i + 1} ${name}`}
            aria-current={i === active}
            className={cn(
              "h-20 w-16 shrink-0 overflow-hidden border transition-colors md:h-24 md:w-20",
              i === active ? "border-foreground" : "border-transparent hover:border-border",
            )}
          >
            <img src={img.src} alt={img.alt} loading="lazy" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-hidden bg-secondary">
        <img
          src={current?.src}
          alt={current?.alt ?? name}
          width={1200}
          height={1500}
          className="aspect-[4/5] w-full object-cover"
        />
      </div>
    </div>
  );
}
