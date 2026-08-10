import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import ProductCard from "../components/ProductCard";
import { Icon, Stars, Badge } from "../components/Icons";

export default function ProductDetail() {
  const { slug } = useParams();
  const nav = useNavigate();
  const { products, addToCart, toggleWishlist, wishlist } = useStore();
  const product = products.find((p) => p.slug === slug);

  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [tab, setTab] = useState<"description" | "details" | "shipping">("description");

  if (!product) {
    return (
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-24 text-center">
        <div className="font-display text-4xl mb-3">Material not found</div>
        <p className="text-stone mb-6">The material you're looking for doesn't exist or has been removed.</p>
        <button
          onClick={() => nav("/shop")}
          className="bg-ink text-bone px-8 py-3 text-xs tracking-[0.25em] uppercase"
        >
          Back to shop
        </button>
      </div>
    );
  }

  const isWished = wishlist.includes(product.id);
  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);
  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  const handleAdd = () => {
    addToCart(product.id, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-8 md:py-14">
      {/* Breadcrumbs */}
      <div className="text-xs text-stone mb-8 flex items-center gap-2">
        <Link to="/" className="hover:text-ink">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-ink">Shop</Link>
        <span>/</span>
        <Link to={`/shop?category=${product.category}`} className="hover:text-ink capitalize">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-ink truncate">{product.name}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
        {/* Gallery */}
        <div className="flex flex-col-reverse md:flex-row gap-3">
          <div className="flex md:flex-col gap-3 md:w-20">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`shrink-0 w-20 h-24 overflow-hidden border-2 transition-colors ${
                  activeImg === i ? "border-ink" : "border-transparent hover:border-ink/30"
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
          <div className="flex-1 aspect-[4/5] bg-sand/60 overflow-hidden">
            <img
              src={product.images[activeImg]}
              alt={product.name}
              className="w-full h-full object-cover animate-fadeIn"
              key={activeImg}
            />
          </div>
        </div>

        {/* Info */}
        <div className="md:sticky md:top-28 self-start">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] tracking-[0.25em] uppercase text-stone">
              {product.subcategory} · {product.origin}
            </span>
            {discount > 0 && <Badge tone="clay">Save {discount}%</Badge>}
          </div>
          <h1 className="font-display text-3xl md:text-5xl leading-tight mb-4">
            {product.name}
          </h1>
          <div className="flex items-center gap-3 mb-6">
            <Stars rating={product.rating} size={14} />
            <span className="text-sm text-stone">
              {product.rating} · {product.reviewCount} reviews
            </span>
          </div>
          <div className="flex items-baseline gap-3 mb-8">
            <span className="font-display text-4xl">${product.price}</span>
            <span className="text-sm text-stone">/ {product.unit}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-stone text-lg line-through">${product.originalPrice}</span>
            )}
          </div>

          <p className="text-stone leading-relaxed mb-8">{product.description}</p>

          {/* Quantity + Add */}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center border border-ink/15">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-11 h-12 flex items-center justify-center hover:bg-sand/60"
              >
                <Icon.Minus size={14} />
              </button>
              <span className="w-12 text-center font-medium">{qty}</span>
              <button
                onClick={() => setQty(qty + 1)}
                className="w-11 h-12 flex items-center justify-center hover:bg-sand/60"
              >
                <Icon.Plus size={14} />
              </button>
            </div>
            <div className="text-xs text-stone">
              {product.stock} in stock · Ships in 2–4 days
            </div>
          </div>

          <div className="flex gap-3 mb-10">
            <button
              onClick={handleAdd}
              disabled={added}
              className={`flex-1 py-4 text-xs tracking-[0.25em] uppercase transition-colors btn-press ${
                added ? "bg-clay text-bone" : "bg-ink text-bone hover:bg-clay"
              }`}
            >
              {added ? (
                <span className="inline-flex items-center gap-2 justify-center">
                  <Icon.Check size={14} /> Added to bag
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 justify-center">
                  <Icon.Bag size={14} /> Add to Bag — ${(product.price * qty).toFixed(2)}
                </span>
              )}
            </button>
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`w-14 h-14 border transition-colors ${
                isWished ? "bg-clay/10 border-clay text-clay" : "border-ink/15 hover:bg-ink hover:text-bone"
              }`}
              aria-label="Wishlist"
            >
              <Icon.Heart size={20} filled={isWished} className="mx-auto" />
            </button>
          </div>

          {/* Tabs */}
          <div className="border-t border-ink/10">
            <div className="flex gap-6 border-b border-ink/10">
              {(["description", "details", "shipping"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`py-4 text-xs tracking-[0.2em] uppercase border-b-2 -mb-px transition-colors capitalize ${
                    tab === t ? "border-ink text-ink" : "border-transparent text-stone hover:text-ink"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="py-6 text-sm text-stone leading-relaxed">
              {tab === "description" && (
                <p>{product.description}</p>
              )}
              {tab === "details" && (
                <ul className="space-y-2">
                  {product.details.map((d, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="text-clay mt-1">✦</span>
                      <span className="text-ink">{d}</span>
                    </li>
                  ))}
                </ul>
              )}
              {tab === "shipping" && (
                <div className="space-y-3">
                  <p>
                    <strong className="text-ink">Free shipping</strong> on orders over $200. Standard
                    delivery 3–7 business days worldwide.
                  </p>
                  <p>
                    Samples ship within 48 hours. Large slabs and hides ship via freight with white-glove
                    delivery available.
                  </p>
                  <p>
                    <strong className="text-ink">Returns:</strong> 30-day return policy on cut yardage.
                    Full hides and slabs are final sale unless damaged in transit.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Trust */}
          <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-ink/10 text-xs">
            <div className="flex flex-col items-center text-center gap-2">
              <Icon.Globe size={20} className="text-clay" />
              <span className="text-stone">Global shipping</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <Icon.Shield size={20} className="text-clay" />
              <span className="text-stone">Provenance verified</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <Icon.Leaf size={20} className="text-clay" />
              <span className="text-stone">Responsibly sourced</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-24">
          <h2 className="font-display text-3xl md:text-4xl mb-10">You may also like</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
