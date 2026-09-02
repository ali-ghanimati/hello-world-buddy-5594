import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  side?: boolean;
}

export function Modal({ open, onClose, title, children, side = false }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex" role="dialog" aria-modal="true" aria-label={title}>
      <button
        type="button"
        aria-label="بستن"
        onClick={onClose}
        className="absolute inset-0 bg-foreground/35"
      />
      <div
        className={
          side
            ? "relative m-0 h-full w-[86%] max-w-sm overflow-y-auto bg-card p-5 shadow-xl"
            : "relative m-auto max-h-[86vh] w-[92%] max-w-2xl overflow-y-auto rounded-md bg-card p-6 shadow-xl"
        }
      >
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-base font-bold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="بستن"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-sm text-muted-foreground hover:bg-secondary"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
