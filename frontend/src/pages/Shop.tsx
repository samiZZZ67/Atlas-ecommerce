import { useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { categories } from "../data/products";
import ProductCard from "../components/ProductCard";
import { Icon } from "../components/Icons";

type SortKey = "featured" | "price-asc" | "price-desc" | "rating" | "newest";

export default function Shop() {
  const { products } = useStore();
  const [params, setParams] = useSearchParams();

  const category = params.get("category") || "all";
  const filter = params.get("filter") || "";
  const q = params.get("q") || "";
  const sort = (params.get("sort") as SortKey) || "featured";
  const minPrice = Number(params.get("min") || 0);
  const maxPrice = Number(params.get("max") || 500);

  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = [...products];
    if (category !== "all") list = list.filter((p) => p.category === category);
    if (filter === "new") list = list.filter((p) => p.newArrival);
    if (filter === "sale") list = list.filter((p) => p.originalPrice && p.originalPrice > p.price);
    if (filter === "bestseller") list = list.filter((p) => p.bestseller);
    if (q) {
      const s = q.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(s) ||
          p.subcategory.toLowerCase().includes(s) ||
          p.tags.some((t) => t.includes(s)),
      );
    }
    list = list.filter((p) => p.price >= minPrice && p.price <= maxPrice);

    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        list.sort((a, b) => Number(!!b.newArrival) - Number(!!a.newArrival));
        break;
      default:
        list.sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
    }
    return list;
  }, [products, category, filter, q, sort, minPrice, maxPrice]);

  const setParam = (k: string, v: string) => {
    const p = new URLSearchParams(params);
    if (v) p.set(k, v);
    else p.delete(k);
    setParams(p);
  };

  const currentCat = categories.find((c) => c.slug === category);
  const title =
    filter === "new"
      ? "New Arrivals"
      : filter === "sale"
      ? "The Archive Sale"
      : filter === "bestseller"
      ? "Bestsellers"
      : q
      ? `Results for "${q}"`
      : currentCat
      ? currentCat.name
      : "All Materials";

  const subtitle =
    filter === "sale"
      ? "Up to 30% off select heritage fabrics and leathers."
      : currentCat?.tagline || "Curated materials from the world's finest ateliers.";

  return (
    <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-12 md:py-20">
      {/* Breadcrumbs */}
      <div className="text-xs text-stone mb-6 flex items-center gap-2">
        <Link to="/" className="hover:text-ink">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-ink">Shop</Link>
        {currentCat && (
          <>
            <span>/</span>
            <span className="text-ink">{currentCat.name}</span>
          </>
        )}
      </div>

      {/* Header */}
      <div className="mb-10">
        <div className="text-xs tracking-[0.3em] uppercase text-clay mb-3">
          {categories.length} categories · {products.length} materials
        </div>
        <h1 className="font-display text-4xl md:text-6xl leading-tight mb-3">{title}</h1>
        <p className="text-stone max-w-xl">{subtitle}</p>
      </div>

      {/* Category tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar mb-8 pb-2">
        <CatPill active={category === "all"} onClick={() => setParam("category", "")}>
          All
        </CatPill>
        {categories.map((c) => (
          <CatPill
            key={c.id}
            active={category === c.slug}
            onClick={() => setParam("category", c.slug)}
          >
            {c.name}
          </CatPill>
        ))}
      </div>

      <div className="grid lg:grid-cols-[260px_1fr] gap-10">
        {/* Sidebar filters */}
        <aside
          className={`${filtersOpen ? "fixed inset-0 z-40 bg-bone p-6 overflow-auto" : "hidden"} lg:block lg:static lg:z-auto lg:bg-transparent lg:p-0`}
        >
          {filtersOpen && (
            <div className="flex items-center justify-between mb-6 lg:hidden">
              <span className="font-display text-2xl">Filters</span>
              <button onClick={() => setFiltersOpen(false)}>
                <Icon.Close size={22} />
              </button>
            </div>
          )}
          <FilterBlock title="Sort by">
            {([
              ["featured", "Featured"],
              ["newest", "Newest"],
              ["price-asc", "Price: Low to High"],
              ["price-desc", "Price: High to Low"],
              ["rating", "Top Rated"],
            ] as [SortKey, string][]).map(([k, label]) => (
              <button
                key={k}
                onClick={() => setParam("sort", k === "featured" ? "" : k)}
                className={`block w-full text-left py-1.5 text-sm transition-colors ${
                  sort === k ? "text-ink font-medium" : "text-stone hover:text-ink"
                }`}
              >
                {label}
              </button>
            ))}
          </FilterBlock>
          <FilterBlock title="Collection">
            <button
              onClick={() => setParam("filter", "")}
              className={`block w-full text-left py-1.5 text-sm ${
                !filter ? "text-ink font-medium" : "text-stone hover:text-ink"
              }`}
            >
              All materials
            </button>
            {[
              ["new", "New arrivals"],
              ["bestseller", "Bestsellers"],
              ["sale", "On sale"],
            ].map(([k, label]) => (
              <button
                key={k}
                onClick={() => setParam("filter", k)}
                className={`block w-full text-left py-1.5 text-sm ${
                  filter === k ? "text-ink font-medium" : "text-stone hover:text-ink"
                }`}
              >
                {label}
              </button>
            ))}
          </FilterBlock>
          <FilterBlock title="Price range">
            <div className="space-y-3 text-sm">
              <input
                type="range"
                min={0}
                max={500}
                value={maxPrice}
                onChange={(e) => setParam("max", e.target.value)}
                className="w-full accent-clay"
              />
              <div className="flex justify-between text-xs text-stone">
                <span>${minPrice}</span>
                <span>Up to ${maxPrice}</span>
              </div>
            </div>
          </FilterBlock>
        </aside>

        {/* Grid */}
        <div>
          <div className="flex items-center justify-between mb-6 lg:hidden">
            <button
              onClick={() => setFiltersOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 border border-ink/15 text-xs tracking-[0.2em] uppercase"
            >
              <Icon.Filter size={14} /> Filters
            </button>
            <div className="text-xs text-stone">{filtered.length} results</div>
          </div>

          {filtered.length === 0 ? (
            <div className="py-24 text-center">
              <div className="font-display text-3xl mb-3">No materials found</div>
              <p className="text-stone mb-6">Try adjusting your filters or search.</p>
              <button
                onClick={() => setParams(new URLSearchParams())}
                className="inline-block bg-ink text-bone px-8 py-3 text-xs tracking-[0.25em] uppercase"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-10">
              {filtered.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CatPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 px-4 py-2 text-xs tracking-[0.15em] uppercase transition-colors ${
        active
          ? "bg-ink text-bone"
          : "border border-ink/15 hover:border-ink hover:bg-ink hover:text-bone"
      }`}
    >
      {children}
    </button>
  );
}

function FilterBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-ink/10 py-6 first:border-t-0">
      <div className="text-xs tracking-[0.25em] uppercase mb-3 text-stone">{title}</div>
      {children}
    </div>
  );
}
