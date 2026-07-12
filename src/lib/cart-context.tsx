import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import API from "@/api/axios";

export type CartItem = {
  productId: string;
  name: string;
  image?: string;
  price: number;
  quantity: number;
  variant?: string;
};

type CartContextValue = {
  items: CartItem[];
  loading: boolean;
  isLoggedIn: boolean;
  subtotal: number;
  addItem: (
    item: Omit<CartItem, "quantity"> & { quantity?: number }
  ) => Promise<void>;
  updateItem: (
    productId: string,
    quantity: number,
    variant?: string
  ) => Promise<void>;
  removeItem: (productId: string, variant?: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refresh: () => Promise<void>;
};

const LOCAL_CART_KEY = "growdoctor_cart";
const TOKEN_KEY = "growdoctor_token";

const CartContext = createContext<CartContextValue | undefined>(undefined);

const isBrowser = typeof window !== "undefined";

function readLocalCart(): CartItem[] {
  if (!isBrowser) return [];

  try {
    return JSON.parse(localStorage.getItem(LOCAL_CART_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeLocalCart(items: CartItem[]) {
  if (!isBrowser) return;

  localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(items));
}

function hasToken() {
  return isBrowser && !!localStorage.getItem(TOKEN_KEY);
}

function mergeLocal(
  items: CartItem[],
  incoming: Omit<CartItem, "quantity"> & { quantity?: number }
) {
  const quantity = incoming.quantity ?? 1;

  const existing = items.find(
    (i) =>
      i.productId === incoming.productId &&
      i.variant === incoming.variant
  );

  if (existing) {
    return items.map((i) =>
      i === existing
        ? { ...i, quantity: i.quantity + quantity }
        : i
    );
  }

  return [...items, { ...incoming, quantity }];
}

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (!isBrowser) return;

    setItems(readLocalCart());

    const loggedIn = hasToken();
    setIsLoggedIn(loggedIn);

    if (!loggedIn) return;

    const bootstrap = async () => {
      setLoading(true);

      try {
        const localItems = readLocalCart();

        if (localItems.length > 0) {
          await API.post("/cart/sync", {
            items: localItems,
          });

          localStorage.removeItem(LOCAL_CART_KEY);
        }

        const res = await API.get("/cart");

        setItems(res.data?.cart?.items ?? []);
      } catch (err) {
        console.error("Failed to sync/load cart", err);
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  const refresh = useCallback(async () => {
    if (!hasToken()) {
      setItems(readLocalCart());
      return;
    }

    setLoading(true);

    try {
      const res = await API.get("/cart");
      setItems(res.data?.cart?.items ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  const addItem = useCallback(async (item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
    if (!hasToken()) {
      setItems((prev) => {
        const next = mergeLocal(prev, item);
        writeLocalCart(next);
        return next;
      });
      return;
    }

    setLoading(true);

    try {
      const res = await API.post("/cart/add", item);
      setItems(res.data?.cart?.items ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateItem = useCallback(
    async (
      productId: string,
      quantity: number,
      variant?: string
    ) => {
      if (!hasToken()) {
        setItems((prev) => {
          const next = prev.map((i) =>
            i.productId === productId &&
            i.variant === variant
              ? { ...i, quantity }
              : i
          );

          writeLocalCart(next);
          return next;
        });

        return;
      }

      setLoading(true);

      try {
        const res = await API.put("/cart/update", {
          productId,
          quantity,
          variant,
        });

        setItems(res.data?.cart?.items ?? []);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const removeItem = useCallback(
    async (productId: string, variant?: string) => {
      if (!hasToken()) {
        setItems((prev) => {
          const next = prev.filter(
            (i) =>
              !(
                i.productId === productId &&
                i.variant === variant
              )
          );

          writeLocalCart(next);
          return next;
        });

        return;
      }

      setLoading(true);

      try {
        const query = variant
          ? `?variant=${encodeURIComponent(variant)}`
          : "";

        const res = await API.delete(
          `/cart/remove/${productId}${query}`
        );

        setItems(res.data?.cart?.items ?? []);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const clearCart = useCallback(async () => {
    if (!hasToken()) {
      setItems([]);
      writeLocalCart([]);
      return;
    }

    setLoading(true);

    try {
      const res = await API.delete("/cart/clear");
      setItems(res.data?.cart?.items ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const value: CartContextValue = {
    items,
    loading,
    isLoggedIn,
    subtotal,
    addItem,
    updateItem,
    removeItem,
    clearCart,
    refresh,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);

  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return ctx;
}