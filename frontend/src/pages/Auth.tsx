import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { Icon } from "../components/Icons";

export function Login() {
  const { login } = useStore();
  const nav = useNavigate();
  const loc = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = login(email, password);
    if (!res.ok) setErr(res.error || "Login failed");
    else nav((loc.state as { from?: string })?.from || "/account");
  };

  return (
    <AuthLayout title="Welcome back." subtitle="Sign in to access your orders, wishlist, and trade pricing.">
      <form onSubmit={submit} className="space-y-5">
        {err && <div className="bg-clay/10 border border-clay/30 text-clay px-4 py-3 text-sm">{err}</div>}
        <div>
          <label className="block text-xs tracking-[0.15em] uppercase text-stone mb-2">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-ink/15 bg-transparent px-4 py-3.5 text-sm focus:border-ink outline-none"
          />
        </div>
        <div>
          <label className="block text-xs tracking-[0.15em] uppercase text-stone mb-2">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-ink/15 bg-transparent px-4 py-3.5 text-sm focus:border-ink outline-none"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-ink text-bone py-4 text-xs tracking-[0.25em] uppercase hover:bg-clay transition-colors btn-press"
        >
          Sign in
        </button>
        <div className="text-center text-sm text-stone">
          Don't have an account?{" "}
          <Link to="/register" className="text-ink underline underline-offset-4 hover:text-clay">
            Create one
          </Link>
        </div>
        <div className="text-center text-xs text-stone/70 border-t border-ink/10 pt-4">
          Demo admin: <code className="bg-sand px-1.5 py-0.5">admin@atlas.com</code> / <code className="bg-sand px-1.5 py-0.5">admin123</code>
        </div>
      </form>
    </AuthLayout>
  );
}

export function Register() {
  const { register } = useStore();
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = register(name, email, password);
    if (!res.ok) setErr(res.error || "Registration failed");
    else nav("/account");
  };

  return (
    <AuthLayout title="Create your account." subtitle="Join ATLAS to save your wishlist, track orders, and unlock trade pricing.">
      <form onSubmit={submit} className="space-y-5">
        {err && <div className="bg-clay/10 border border-clay/30 text-clay px-4 py-3 text-sm">{err}</div>}
        <div>
          <label className="block text-xs tracking-[0.15em] uppercase text-stone mb-2">Full name</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-ink/15 bg-transparent px-4 py-3.5 text-sm focus:border-ink outline-none"
          />
        </div>
        <div>
          <label className="block text-xs tracking-[0.15em] uppercase text-stone mb-2">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-ink/15 bg-transparent px-4 py-3.5 text-sm focus:border-ink outline-none"
          />
        </div>
        <div>
          <label className="block text-xs tracking-[0.15em] uppercase text-stone mb-2">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            className="w-full border border-ink/15 bg-transparent px-4 py-3.5 text-sm focus:border-ink outline-none"
          />
          <p className="text-xs text-stone mt-1.5">At least 6 characters</p>
        </div>
        <button
          type="submit"
          className="w-full bg-ink text-bone py-4 text-xs tracking-[0.25em] uppercase hover:bg-clay transition-colors btn-press"
        >
          Create account
        </button>
        <div className="text-center text-sm text-stone">
          Already have an account?{" "}
          <Link to="/login" className="text-ink underline underline-offset-4 hover:text-clay">
            Sign in
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}

function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[calc(100vh-8rem)] grid md:grid-cols-2">
      <div className="hidden md:block relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80"
          alt=""
          className="absolute inset-0 w-full h-full object-cover animate-kenburns"
        />
        <div className="absolute inset-0 bg-ink/40" />
        <div className="relative h-full p-12 flex flex-col justify-end text-bone">
          <div className="font-display text-4xl leading-tight mb-3">
            A private archive, open to all.
          </div>
          <div className="text-sm text-bone/80 max-w-sm">
            Members enjoy saved selections, order tracking, and first access to rare materials from
            our atelier network.
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-block font-display text-2xl tracking-[0.3em] mb-10">
            ATLAS
          </Link>
          <h1 className="font-display text-4xl md:text-5xl mb-3">{title}</h1>
          <p className="text-stone mb-10">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}

export function Wishlist() {
  const { products, wishlist, toggleWishlist, addToCart } = useStore();
  const items = products.filter((p) => wishlist.includes(p.id));

  if (items.length === 0) {
    return (
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-24 text-center">
        <div className="w-20 h-20 rounded-full bg-sand flex items-center justify-center mx-auto mb-5">
          <Icon.Heart size={28} className="text-stone" />
        </div>
        <h1 className="font-display text-4xl mb-3">Your wishlist is empty</h1>
        <p className="text-stone mb-6">Save materials you love to revisit them later.</p>
        <Link to="/shop" className="inline-block bg-ink text-bone px-8 py-3 text-xs tracking-[0.25em] uppercase">
          Browse materials
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-12 md:py-20">
      <h1 className="font-display text-4xl md:text-5xl mb-10">Your wishlist</h1>
      <div className="space-y-4">
        {items.map((p) => (
          <div key={p.id} className="flex gap-5 p-4 border border-ink/10 hover:border-ink/30 transition-colors">
            <Link to={`/product/${p.slug}`} className="w-28 h-32 bg-sand/60 shrink-0 overflow-hidden">
              <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
            </Link>
            <div className="flex-1 flex flex-col">
              <div className="flex justify-between gap-3">
                <div>
                  <div className="text-[10px] tracking-[0.2em] uppercase text-stone mb-1">{p.subcategory}</div>
                  <Link to={`/product/${p.slug}`} className="text-base font-medium hover:text-clay">{p.name}</Link>
                  <div className="text-sm mt-1">${p.price} / {p.unit}</div>
                </div>
                <button onClick={() => toggleWishlist(p.id)} className="text-stone hover:text-clay">
                  <Icon.Close size={18} />
                </button>
              </div>
              <div className="mt-auto">
                <button
                  onClick={() => addToCart(p.id, 1)}
                  className="bg-ink text-bone px-6 py-2.5 text-xs tracking-[0.25em] uppercase hover:bg-clay transition-colors btn-press"
                >
                  Add to bag
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
