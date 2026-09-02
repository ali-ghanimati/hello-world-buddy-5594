import { Modal } from "@/components/base/Modal";
import { toPersianDigits } from "@/lib/format";
import type { CategorySlug } from "@/lib/types";

const TABLES: Record<CategorySlug, { title: string; head: string[]; rows: string[][] }> = {
  tshirt: {
    title: "جدول سایز تیشرت (سانتی‌متر)",
    head: ["سایز", "دور سینه", "قد بالاتنه", "عرض شانه"],
    rows: [
      ["S", "96", "68", "43"],
      ["M", "102", "70", "45"],
      ["L", "108", "72", "47"],
      ["XL", "114", "74", "49"],
      ["2XL", "120", "76", "51"],
    ],
  },
  shirt: {
    title: "جدول سایز پیراهن (سانتی‌متر)",
    head: ["سایز", "دور یقه", "دور سینه", "قد آستین"],
    rows: [
      ["S", "38", "98", "62"],
      ["M", "40", "104", "63"],
      ["L", "42", "110", "64"],
      ["XL", "44", "116", "65"],
      ["2XL", "46", "122", "66"],
    ],
  },
  pants: {
    title: "جدول سایز شلوار (سانتی‌متر)",
    head: ["سایز", "دور کمر", "دور باسن", "قد پا"],
    rows: [
      ["30", "76", "94", "100"],
      ["32", "81", "99", "102"],
      ["34", "86", "104", "104"],
      ["36", "91", "109", "105"],
      ["38", "96", "114", "106"],
    ],
  },
  shoes: {
    title: "جدول سایز کفش",
    head: ["سایز ایران", "طول کف پا (سانتی‌متر)", "معادل EU"],
    rows: [
      ["40", "25.5", "40"],
      ["41", "26.2", "41"],
      ["42", "26.8", "42"],
      ["43", "27.5", "43"],
      ["44", "28.2", "44"],
    ],
  },
};

export function SizeGuide({
  open,
  onClose,
  category,
}: {
  open: boolean;
  onClose: () => void;
  category: CategorySlug;
}) {
  const table = TABLES[category];
  return (
    <Modal open={open} onClose={onClose} title="راهنمای انتخاب سایز">
      <p className="text-sm leading-7 text-muted-foreground">
        اندازه‌ها روی بدن اندازه‌گیری شده‌اند. اگر بین دو سایز قرار می‌گیرید، سایز بزرگ‌تر را انتخاب
        کنید.
      </p>
      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[26rem] border-collapse text-sm">
          <caption className="sr-only">{table.title}</caption>
          <thead>
            <tr className="bg-secondary text-right">
              {table.head.map((h) => (
                <th key={h} scope="col" className="border border-border px-3 py-2 font-bold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row) => (
              <tr key={row[0]}>
                {row.map((cell, i) => (
                  <td key={i} className="border border-border px-3 py-2 text-muted-foreground">
                    {toPersianDigits(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 rounded-sm bg-secondary px-3 py-2.5 text-xs leading-6 text-muted-foreground">
        این اعداد نمونه هستند و پیش از انتشار نهایی با اندازه‌های واقعی الگوی شیکو جایگزین می‌شوند.
      </p>
    </Modal>
  );
}
