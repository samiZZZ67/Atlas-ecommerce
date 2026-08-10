import { Link } from "react-router-dom";
import { useState } from "react";
import type { Product } from "../data/products";
import { useStore } from "../context/StoreContext";
import { Badge, Icon } from "./Icons";

export default function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const isWished = wishlist.includes(product.id);
  const [hover, setHover] = useState(false);
  const [added, setAdded] = useState(false);
  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  const quickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product.id, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <Link
      to={`/product/${product.slug}`}
      className="group block animate-fadeInUp"
      style={{ animationDelay: `${Math.min(index * 60, 400)}ms` }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="relative overflow-hidden bg-sand/60 aspect-[4/5]">
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-all duration-[900ms] ease-out group-hover:scale-105"
        />
        {product.images[1] && (
          <img
            src={product.images[1]}
            alt=""
            loading="lazy"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              hover ? "opacity-100" : "opacity-0"
            }`}
          />
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {discount > 0 && <Badge tone="clay">-{discount}%</Badge>}
          {product.newArrival && <Badge tone="ink">New</Badge>}
          {product.bestseller && !product.newArrival && <Badge tone="stone">Bestseller</Badge>}
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className="absolute top-3 right-3 w-9 h-9 bg-bone/95 backdrop-blur rounded-full flex items-center justify-center hover:bg-bone transition-colors"
          aria-label="Add to wishlist"
        >
          <Icon.Heart size={16} filled={isWished} className={isWished ? "text-clay" : ""} />
        </button>

        {/* Quick add */}
        <div
          className={`absolute inset-x-3 bottom-3 transition-all duration-500 ${
            hover ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"
          }`}
        >
          <button
            onClick={quickAdd}
            disabled={added}
            className={`w-full py-3 text-xs tracking-[0.2em] uppercase font-medium transition-colors btn-press ${
              added
                ? "bg-ink text-bone"
                : "bg-bone text-ink hover:bg-ink hover:text-bone"
            }`}
          >
            {added ? (
              <span className="inline-flex items-center gap-2">
                <Icon.Check size={14} /> Added to bag
              </span>
            ) : (
              <span className="inline-flex items-center gap-2">
                <Icon.Plus size={14} /> Quick Add
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="pt-4 space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <div className="text-[10px] tracking-[0.2em] uppercase text-stone">
            {product.subcategory}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-stone">
            <Icon.Star size={11} filled className="text-clay" />
            {product.rating}
          </div>
        </div>
        <div className="text-[15px] font-medium leading-snug group-hover:text-clay transition-colors">
          {product.name}
        </div>
        <div className="flex items-baseline gap-2 text-sm">
          <span className="font-medium">${product.price}</span>
          <span className="text-stone text-xs">/ {product.unit}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-stone text-xs line-through">${product.originalPrice}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
