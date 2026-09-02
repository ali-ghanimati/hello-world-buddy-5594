import { cn } from "@/lib/utils";
import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from "react";

interface FieldProps {
  label: string;
  error?: string | undefined;
  hint?: string | undefined;
  children: (id: string) => ReactNode;
}

export function Field({ label, error, hint, children }: FieldProps) {
  const id = useId();
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-foreground">
        {label}
      </label>
      {children(id)}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

export const inputClass =
  "w-full rounded-sm border border-input bg-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 transition-colors focus:border-foreground/40";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string | undefined;
  hint?: string | undefined;
}

export function TextField({ label, error, hint, className, ...props }: TextFieldProps) {
  return (
    <Field label={label} error={error} hint={hint}>
      {(id) => (
        <input
          id={id}
          aria-invalid={Boolean(error)}
          className={cn(inputClass, error && "border-destructive", className)}
          {...props}
        />
      )}
    </Field>
  );
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
}

export function SelectField({ label, options, className, ...props }: SelectFieldProps) {
  return (
    <Field label={label}>
      {(id) => (
        <select id={id} className={cn(inputClass, "appearance-none", className)} {...props}>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      )}
    </Field>
  );
}
