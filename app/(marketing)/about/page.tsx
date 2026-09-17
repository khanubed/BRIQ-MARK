import { Metadata } from "next";
import { generatePageMetadata } from "../../../lib/seo";
import { getTeam } from "../../../lib/cms";
import { Badge } from "../../../components/ui/Badge";
import { Card } from "../../../components/ui/Card";
import { CTASection } from "../../../components/sections/CTASection";
import { Globe, Award, Shield, Target } from "lucide-react";

export const metadata: Metadata = generatePageMetadata({
  title: "About the Agency | Senior Growth Leadership",
  description:
    "Meet the leadership behind NAVIGO. Former growth leaders, creative directors, and data engineers orchestrating market dominance across North America and Dubai.",
  canonical: "/about",
});

export default async function AboutPage() {
  const team = await getTeam();

  return (
    <main className="flex-1 pt-28 pb-16">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 mb-16 space-y-4">
        <Badge variant="gold">SENIOR LEADERSHIP</Badge>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Crafted by Founders, <br />
          Engineered for Leaders.
        </h1>
        <p className="max-w-2xl text-base sm:text-lg text-neutral-400 font-light leading-relaxed">
          NAVIGO was founded on a simple thesis: elite brands require senior
          strategic partners, not junior account managers. Every client works
          directly with our principals.
        </p>
      </div>

      {/* Core Principles Grid */}
      <div className="max-w-7xl mx-auto px-6 mb-24 grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="p-8 bg-neutral-900/30 border-neutral-800 space-y-4">
          <Target className="w-6 h-6 text-amber-400" />
          <h3 className="text-xl font-bold text-white">Skin in the Game</h3>
          <p className="text-sm text-neutral-400 leading-relaxed">
            We tie our commercial upside to verified client revenue milestones.
            When you scale, we scale.
          </p>
        </Card>

        <Card className="p-8 bg-neutral-900/30 border-neutral-800 space-y-4">
          <Globe className="w-6 h-6 text-amber-400" />
          <h3 className="text-xl font-bold text-white">Tri-Market Advantage</h3>
          <p className="text-sm text-neutral-400 leading-relaxed">
            Operating seamlessly across New York, Toronto, and Dubai allows us
            to syndicate global brand prestige and high-net-worth liquidity.
          </p>
        </Card>

        <Card className="p-8 bg-neutral-900/30 border-neutral-800 space-y-4">
          <Award className="w-6 h-6 text-amber-400" />
          <h3 className="text-xl font-bold text-white">Awwwards-Tier Rigor</h3>
          <p className="text-sm text-neutral-400 leading-relaxed">
            We believe aesthetic excellence is an emotional moat. We craft
            experiences that command instant authority and trust.
          </p>
        </Card>
      </div>

      {/* Team Principals */}
      <div className="max-w-7xl mx-auto px-6 mb-16 space-y-12">
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase text-amber-400 tracking-widest block">
            THE STRATEGIC PARTNERS
          </span>
          <h2 className="text-3xl font-bold text-white">Principal Directors</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member) => (
            <Card
              key={member.id}
              className="p-8 bg-neutral-900/40 border-neutral-800 space-y-6 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-white">
                    {member.name}
                  </h3>
                  <div className="text-xs text-amber-400 font-medium">
                    {member.role}
                  </div>
                  <div className="text-[10px] font-mono text-neutral-500">
                    {member.market}
                  </div>
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed">
                  {member.bio}
                </p>
              </div>

              <div className="pt-4 border-t border-neutral-800">
                <span className="text-[10px] font-mono uppercase text-neutral-500 block">
                  Domain Specialty:
                </span>
                <span className="text-xs text-neutral-200 font-medium">
                  {member.specialty}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <CTASection />
    </main>
  );
}
