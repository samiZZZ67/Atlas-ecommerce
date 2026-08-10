import { Link } from "react-router-dom";
import { Icon } from "../components/Icons";

const posts = [
  {
    id: 1,
    category: "Sourcing",
    title: "A week in Biella: inside the wool mills that dress the world.",
    excerpt:
      "We traveled to the foothills of the Italian Alps to meet the third-generation weavers who produce our signature merino blends.",
    image: "https://images.unsplash.com/photo-1558171813-4c088753af8f?auto=format&fit=crop&w=1200&q=80",
    date: "March 12, 2026",
    read: "8 min read",
  },
  {
    id: 2,
    category: "Craft",
    title: "The slow fire of Shigaraki: five days inside an anagama kiln.",
    excerpt:
      "What makes an anagama-fired tile worth the wait? Master potter Kenji Watanabe explains the alchemy of wood-ash and flame.",
    image: "https://images.unsplash.com/photo-1610701596061-2ecf227e85c2?auto=format&fit=crop&w=1200&q=80",
    date: "February 28, 2026",
    read: "12 min read",
  },
  {
    id: 3,
    category: "Design",
    title: "Material first: why the best projects start at the surface.",
    excerpt:
      "An argument for designing from the material out — from architects, furniture makers, and fashion designers in our community.",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80",
    date: "February 10, 2026",
    read: "6 min read",
  },
];

export default function Journal() {
  return (
    <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-12 md:py-20">
      <div className="text-xs tracking-[0.3em] uppercase text-clay mb-4">The Journal</div>
      <h1 className="font-display text-5xl md:text-7xl leading-tight mb-6 max-w-3xl">
        Sourcing stories, studio notes, and the craft behind the materials.
      </h1>
      <p className="text-stone text-lg max-w-2xl mb-16">
        Long-form writing from the ateliers, tanneries, and quarries we work with — plus essays
        from the makers in our community.
      </p>

      {/* Featured */}
      <Link to="#" className="block group mb-16">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="aspect-[5/4] overflow-hidden">
            <img src={posts[0].image} alt="" className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-105" />
          </div>
          <div>
            <div className="text-xs tracking-[0.25em] uppercase text-clay mb-3">
              {posts[0].category} · {posts[0].date}
            </div>
            <h2 className="font-display text-3xl md:text-5xl leading-tight mb-4 group-hover:text-clay transition-colors">
              {posts[0].title}
            </h2>
            <p className="text-stone mb-4">{posts[0].excerpt}</p>
            <span className="inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase">
              Read the story <Icon.ArrowRight size={14} />
            </span>
          </div>
        </div>
      </Link>

      {/* Grid */}
      <div className="grid md:grid-cols-2 gap-10">
        {posts.slice(1).map((p) => (
          <Link key={p.id} to="#" className="group block">
            <div className="aspect-[4/3] overflow-hidden mb-5">
              <img src={p.image} alt="" className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-105" />
            </div>
            <div className="text-xs tracking-[0.25em] uppercase text-clay mb-2">
              {p.category} · {p.date}
            </div>
            <h3 className="font-display text-2xl md:text-3xl leading-tight mb-3 group-hover:text-clay transition-colors">
              {p.title}
            </h3>
            <p className="text-stone text-sm mb-3">{p.excerpt}</p>
            <span className="text-xs tracking-[0.2em] uppercase text-stone">{p.read}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function NotFound() {
  return (
    <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-32 text-center">
      <div className="font-display text-8xl md:text-9xl text-clay mb-4">404</div>
      <h1 className="font-display text-3xl md:text-4xl mb-4">This page has moved on.</h1>
      <p className="text-stone mb-8">The material you're looking for isn't in our archive.</p>
      <Link to="/" className="inline-block bg-ink text-bone px-8 py-3 text-xs tracking-[0.25em] uppercase">
        Return home
      </Link>
    </div>
  );
}
