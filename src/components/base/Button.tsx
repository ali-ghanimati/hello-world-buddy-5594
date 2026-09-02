import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "outline" | "ghost" | "navy";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/90",
  navy: "bg-navy text-primary-foreground hover:bg-navy/90",
  outline: "border border-foreground/25 text-foreground hover:bg-secondary",
  ghost: "text-foreground hover:bg-secondary",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-[0.8rem]",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-7 text-sm",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

export function Button({ variant = "primary", size = "md", className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-sm font-medium transition-colors duration-150 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
