import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { products, productById, type Product } from "@/lib/catalog";
import { COUPONS, DELIVERY_FEE, FREE_DELIVERY_ABOVE, TAX_RATE } from "@/lib/format";

export type CartLine = { productId: string; qty: number };
export type Address = {
  id: string;
  fullName: string;
  mobile: string;
  house: string;
  street: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
};
export type OrderItem = { productId: string; name: string; unit: string; qty: number; price: number };
export type Order = {
  id: string;
  date: string;
  items: OrderItem[];
  total: number;
  payment: string;
  address: Address;
  status: "Confirmed" | "Packed" | "Out for Delivery" | "Delivered";
  eta: string;
};
export type User = { name: string; email: string; mobile: string };

type ShopState = {
  cart: CartLine[];
  wishlist: string[];
  orders: Order[];
  addresses: Address[];
  user: User | null;
  coupon: string | null;
  recentlyViewed: string[];
};

const KEY = "jdp-shop-v1";

const sampleAddress: Address = {
  id: "addr-1",
  fullName: "Abhishek Jain",
  mobile: "9876543210",
  house: "B-204, Shanti Residency",
  street: "MG Road",
  landmark: "Near Jain Mandir",
  city: "Indore",
  state: "Madhya Pradesh",
  pincode: "452001",
};

const sampleOrder: Order = {
  id: "JDP10245",
  date: "02 Aug 2026",
  items: [
    { productId: "JDP-001", name: "Cold Pressed Til Oil", unit: "1 Litre", qty: 1, price: 379 },
    { productId: "JDP-019", name: "Moong Dhuli", unit: "1 Kg", qty: 1, price: 149 },
    { productId: "JDP-041", name: "Makhana", unit: "250 Gm", qty: 1, price: 299 },
  ],
  total: 1049,
  payment: "Cash on Delivery",
  address: sampleAddress,
  status: "Out for Delivery",
  eta: "Tomorrow, 10 AM - 1 PM",
};

const initialState: ShopState = {
  cart: [],
  wishlist: [],
  orders: [sampleOrder],
  addresses: [sampleAddress],
  user: null,
  coupon: null,
  recentlyViewed: [],
};

type ShopContextValue = ShopState & {
  hydrated: boolean;
  cartItems: { product: Product; qty: number }[];
  cartCount: number;
  totals: {
    subtotal: number;
    mrpTotal: number;
    discount: number;
    couponDiscount: number;
    delivery: number;
    tax: number;
    total: number;
    savings: number;
  };
  qtyOf: (id: string) => number;
  addToCart: (id: string, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  toggleWishlist: (id: string) => void;
  inWishlist: (id: string) => boolean;
  applyCoupon: (code: string) => { ok: boolean; message: string };
  removeCoupon: () => void;
  login: (user: User) => void;
  logout: () => void;
  addAddress: (address: Omit<Address, "id">) => Address;
  placeOrder: (payment: string, address: Address) => Order;
  markViewed: (id: string) => void;
};

const ShopContext = createContext<ShopContextValue | null>(null);

export function ShopProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ShopState>(initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(KEY);
      if (stored) setState({ ...initialState, ...(JSON.parse(stored) as Partial<ShopState>) });
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(KEY, JSON.stringify(state));
  }, [state, hydrated]);

  const patch = useCallback((fn: (s: ShopState) => ShopState) => setState((s) => fn(s)), []);

  const cartItems = useMemo(
    () =>
      state.cart
        .map((line) => {
          const product = productById(line.productId);
          return product ? { product, qty: line.qty } : null;
        })
        .filter((v): v is { product: Product; qty: number } => v !== null),
    [state.cart],
  );

  const totals = useMemo(() => {
    const subtotal = cartItems.reduce((sum, i) => sum + i.product.price * i.qty, 0);
    const mrpTotal = cartItems.reduce((sum, i) => sum + i.product.mrp * i.qty, 0);
    const discount = mrpTotal - subtotal;
    const c = state.coupon ? COUPONS[state.coupon] : undefined;
    const couponDiscount = c && subtotal >= c.minimum ? c.amount : 0;
    const delivery = subtotal === 0 || subtotal >= FREE_DELIVERY_ABOVE ? 0 : DELIVERY_FEE;
    const taxable = Math.max(subtotal - couponDiscount, 0);
    const tax = Math.round(taxable * TAX_RATE);
    return {
      subtotal,
      mrpTotal,
      discount,
      couponDiscount,
      delivery,
      tax,
      total: Math.max(taxable + delivery + tax, 0),
      savings: discount + couponDiscount,
    };
  }, [cartItems, state.coupon]);

  const value: ShopContextValue = {
    ...state,
    hydrated,
    cartItems,
    cartCount: state.cart.reduce((n, l) => n + l.qty, 0),
    totals,
    qtyOf: (id) => state.cart.find((l) => l.productId === id)?.qty ?? 0,
    addToCart: (id, qty = 1) =>
      patch((s) => {
        const existing = s.cart.find((l) => l.productId === id);
        return {
          ...s,
          cart: existing
            ? s.cart.map((l) => (l.productId === id ? { ...l, qty: l.qty + qty } : l))
            : [...s.cart, { productId: id, qty }],
        };
      }),
    setQty: (id, qty) =>
      patch((s) => ({
        ...s,
        cart: qty <= 0 ? s.cart.filter((l) => l.productId !== id) : s.cart.map((l) => (l.productId === id ? { ...l, qty } : l)),
      })),
    removeFromCart: (id) => patch((s) => ({ ...s, cart: s.cart.filter((l) => l.productId !== id) })),
    clearCart: () => patch((s) => ({ ...s, cart: [], coupon: null })),
    toggleWishlist: (id) =>
      patch((s) => ({
        ...s,
        wishlist: s.wishlist.includes(id) ? s.wishlist.filter((w) => w !== id) : [id, ...s.wishlist],
      })),
    inWishlist: (id) => state.wishlist.includes(id),
    applyCoupon: (code) => {
      const key = code.trim().toUpperCase();
      const c = COUPONS[key];
      if (!c) return { ok: false, message: "Invalid coupon code" };
      if (totals.subtotal < c.minimum)
        return { ok: false, message: `Add items worth ₹${c.minimum - totals.subtotal} more to use ${key}` };
      patch((s) => ({ ...s, coupon: key }));
      return { ok: true, message: `${key} applied — ${c.label}` };
    },
    removeCoupon: () => patch((s) => ({ ...s, coupon: null })),
    login: (user) => patch((s) => ({ ...s, user })),
    logout: () => patch((s) => ({ ...s, user: null })),
    addAddress: (address) => {
      const full: Address = { ...address, id: `addr-${Date.now()}` };
      patch((s) => ({ ...s, addresses: [full, ...s.addresses] }));
      return full;
    },
    placeOrder: (payment, address) => {
      const order: Order = {
        id: `JDP${10246 + state.orders.length}`,
        date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
        items: cartItems.map((i) => ({
          productId: i.product.id,
          name: i.product.name,
          unit: i.product.unit,
          qty: i.qty,
          price: i.product.price,
        })),
        total: totals.total,
        payment,
        address,
        status: "Confirmed",
        eta: "Tomorrow, 10 AM - 1 PM",
      };
      patch((s) => ({ ...s, orders: [order, ...s.orders], cart: [], coupon: null }));
      return order;
    },
    markViewed: (id) =>
      patch((s) => ({ ...s, recentlyViewed: [id, ...s.recentlyViewed.filter((r) => r !== id)].slice(0, 8) })),
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used inside ShopProvider");
  return ctx;
}

export const allProducts = products;
