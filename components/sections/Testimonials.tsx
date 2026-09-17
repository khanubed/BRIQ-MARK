import { getTestimonials } from "../../lib/cms";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { RevealOnScroll } from "../motion/RevealOnScroll";
import { Quote } from "lucide-react";

export async function Testimonials() {
  const testimonials = await getTestimonials();

  return (
    <section className="py-24 px-6 bg-black/20 backdrop-blur-[2px] border-t border-neutral-800/60">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <RevealOnScroll className="max-w-2xl space-y-4">
          <Badge variant="gold">EXECUTIVE VALIDATION</Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Trusted by Visionary Founders and Institutional Leaders.
          </h2>
        </RevealOnScroll>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, idx) => (
            <RevealOnScroll key={item.id} delay={idx * 0.1}>
              <Card className="h-full flex flex-col justify-between p-8 border-neutral-800 bg-neutral-900/40">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <Quote className="w-6 h-6 text-amber-400/50" />
                    <Badge variant="gold" className="text-[10px]">
                      {item.metric}
                    </Badge>
                  </div>
                  <p className="text-sm text-neutral-300 leading-relaxed italic">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </div>

                <div className="pt-8 border-t border-neutral-800/80">
                  <div className="text-sm font-bold text-white">
                    {item.author}
                  </div>
                  <div className="text-xs text-neutral-400">
                    {item.role}, {item.company}
                  </div>
                  <div className="text-[10px] font-mono text-neutral-500 pt-1">
                    {item.location}
                  </div>
                </div>
              </Card>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
