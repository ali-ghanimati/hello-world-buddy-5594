import type { Order } from "@/lib/types";

/** Mock order history — replaceable by `/wp-json/wc/v3/orders?customer=<id>`. */
const MOCK_ORDERS: Order[] = [
  {
    id: "SHK-۱۴۰۳۲۲۱",
    date: "۱۲ شهریور ۱۴۰۳",
    status: "completed",
    items: [
      { name: "پیراهن آکسفورد سفید", size: "L", color: "سفید", quantity: 1, price: 1450000 },
      { name: "شلوار چینو کلاسیک", size: "۳۴", color: "شتری", quantity: 1, price: 1490000 },
    ],
    total: 2940000,
    address: "تهران، خیابان ولیعصر، کوچه بهار، پلاک ۱۲",
  },
  {
    id: "SHK-۱۴۰۳۱۹۸",
    date: "۳ مرداد ۱۴۰۳",
    status: "shipped",
    items: [{ name: "کفش لوفر چرم طبیعی", size: "۴۲", color: "قهوه‌ای", quantity: 1, price: 2890000 }],
    total: 2890000,
    address: "تهران، سعادت‌آباد، بلوار دریا، پلاک ۴۵",
  },
  {
    id: "SHK-۱۴۰۳۱۵۴",
    date: "۲۱ خرداد ۱۴۰۳",
    status: "processing",
    items: [{ name: "تیشرت پنبه‌ای پیما کلاسیک", size: "M", color: "کرم", quantity: 2, price: 545000 }],
    total: 1090000,
    address: "تهران، خیابان ولیعصر، کوچه بهار، پلاک ۱۲",
  },
];

export async function getOrders(): Promise<Order[]> {
  return MOCK_ORDERS;
}

export const ORDER_STATUS_LABEL: Record<Order["status"], string> = {
  processing: "در حال پردازش",
  shipped: "ارسال شده",
  completed: "تحویل شده",
  cancelled: "لغو شده",
};
