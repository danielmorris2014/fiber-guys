import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ReferralForm } from "@/components/forms/ReferralForm";
import type { PositionOption } from "@/components/forms/ApplicationForm";

interface ReferralSectionProps {
  bonusAmount?: string | null;
  description?: string | null;
  positions: PositionOption[];
}

export function ReferralSection({
  bonusAmount,
  description,
  positions,
}: ReferralSectionProps) {
  const bonus = bonusAmount || "$500";
  const desc =
    description ||
    `Know someone who belongs in the field? Refer an experienced operator or splicer. If they get hired and complete 90 days, you earn a ${bonus} referral bonus. No strings — just good people recommending good people.`;

  return (
    <section className="border-t-2 border-white/[0.1] bg-[#060606]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left — Info */}
          <ScrollReveal>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-amber-500 mb-4">
                [Referral Program]
              </p>
              <h2 className="font-heading text-3xl lg:text-4xl font-bold tracking-tighter text-white mb-4">
                Refer a Field Hand.{" "}
                <span className="text-amber-400">Earn {bonus}.</span>
              </h2>
              <p className="font-mono text-sm text-white/40 leading-relaxed max-w-lg">
                {desc}
              </p>

              <div className="mt-8 flex items-center gap-4">
                <div className="border border-amber-500/20 bg-amber-500/[0.05] rounded-sm px-4 py-3">
                  <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-amber-400/60 mb-1">
                    Bonus
                  </p>
                  <p className="font-heading text-2xl font-bold text-amber-400">
                    {bonus}
                  </p>
                </div>
                <div className="font-mono text-[10px] text-white/25 leading-relaxed">
                  <p>Per qualified hire</p>
                  <p>Paid after 90-day retention</p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Right — Form */}
          <ScrollReveal delay={0.1}>
            <div className="border border-white/[0.06] rounded-sm bg-white/[0.01] p-6 md:p-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/30 mb-6">
                Submit a Referral
              </p>
              <ReferralForm positions={positions} />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
