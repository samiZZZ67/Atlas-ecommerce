import { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { categories } from "../data/products";
import { Icon } from "../components/Icons";
import { StatusPill } from "./Account";
import type { Order } from "../context/StoreContext";

export default function Admin() {
  const { user, products, orders, updateOrderStatus, deleteProduct } = useStore();
  const [tab, setTab] = useState<"overview" | "products" | "orders">("overview");

  if (!user?.isAdmin) return <Navigate to="/login" replace />;

  const revenue = orders.reduce((s, o) => s + o.total, 0);
  const pending = orders.filter((o) => o.status === "Processing").length;
  const lowStock = products.filter((p) => p.stock < 20).length;

  return (
    <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-12">
      <div className="flex items-center gap-3 mb-4">
        <Icon.Shield size={18} className="text-clay" />
        <span className="text-xs tracking-[0.25em] uppercase text-clay">Admin Panel</span>
      </div>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
        <div>
          <h1 className="font-display text-4xl md:text-5xl">Atlas Operations</h1>
          <p className="text-stone mt-2">Manage inventory, orders, and sales analytics.</p>
        </div>
        <Link to="/account" className="text-xs tracking-[0.2em] uppercase link-underline">
          ← Back to account
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-ink/10 mb-10">
        {(["overview", "products", "orders"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-3 text-xs tracking-[0.2em] uppercase border-b-2 -mb-px capitalize transition-colors ${
              tab === t ? "border-ink text-ink" : "border-transparent text-stone hover:text-ink"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <DashStat label="Total revenue" value={`$${revenue.toFixed(2)}`} tone="clay" />
            <DashStat label="Orders" value={orders.length.toString()} />
            <DashStat label="Pending" value={pending.toString()} />
            <DashStat label="Low stock items" value={lowStock.toString()} />
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="border border-ink/10 p-6">
              <div className="text-xs tracking-[0.2em] uppercase text-stone mb-5">Top products</div>
              <div className="space-y-3">
                {products.slice(0, 5).map((p, i) => (
                  <div key={p.id} className="flex items-center gap-3">
                    <span className="text-stone w-6">{String(i + 1).padStart(2, "0")}</span>
                    <img src={p.images[0]} alt="" className="w-12 h-14 object-cover" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{p.name}</div>
                      <div className="text-xs text-stone">${p.price} · {p.stock} in stock</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-ink/10 p-6">
              <div className="text-xs tracking-[0.2em] uppercase text-stone mb-5">Sales by category</div>
              <div className="space-y-3">
                {categories.map((c) => {
                  const count = products.filter((p) => p.category === c.id).length;
                  const pct = Math.round((count / products.length) * 100);
                  return (
                    <div key={c.id}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span>{c.name}</span>
                        <span className="text-stone">{count} items</span>
                      </div>
                      <div className="h-1.5 bg-sand rounded-full overflow-hidden">
                        <div className="h-full bg-clay" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "products" && (
        <div>
          <div className="overflow-x-auto border border-ink/10">
            <table className="w-full text-sm">
              <thead className="bg-sand/40 text-xs tracking-[0.15em] uppercase text-stone">
                <tr>
                  <th className="text-left p-3">Product</th>
                  <th className="text-left p-3">Category</th>
                  <th className="text-right p-3">Price</th>
                  <th className="text-right p-3">Stock</th>
                  <th className="text-right p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-t border-ink/10 hover:bg-sand/30">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <img src={p.images[0]} alt="" className="w-10 h-12 object-cover" />
                        <div>
                          <div className="font-medium">{p.name}</div>
                          <div className="text-xs text-stone">{p.subcategory}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 capitalize">{p.category}</td>
                    <td className="p-3 text-right">${p.price}</td>
                    <td className="p-3 text-right">
                      <span className={p.stock < 20 ? "text-clay font-medium" : ""}>{p.stock}</span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => {
                          if (confirm(`Delete "${p.name}"?`)) deleteProduct(p.id);
                        }}
                        className="text-stone hover:text-clay"
                      >
                        <Icon.Trash size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "orders" && (
        <div className="space-y-3">
          {orders.length === 0 ? (
            <div className="py-16 text-center text-stone border border-dashed border-ink/20">
              No orders placed yet.
            </div>
          ) : (
            orders.map((o) => (
              <div key={o.id} className="border border-ink/10 p-5 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-stone mb-0.5">Order {o.id}</div>
                  <div className="font-medium">{o.shippingAddress.fullName}</div>
                  <div className="text-xs text-stone">
                    {new Date(o.date).toLocaleString()} · {o.items.length} items · ${o.total.toFixed(2)}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusPill status={o.status} />
                  <select
                    value={o.status}
                    onChange={(e) => updateOrderStatus(o.id, e.target.value as Order["status"])}
                    className="border border-ink/15 bg-transparent px-3 py-2 text-xs"
                  >
                    <option>Processing</option>
                    <option>Shipped</option>
                    <option>Delivered</option>
                    <option>Cancelled</option>
                  </select>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function DashStat({ label, value, tone }: { label: string; value: string; tone?: "clay" }) {
  return (
    <div className="border border-ink/10 p-5">
      <div className="text-xs tracking-[0.2em] uppercase text-stone mb-2">{label}</div>
      <div className={`font-display text-3xl ${tone === "clay" ? "text-clay" : ""}`}>{value}</div>
    </div>
  );
}
