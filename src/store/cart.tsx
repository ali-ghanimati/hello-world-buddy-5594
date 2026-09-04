import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type {
  CartLine,
  OrderSummaryTotals,
  Product,
} from "@/lib/types";

const STORAGE_KEY = "shiko.cart.v1";

export const FREE_SHIPPING_THRESHOLD = 3_000_000;
export const SHIPPING_COST = 89_000;

const MAX_QUANTITY = 10;

interface CartContextValue {
  lines: CartLine[];
  count: number;
  totals: OrderSummaryTotals;

  addItem: (
    product: Product,
    size: string,
    color: string,
    quantity?: number,
  ) => void;

  updateQuantity: (
    key: string,
    quantity: number,
  ) => void;

  removeItem: (key: string) => void;

  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  /*
   * Load cart from localStorage
   */
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(
        STORAGE_KEY,
      );

      if (raw) {
        const parsed = JSON.parse(raw);

        if (Array.isArray(parsed)) {
          setLines(parsed as CartLine[]);
        }
      }
    } catch {
      /*
       * Ignore corrupt localStorage data.
       */
    }

    setHydrated(true);
  }, []);

  /*
   * Persist cart to localStorage
   */
  useEffect(() => {
    if (!hydrated) return;

    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(lines),
      );
    } catch {
      /*
       * Ignore storage errors.
       */
    }
  }, [lines, hydrated]);

  /*
   * Add product variation to cart
   */
  const addItem = useCallback(
    (
      product: Product,
      size: string,
      color: string,
      quantity = 1,
    ) => {
      /*
       * Find the exact WooCommerce-style variation
       * using selected size and color.
       */
      const variation = product.variations.find(
        (item) =>
          item.attributes.size?.label === size &&
          item.attributes.color?.label === color,
      );

      /*
       * No matching variation = do not add anything.
       */
      if (!variation) {
        console.warn(
          "No matching product variation found.",
          {
            productId: product.id,
            size,
            color,
          },
        );

        return;
      }

      /*
       * Do not add an out-of-stock variation.
       */
      if (
        variation.stockStatus === "outofstock" ||
        variation.stockQuantity === 0
      ) {
        console.warn(
          "Selected product variation is out of stock.",
          {
            variationId: variation.id,
          },
        );

        return;
      }

      /*
       * Normalize quantity.
       */
      const requestedQuantity = Math.max(
        1,
        Math.min(quantity, MAX_QUANTITY),
      );

      /*
       * If variation has a stock limit,
       * respect that limit.
       */
      const availableStock =
        variation.stockQuantity ?? MAX_QUANTITY;

      const safeQuantity = Math.min(
        requestedQuantity,
        availableStock,
        MAX_QUANTITY,
      );

      /*
       * A cart item is uniquely identified by variation ID.
       *
       * This is important because in WooCommerce
       * each size/color combination is a separate variation.
       */
      const key = `${product.id}-${variation.id}`;

      setLines((prev) => {
        const existing = prev.find(
          (line) => line.key === key,
        );

        /*
         * Existing variation:
         * increase quantity instead of creating
         * another cart line.
         */
        if (existing) {
          const maxAllowed =
            variation.stockQuantity ??
            MAX_QUANTITY;

          const nextQuantity = Math.min(
            existing.quantity + safeQuantity,
            maxAllowed,
            MAX_QUANTITY,
          );

          return prev.map((line) =>
            line.key === key
              ? {
                  ...line,
                  quantity: nextQuantity,
                }
              : line,
          );
        }

        /*
         * New variation.
         */
        return [
          ...prev,
          {
            key,

            productId: product.id,

            variationId: variation.id,

            slug: product.slug,

            name: product.name,

            image:
              variation.image?.src ??
              product.images[0]?.src ??
              "",

            /*
             * Price comes from the variation,
             * not directly from the parent product.
             */
            price: variation.price,

            size:
              variation.attributes.size?.label ??
              size,

            color:
              variation.attributes.color?.label ??
              color,

            quantity: safeQuantity,
          },
        ];
      });
    },
    [],
  );

  /*
   * Update quantity
   */
  const updateQuantity = useCallback(
    (key: string, quantity: number) => {
      setLines((prev) =>
        quantity <= 0
          ? prev.filter(
              (line) => line.key !== key,
            )
          : prev.map((line) => {
              if (line.key !== key) {
                return line;
              }

              return {
                ...line,
                quantity: Math.min(
                  Math.max(quantity, 1),
                  MAX_QUANTITY,
                ),
              };
            }),
      );
    },
    [],
  );

  /*
   * Remove item
   */
  const removeItem = useCallback(
    (key: string) => {
      setLines((prev) =>
        prev.filter(
          (line) => line.key !== key,
        ),
      );
    },
    [],
  );

  /*
   * Clear cart
   */
  const clear = useCallback(() => {
    setLines([]);
  }, []);

  /*
   * Calculate cart totals
   */
  const value = useMemo<CartContextValue>(() => {
    const subtotal = lines.reduce(
      (sum, line) =>
        sum + line.price * line.quantity,
      0,
    );

    const shipping =
      subtotal === 0 ||
      subtotal >= FREE_SHIPPING_THRESHOLD
        ? 0
        : SHIPPING_COST;

    const total = subtotal + shipping;

    return {
      lines,

      count: lines.reduce(
        (sum, line) =>
          sum + line.quantity,
        0,
      ),

      totals: {
        subtotal,
        discount: 0,
        shipping,
        total,
      },

      addItem,

      updateQuantity,

      removeItem,

      clear,
    };
  }, [
    lines,
    addItem,
    updateQuantity,
    removeItem,
    clear,
  ]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);

  if (!ctx) {
    throw new Error(
      "useCart must be used inside CartProvider",
    );
  }

  return ctx;
}
