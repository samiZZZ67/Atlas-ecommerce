const API_URL = import.meta.env.VITE_API_URL || import.meta.env.NEXT_PUBLIC_API_URL || "";

export const api = {
  baseUrl: API_URL,
  
  async getProducts() {
    if (!API_URL) return null;
    try {
      const res = await fetch(`${API_URL}/products`);
      const data = await res.json();
      if (data.success && data.data?.products) return data.data.products;
    } catch (err) {
      console.warn("Backend API fetch failed, falling back to local state:", err);
    }
    return null;
  },

  async login(email: string, password: string) {
    if (!API_URL) return null;
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        if (data.data.accessToken) {
          localStorage.setItem("atlas.token", data.data.accessToken);
        }
        return { ok: true, user: data.data.user };
      }
      return { ok: false, error: data.message || "Login failed" };
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Network error";
      return { ok: false, error: msg };
    }
  },

  async register(name: string, email: string, password: string) {
    if (!API_URL) return null;
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        if (data.data.accessToken) {
          localStorage.setItem("atlas.token", data.data.accessToken);
        }
        return { ok: true, user: data.data.user };
      }
      return { ok: false, error: data.message || "Registration failed" };
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Network error";
      return { ok: false, error: msg };
    }
  },

  async placeOrder(address: unknown, paymentLast4: string) {
    if (!API_URL) return null;
    const token = localStorage.getItem("atlas.token");
    if (!token) return null;
    try {
      const res = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ address, paymentLast4 }),
      });
      const data = await res.json();
      if (data.success && data.data) return data.data;
    } catch (err) {
      console.warn("Failed to place order via API:", err);
    }
    return null;
  }
};
