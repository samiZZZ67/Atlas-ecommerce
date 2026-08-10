import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  products as seedProducts,
  type Product,
} from "../data/products";
import { api } from "../utils/api";

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
  items: { productId: string; name: string; qty: number; price: number; image: string }[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: Address;
  paymentLast4: string;
}

export interface Address {
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  region: string;
  postal: string;
  country: string;
}

export interface User {
  email: string;
  name: string;
  isAdmin?: boolean;
}

interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
  user: User | null;
  addToCart: (productId: string, qty?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  placeOrder: (address: Address, last4: string) => Order;
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;
  login: (email: string, password: string) => { ok: boolean; error?: string };
  register: (name: string, email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
  addProduct: (p: Omit<Product, "id" | "slug">) => void;
  updateProduct: (id: string, p: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  cartCount: number;
  cartSubtotal: number;
}

const StoreContext = createContext<StoreContextType | null>(null);

const LS_KEYS = {
  cart: "atlas.cart",
  wishlist: "atlas.wishlist",
  orders: "atlas.orders",
  users: "atlas.users",
  session: "atlas.session",
  products: "atlas.products",
};

function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function saveJSON(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() =>
    loadJSON<Product[]>(LS_KEYS.products, seedProducts),
  );
  const [cart, setCart] = useState<CartItem[]>(() => loadJSON(LS_KEYS.cart, []));
  const [wishlist, setWishlist] = useState<string[]>(() => loadJSON(LS_KEYS.wishlist, []));
  const [orders, setOrders] = useState<Order[]>(() => loadJSON(LS_KEYS.orders, []));
  const [user, setUser] = useState<User | null>(() => loadJSON<User | null>(LS_KEYS.session, null));

  useEffect(() => {
    if (api.baseUrl) {
      api.getProducts().then((apiProducts) => {
        if (apiProducts && apiProducts.length > 0) {
          setProducts(apiProducts);
        }
      });
    }
  }, []);

  useEffect(() => saveJSON(LS_KEYS.products, products), [products]);
  useEffect(() => saveJSON(LS_KEYS.cart, cart), [cart]);
  useEffect(() => saveJSON(LS_KEYS.wishlist, wishlist), [wishlist]);
  useEffect(() => saveJSON(LS_KEYS.orders, orders), [orders]);
  useEffect(() => saveJSON(LS_KEYS.session, user), [user]);

  // ---------- Cart ----------
  const addToCart = (productId: string, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === productId ? { ...i, quantity: i.quantity + qty } : i,
        );
      }
      return [...prev, { productId, quantity: qty }];
    });
  };
  const removeFromCart = (productId: string) =>
    setCart((prev) => prev.filter((i) => i.productId !== productId));
  const updateQty = (productId: string, qty: number) =>
    setCart((prev) =>
      prev
        .map((i) => (i.productId === productId ? { ...i, quantity: Math.max(1, qty) } : i))
        .filter((i) => i.quantity > 0),
    );
  const clearCart = () => setCart([]);

  // ---------- Wishlist ----------
  const toggleWishlist = (productId: string) =>
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
    );

  // ---------- Orders ----------
  const placeOrder = (address: Address, last4: string): Order => {
    const items = cart
      .map((ci) => {
        const p = products.find((x) => x.id === ci.productId);
        if (!p) return null;
        return { productId: p.id, name: p.name, qty: ci.quantity, price: p.price, image: p.images[0] };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);

    const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
    const shipping = subtotal > 200 ? 0 : 18;
    const tax = +(subtotal * 0.08).toFixed(2);
    const total = +(subtotal + shipping + tax).toFixed(2);

    const order: Order = {
      id: "A-" + Math.random().toString(36).slice(2, 9).toUpperCase(),
      date: new Date().toISOString(),
      status: "Processing",
      items,
      subtotal: +subtotal.toFixed(2),
      shipping,
      tax,
      total,
      shippingAddress: address,
      paymentLast4: last4,
    };

    if (api.baseUrl) {
      api.placeOrder(address, last4);
    }

    setOrders((prev) => [order, ...prev]);
    setCart([]);
    return order;
  };

  const updateOrderStatus = (orderId: string, status: Order["status"]) =>
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));

  // ---------- Auth ----------
  const login = (email: string, password: string) => {
    if (api.baseUrl) {
      api.login(email, password).then((res) => {
        if (res && res.ok && res.user) {
          const u = { email: res.user.email, name: res.user.name, isAdmin: res.user.role === 'ADMIN' };
          setUser(u);
        }
      });
    }

    const users = loadJSON<{ email: string; name: string; password: string; isAdmin?: boolean }[]>(
      LS_KEYS.users,
      [],
    );
    // Demo admin account
    if (email === "admin@atlas.com" && password === "admin123") {
      const u = { email, name: "Atlas Admin", isAdmin: true };
      setUser(u);
      return { ok: true };
    }
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!found) return { ok: false, error: "No account with that email." };
    if (found.password !== password) return { ok: false, error: "Incorrect password." };
    setUser({ email: found.email, name: found.name, isAdmin: found.isAdmin });
    return { ok: true };
  };

  const register = (name: string, email: string, password: string) => {
    if (api.baseUrl) {
      api.register(name, email, password).then((res) => {
        if (res && res.ok && res.user) {
          const u = { email: res.user.email, name: res.user.name, isAdmin: res.user.role === 'ADMIN' };
          setUser(u);
        }
      });
    }

    const users = loadJSON<{ email: string; name: string; password: string }[]>(LS_KEYS.users, []);
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, error: "An account with that email already exists." };
    }
    if (password.length < 6) return { ok: false, error: "Password must be at least 6 characters." };
    users.push({ email, name, password });
    saveJSON(LS_KEYS.users, users);
    setUser({ email, name });
    return { ok: true };
  };

  const logout = () => {
    localStorage.removeItem("atlas.token");
    setUser(null);
  };

  // ---------- Admin products ----------
  const addProduct = (p: Omit<Product, "id" | "slug">) => {
    const id = "p" + Date.now().toString(36);
    const slug = slugify(p.name);
    setProducts((prev) => [{ ...p, id, slug }, ...prev]);
  };
  const updateProduct = (id: string, p: Partial<Product>) =>
    setProducts((prev) => prev.map((x) => (x.id === id ? { ...x, ...p } : x)));
  const deleteProduct = (id: string) => setProducts((prev) => prev.filter((x) => x.id !== id));

  const cartCount = useMemo(() => cart.reduce((s, i) => s + i.quantity, 0), [cart]);
  const cartSubtotal = useMemo(
    () =>
      cart.reduce((s, ci) => {
        const p = products.find((x) => x.id === ci.productId);
        return s + (p ? p.price * ci.quantity : 0);
      }, 0),
    [cart, products],
  );

  return (
    <StoreContext.Provider
      value={{
        products,
        cart,
        wishlist,
        orders,
        user,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        toggleWishlist,
        placeOrder,
        updateOrderStatus,
        login,
        register,
        logout,
        addProduct,
        updateProduct,
        deleteProduct,
        cartCount,
        cartSubtotal,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
