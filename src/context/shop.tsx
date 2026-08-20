import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  apiAddCartItem,
  apiClearCart,
  apiCreateCustomerAddress,
  apiCreateOrder,
  apiCustomerProfile,
  apiDeleteCartItem,
  apiDeliveryFee,
  apiGetCustomerAddresses,
  apiGetCustomerCart,
  apiGetCustomerOrders,
  apiUpdateCartItem,
  setAuthToken,
} from "@/lib/api";
import { getProducts, normalizeImageUrl, productByIdSync, type Product } from "@/lib/catalog";
import { COUPONS, TAX_RATE } from "@/lib/format";

export type CartLine = {
  productId: string;
  qty: number;
  unitPrice?: number;
  product?: {
    name?: string;
    slug?: string;
    unit?: string;
    price?: number;
    image?: string;
  };
};
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
export type User = {
  id?: string | number;
  name: string;
  email: string;
  mobile: string;
};

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

const normalizeAddress = (entry: any, fallback?: Address): Address => {
  const fullName = entry?.full_name || entry?.fullName || entry?.label || entry?.name || fallback?.fullName || "";
  const mobile = entry?.mobile || entry?.phone || entry?.phone_number || fallback?.mobile || "";
  const house = entry?.house || entry?.line_one || entry?.address_line_1 || entry?.line1 || fallback?.house || "";
  const street = entry?.street || entry?.line_two || entry?.area || entry?.address_line_2 || entry?.line2 || fallback?.street || "";
  const landmark = entry?.landmark || fallback?.landmark || "";
  const city = entry?.city || fallback?.city || "";
  const state = entry?.state || fallback?.state || "";
  const pincode = entry?.pincode || entry?.postal_code || fallback?.pincode || "";

  return {
    id: String(entry?.id ?? fallback?.id ?? `addr-${Date.now()}`),
    fullName,
    mobile,
    house,
    street,
    landmark,
    city,
    state,
    pincode,
  };
};

const normalizeUser = (entry: any): User => ({
  id: entry?.id ?? entry?.customer_id ?? entry?.user_id,
  name: entry?.name || entry?.full_name || entry?.first_name || "Jain Customer",
  email: entry?.email || "customer@jaindesiandpure.in",
  mobile: entry?.mobile || entry?.phone || entry?.phone_number || "",
});

const fallbackProductFromCartLine = (line: CartLine): Product | null => {
  const snapshot = line.product;
  const price = Number(line.unitPrice ?? snapshot?.price ?? 0);
  if (!snapshot?.name && price <= 0) return null;

  return {
    id: line.productId,
    name: snapshot?.name || "Product",
    slug: snapshot?.slug || line.productId,
    category: "",
    categoryName: "",
    description: "",
    price,
    mrp: price,
    discount: 0,
    unit: snapshot?.unit || "",
    image: normalizeImageUrl(snapshot?.image),
    stock: 0,
    rating: 0,
    reviewCount: 0,
    tags: [],
    bestseller: false,
    featured: false,
    brand: "Jain Desi and Pure",
  };
};

