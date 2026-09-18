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

import { CaseStudyContent } from "./CaseStudyContent";

export default async function CaseStudyDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const study = await getCaseStudyBySlug(slug);

  if (!study) {
    notFound();
  }

  return (
    <main className="flex-1 w-full bg-[#08080a] min-h-screen">
      <CaseStudyContent />
    </main>
  );
}
