"use client";

const clients = [
  "AT&T",
  "Comcast",
  "Meta",
  "Fastwyre",
  "Open Country",
  "Lumen",
  "Verizon",
  "Zayo",
  "Crown Castle",
  "Frontier",
];

export function ClientMarquee() {
  const allItems = [...clients, ...clients, ...clients, ...clients];

  return (
    <section className="border-b border-line overflow-hidden relative py-8 lg:py-10">
      {/* Label */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 mb-6">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted/50">
          Relied on by top telecom contractors
        </span>
      </div>

      {/* Edge fades */}
      <div className="absolute left-0 bottom-0 w-24 h-16 bg-gradient-to-r from-bg to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 bottom-0 w-24 h-16 bg-gradient-to-l from-bg to-transparent z-10 pointer-events-none" />

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
