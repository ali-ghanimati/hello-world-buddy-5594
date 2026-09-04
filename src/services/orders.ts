import type {
  Order,
  OrderAddress,
  OrderItem,
  OrderSummaryTotals,
} from "@/lib/types";

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
    discount?: number;
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
        productId: 5,
        variationId: 5001,
        name: "پیراهن آکسفورد سفید",
        sku: "SHK-SHR-001-L-WH",
        size: "L",
        color: "سفید",
        quantity: 1,
        price: 1450000,
      },
      {
        productId: 10,
        variationId: 10001,
        name: "شلوار چینو کلاسیک",
        sku: "SHK-PNT-002-34-CM",
        size: "۳۴",
        color: "شتری",
        quantity: 1,
        price: 1490000,
      },
    ],

    totals: {
      subtotal: 2940000,
      discount: 0,
      shipping: 0,
      total: 2940000,
    },

    address: {
      fullName: "کاربر شیکو",
      phone: "09120000000",
      city: "تهران",
      address: "خیابان ولیعصر، کوچه بهار، پلاک ۱۲",
      postalCode: "1111111111",
    },
  },

  {
    id: "SHK-۱۴۰۳۱۹۸",
    date: "۳ مرداد ۱۴۰۳",
    status: "shipped",

    items: [
      {
        productId: 13,
        variationId: 13001,
        name: "کفش لوفر چرم طبیعی",
        sku: "SHK-SHO-001-42-BR",
        size: "۴۲",
        color: "قهوه‌ای",
        quantity: 1,
        price: 2890000,
      },
    ],

    totals: {
      subtotal: 2890000,
      discount: 0,
      shipping: 0,
      total: 2890000,
    },

    address: {
      fullName: "کاربر شیکو",
      phone: "09120000000",
      city: "تهران",
      address: "سعادت‌آباد، بلوار دریا، پلاک ۴۵",
      postalCode: "1111111111",
    },
  },

  {
    id: "SHK-۱۴۰۳۱۵۴",
    date: "۲۱ خرداد ۱۴۰۳",
    status: "processing",

    items: [
      {
        productId: 1,
        variationId: 1001,
        name: "تیشرت پنبه‌ای پیما کلاسیک",
        sku: "SHK-TSH-001-M-CR",
        size: "M",
        color: "کرم",
        quantity: 2,
        price: 545000,
      },
    ],

    totals: {
      subtotal: 1090000,
      discount: 0,
      shipping: 0,
      total: 1090000,
    },

    address: {
      fullName: "کاربر شیکو",
      phone: "09120000000",
      city: "تهران",
      address: "خیابان ولیعصر، کوچه بهار، پلاک ۱۲",
      postalCode: "1111111111",
    },
  },
];

/**
 * Get current user's orders.
 *
 * Mock for now.
 *
 * Later:
 *
 * GET /api/orders
 *        ↓
 * Server/API layer
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
  const orderNumber = Math.floor(
    100000 + Math.random() * 900000,
  );

  const items: OrderItem[] = input.items.map((item) => ({
    productId: item.productId,
    variationId: item.variationId,

    name: item.name,
    sku: item.sku,

    size: item.size,
    color: item.color,

    quantity: item.quantity,
    price: item.price,
  }));

  const totals: OrderSummaryTotals = {
    subtotal: input.totals.subtotal,
    discount: input.totals.discount ?? 0,
    shipping: input.totals.shipping,
    total: input.totals.total,
  };

  const address: OrderAddress = {
    fullName: input.customer.fullName,
    phone: input.customer.phone,
    city: input.customer.city,
    address: input.customer.address,
    postalCode: input.customer.postalCode,
  };

  const order: Order = {
    id: `SHK-${orderNumber}`,

    date: new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date()),

    status: "processing",

    items,

    totals,

    address,
  };

  // Add the newest order to the beginning
  // of the mock order history.
  MOCK_ORDERS.unshift(order);

  return {
    order,
  };
}

export const ORDER_STATUS_LABEL: Record<
  Order["status"],
  string
> = {
  processing: "در حال پردازش",
  shipped: "ارسال شده",
  completed: "تحویل شده",
  cancelled: "لغو شده",
};
