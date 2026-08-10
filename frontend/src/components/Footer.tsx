import { Link } from "react-router-dom";
import { Icon } from "./Icons";

export default function Footer() {
  return (
    <footer className="bg-ink text-bone/90 mt-24">
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 pt-20 pb-10">
        <div className="grid md:grid-cols-12 gap-10 md:gap-8 pb-14 border-b border-bone/10">
          <div className="md:col-span-4">
            <div className="font-display text-3xl tracking-[0.3em] mb-6">ATLAS</div>
            <p className="text-sm text-bone/70 leading-relaxed max-w-sm">
              A curated marketplace of the world's finest materials — sourced from the ateliers,
              mills, and quarries that have defined craft for generations.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="p-2 border border-bone/20 rounded-full hover:bg-bone hover:text-ink transition-colors">
                <Icon.Instagram size={16} />
              </a>
              <a href="#" className="p-2 border border-bone/20 rounded-full hover:bg-bone hover:text-ink transition-colors">
                <Icon.Pinterest size={16} />
              </a>
              <a href="#" className="p-2 border border-bone/20 rounded-full hover:bg-bone hover:text-ink transition-colors">
                <Icon.Twitter size={16} />
              </a>
            </div>
          </div>

          <FooterCol
            title="Shop"
            links={[
              ["All Materials", "/shop"],
              ["Fabrics", "/shop?category=fabric"],
              ["Leather", "/shop?category=leather"],
              ["Wood", "/shop?category=wood"],
              ["Stone", "/shop?category=stone"],
              ["Metal", "/shop?category=metal"],
              ["Sale", "/shop?filter=sale"],
            ]}
          />
          <FooterCol
            title="Studio"
            links={[
              ["Our Story", "/journal"],
              ["Sourcing", "/journal"],
              ["Trade Program", "/trade"],
              ["Sample Service", "/samples"],
              ["Journal", "/journal"],
            ]}
          />
          <FooterCol
            title="Support"
            links={[
              ["Contact", "/contact"],
              ["Shipping", "/shipping"],
              ["Returns", "/returns"],
              ["Care Guide", "/care"],
              ["FAQ", "/faq"],
            ]}
          />
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-8 text-xs text-bone/50">
          <div>© 2026 Atlas Materials Co. All rights reserved.</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-bone">Privacy</a>
            <a href="#" className="hover:text-bone">Terms</a>
            <a href="#" className="hover:text-bone">Cookies</a>
            <a href="#" className="hover:text-bone">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div className="md:col-span-2">
      <div className="text-xs tracking-[0.2em] uppercase text-bone/50 mb-5">{title}</div>
      <ul className="space-y-3 text-sm">
        {links.map(([label, href]) => (
          <li key={label}>
            <Link to={href} className="hover:text-clay transition-colors link-underline">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
