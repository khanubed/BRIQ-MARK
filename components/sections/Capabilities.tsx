import Link from "next/link";
import { ArrowUpRight, CheckCircle2, Zap } from "lucide-react";
import { getServices } from "../../lib/cms";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { RevealOnScroll } from "../motion/RevealOnScroll";

export async function Capabilities() {
  const services = await getServices();

  return (
    <section className="py-24 px-6 bg-black/20 backdrop-blur-[2px] border-t border-neutral-800/60">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Header */}
        <RevealOnScroll className="max-w-2xl space-y-4">
          <Badge variant="gold">CAPABILITIES ARCHITECTURE</Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Engineered for Exponential Return, Not Incremental Vanity.
          </h2>
          <p className="text-neutral-400 text-base leading-relaxed">
            We reject the traditional agency menu of hourly deliverables.
            Instead, we deploy comprehensive growth systems engineered around
            revenue milestones.
          </p>
        </RevealOnScroll>

        {/* Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <RevealOnScroll key={service.id} delay={index * 0.1}>
              <Card className="h-full flex flex-col justify-between p-8 border-neutral-800 bg-neutral-900/40 hover:border-amber-400/40 transition-all group">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-amber-400 tracking-widest uppercase">
                      SYS // 0{index + 1}
                    </span>
                    <Badge variant="default" className="text-[10px]">
                      {service.outcomeMetric}
                    </Badge>
                  </div>

                  <h3 className="text-2xl font-bold text-white group-hover:text-amber-300 transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-sm font-light text-neutral-300 italic">
                    &ldquo;{service.tagline}&rdquo;
                  </p>

                  <p className="text-sm text-neutral-400 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Key Deliverables list */}
                  <div className="pt-4 border-t border-neutral-800/80 space-y-2.5">
                    {service.deliverables.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2.5 text-xs text-neutral-300"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-8">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-amber-400 group-hover:text-amber-300 transition-colors"
                  >
                    Deploy this capability
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>
              </Card>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
