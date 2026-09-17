import { Metadata } from "next";
import { generatePageMetadata } from "../../lib/seo";
import { getCaseStudies } from "../../lib/cms";
import { Hero } from "../../components/sections/Hero";
import { Capabilities } from "../../components/sections/Capabilities";
import { WorkPreview } from "../../components/sections/WorkPreview";
import WorkSection from "../../components/sections/WorkSection";
import { Testimonials } from "../../components/sections/Testimonials";
import { CTASection } from "../../components/sections/CTASection";
import { NarrativeSection } from "@/components/sections/NarrativeSection";
import WorkGallery from "@/components/sections/WorkGallery";

export const metadata: Metadata = generatePageMetadata({
  title: "NAVIGO | Premium Strategic Growth Partner",
  description:
    "Engineering category dominance for high-growth, luxury, and enterprise brands across the US, Canada, and UAE through algorithmic media and cinematic creative.",
  canonical: "/",
});

export default async function HomePage() {
  const caseStudies = await getCaseStudies();

  return (
    <main className="flex-1">
      <Hero />
      <CTASection theme="dark" />
      <NarrativeSection />
      <WorkGallery />
      <CTASection theme="light" />
      {/* <Capabilities /> */}
      {/* <WorkSection /> */}
      {/* <WorkPreview initialCaseStudies={caseStudies} />
      <Testimonials />
      <CTASection /> */}
    </main>
  );
}
