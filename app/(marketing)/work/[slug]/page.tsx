import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { getCaseStudies, getCaseStudyBySlug } from "../../../../lib/cms";
import { generatePageMetadata } from "../../../../lib/seo";
import { Badge } from "../../../../components/ui/Badge";
import { Card } from "../../../../components/ui/Card";
import { Button } from "../../../../components/ui/Button";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const studies = await getCaseStudies();
  return studies.map((s) => ({
    slug: s.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const study = await getCaseStudyBySlug(slug);

  if (!study) {
    return generatePageMetadata({
      title: "Case Study Not Found",
      description: "Case study could not be located.",
    });
  }

  return generatePageMetadata({
    title: `${study.title} | Case Study`,
    description: study.tagline,
    canonical: `/work/${study.slug}`,
  });
}

export default async function CaseStudyDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const study = await getCaseStudyBySlug(slug);

  if (!study) {
    notFound();
  }

  return (
    <main className="flex-1 pt-32 pb-24 px-6 bg-transparent">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Back Link */}
        <Link
          href="/work"
          className="inline-flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-amber-400 transition-colors uppercase tracking-wider"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to all case studies
        </Link>

        {/* Case Study Header */}
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="gold">{study.client}</Badge>
            <Badge variant="outline">{study.industry}</Badge>
            <Badge variant="default">Market: {study.market}</Badge>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            {study.title}
          </h1>

          <p className="text-lg sm:text-xl text-neutral-300 font-light leading-relaxed">
            {study.tagline}
          </p>
        </div>

        {/* Big Metrics Grid (Design rule: Large numbers, visual presentation) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-8 border-y border-neutral-800">
          {study.results.map((metric, idx) => (
            <Card
              key={idx}
              className="p-6 bg-neutral-900/40 border-neutral-800"
            >
              <span className="block text-3xl sm:text-4xl font-extrabold text-amber-400 font-mono">
                {metric.value}
              </span>
              <span className="block text-xs uppercase tracking-widest text-neutral-400 mt-1">
                {metric.label}
              </span>
            </Card>
          ))}
        </div>

        {/* Narrative: Challenge → Approach → Result */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-4">
          <div className="space-y-4">
            <span className="text-xs font-mono text-amber-400 uppercase tracking-widest">
              Phase 01 // The Challenge
            </span>
            <h3 className="text-xl font-bold text-white">
              The Structural Bottleneck
            </h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              {study.challenge}
            </p>
          </div>

          <div className="space-y-4">
            <span className="text-xs font-mono text-amber-400 uppercase tracking-widest">
              Phase 02 // Strategic Approach
            </span>
            <h3 className="text-xl font-bold text-white">The Intervention</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              {study.approach}
            </p>
          </div>

          <div className="space-y-4">
            <span className="text-xs font-mono text-amber-400 uppercase tracking-widest">
              Phase 03 // Business Outcome
            </span>
            <h3 className="text-xl font-bold text-white">Market Dominance</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              {study.outcome}
            </p>
          </div>
        </div>

        {/* CTA Card */}
        <Card className="p-10 bg-gradient-to-r from-neutral-900 via-neutral-900 to-black border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-2xl font-bold text-white">
              Achieve Comparable Scale For Your Brand
            </h3>
            <p className="text-sm text-neutral-400">
              Request a private strategic audit and discovery consultation.
            </p>
          </div>
          <Link href="/contact">
            <Button variant="gold" size="md" className="gap-2 shrink-0">
              Inquire Now
              <ArrowUpRight className="w-4 h-4" />
            </Button>
          </Link>
        </Card>
      </div>
    </main>
  );
}
