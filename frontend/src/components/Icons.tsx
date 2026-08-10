import type { ReactNode, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const base = (props: IconProps): IconProps => ({
  width: props.size ?? 20,
  height: props.size ?? 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  ...props,
});

export const Icon = {
  Search: (p: IconProps) => (
    <svg {...base(p)}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  ),
  Bag: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M6 7h12l-1 13H7L6 7Z" />
      <path d="M9 7a3 3 0 0 1 6 0" />
    </svg>
  ),
  Heart: (p: IconProps & { filled?: boolean }) => (
    <svg {...base(p)} fill={p.filled ? "currentColor" : "none"}>
      <path d="M12 20s-7-4.5-9-10a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 5.5-9 10-9 10Z" />
    </svg>
  ),
  User: (p: IconProps) => (
    <svg {...base(p)}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 4-7 8-7s8 3 8 7" />
    </svg>
  ),
  Menu: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  ),
  Close: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  ),
  ArrowRight: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  ),
  ArrowLeft: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M19 12H5M11 5l-7 7 7 7" />
    </svg>
  ),
  Star: (p: IconProps & { filled?: boolean }) => (
    <svg {...base(p)} fill={p.filled ? "currentColor" : "none"}>
      <path d="m12 3 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.8l-5.8 3.1 1.1-6.5L2.6 9.8l6.5-.9L12 3Z" />
    </svg>
  ),
  Truck: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
    </svg>
  ),
  Shield: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  Leaf: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M4 20c8 0 16-4 16-16-8 0-16 4-16 16Z" />
      <path d="M4 20c4-8 8-12 16-16" />
    </svg>
  ),
  Globe: (p: IconProps) => (
    <svg {...base(p)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" />
    </svg>
  ),
  Plus: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  Minus: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M5 12h14" />
    </svg>
  ),
  Trash: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" />
    </svg>
  ),
  Check: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="m5 12 5 5L20 7" />
    </svg>
  ),
  Package: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M3 7 12 3l9 4v10l-9 4-9-4V7Z" />
      <path d="M3 7l9 4 9-4M12 11v10" />
    </svg>
  ),
  Filter: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M4 5h16l-6 7v7l-4-2v-5L4 5Z" />
    </svg>
  ),
  Sparkle: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6" />
    </svg>
  ),
  Mail: (p: IconProps) => (
    <svg {...base(p)}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  ),
  Instagram: (p: IconProps) => (
    <svg {...base(p)}>
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
  ),
  Twitter: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M4 4h3l5 7 5-7h3L14 12l6 8h-3l-5-7-5 7H4l6-8L4 4Z" />
    </svg>
  ),
  Pinterest: (p: IconProps) => (
    <svg {...base(p)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M11 7c3 0 5 2 5 5s-2 4-4 4c-1 0-1-.5-1-1l1-4c-1 0-2 1-2 2 0 2 1 4 3 4 3 0 5-2 5-6s-3-6-7-6-7 3-7 6c0 2 1 3 2 4" />
    </svg>
  ),
};

export function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5 text-clay">
      {[1, 2, 3, 4, 5].map((i) => (
        <Icon.Star key={i} size={size} filled={i <= Math.round(rating)} />
      ))}
    </div>
  );
}

export function Badge({ children, tone = "ink" }: { children: ReactNode; tone?: "ink" | "clay" | "stone" | "bone" }) {
  const tones = {
    ink: "bg-ink text-bone",
    clay: "bg-clay text-bone",
    stone: "bg-stone text-bone",
    bone: "bg-bone text-ink border border-ink/10",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-medium tracking-[0.15em] uppercase ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
