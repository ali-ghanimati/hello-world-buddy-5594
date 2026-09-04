import type { Order } from "@/lib/types";

export interface CreateOrderItemInput {
  productId: number;
  variationId: number;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  size: string;
  color: string;
}

export interface CreateOrderInput {
  customer: {
    fullName: string;
    phone: string;
    city: string;
    address: string;
    postalCode: string;
  };

  paymentMethod: "online" | "cod";

  items: CreateOrderItemInput[];

  totals: {
    subtotal: number;
    shipping: number;
    total: number;
  };
}

export interface CreateOrderResult {
  order: Order;
  paymentUrl?: string;
}

/**
 * Mock order history.
 *
 * Production:
 * This service will eventually communicate with the server/API layer,
 * which will communicate with WooCommerce.
 */
const MOCK_ORDERS: Order[] = [
  {
    id: "SHK-۱۴۰۳۲۲۱",
    date: "۱۲ شهریور ۱۴۰۳",
    status: "completed",
    items: [
      {
        name: "پیراهن آکسفورد سفید",
        size: "L",
        color: "سفید",
        quantity: 1,
        price: 1450000,
      },
      {
        name: "شلوار چینو کلاسیک",
        size: "۳۴",
        color: "شتری",
        quantity: 1,
        price: 1490000,
      },
    ],
    total: 2940000,
    address: "تهران، خیابان ولیعصر، کوچه بهار، پلاک ۱۲",
  },
  {
    id: "SHK-۱۴۰۳۱۹۸",
    date: "۳ مرداد ۱۴۰۳",
    status: "shipped",
    items: [
      {
        name: "کفش لوفر چرم طبیعی",
        size: "۴۲",
        color: "قهوه‌ای",
        quantity: 1,
        price: 2890000,
      },
    ],
    total: 2890000,
    address: "تهران، سعادت‌آباد، بلوار دریا، پلاک ۴۵",
  },
  {
    id: "SHK-۱۴۰۳۱۵۴",
    date: "۲۱ خرداد ۱۴۰۳",
    status: "processing",
    items: [
      {
        name: "تیشرت پنبه‌ای پیما کلاسیک",
        size: "M",
        color: "کرم",
        quantity: 2,
        price: 545000,
      },
    ],
    total: 1090000,
    address: "تهران، خیابان ولیعصر، کوچه بهار، پلاک ۱۲",
  },
];

/**
 * Get current user's orders.
 *
 * Mock for now.
 *
 * Later:
 * GET /api/orders
 *        ↓
 * WooCommerce REST API
 */
export async function getOrders(): Promise<Order[]> {
  return [...MOCK_ORDERS];
}

/**
 * Create a new order.
 *
 * Currently this creates a local mock order
 * and adds it to the in-memory order history.
 *
 * Later:
 *
 * Frontend
 *   ↓
 * /api/orders
 *   ↓
 * WooCommerce
 */
export async function createOrder(
  input: CreateOrderInput,
): Promise<CreateOrderResult> {
  const orderNumber = Math.floor(100000 + Math.random() * 900000);

  const order: Order = {
    id: `SHK-${orderNumber}`,

    date: new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date()),

    status: "processing",

    items: input.items.map((item) => ({
      name: item.name,
      size: item.size,
      color: item.color,
      quantity: item.quantity,
      price: item.price,
    })),

    total: input.totals.total,

    address: `${input.customer.city}، ${input.customer.address}`,
  };

  // Add the newest order to the beginning of the mock order list.
  MOCK_ORDERS.unshift(order);

  return {
    order,
  };
}

export const ORDER_STATUS_LABEL: Record<Order["status"], string> = {
  processing: "در حال پردازش",
  shipped: "ارسال شده",
  completed: "تحویل شده",
  cancelled: "لغو شده",
};
