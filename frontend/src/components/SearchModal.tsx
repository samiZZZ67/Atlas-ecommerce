import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { Icon, Stars } from "./Icons";

export default function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { products } = useStore();
  const [q, setQ] = useState("");
  const nav = useNavigate();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const results = useMemo(() => {
    if (!q.trim()) return [];
    const s = q.toLowerCase();
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(s) ||
          p.category.includes(s) ||
          p.subcategory.toLowerCase().includes(s) ||
          p.tags.some((t) => t.includes(s)),
      )
      .slice(0, 6);
  }, [q, products]);

  const suggestions = ["linen", "walnut", "marble", "leather", "brass", "terracotta"];

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-bone/98 animate-fadeIn">
      <div className="max-w-3xl mx-auto pt-24 px-6">
        <div className="flex items-center gap-4 border-b-2 border-ink pb-4">
          <Icon.Search size={24} />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search materials, fabrics, origins..."
            className="flex-1 bg-transparent text-2xl md:text-3xl font-display outline-none placeholder:text-stone/50"
          />
          <button onClick={onClose} className="p-2 hover:opacity-60">
            <Icon.Close size={24} />
          </button>
        </div>

        {q.trim() === "" && (
          <div className="pt-8">
            <div className="text-xs tracking-[0.2em] uppercase text-stone mb-3">
              Popular searches
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => setQ(s)}
                  className="px-4 py-2 border border-ink/15 text-sm hover:bg-ink hover:text-bone transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {q.trim() !== "" && (
          <div className="pt-8">
            {results.length === 0 ? (
              <div className="text-center py-12 text-stone">
                No materials match "{q}". Try a different search.
              </div>
            ) : (
              <>
                <div className="text-xs tracking-[0.2em] uppercase text-stone mb-4">
                  {results.length} result{results.length !== 1 && "s"}
                </div>
                <div className="space-y-1">
                  {results.map((p) => (
                    <Link
                      key={p.id}
                      to={`/product/${p.slug}`}
                      onClick={onClose}
                      className="flex items-center gap-4 p-3 hover:bg-sand/60 transition-colors group"
                    >
                      <img src={p.images[0]} alt="" className="w-16 h-20 object-cover" />
                      <div className="flex-1">
                        <div className="text-[10px] tracking-[0.2em] uppercase text-stone">
                          {p.subcategory}
                        </div>
                        <div className="text-base font-medium group-hover:text-clay">{p.name}</div>
                        <div className="flex items-center gap-2 text-sm mt-0.5">
                          <Stars rating={p.rating} size={11} />
                          <span className="text-stone">${p.price} / {p.unit}</span>
                        </div>
                      </div>
                      <Icon.ArrowRight size={18} className="text-stone group-hover:text-ink group-hover:translate-x-1 transition-all" />
                    </Link>
                  ))}
                </div>
                <button
                  onClick={() => {
                    nav(`/shop?q=${encodeURIComponent(q)}`);
                    onClose();
                  }}
                  className="mt-6 w-full py-4 bg-ink text-bone text-xs tracking-[0.25em] uppercase hover:bg-clay transition-colors"
                >
                  View all results for "{q}"
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
