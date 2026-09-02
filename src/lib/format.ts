export function toPersianDigits(input: string | number): string {
  const digits = "۰۱۲۳۴۵۶۷۸۹";
  return String(input).replace(/\d/g, (d) => digits[Number(d)] ?? d);
}

export function formatPrice(value: number): string {
  return toPersianDigits(value.toLocaleString("en-US"));
}

export function formatToman(value: number): string {
  return `${formatPrice(value)} تومان`;
}

export function discountPercent(regular: number, sale: number): number {
  if (!regular || sale >= regular) return 0;
  return Math.round(((regular - sale) / regular) * 100);
}
