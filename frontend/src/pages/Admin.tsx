import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { categories } from "../data/products";
import { Icon } from "../components/Icons";
import { StatusPill } from "./Account";
import type { Order } from "../context/StoreContext";
import type { Product } from "../data/products";

export default function Admin() {
  const { user, products, orders, updateOrderStatus, deleteProduct, addProduct, updateProduct, login } = useStore();
  const [tab, setTab] = useState<"overview" | "products" | "orders" | "customers" | "analytics">("overview");

  // Product filters and modal state
  const [productSearch, setProductSearch] = useState("");
  const [productCategoryFilter, setProductCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState<"all" | "low" | "out">("all");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  // Order filters
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // New Product Form State
  const [formData, setFormData] = useState({
    name: "",
    category: "fabric",
    subcategory: "",
    price: 45,
    originalPrice: 0,
    stock: 50,
    unit: "per yard",
    origin: "Italy",
    description: "",
    details: "Composition: 100% Organic\nOrigin: Certified Mill\nCare: Professional clean",
    images: "https://images.unsplash.com/photo-1558171813-4c088753af8f?auto=format&fit=crop&w=900&q=80",
    tags: "sustainable, luxury, artisan",
    featured: false,
    bestseller: false,
    newArrival: true,
  });

  // Admin Access Gate
  if (!user?.isAdmin) {
    return (
      <div className="max-w-[600px] mx-auto px-5 py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-sand flex items-center justify-center mx-auto mb-6 text-clay">
          <Icon.Shield size={32} />
        </div>
        <h1 className="font-display text-3xl md:text-4xl mb-3">Atlas Operations Gate</h1>
        <p className="text-stone text-sm mb-8">
          This portal requires Atlas Admin credentials. Sign in to manage store inventory, fulfill orders, and inspect real-time metrics.
        </p>
        <div className="bg-sand/30 border border-ink/10 p-6 space-y-4 text-left mb-6">
          <div className="text-xs uppercase tracking-widest text-stone">Demo Administrator Credentials</div>
          <div className="text-sm font-mono bg-bone p-3 border border-ink/10 flex justify-between items-center">
            <span>admin@atlas.com</span>
            <span className="text-stone">Password: admin123</span>
          </div>
          <button
            onClick={() => login("admin@atlas.com", "admin123")}
            className="w-full bg-ink text-bone py-3.5 text-xs tracking-[0.25em] uppercase hover:bg-clay transition-colors btn-press font-medium flex items-center justify-center gap-2"
          >
            <Icon.Shield size={14} /> One-Click Admin Sign In
          </button>
        </div>
        <Link to="/" className="text-xs text-stone hover:text-ink tracking-widest uppercase">
          ← Return to Storefront
        </Link>
      </div>
    );
  }

  // Analytics Computations
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter((o) => o.status === "Processing");
  const lowStockProducts = products.filter((p) => p.stock > 0 && p.stock < 20);
  const outOfStockProducts = products.filter((p) => p.stock === 0);
  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.subcategory.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(productSearch.toLowerCase()));
    const matchesCategory = productCategoryFilter === "all" || p.category === productCategoryFilter;
    const matchesStock = stockFilter === "all" ? true : stockFilter === "low" ? (p.stock > 0 && p.stock < 20) : p.stock === 0;
    return matchesSearch && matchesCategory && matchesStock;
  });

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    const matchesSearch = o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.shippingAddress.fullName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.shippingAddress.city.toLowerCase().includes(orderSearch.toLowerCase());
    const matchesStatus = orderStatusFilter === "all" || o.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Handle Save Product
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const formatted = {
      name: formData.name,
      category: formData.category,
      subcategory: formData.subcategory || "Curated",
      price: Number(formData.price),
      originalPrice: formData.originalPrice > 0 ? Number(formData.originalPrice) : undefined,
      stock: Number(formData.stock),
      rating: 5.0,
      reviewCount: 1,
      description: formData.description,
      details: formData.details.split("\n").filter(Boolean),
      images: formData.images.split(",").map(s => s.trim()).filter(Boolean),
      tags: formData.tags.split(",").map(s => s.trim()).filter(Boolean),
      featured: formData.featured,
      bestseller: formData.bestseller,
      newArrival: formData.newArrival,
      unit: formData.unit,
      origin: formData.origin,
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, formatted);
      setEditingProduct(null);
    } else {
      addProduct(formatted);
      setIsAddingProduct(false);
    }

    // Reset Form
    setFormData({
      name: "",
      category: "fabric",
      subcategory: "",
      price: 45,
      originalPrice: 0,
      stock: 50,
      unit: "per yard",
      origin: "Italy",
      description: "",
      details: "Composition: 100% Organic\nOrigin: Certified Mill\nCare: Professional clean",
      images: "https://images.unsplash.com/photo-1558171813-4c088753af8f?auto=format&fit=crop&w=900&q=80",
      tags: "sustainable, luxury, artisan",
      featured: false,
      bestseller: false,
      newArrival: true,
    });
  };

  const startEditProduct = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      category: p.category,
      subcategory: p.subcategory,
      price: p.price,
      originalPrice: p.originalPrice || 0,
      stock: p.stock,
      unit: p.unit,
      origin: p.origin,
      description: p.description,
      details: p.details.join("\n"),
      images: p.images.join(", "),
      tags: p.tags.join(", "),
      featured: !!p.featured,
      bestseller: !!p.bestseller,
      newArrival: !!p.newArrival,
    });
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-10">
      {/* Top Header Bar */}
      <div className="border-b border-ink/10 pb-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs tracking-[0.3em] uppercase text-clay font-medium mb-1">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Atlas Live Management Suite
          </div>
          <h1 className="font-display text-4xl md:text-5xl text-ink">Executive Dashboard</h1>
          <p className="text-stone text-sm mt-1">Real-time control over catalog, inventory, logistics, and revenues.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddingProduct(true)}
            className="bg-ink text-bone px-5 py-3 text-xs tracking-[0.2em] uppercase hover:bg-clay transition-colors flex items-center gap-2 btn-press"
          >
            <span>+</span> Add Material
          </button>
          <Link
            to="/shop"
            className="border border-ink/20 px-4 py-3 text-xs tracking-[0.2em] uppercase hover:bg-sand transition-colors"
          >
            View Live Store
          </Link>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto gap-2 border-b border-ink/10 mb-8 scrollbar-none">
        {[
          { id: "overview", label: "Executive Overview", badge: null },
          { id: "products", label: "Material Catalog", badge: products.length },
          { id: "orders", label: "Fulfillment & Orders", badge: pendingOrders.length > 0 ? `${pendingOrders.length} pending` : null },
          { id: "customers", label: "Client Directory", badge: "Live" },
          { id: "analytics", label: "Sourcing & Provenance", badge: null },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as any)}
            className={`px-6 py-3.5 text-xs tracking-[0.2em] uppercase border-b-2 -mb-px whitespace-nowrap transition-all flex items-center gap-2 font-medium ${
              tab === t.id
                ? "border-ink text-ink bg-sand/30"
                : "border-transparent text-stone hover:text-ink hover:border-ink/20"
            }`}
          >
            <span>{t.label}</span>
            {t.badge && (
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${tab === t.id ? "bg-ink text-bone" : "bg-sand text-stone"}`}>
                {t.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ────────────────── OVERVIEW TAB ────────────────── */}
      {tab === "overview" && (
        <div className="space-y-10 animate-fadeIn">
          {/* Key Metric Tiles */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard label="Gross Revenue" value={`$${totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}`} delta="+18.4% vs last month" tone="clay" />
            <MetricCard label="Total Orders" value={orders.length.toString()} delta={`${pendingOrders.length} processing fulfillment`} />
            <MetricCard label="Avg. Order Value" value={`$${avgOrderValue.toFixed(2)}`} delta="High basket tier" />
            <MetricCard label="Inventory Status" value={`${products.length} materials`} delta={`${lowStockProducts.length} low stock alerts`} />
          </div>

          {/* Sourcing & Category Sales Breakdown */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 border border-ink/10 bg-bone p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-display text-xl">Material Inventory & Provenance</h3>
                  <p className="text-xs text-stone">Distribution across international artisanal sources</p>
                </div>
                <span className="text-xs tracking-widest uppercase text-clay">{categories.length} Categories</span>
              </div>
              <div className="space-y-4">
                {categories.map((c) => {
                  const count = products.filter((p) => p.category === c.slug || p.category === c.id).length;
                  const pct = Math.round((count / Math.max(1, products.length)) * 100);
                  return (
                    <div key={c.id} className="group">
                      <div className="flex justify-between text-xs mb-1.5 font-medium">
                        <span className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-sm bg-clay inline-block"></span>
                          {c.name}
                        </span>
                        <span className="text-stone">{count} items ({pct}%)</span>
                      </div>
                      <div className="h-2 bg-sand/80 rounded-full overflow-hidden">
                        <div className="h-full bg-clay transition-all duration-700 group-hover:bg-ink" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Attention & Low Stock List */}
            <div className="border border-ink/10 bg-sand/20 p-6 flex flex-col justify-between">
              <div>
                <h3 className="font-display text-xl mb-1">Inventory Attention</h3>
                <p className="text-xs text-stone mb-4">Stock thresholds requiring immediate re-order</p>
                {lowStockProducts.length === 0 && outOfStockProducts.length === 0 ? (
                  <div className="py-12 text-center text-xs text-stone">
                    ✓ All material stock levels healthy.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {lowStockProducts.concat(outOfStockProducts).slice(0, 4).map((p) => (
                      <div key={p.id} className="flex items-center justify-between p-3 bg-bone border border-ink/10 text-xs">
                        <div className="min-w-0 pr-2">
                          <div className="font-medium truncate">{p.name}</div>
                          <div className="text-[10px] text-stone capitalize">{p.category} · ${p.price}/{p.unit}</div>
                        </div>
                        <span className="px-2 py-1 bg-red-100 text-red-800 font-bold whitespace-nowrap">
                          {p.stock === 0 ? "Out of Stock" : `${p.stock} left`}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={() => { setTab("products"); setStockFilter("low"); }}
                className="w-full mt-4 text-center py-2.5 border border-ink/20 text-xs uppercase tracking-widest hover:bg-ink hover:text-bone transition-colors"
              >
                Inspect All Low Stock →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ────────────────── PRODUCTS CATALOG TAB ────────────────── */}
      {tab === "products" && (
        <div className="space-y-6 animate-fadeIn">
          {/* Controls toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-sand/30 border border-ink/10">
            <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
              <div className="relative flex-1 max-w-sm">
                <input
                  type="text"
                  placeholder="Search materials, origins, tags..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full bg-bone border border-ink/20 px-3.5 py-2 text-xs focus:border-ink outline-none"
                />
              </div>
              <select
                value={productCategoryFilter}
                onChange={(e) => setProductCategoryFilter(e.target.value)}
                className="bg-bone border border-ink/20 px-3 py-2 text-xs capitalize outline-none"
              >
                <option value="all">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>{c.name}</option>
                ))}
              </select>
              <select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value as any)}
                className="bg-bone border border-ink/20 px-3 py-2 text-xs outline-none"
              >
                <option value="all">All Stock Statuses</option>
                <option value="low">Low Stock (&lt;20 units)</option>
                <option value="out">Out of Stock</option>
              </select>
            </div>
            <div className="text-xs text-stone">
              Showing <span className="font-bold text-ink">{filteredProducts.length}</span> of {products.length} materials
            </div>
          </div>

          {/* Products Table */}
          <div className="border border-ink/10 overflow-x-auto bg-bone">
            <table className="w-full text-left text-xs">
              <thead className="bg-sand/60 text-stone uppercase tracking-widest border-b border-ink/10">
                <tr>
                  <th className="py-3 px-4">Material</th>
                  <th className="py-3 px-4">Category / Origin</th>
                  <th className="py-3 px-4 text-right">Price</th>
                  <th className="py-3 px-4 text-center">Stock Level</th>
                  <th className="py-3 px-4 text-center">Badges</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/10">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-sand/20 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img src={p.images[0]} alt="" className="w-12 h-14 object-cover border border-ink/10 shrink-0" />
                        <div>
                          <div className="font-medium text-sm text-ink">{p.name}</div>
                          <div className="text-stone text-[11px]">{p.subcategory}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium capitalize">{p.category}</div>
                      <div className="text-stone text-[11px]">Origin: {p.origin}</div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-medium">
                      <div>${p.price.toFixed(2)}</div>
                      <div className="text-stone text-[10px]">{p.unit}</div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => updateProduct(p.id, { stock: Math.max(0, p.stock - 5) })}
                          className="w-6 h-6 border border-ink/20 hover:bg-ink hover:text-bone text-xs rounded transition-colors"
                        >
                          -
                        </button>
                        <span className={`font-mono font-bold w-10 text-center ${p.stock < 20 ? "text-clay" : ""}`}>
                          {p.stock}
                        </span>
                        <button
                          onClick={() => updateProduct(p.id, { stock: p.stock + 10 })}
                          className="w-6 h-6 border border-ink/20 hover:bg-ink hover:text-bone text-xs rounded transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {p.featured && <span className="px-1.5 py-0.5 bg-clay/20 text-clay text-[9px] uppercase tracking-wider font-semibold">Featured</span>}
                        {p.bestseller && <span className="px-1.5 py-0.5 bg-ink text-bone text-[9px] uppercase tracking-wider font-semibold">Best</span>}
                        {p.newArrival && <span className="px-1.5 py-0.5 bg-sand text-ink text-[9px] uppercase tracking-wider font-semibold">New</span>}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => startEditProduct(p)}
                          className="p-1.5 text-stone hover:text-ink border border-ink/10 hover:border-ink"
                          title="Edit Material"
                        >
                          ✎
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete "${p.name}" from catalog?`)) {
                              deleteProduct(p.id);
                            }
                          }}
                          className="p-1.5 text-stone hover:text-red-700 border border-ink/10 hover:border-red-600"
                          title="Delete Material"
                        >
                          <Icon.Trash size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ────────────────── ORDERS TAB ────────────────── */}
      {tab === "orders" && (
        <div className="space-y-6 animate-fadeIn">
          {/* Order Search & Filters */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-sand/30 border border-ink/10">
            <div className="flex items-center gap-3 flex-1 min-w-[280px]">
              <input
                type="text"
                placeholder="Search by Order ID, customer, city..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="w-full max-w-sm bg-bone border border-ink/20 px-3.5 py-2 text-xs focus:border-ink outline-none"
              />
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="bg-bone border border-ink/20 px-3 py-2 text-xs outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div className="text-xs text-stone">
              <span className="font-bold text-ink">{filteredOrders.length}</span> Total Orders Listed
            </div>
          </div>

          {/* Orders Listing */}
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="py-16 text-center text-stone border border-dashed border-ink/20">
                No orders match your filter criteria.
              </div>
            ) : (
              filteredOrders.map((o) => (
                <div key={o.id} className="border border-ink/10 bg-bone p-5 hover:border-ink/40 transition-colors">
                  <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-ink/10">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-sm text-ink">{o.id}</span>
                        <StatusPill status={o.status} />
                      </div>
                      <div className="text-xs text-stone mt-1">
                        Placed on {new Date(o.date).toLocaleDateString()} at {new Date(o.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · Client: <strong className="text-ink">{o.shippingAddress.fullName}</strong>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={o.status}
                        onChange={(e) => updateOrderStatus(o.id, e.target.value as Order["status"])}
                        className="border border-ink/20 bg-bone px-3 py-1.5 text-xs outline-none font-medium cursor-pointer"
                      >
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                      <button
                        onClick={() => setSelectedOrder(selectedOrder?.id === o.id ? null : o)}
                        className="px-3 py-1.5 border border-ink/20 hover:bg-sand text-xs uppercase tracking-widest transition-colors"
                      >
                        {selectedOrder?.id === o.id ? "Hide" : "Invoice"}
                      </button>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="pt-4 grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {o.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-2 bg-sand/20 border border-ink/5">
                        <img src={item.image} alt="" className="w-10 h-12 object-cover border border-ink/10" />
                        <div className="min-w-0">
                          <div className="text-xs font-medium truncate">{item.name}</div>
                          <div className="text-[11px] text-stone">Qty: {item.qty} × ${item.price.toFixed(2)}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Detailed Invoice Breakdown Drawer */}
                  {selectedOrder?.id === o.id && (
                    <div className="mt-4 pt-4 border-t border-ink/10 bg-sand/30 p-4 text-xs space-y-2 animate-fadeIn">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <div className="text-stone uppercase tracking-widest text-[10px] mb-1">Shipping Destination</div>
                          <div className="font-medium">{o.shippingAddress.fullName}</div>
                          <div>{o.shippingAddress.line1} {o.shippingAddress.line2}</div>
                          <div>{o.shippingAddress.city}, {o.shippingAddress.region} {o.shippingAddress.postal}</div>
                          <div>{o.shippingAddress.country}</div>
                        </div>
                        <div className="text-right space-y-1">
                          <div className="text-stone uppercase tracking-widest text-[10px] mb-1">Financial Summary</div>
                          <div>Subtotal: ${o.subtotal.toFixed(2)}</div>
                          <div>Shipping: ${o.shipping.toFixed(2)}</div>
                          <div>Tax (8%): ${o.tax.toFixed(2)}</div>
                          <div className="text-sm font-bold text-ink pt-1 border-t border-ink/10">Total Paid: ${o.total.toFixed(2)}</div>
                          <div className="text-stone text-[10px]">Payment Card: ending in •••• {o.paymentLast4}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ────────────────── CUSTOMERS TAB ────────────────── */}
      {tab === "customers" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="border border-ink/10 bg-bone p-6">
            <h3 className="font-display text-xl mb-1">Registered Clients & Trade Directory</h3>
            <p className="text-xs text-stone mb-6">Directory of verified makers, architecture studios, and retail buyers.</p>
            <div className="divide-y divide-ink/10 text-xs">
              {[
                { name: user?.name || "Atlas Administrator", email: user?.email || "admin@atlas.com", role: "Super Admin", orders: orders.length, spend: totalRevenue },
                { name: "Amara Okafor", email: "amara@studio-okafor.com", role: "Trade Atelier", orders: 4, spend: 3240.00 },
                { name: "Julien Marchetti", email: "j.marchetti@atelier-cuir.fr", role: "Trade Client", orders: 2, spend: 1840.00 },
                { name: "Kenji Watanabe", email: "kenji@shigaraki-craft.jp", role: "Artisan Partner", orders: 1, spend: 580.00 },
              ].map((c, i) => (
                <div key={i} className="py-4 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-sand text-ink flex items-center justify-center font-display text-base">
                      {c.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-sm text-ink">{c.name}</div>
                      <div className="text-stone">{c.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="px-2 py-1 bg-sand font-medium uppercase tracking-wider text-[10px]">{c.role}</span>
                    <div className="text-right">
                      <div className="font-medium">${c.spend.toFixed(2)}</div>
                      <div className="text-stone text-[10px]">{c.orders} orders placed</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ────────────────── PROVENANCE & SOURCING TAB ────────────────── */}
      {tab === "analytics" && (
        <div className="grid md:grid-cols-2 gap-6 animate-fadeIn">
          <div className="border border-ink/10 bg-bone p-6 space-y-4">
            <h3 className="font-display text-xl">Global Atelier Network</h3>
            <p className="text-xs text-stone">Direct sourcing partners across 12 countries.</p>
            <div className="space-y-3 pt-2 text-xs">
              {[
                { country: "Italy", items: "Merino Wool, Tuscan Vachetta, Carrara Marble, Puglia Terracotta", count: 5 },
                { country: "USA", items: "Horween Chromexcel, Appalachian Black Walnut Slab", count: 2 },
                { country: "Japan", items: "Shigaraki Stoneware Tiles", count: 1 },
                { country: "Belgium", items: "Flanders Belgian Linen Canvas", count: 1 },
                { country: "Germany", items: "Brushed Brass Architectural Sheets", count: 1 },
                { country: "Finland", items: "Patinated Copper Verdigris Sheets", count: 1 },
                { country: "France", items: "European White Oak Planks", count: 1 },
              ].map((s, idx) => (
                <div key={idx} className="p-3 bg-sand/20 border border-ink/5 flex justify-between items-start gap-4">
                  <div>
                    <strong className="text-sm font-medium text-ink">{s.country}</strong>
                    <div className="text-stone text-[11px] mt-0.5">{s.items}</div>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-1 bg-bone border border-ink/10">{s.count} materials</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-ink/10 bg-sand/20 p-6 space-y-6">
            <h3 className="font-display text-xl">Fulfillment & Operations Policy</h3>
            <div className="space-y-3 text-xs text-stone">
              <div className="p-3 bg-bone border border-ink/10">
                <div className="font-medium text-ink mb-1">Free Shipping Threshold</div>
                <div>Orders over $200.00 qualify for complimentary international courier shipping. Standard flat rate: $18.00.</div>
              </div>
              <div className="p-3 bg-bone border border-ink/10">
                <div className="font-medium text-ink mb-1">Sales Tax Policy</div>
                <div>Fixed 8.00% automated calculation applied at checkout.</div>
              </div>
              <div className="p-3 bg-bone border border-ink/10">
                <div className="font-medium text-ink mb-1">Material Provenance Guarantee</div>
                <div>Every shipped order includes certificate of origin, batch inspection documentation, and workshop stamp.</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ────────────────── ADD / EDIT PRODUCT MODAL ────────────────── */}
      {(isAddingProduct || editingProduct) && (
        <div className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-bone border border-ink/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6 shadow-2xl animate-fadeIn">
            <div className="flex justify-between items-center border-b border-ink/10 pb-4">
              <div>
                <h2 className="font-display text-2xl md:text-3xl text-ink">
                  {editingProduct ? `Edit: ${editingProduct.name}` : "Add Material to Archive"}
                </h2>
                <p className="text-xs text-stone mt-0.5">Specify specifications, provenance, and inventory counts.</p>
              </div>
              <button
                onClick={() => { setIsAddingProduct(false); setEditingProduct(null); }}
                className="text-stone hover:text-ink text-xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone uppercase tracking-widest text-[10px] mb-1">Material Name *</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-bone border border-ink/20 px-3 py-2 text-xs focus:border-ink outline-none"
                    placeholder="e.g. Tuscan Calfskin Hide"
                  />
                </div>
                <div>
                  <label className="block text-stone uppercase tracking-widest text-[10px] mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-bone border border-ink/20 px-3 py-2 text-xs focus:border-ink outline-none capitalize"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-stone uppercase tracking-widest text-[10px] mb-1">Subcategory / Type</label>
                  <input
                    type="text"
                    value={formData.subcategory}
                    onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                    className="w-full bg-bone border border-ink/20 px-3 py-2 text-xs focus:border-ink outline-none"
                    placeholder="e.g. Full Grain"
                  />
                </div>
                <div>
                  <label className="block text-stone uppercase tracking-widest text-[10px] mb-1">Price ($) *</label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-bone border border-ink/20 px-3 py-2 text-xs focus:border-ink outline-none"
                  />
                </div>
                <div>
                  <label className="block text-stone uppercase tracking-widest text-[10px] mb-1">Original Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-bone border border-ink/20 px-3 py-2 text-xs focus:border-ink outline-none"
                    placeholder="Optional sale anchor"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-stone uppercase tracking-widest text-[10px] mb-1">Stock Quantity *</label>
                  <input
                    required
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                    className="w-full bg-bone border border-ink/20 px-3 py-2 text-xs focus:border-ink outline-none"
                  />
                </div>
                <div>
                  <label className="block text-stone uppercase tracking-widest text-[10px] mb-1">Unit Pricing</label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full bg-bone border border-ink/20 px-3 py-2 text-xs focus:border-ink outline-none"
                    placeholder="per yard, per slab, per m²"
                  />
                </div>
                <div>
                  <label className="block text-stone uppercase tracking-widest text-[10px] mb-1">Country of Origin</label>
                  <input
                    type="text"
                    value={formData.origin}
                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                    className="w-full bg-bone border border-ink/20 px-3 py-2 text-xs focus:border-ink outline-none"
                    placeholder="Italy, Japan, USA..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone uppercase tracking-widest text-[10px] mb-1">Image URL(s) (comma-separated)</label>
                <input
                  type="text"
                  value={formData.images}
                  onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                  className="w-full bg-bone border border-ink/20 px-3 py-2 text-xs focus:border-ink outline-none font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-stone uppercase tracking-widest text-[10px] mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-bone border border-ink/20 px-3 py-2 text-xs focus:border-ink outline-none"
                  placeholder="Atmospheric narrative and provenance notes..."
                />
              </div>

              <div>
                <label className="block text-stone uppercase tracking-widest text-[10px] mb-1">Specifications (1 line per bullet)</label>
                <textarea
                  rows={3}
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  className="w-full bg-bone border border-ink/20 px-3 py-2 text-xs focus:border-ink outline-none font-mono text-[11px]"
                  placeholder="Composition: 100% Linen&#10;Width: 140cm&#10;Care: Dry clean"
                />
              </div>

              <div className="flex flex-wrap gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded border-ink/20"
                  />
                  <span>Feature on Homepage</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.bestseller}
                    onChange={(e) => setFormData({ ...formData, bestseller: e.target.checked })}
                    className="rounded border-ink/20"
                  />
                  <span>Mark as Bestseller</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.newArrival}
                    onChange={(e) => setFormData({ ...formData, newArrival: e.target.checked })}
                    className="rounded border-ink/20"
                  />
                  <span>New Arrival</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-ink/10">
                <button
                  type="button"
                  onClick={() => { setIsAddingProduct(false); setEditingProduct(null); }}
                  className="px-5 py-2.5 border border-ink/20 text-stone hover:text-ink uppercase tracking-widest text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-ink text-bone px-8 py-2.5 uppercase tracking-widest text-xs hover:bg-clay transition-colors btn-press font-medium"
                >
                  {editingProduct ? "Save Changes" : "Create Material"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function MetricCard({ label, value, delta, tone }: { label: string; value: string; delta: string; tone?: "clay" }) {
  return (
    <div className="border border-ink/10 bg-bone p-5 space-y-2">
      <div className="text-[10px] tracking-[0.25em] uppercase text-stone font-medium">{label}</div>
      <div className={`font-display text-3xl sm:text-4xl ${tone === "clay" ? "text-clay" : "text-ink"}`}>
        {value}
      </div>
      <div className="text-[11px] text-stone">{delta}</div>
    </div>
  );
}
