import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useStore } from "../context/StoreContext";
import { banners, categories, heroSlides, testimonials } from "../data/products";
import ProductCard from "../components/ProductCard";
import { Icon, Stars, Badge } from "../components/Icons";
import { useReveal } from "../hooks/useReveal";

export default function Home() {
  const { products } = useStore();

  const featured = products.filter((p) => p.featured).slice(0, 8);
  const newArrivals = products.filter((p) => p.newArrival).slice(0, 4);
  const bestsellers = products.filter((p) => p.bestseller).slice(0, 4);

  return (
    <div>
      <Hero />
      <Marquee />
      <CategoriesSection />
      <FeaturedSection products={featured} />
      <StorySection />
      <BannersSection />
      <NewArrivals products={newArrivals} />
      <PromiseStrip />
      <TestimonialsSection />
      <BestsellersSection products={bestsellers} />
      <NewsletterSection />
    </div>
  );
}

function Hero() {
  const slide = heroSlides[0];
  return (
    <section className="relative h-[92vh] min-h-[640px] -mt-0 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={slide.image}
          alt=""
          className="w-full h-full object-cover animate-kenburns"
        />
        <div className="absolute inset-0 hero-overlay" />
      </div>
      <div className="relative h-full max-w-[1400px] mx-auto px-5 md:px-10 flex flex-col justify-end pb-20 md:pb-28 text-bone">
        <div className="max-w-2xl">
          <div className="text-xs tracking-[0.35em] uppercase opacity-80 animate-fadeInUp">
            ✦ {slide.kicker}
          </div>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.95] mt-6 mb-6 animate-fadeInUp delay-200 whitespace-pre-line">
            {slide.title}
          </h1>
          <p className="text-base md:text-lg text-bone/85 max-w-xl mb-10 animate-fadeInUp delay-300">
            {slide.subtitle}
          </p>
          <div className="flex flex-wrap gap-4 animate-fadeInUp delay-400">
            <Link
              to={slide.href}
              className="group inline-flex items-center gap-3 bg-bone text-ink px-8 py-4 text-xs tracking-[0.25em] uppercase btn-press"
            >
              {slide.cta}
              <Icon.ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/journal"
              className="inline-flex items-center gap-3 border border-bone/60 text-bone px-8 py-4 text-xs tracking-[0.25em] uppercase hover:bg-bone hover:text-ink transition-colors"
            >
              Our Story
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 right-5 md:right-10 text-xs tracking-[0.3em] uppercase opacity-70 flex items-center gap-3 animate-float">
          <span className="hidden md:inline">Scroll</span>
          <span className="w-10 h-px bg-bone/70" />
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const words = [
    "Woven in Biella",
    "Tanned in Tuscany",
    "Quarried in Carrara",
    "Milled in Flanders",
    "Fired in Shigaraki",
    "Forged in Solingen",
  ];
  return (
    <div className="border-y border-ink/10 py-5 overflow-hidden bg-bone">
      <div className="flex animate-marquee whitespace-nowrap">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-12 px-6 shrink-0 font-display text-xl md:text-2xl text-stone">
            {words.map((w, j) => (
              <span key={j} className="flex items-center gap-12">
                <span>{w}</span>
                <span className="text-clay">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function CategoriesSection() {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <section className="max-w-[1400px] mx-auto px-5 md:px-10 py-20 md:py-28" ref={ref}>
      <SectionHeader
        kicker="By Category"
        title="A world of materials, curated for you."
        subtitle="From Italian marble to Japanese stoneware, every piece is selected for provenance, quality, and enduring beauty."
      />
      <div
        className={`grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mt-12 transition-all duration-1000 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        {categories.map((c, i) => (
          <Link
            key={c.id}
            to={`/shop?category=${c.slug}`}
            className={`group relative overflow-hidden ${i === 0 ? "col-span-2 md:col-span-2 md:row-span-2 aspect-[4/3] md:aspect-auto" : "aspect-[4/3]"}`}
          >
            <img
              src={c.image}
              alt={c.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent" />
            <div className="absolute inset-0 p-5 md:p-7 flex flex-col justify-end text-bone">
              <div className="text-[10px] tracking-[0.3em] uppercase opacity-80 mb-1">
                {c.count} materials
              </div>
              <div className="font-display text-xl md:text-3xl leading-tight mb-1">{c.name}</div>
              <div className="text-xs md:text-sm opacity-80 italic">{c.tagline}</div>
              <div className="mt-3 inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                Shop collection <Icon.ArrowRight size={14} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function FeaturedSection({ products }: { products: ReturnType<typeof useStore>["products"] }) {
  return (
    <section className="max-w-[1400px] mx-auto px-5 md:px-10 pb-20 md:pb-28">
      <SectionHeader
        kicker="Featured"
        title="Editor's picks."
        subtitle="Hand-selected pieces our team can't stop talking about this season."
        action={{ label: "View all materials", href: "/shop" }}
      />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 mt-12">
        {products.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
    </section>
  );
}

function StorySection() {
  return (
    <section className="relative bg-ink text-bone py-24 md:py-32 overflow-hidden noise">
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 relative grid md:grid-cols-12 gap-10 items-center">
        <div className="md:col-span-5 relative">
          <img
            src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=900&q=80"
            alt="Craftsman hands"
            className="w-full aspect-[4/5] object-cover"
          />
          <div className="absolute -bottom-5 -right-5 md:-bottom-8 md:-right-8 bg-clay text-bone px-6 py-5 max-w-[240px]">
            <div className="font-display text-4xl mb-1">12</div>
            <div className="text-[11px] tracking-[0.2em] uppercase">Countries sourced from</div>
          </div>
        </div>
        <div className="md:col-span-6 md:col-start-7">
          <div className="text-xs tracking-[0.3em] uppercase text-bone/60 mb-5">Our Philosophy</div>
          <h2 className="font-display text-4xl md:text-6xl leading-tight mb-6">
            Every material has a story. We help you find yours.
          </h2>
          <p className="text-bone/75 leading-relaxed mb-4 text-base">
            ATLAS was founded on a simple conviction: the materials we live with matter. For over a
            decade, our team has traveled to the mills, tanneries, and quarries that have defined
            craft for generations — forging direct relationships with the artisans who make them.
          </p>
          <p className="text-bone/75 leading-relaxed mb-8">
            No middlemen. No compromises. Just the finest materials on earth, delivered to your
            studio with complete provenance.
          </p>
          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-bone/20">
            <Stat value="340+" label="Artisan partners" />
            <Stat value="12" label="Countries" />
            <Stat value="98%" label="Client retention" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-display text-3xl md:text-4xl text-clay mb-1">{value}</div>
      <div className="text-[10px] tracking-[0.2em] uppercase text-bone/60">{label}</div>
    </div>
  );
}

function BannersSection() {
  return (
    <section className="max-w-[1400px] mx-auto px-5 md:px-10 py-20 md:py-28 grid md:grid-cols-2 gap-4">
      {banners.map((b) => (
        <Link
          key={b.id}
          to={b.href}
          className="group relative aspect-[5/4] overflow-hidden"
        >
          <img
            src={b.image}
            alt=""
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/20 to-transparent" />
          <div
            className={`relative h-full p-8 md:p-10 flex flex-col justify-end text-bone ${
              b.align === "right" ? "md:items-end md:text-right" : ""
            }`}
          >
            <Badge tone="bone">{b.tag}</Badge>
            <h3 className="font-display text-3xl md:text-5xl leading-tight mt-3 mb-2">{b.title}</h3>
            <p className="text-bone/80 max-w-sm mb-5 text-sm md:text-base">{b.subtitle}</p>
            <span className="inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase">
              {b.cta}
              <Icon.ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </Link>
      ))}
    </section>
  );
}

function NewArrivals({ products }: { products: ReturnType<typeof useStore>["products"] }) {
  return (
    <section className="bg-sand/40 py-20 md:py-28">
      <div className="max-w-[1400px] mx-auto px-5 md:px-10">
        <SectionHeader
          kicker="Just In"
          title="New arrivals."
          subtitle="Fresh materials added to the archive this week."
          action={{ label: "See all new", href: "/shop?filter=new" }}
        />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 mt-12">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PromiseStrip() {
  const items = [
    { icon: <Icon.Truck size={24} />, title: "Free shipping over $200", sub: "Worldwide delivery" },
    { icon: <Icon.Shield size={24} />, title: "Provenance guaranteed", sub: "Full material traceability" },
    { icon: <Icon.Leaf size={24} />, title: "Responsibly sourced", sub: "FSC, LWG & OEKO-TEX certified" },
    { icon: <Icon.Package size={24} />, title: "Sample service", sub: "Try before you commit" },
  ];
  return (
    <section className="max-w-[1400px] mx-auto px-5 md:px-10 py-14 border-y border-ink/10 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4">
      {items.map((it, i) => (
        <div key={i} className="flex items-start gap-4">
          <div className="text-clay shrink-0">{it.icon}</div>
          <div>
            <div className="text-sm font-medium">{it.title}</div>
            <div className="text-xs text-stone mt-0.5">{it.sub}</div>
          </div>
        </div>
      ))}
    </section>
  );
}

function TestimonialsSection() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % testimonials.length), 6000);
    return () => clearInterval(t);
  }, []);
  const t = testimonials[idx];

  return (
    <section className="max-w-[1400px] mx-auto px-5 md:px-10 py-20 md:py-28">
      <SectionHeader kicker="Kind Words" title="Trusted by makers worldwide." />
      <div className="grid md:grid-cols-2 gap-12 items-center mt-14">
        <div className="relative h-96 md:h-[500px] overflow-hidden">
          {testimonials.map((tt, i) => (
            <img
              key={tt.id}
              src={tt.avatar}
              alt={tt.name}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                i === idx ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>
        <div>
          <Stars rating={t.rating} size={16} />
          <blockquote className="font-display text-2xl md:text-4xl leading-snug mt-6 mb-8 transition-opacity duration-500">
            "{t.text}"
          </blockquote>
          <div className="flex items-center gap-4 pt-6 border-t border-ink/10">
            <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
            <div>
              <div className="font-medium">{t.name}</div>
              <div className="text-xs text-stone">{t.role}</div>
              <div className="text-xs text-clay mt-0.5">Purchased: {t.product}</div>
            </div>
          </div>
          <div className="flex gap-2 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`h-0.5 transition-all ${
                  i === idx ? "w-12 bg-ink" : "w-6 bg-ink/20"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function BestsellersSection({ products }: { products: ReturnType<typeof useStore>["products"] }) {
  return (
    <section className="bg-ink text-bone py-20 md:py-28">
      <div className="max-w-[1400px] mx-auto px-5 md:px-10">
        <SectionHeader
          kicker="Bestsellers"
          title="Most loved this month."
          subtitle="The materials our community can't get enough of."
          action={{ label: "Shop all bestsellers", href: "/shop?filter=bestseller", dark: true }}
        />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 mt-12">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1600&q=80"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-ink/70" />
      </div>
      <div className="relative max-w-3xl mx-auto px-5 md:px-10 py-24 md:py-32 text-center text-bone">
        <div className="text-xs tracking-[0.3em] uppercase opacity-80 mb-4">Stay in touch</div>
        <h2 className="font-display text-4xl md:text-6xl leading-tight mb-6">
          Letters from the archive.
        </h2>
        <p className="text-bone/80 mb-10 max-w-lg mx-auto">
          New arrivals, sourcing stories, and invitations to private previews — delivered monthly.
          No noise, just craft.
        </p>
        {sent ? (
          <div className="inline-flex items-center gap-3 bg-bone text-ink px-8 py-4">
            <Icon.Check size={18} />
            <span className="text-xs tracking-[0.2em] uppercase">Welcome to the archive</span>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (email) setSent(true);
            }}
            className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 bg-transparent border border-bone/40 px-5 py-4 text-sm placeholder:text-bone/50 focus:border-bone outline-none"
            />
            <button
              type="submit"
              className="bg-bone text-ink px-8 py-4 text-xs tracking-[0.25em] uppercase hover:bg-clay hover:text-bone transition-colors btn-press"
            >
              Subscribe
            </button>
          </form>
        )}
        <div className="text-xs text-bone/50 mt-6">
          By subscribing you agree to our privacy policy. Unsubscribe anytime.
        </div>
      </div>
    </section>
  );
}

export function SectionHeader({
  kicker,
  title,
  subtitle,
  action,
}: {
  kicker?: string;
  title: string;
  subtitle?: string;
  action?: { label: string; href: string; dark?: boolean };
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
      <div className="max-w-2xl">
        {kicker && (
          <div className="text-xs tracking-[0.3em] uppercase text-clay mb-3">{kicker}</div>
        )}
        <h2 className="font-display text-3xl md:text-5xl leading-tight">{title}</h2>
        {subtitle && (
          <p className={`mt-4 text-sm md:text-base ${action ? "" : "text-stone"}`}>{subtitle}</p>
        )}
      </div>
      {action && (
        <Link
          to={action.href}
          className={`inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase link-underline whitespace-nowrap ${
            action.dark ? "text-bone/80 hover:text-clay" : ""
          }`}
        >
          {action.label} <Icon.ArrowRight size={14} />
        </Link>
      )}
    </div>
  );
}
