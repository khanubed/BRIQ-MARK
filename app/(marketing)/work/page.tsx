import { Metadata } from "next";
import { generatePageMetadata } from "../../../lib/seo";
import { getCaseStudies } from "../../../lib/cms";
import { WorkPreview } from "../../../components/sections/WorkPreview";
import { Badge } from "../../../components/ui/Badge";
import { CTASection } from "../../../components/sections/CTASection";

export const metadata: Metadata = generatePageMetadata({
  title: "Selected Work & Documented Growth",
  description:
    "Explore verifiable case studies in luxury e-commerce, healthcare SaaS, and institutional greentech finance across North America and Dubai.",
  canonical: "/work",
});

export default async function WorkIndexPage() {
  const caseStudies = await getCaseStudies();

  return (
    <main className="flex-1 pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-6 mb-12 space-y-4">
        <Badge variant="gold">PORTFOLIO OF IMPACT</Badge>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white">
          Transformational Results for High-Stakes Brands.
        </h1>
        <p className="max-w-2xl text-base text-neutral-400 font-light">
          Every client engagement is built around explicit commercial
          benchmarks: revenue acceleration, market share acquisition, and brand
          valuation expansion.
        </p>
      </div>

      <WorkPreview initialCaseStudies={caseStudies} />
      <CTASection />
    </main>
  );
}
