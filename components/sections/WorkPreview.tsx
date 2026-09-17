"use client";

import Link from "next/link";
import { ArrowUpRight, TrendingUp } from "lucide-react";
import { CaseStudy } from "../../lib/cms";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { RevealOnScroll } from "../motion/RevealOnScroll";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  setSelectedMarket,
  setSelectedIndustry,
} from "../../store/slices/workSlice";

interface WorkPreviewProps {
  initialCaseStudies: CaseStudy[];
}

export function WorkPreview({ initialCaseStudies }: WorkPreviewProps) {
  const dispatch = useAppDispatch();
  const selectedMarket = useAppSelector((state) => state.work.selectedMarket);
  const selectedIndustry = useAppSelector(
    (state) => state.work.selectedIndustry,
  );

  const filteredStudies = initialCaseStudies.filter((study) => {
    const marketMatch =
      selectedMarket === "all" || study.market === selectedMarket;
    const industryMatch =
      selectedIndustry === "all" || study.industry === selectedIndustry;
    return marketMatch && industryMatch;
  });

  const industries = [
    "all",
    ...Array.from(new Set(initialCaseStudies.map((s) => s.industry))),
  ];

  return (
    <section className="py-24 px-6 bg-black/30 backdrop-blur-[2px] border-t border-neutral-800/60">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header and Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <RevealOnScroll className="max-w-xl space-y-4">
            <Badge variant="gold">PROVEN OUTCOMES</Badge>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Selected Engagements & Documented Transformations.
            </h2>
          </RevealOnScroll>

          {/* Market Filter Chips (US, Canada, UAE) */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono uppercase text-neutral-500 mr-2">
              Market:
            </span>
            {(["all", "US", "Canada", "UAE"] as const).map((mkt) => (
              <button
                key={mkt}
                onClick={() => dispatch(setSelectedMarket(mkt))}
                className={`text-xs px-3 py-1.5 rounded-full font-mono transition-all cursor-pointer ${
                  selectedMarket === mkt
                    ? "bg-amber-400 text-black font-semibold"
                    : "bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800"
                }`}
              >
                {mkt === "all" ? "All Markets" : mkt}
              </button>
            ))}
          </div>
        </div>

        {/* Case Studies Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {filteredStudies.map((study, idx) => (
            <RevealOnScroll key={study.slug} delay={idx * 0.1}>
              <Card className="h-full flex flex-col justify-between overflow-hidden border-neutral-800 bg-neutral-900/30 hover:border-neutral-700 transition-all p-0 group">
                <div className="p-8 space-y-6">
                  {/* Market & Industry Tags */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
                      {study.client}
                    </span>
                    <Badge variant="outline" className="text-[10px]">
                      {study.market} • {study.industry}
                    </Badge>
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors leading-snug">
                    {study.title}
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {study.tagline}
                  </p>

                  {/* Results Highlights */}
                  <div className="grid grid-cols-3 gap-2 pt-4 border-t border-neutral-800/80">
                    {study.results.map((res, rIdx) => (
                      <div key={rIdx} className="space-y-1">
                        <span className="block text-lg font-mono font-bold text-amber-400">
                          {res.value}
                        </span>
                        <span className="block text-[10px] uppercase tracking-wider text-neutral-500">
                          {res.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Action Link */}
                <div className="p-6 bg-neutral-950/60 border-t border-neutral-800/60 flex items-center justify-between">
                  <Link
                    href={`/work/${study.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-amber-400 group-hover:text-amber-300 transition-colors"
                  >
                    View Case Narrative
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                  <span className="text-[10px] font-mono text-neutral-500">
                    VERIFIED DATA
                  </span>
                </div>
              </Card>
            </RevealOnScroll>
          ))}
        </div>

        {/* View All Work Link */}
        <div className="text-center pt-6">
          <Link href="/work">
            <Button variant="secondary" size="md">
              Explore All Client Case Studies
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
