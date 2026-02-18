"use client";

const clients = [
  "AT&T Broadband",
  "Fastwyre",
  "Comcast",
  "Meta",
  "Open County",
  "CAT5",
  "Sunrise Telecom",
];

export function ClientMarquee() {
  const allItems = [...clients, ...clients, ...clients, ...clients];

  return (
    <section className="border-b border-line overflow-hidden relative py-6 lg:py-8">
      {/* Edge fades */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-bg to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-bg to-transparent z-10 pointer-events-none" />

      <div className="flex animate-marquee w-max">
        {allItems.map((name, i) => (
          <span
            key={`${name}-${i}`}
            className="px-8 lg:px-12 font-heading text-lg lg:text-xl font-medium uppercase tracking-wider text-text/40 hover:text-text transition-opacity duration-300 whitespace-nowrap cursor-default select-none"
          >
            {name}
          </span>
        ))}
      </div>
    </section>
  );
}
