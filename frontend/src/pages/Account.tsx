import { Navigate, Link, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { Icon } from "../components/Icons";

export default function Account() {
  const { user, logout, orders } = useStore();
  const nav = useNavigate();

  if (!user) return <Navigate to="/login" state={{ from: "/account" }} replace />;

  const doLogout = () => {
    logout();
    nav("/");
  };

  return (
    <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-12 md:py-20">
      <div className="text-xs text-stone mb-4">
        <Link to="/" className="hover:text-ink">Home</Link> / <span className="text-ink">Account</span>
      </div>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-12">
        <div>
          <div className="text-xs tracking-[0.3em] uppercase text-clay mb-2">Member since 2026</div>
          <h1 className="font-display text-4xl md:text-5xl">Hello, {user.name.split(" ")[0]}.</h1>
        </div>
        <div className="flex gap-3">
          {user.isAdmin && (
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 border border-ink/20 px-5 py-2.5 text-xs tracking-[0.2em] uppercase hover:bg-ink hover:text-bone transition-colors"
            >
              <Icon.Shield size={14} /> Admin Panel
            </Link>
          )}
          <button
            onClick={doLogout}
            className="border border-ink/20 px-5 py-2.5 text-xs tracking-[0.2em] uppercase hover:bg-ink hover:text-bone transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-12">
        <StatCard label="Orders placed" value={orders.length.toString()} />
        <StatCard label="Total spent" value={`$${orders.reduce((s, o) => s + o.total, 0).toFixed(2)}`} />
        <StatCard label="Loyalty tier" value={orders.length >= 5 ? "Atelier" : orders.length >= 2 ? "Studio" : "Member"} />
      </div>

      <h2 className="font-display text-3xl mb-6">Order history</h2>
      {orders.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-ink/20">
          <Icon.Package size={36} className="text-stone mx-auto mb-4" />
          <div className="font-display text-2xl mb-2">No orders yet</div>
          <p className="text-stone mb-6">Your purchases will appear here.</p>
          <Link to="/shop" className="inline-block bg-ink text-bone px-8 py-3 text-xs tracking-[0.25em] uppercase">
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <details key={o.id} className="border border-ink/10 group">
              <summary className="flex flex-wrap items-center justify-between gap-4 p-5 cursor-pointer hover:bg-sand/40 transition-colors list-none">
                <div className="flex items-center gap-6">
                  <div>
                    <div className="text-xs text-stone">Order</div>
                    <div className="font-medium">{o.id}</div>
                  </div>
                  <div>
                    <div className="text-xs text-stone">Date</div>
                    <div className="text-sm">{new Date(o.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
                  </div>
                  <div>
                    <div className="text-xs text-stone">Total</div>
                    <div className="font-medium">${o.total.toFixed(2)}</div>
                  </div>
                </div>
                <StatusPill status={o.status} />
              </summary>
              <div className="px-5 pb-5 border-t border-ink/10 pt-4 space-y-3">
                {o.items.map((it) => (
                  <div key={it.productId} className="flex items-center gap-3">
                    <img src={it.image} alt="" className="w-14 h-16 object-cover" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{it.name}</div>
                      <div className="text-xs text-stone">Qty {it.qty} · ${it.price.toFixed(2)}</div>
                    </div>
                    <div className="text-sm">${(it.price * it.qty).toFixed(2)}</div>
                  </div>
                ))}
                <div className="text-xs text-stone pt-3 border-t border-ink/10">
                  Shipping to: {o.shippingAddress.line1}, {o.shippingAddress.city} · Payment ending in {o.paymentLast4}
                </div>
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-ink/10 p-6">
      <div className="text-xs tracking-[0.2em] uppercase text-stone mb-2">{label}</div>
      <div className="font-display text-3xl">{value}</div>
    </div>
  );
}

export function StatusPill({ status }: { status: string }) {
  const tones: Record<string, string> = {
    Processing: "bg-sand text-ink",
    Shipped: "bg-clay/15 text-clay",
    Delivered: "bg-ink/10 text-ink",
    Cancelled: "bg-red-100 text-red-800",
  };
  return (
    <span className={`px-3 py-1 text-[10px] tracking-[0.2em] uppercase font-medium ${tones[status] || "bg-sand"}`}>
      {status}
    </span>
  );
}
