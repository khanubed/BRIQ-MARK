import { Metadata } from "next";
import { generatePageMetadata } from "../../../lib/seo";
import { getCaseStudies } from "../../../lib/cms";
import { WorkPreview } from "../../../components/sections/WorkPreview";
import { CTASection } from "../../../components/sections/CTASection";
import { WorkAnimationWrapper } from "./WorkAnimationWrapper";
import { GuitarString } from "../../../components/ui/GuitarString";

export const metadata: Metadata = generatePageMetadata({
  title: "Selected Work & Documented Growth",
  description:
    "Explore verifiable case studies in luxury e-commerce, healthcare SaaS, and institutional greentech finance across North America and Dubai.",
  canonical: "/work",
});

const AnimatedText = ({ text, className }: { text: string; className?: string }) => {
  return (
    <span className={`animated-text-container ${className || ""}`}>
      {text.split(" ").map((word, i) => (
        <span key={i} className="inline-flex overflow-hidden mr-[0.25em] align-bottom pb-[0.2em] pt-[0.1em] -mb-[0.2em] pr-[0.1em] -mr-[0.1em]">
          <span className="reveal-word block translate-y-[110%] opacity-0 rotate-2">
            {word}
          </span>
        </span>
      ))}
    </span>
  );
};

const EditorialDivider = ({ left, center, right }: { left: string, center: string, right: string }) => (
  <div className="w-full relative z-10 pointer-events-auto mb-16">
    <div className="flex justify-between items-center text-[10px] sm:text-xs font-mono uppercase text-neutral-400 pb-4 px-2 tracking-widest">
      <span>{left}</span>
      <span className="hidden sm:block">{center}</span>
      <span>{right}</span>
    </div>
    <GuitarString height={24} strokeColor="rgba(255, 255, 255, 0.15)" activeColor="#ffffff" strokeWidth={1.2} maxDeflection={15} showEndpoints={false} showRipple={true} className="w-full" />
  </div>
);

export default async function WorkIndexPage() {
  const caseStudies = await getCaseStudies();

  return (
    <WorkAnimationWrapper>
      {/* 1. Hero Section (Editorial Layout) */}
      <section className="px-6 sm:px-12 lg:px-20 mb-20 pt-8">
        <div className="max-w-7xl mx-auto">
          {/* Top Bar Editorial */}
          <div className="flex justify-between items-start mb-24 sm:mb-32">
            <div className="flex flex-col text-[10px] sm:text-xs font-mono uppercase tracking-widest text-neutral-400">
              <span>BIQ MARK Agency,</span>
              <span>2026</span>
              <a href="https://navigotechinnovation.com/" target="_blank" rel="noopener noreferrer" className="mt-4 hover:text-white transition-colors underline underline-offset-4 decoration-white/20 hover:decoration-white/100">
                Tech Partner: Navigotech
              </a>
            </div>
            <div className="flex flex-wrap gap-2 justify-end">
              {['Luxury', 'SaaS', 'Finance'].map(badge => (
                <span key={badge} className="px-4 py-1.5 rounded-full border border-neutral-700 text-[10px] sm:text-xs font-mono uppercase tracking-widest text-neutral-300">
                  {badge}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col mb-16 relative">
            <h1 className="hero-title font-archivo text-[clamp(4rem,10vw,12rem)] leading-[0.85] uppercase tracking-[-0.08em] font-medium text-white mb-2">
              <AnimatedText text="selected —" />
            </h1>
            
            {/* The Floating Graphic Element */}
            <div className="absolute top-1/2 right-0 sm:right-[15%] w-32 h-32 sm:w-48 sm:h-48 rounded-full overflow-hidden shadow-2xl rotate-12 z-20 pointer-events-none parallax-media">
              <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 opacity-80 blur-xl absolute inset-0 mix-blend-screen" />
              <div className="w-full h-full bg-neutral-900 border border-white/20 rounded-full flex items-center justify-center backdrop-blur-md relative z-10">
                <span className="font-spacegrotesk font-bold text-white text-xl sm:text-3xl text-center leading-none">
                  HIGH<br/>IMPACT.
                </span>
              </div>
            </div>

            <h1 className="hero-title font-archivo text-[clamp(4rem,10vw,12rem)] leading-[0.85] tracking-[-0.11em] text-white self-end uppercase text-right z-10 relative mix-blend-difference">
              <AnimatedText text="engagements" />
            </h1>
          </div>
        </div>
      </section>

      {/* 2. Projects Gallery */}
      <section className="px-6 sm:px-12 lg:px-20 mb-32">
        <div className="max-w-7xl mx-auto text-center">
          <EditorialDivider left="01: Case Studies" center="biqmark.com" right="2026" />
          
          <WorkPreview initialCaseStudies={caseStudies} />
        </div>
      </section>

      <CTASection />
    </WorkAnimationWrapper>
  );
}
