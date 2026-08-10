import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Icon } from "./Icons";
import { useStore } from "../context/StoreContext";
import { categories } from "../data/products";

export default function Navbar({
  onOpenSearch,
  onOpenCart,
}: {
  onOpenSearch: () => void;
  onOpenCart: () => void;
}) {
  const { cartCount, wishlist, user } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const loc = useLocation();
  const isHome = loc.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setShopOpen(false);
  }, [loc.pathname]);

  const floating = isHome && !scrolled;

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-ink text-bone text-[11px] tracking-[0.2em] uppercase overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap py-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center gap-12 px-6 shrink-0">
              <span>Complimentary shipping on orders over $200</span>
              <span className="opacity-40">✦</span>
              <span>New Spring arrivals now available</span>
              <span className="opacity-40">✦</span>
              <span>Trade program — dedicated pricing for professionals</span>
              <span className="opacity-40">✦</span>
              <span>Sample swatches shipped worldwide in 48 hours</span>
              <span className="opacity-40">✦</span>
            </div>
          ))}
        </div>
      </div>

      <header
        className={`sticky top-0 z-40 transition-all duration-500 ${
          floating
            ? "bg-transparent text-bone"
            : "bg-bone/95 backdrop-blur-md text-ink border-b border-ink/5"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 h-16 md:h-20 flex items-center justify-between gap-6">
          {/* Left: menu */}
          <nav className="hidden lg:flex items-center gap-8 text-[13px] tracking-wide">
            <div
              className="relative"
              onMouseEnter={() => setShopOpen(true)}
              onMouseLeave={() => setShopOpen(false)}
            >
              <NavLink
                to="/shop"
                className={({ isActive }) =>
                  `link-underline py-2 ${isActive ? "opacity-100" : "opacity-80 hover:opacity-100"}`
                }
              >
                Shop
              </NavLink>
              {shopOpen && (
                <div className="absolute left-0 top-full pt-3 animate-fadeIn">
                  <div className="bg-bone text-ink shadow-2xl border border-ink/5 p-6 w-[520px] grid grid-cols-2 gap-1">
                    <Link
                      to="/shop"
                      className="col-span-2 py-2 mb-2 border-b border-ink/10 text-xs tracking-[0.2em] uppercase text-stone"
                    >
                      All Materials →
                    </Link>
                    {categories.map((c) => (
                      <Link
                        key={c.id}
                        to={`/shop?category=${c.slug}`}
                        className="px-3 py-2.5 hover:bg-sand/60 transition-colors group"
                      >
                        <div className="text-sm font-medium">{c.name}</div>
                        <div className="text-xs text-stone">{c.tagline}</div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <NavLink to="/shop?filter=new" className="link-underline opacity-80 hover:opacity-100">
              New Arrivals
            </NavLink>
            <NavLink to="/shop?filter=sale" className="link-underline opacity-80 hover:opacity-100">
              Sale
            </NavLink>
            <NavLink to="/journal" className="link-underline opacity-80 hover:opacity-100">
              Journal
            </NavLink>
          </nav>

          <button className="lg:hidden" onClick={() => setMobileOpen(true)}>
            <Icon.Menu size={22} />
          </button>

          {/* Center: logo */}
          <Link to="/" className="font-display text-2xl md:text-3xl tracking-[0.3em] font-medium">
            ATLAS
          </Link>

          {/* Right: actions */}
          <div className="flex items-center gap-1 md:gap-2">
            <button
              onClick={onOpenSearch}
              className="p-2.5 hover:opacity-60 transition-opacity"
              aria-label="Search"
            >
              <Icon.Search size={20} />
            </button>
            <Link
              to={user ? "/account" : "/login"}
              className="hidden md:inline-flex p-2.5 hover:opacity-60 transition-opacity"
              aria-label="Account"
            >
              <Icon.User size={20} />
            </Link>
            <Link
              to="/wishlist"
              className="p-2.5 hover:opacity-60 transition-opacity relative"
              aria-label="Wishlist"
            >
              <Icon.Heart size={20} />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 bg-clay text-bone text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-semibold">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <button
              onClick={onOpenCart}
              className="p-2.5 hover:opacity-60 transition-opacity relative"
              aria-label="Cart"
            >
              <Icon.Bag size={20} />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-clay text-bone text-[9px] min-w-4 h-4 rounded-full flex items-center justify-center font-semibold px-1">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-bone animate-fadeIn">
          <div className="flex items-center justify-between px-5 h-16 border-b border-ink/10">
            <span className="font-display text-2xl tracking-[0.3em]">ATLAS</span>
            <button onClick={() => setMobileOpen(false)}>
              <Icon.Close size={24} />
            </button>
          </div>
          <nav className="flex flex-col p-8 gap-1">
            <Link to="/shop" className="py-4 text-3xl font-display border-b border-ink/10">
              Shop All
            </Link>
            {categories.map((c) => (
              <Link
                key={c.id}
                to={`/shop?category=${c.slug}`}
                className="py-3 text-xl text-stone hover:text-ink transition-colors"
              >
                {c.name}
              </Link>
            ))}
            <div className="flex gap-6 mt-8 pt-8 border-t border-ink/10 text-sm">
              <Link to="/account" className="link-underline">Account</Link>
              <Link to="/wishlist" className="link-underline">Wishlist</Link>
              <Link to="/login" className="link-underline">Sign in</Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
