import { useState } from "react";

const promoCards = [
  {
    title: "Summer Essentials",
    subtitle: "Beachwear & Accessories",
    discount: "-20%",
    bg: "from-amber-500 to-orange-600",
    href: "/products",
  },
  {
    title: "Tech Deals",
    subtitle: "Gadgets & Electronics",
    discount: "-30%",
    bg: "from-blue-500 to-indigo-600",
    href: "/products",
  },
  {
    title: "New Arrivals",
    subtitle: "Just dropped this week",
    discount: "NEW",
    bg: "from-emerald-500 to-teal-600",
    href: "/products",
  },
];

export default function PromoBanner() {
  const [dismissed, setDismissed] = useState(false);

  return (
    <section>
      {/* Announcement Bar */}
      {!dismissed && (
        <div className="relative bg-gray-900">
          <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-4 py-2.5 text-center text-sm font-medium text-white sm:px-6 lg:px-8">
            <span>🔥</span>
            <span>
              Summer Sale: Up to <strong>30% OFF</strong> with code{" "}
              <span className="rounded bg-white/15 px-2 py-0.5 font-mono text-xs tracking-wider">
                SUMMER2026
              </span>
            </span>
            <button
              onClick={() => setDismissed(true)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-white/50 transition hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Promo Cards */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {promoCards.map((card) => (
            <a
              key={card.title}
              href={card.href}
              className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.bg} p-6 sm:p-8 transition hover:scale-[1.02] hover:shadow-lg`}
            >
              {/* Background circle decoration */}
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 transition group-hover:scale-150" />
              <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-white/10" />

              <div className="relative">
                <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                  {card.discount}
                </span>
                <h3 className="mt-4 text-xl font-bold text-white sm:text-2xl">
                  {card.title}
                </h3>
                <p className="mt-1 text-sm text-white/80">{card.subtitle}</p>
                <span className="mt-4 inline-flex items-center text-sm font-semibold text-white">
                  Shop Collection
                  <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4 transition group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