const normalizeOrder = (entry: any, fallback?: Order): Order => {
  const address = entry?.address ? normalizeAddress(entry.address, fallback?.address) : fallback?.address ?? {
    id: "addr-1",
    fullName: "",
    mobile: "",
    house: "",
    street: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
  };

  const mappedStatus = String(entry?.status ?? fallback?.status ?? "Confirmed");
  const normalizedStatus = mappedStatus.toLowerCase() === "pending" ? "Confirmed" : mappedStatus;

  const rawItems = Array.isArray(entry?.items)
    ? entry.items
    : Array.isArray(entry?.products)
      ? entry.products
      : [];

  const items = rawItems.map((item: any) => ({
    productId: String(item?.product_id ?? item?.productId ?? item?.id ?? ""),
    name: item?.name || item?.product_name || "Item",
    unit: item?.unit || item?.size || "",
    qty: Number(item?.quantity ?? item?.qty ?? 1),
    price: Number(item?.price ?? item?.unit_price ?? 0),
  }));

  return {
    id: String(entry?.id ?? entry?.order_number ?? entry?.orderId ?? fallback?.id ?? "JDP"),
    date: entry?.created_at ? new Date(entry.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : fallback?.date ?? new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
    items,
    total: Number(entry?.total ?? entry?.grand_total ?? entry?.amount ?? fallback?.total ?? 0),
    payment: entry?.payment_method || entry?.payment || fallback?.payment || "Cash on Delivery",
    address,
    status: normalizedStatus as Order["status"],
    eta: entry?.eta || fallback?.eta || "Tomorrow, 10 AM - 1 PM",
  };
};

const initialState: ShopState = {
  cart: [],
  wishlist: [],
  orders: [],
  addresses: [],
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
  addAddress: (address: Omit<Address, "id">) => Promise<Address>;
  placeOrder: (payment: string, address: Address) => Promise<Order>;
  markViewed: (id: string) => void;
};

const ShopContext = createContext<ShopContextValue | null>(null);

export function ShopProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ShopState>(initialState);
  const [hydrated, setHydrated] = useState(false);
  const [catalogLoaded, setCatalogLoaded] = useState(false);
  const [deliveryFee, setDeliveryFee] = useState(0);

  const patch = useCallback((fn: (s: ShopState) => ShopState) => setState((s) => fn(s)), []);

  const hydrateCustomerData = useCallback(async (customerId?: string | number) => {
    if (!customerId) return;

    try {
      const customer = await apiCustomerProfile(String(customerId));
      const profile = normalizeUser(customer);
      const profileResponse = Array.isArray(customer?.addresses) ? customer.addresses : await apiGetCustomerAddresses(String(customerId));
      const addresses = (Array.isArray(profileResponse) ? profileResponse : []).map((entry) => normalizeAddress(entry));
      const ordersResponse = await apiGetCustomerOrders(String(customerId));
      const orders = (Array.isArray(ordersResponse) ? ordersResponse : []).map((entry) => normalizeOrder(entry));
      const cartResponse = await apiGetCustomerCart(String(customerId));
      const remoteItems = Array.isArray(cartResponse?.items) ? cartResponse.items : [];

      patch((s) => ({
        ...s,
        user: { ...s.user, ...profile },
        addresses,
        orders,
        cart: remoteItems
          .map((item: any) => ({
            productId: String(item?.product_id ?? item?.productId ?? item?.id ?? ""),
            qty: Number(item?.quantity ?? item?.qty ?? 1),
            unitPrice: Number(item?.unit_price ?? item?.product?.price ?? 0),
            product: item?.product ? {
              name: item.product.name,
              slug: item.product.slug,
              unit: item.product.unit,
              price: Number(item.product.price ?? 0),
              image: normalizeImageUrl(item.product.image_url),
            } : undefined,
          }))
          .filter((line) => Boolean(line.productId) && Number(line.qty) > 0),
      }));
    } catch (error) {
      console.warn("Customer sync failed:", error);
    }
  }, [patch]);

  useEffect(() => {
    getProducts()
      .then(() => setCatalogLoaded(true))
      .catch((err) => console.error("Failed to load products:", err));
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<ShopState>;
        setState({ ...initialState, ...parsed });
      }
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(KEY, JSON.stringify(state));
  }, [state, hydrated]);

  useEffect(() => {
    if (state.user?.id) {
      hydrateCustomerData(state.user.id);
    }
  }, [state.user?.id, hydrateCustomerData]);

  const cartItems = useMemo(
    () =>
      state.cart
        .map((line) => {
          const catalogProduct = productByIdSync(String(line.productId));
          const product = catalogProduct
            ? {
                ...catalogProduct,
                image: catalogProduct.image || normalizeImageUrl(line.product?.image),
              }
            : fallbackProductFromCartLine(line);
          return product ? { product, qty: Number(line.qty) || 0 } : null;
        })
        .filter((v): v is { product: Product; qty: number } => v !== null && v.qty > 0),
    [state.cart, catalogLoaded],
  );

  const totals = useMemo(() => {
    const subtotal = cartItems.reduce((sum, i) => sum + i.product.price * i.qty, 0);
    const mrpTotal = cartItems.reduce((sum, i) => sum + i.product.mrp * i.qty, 0);
    const discount = mrpTotal - subtotal;
    const c = state.coupon ? COUPONS[state.coupon] : undefined;
    const couponDiscount = c && subtotal >= c.minimum ? c.amount : 0;
    const delivery = subtotal > 0 ? deliveryFee : 0;
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
  }, [cartItems, state.coupon, deliveryFee]);

  useEffect(() => {
    let active = true;
    const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.qty, 0);

    if (subtotal <= 0) {
      setDeliveryFee(0);
      return () => {
        active = false;
      };
    }

    apiDeliveryFee({ subtotal })
      .then((response) => {
        if (active) setDeliveryFee(Number(response.delivery_fee) || 0);
      })
      .catch((error) => {
        console.error("Failed to load delivery fee:", error);
        if (active) setDeliveryFee(0);
      });

    return () => {
      active = false;
    };
  }, [cartItems]);

  const value: ShopContextValue = {
    ...state,
    hydrated,
    cartItems,
    cartCount: state.cart.reduce((n, l) => n + (Number(l.qty) || 0), 0),
    totals,
    qtyOf: (id) => state.cart.find((l) => String(l.productId) === String(id))?.qty ?? 0,
    addToCart: async (id, qty = 1) => {
      if (!state.user?.id) {
        if (typeof window !== "undefined") {
          window.location.assign("/login");
        }
        return;
      }

      try {
        const cart = await apiGetCustomerCart(String(state.user.id));
        const items = Array.isArray(cart?.items) ? cart.items : [];
        const existing = items.find((item: any) => String(item?.product_id ?? item?.productId) === String(id));

        if (existing) {
          await apiUpdateCartItem(String(state.user.id), String(existing.id), { quantity: Number(existing.quantity ?? 0) + qty });
        } else {
          await apiAddCartItem(String(state.user.id), { product_id: id, quantity: qty });
        }

        await hydrateCustomerData(state.user.id);
      } catch (error) {
        console.error("Add-to-cart failed:", error);
      }
    },
    setQty: async (id, qty) => {
      if (!state.user?.id) {
        patch((s) => ({
          ...s,
          cart: qty <= 0 ? s.cart.filter((l) => String(l.productId) !== String(id)) : s.cart.map((l) => (String(l.productId) === String(id) ? { ...l, qty } : l)),
        }));
        return;
      }

      try {
        const cart = await apiGetCustomerCart(String(state.user.id));
        const items = Array.isArray(cart?.items) ? cart.items : [];
        const existing = items.find((item: any) => String(item?.product_id ?? item?.productId) === String(id));

        if (!existing) {
          if (qty > 0) {
            await apiAddCartItem(String(state.user.id), { product_id: id, quantity: qty });
          }
        } else if (qty <= 0) {
          await apiDeleteCartItem(String(state.user.id), String(existing.id));
        } else {
          await apiUpdateCartItem(String(state.user.id), String(existing.id), { quantity: qty });
        }

        await hydrateCustomerData(state.user.id);
      } catch (error) {
        console.error("Update cart quantity failed:", error);
      }
    },
    removeFromCart: async (id) => {
      if (!state.user?.id) {
        patch((s) => ({ ...s, cart: s.cart.filter((l) => l.productId !== id) }));
        return;
      }

      try {
        const cart = await apiGetCustomerCart(String(state.user.id));
        const items = Array.isArray(cart?.items) ? cart.items : [];
        const existing = items.find((item: any) => String(item?.product_id ?? item?.productId) === String(id));
        if (existing) {
          await apiDeleteCartItem(String(state.user.id), String(existing.id));
          await hydrateCustomerData(state.user.id);
        }
      } catch (error) {
        console.error("Remove from cart failed:", error);
      }
    },
    clearCart: async () => {
      if (!state.user?.id) {
        patch((s) => ({ ...s, cart: [], coupon: null }));
        return;
      }

      try {
        await apiClearCart(String(state.user.id));
        await hydrateCustomerData(state.user.id);
      } catch (error) {
        console.error("Clear cart failed:", error);
      }
    },
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
    login: (user) => {
      const normalizedUser = normalizeUser(user);
      patch((s) => ({ ...s, user: normalizedUser }));
    },
    logout: () => {
      setAuthToken(null);
      patch((s) => ({ ...s, user: null, addresses: [], orders: [] }));
    },
    addAddress: async (address) => {
      if (!state.user?.id) {
        throw new Error("Please log in to save an address.");
      }

      const payload = {
        label: `${address.fullName}`.trim() || "Home",
        line_one: address.house,
        line_two: address.street,
        area: address.street || address.house,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        landmark: address.landmark,
        is_default: true,
      };

      const created = await apiCreateCustomerAddress(String(state.user.id), payload);
      const full = normalizeAddress(created, {
        id: String(created?.id ?? `addr-${Date.now()}`),
        fullName: address.fullName,
        mobile: address.mobile,
        house: address.house,
        street: address.street,
        landmark: address.landmark,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
      });

      await hydrateCustomerData(state.user.id);
      patch((s) => ({ ...s, addresses: [full, ...s.addresses.filter((entry) => entry.id !== full.id)] }));
      return full;
    },
    placeOrder: async (payment, address) => {
      if (!state.user?.id) {
        throw new Error("Please log in to place an order.");
      }

      const paymentMethod = payment === "Cash on Delivery" ? "cod" : payment === "UPI" ? "upi" : "card";
      const response = await apiCreateOrder({
        customer_id: state.user.id,
        customer_address_id: address.id,
        payment_method: paymentMethod,
        items: cartItems.map((i) => ({
          product_id: i.product.id,
          quantity: i.qty,
        })),
      });

      const order = normalizeOrder(response, {
        id: String(response?.id ?? response?.order_number ?? `JDP${Date.now()}`),
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
      });

      await hydrateCustomerData(state.user.id);
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
