import { Metadata } from "next";
import { generatePageMetadata } from "../../../lib/seo";
import { getTeam } from "../../../lib/cms";
import { CTASection } from "../../../components/sections/CTASection";
import { GuitarString } from "../../../components/ui/GuitarString";
import { AboutAnimationWrapper } from "./AboutAnimationWrapper";

export const metadata: Metadata = generatePageMetadata({
  title: "About the Agency | Senior Growth Leadership",
  description:
    "Meet the leadership behind BIQ MARK. Former growth leaders, creative directors, and data engineers orchestrating market dominance across North America and Dubai.",
  canonical: "/about",
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

// Reusable Divider Component for Dark Sections
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

// Minimalist Light Divider for the White Leadership Block
const LightDivider = ({ left, center, right }: { left: string, center: string, right: string }) => (
  <div className="w-full relative z-10 mb-16 border-b border-black/10 pb-4 flex justify-between items-center text-[10px] sm:text-xs font-mono uppercase text-neutral-500 px-2 tracking-widest">
    <span>{left}</span>
    <span className="hidden sm:block">{center}</span>
    <span>{right}</span>
  </div>
);

export default async function AboutPage() {
  const team = await getTeam();

  const corePrinciples = [
    {
      title: "Problem",
      desc: "Most agencies provide commoditized services. Elite brands require senior strategic partners with skin in the game.",
    },
    {
      title: "Solution",
      desc: "Every client works directly with our principals. We engineer market dominance combining aesthetic rigor with algorithmic capital allocation.",
    }
  ];

  return (
    <AboutAnimationWrapper>
      {/* 1. Hero Section (Editorial Layout) */}
      <section className="px-6 sm:px-12 lg:px-20 mb-32 pt-8">
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
              {['Strategy', 'Growth', 'Design'].map(badge => (
                <span key={badge} className="px-4 py-1.5 rounded-full border border-neutral-700 text-[10px] sm:text-xs font-mono uppercase tracking-widest text-neutral-300">
                  {badge}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col mb-16 relative">
            <h1 className="hero-title font-archivo text-[clamp(4rem,10vw,12rem)] leading-[0.85] uppercase tracking-[-0.08em] font-medium text-white mb-2">
              <AnimatedText text="full cycle —" />
            </h1>
            
            {/* The Floating Graphic Element */}
            <div className="absolute top-1/ right-0 sm:right-[15%] w-32 h-32 sm:w-48 sm:h-48 rounded-full overflow-hidden shadow-2xl rotate-12 z-20 pointer-events-none parallax-media">
              <div className="w-full h-full bg-gradient-to-br from-amber-400 to-red-500 opacity-80 blur-xl absolute inset-0 mix-blend-screen" />
              <div className="w-full h-full bg-neutral-900 border border-white/20 rounded-full flex items-center justify-center backdrop-blur-md relative z-10">
                <span className="font-spacegrotesk font-bold text-white text-xl sm:text-3xl text-center leading-none">
                  GOOD<br/>JOB.
                </span>
              </div>
            </div>

            <h1 className="hero-title font-archivo text-[clamp(4rem,10vw,12rem)] leading-[0.85] tracking-[-0.11em]  text-white self-end uppercase text-right z-10 relative mix-blend-difference">
              <AnimatedText text="digital agency" />
            </h1>
          </div>
        </div>
      </section>

      {/* Cinematic Video Section */}
      <section className="p-4 sm:p-14 w-full mb-32">
        <div className="relative w-full aspect-video rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-2xl border border-white/10 bg-neutral-900">
          <video
            src="/assets/about/about-top.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="parallax-media absolute top-[-15%] left-0 w-full h-[130%] object-cover"
          ></video>
        </div>
      </section>

      {/* 2. Thesis Section (Split Layout) */}
      <section className="px-6 sm:px-12 lg:px-20 mb-32">
        <div className="max-w-7xl mx-auto">
          <EditorialDivider left="01: The Thesis" center="biqmark.com" right="2026" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 pt-4">
            {/* Left side: Massive text */}
            <div className="lg:col-span-7">
              <h2 className="font-spacegrotesk text-2xl sm:text-3xl md:text-5xl text-neutral-200 leading-[1.1] sm:leading-[1.1] tracking-[-0.02em]">
                <AnimatedText text="BIQ MARK is a strategic growth firm that brings elite brands online, scales their operations, and captures the most profitable market share across North America and Dubai." />
              </h2>
            </div>
            
            {/* Right side: Bracket graphic & Problem/Solution */}
            <div className="lg:col-span-5 flex flex-col items-end text-right lg:text-left lg:items-start lg:pl-16">
              
              {/* Bracket Graphic */}
              <div className="flex items-center gap-4 mb-16 self-end lg:self-auto reveal-row opacity-0 translate-y-12">
                <span className="text-4xl sm:text-5xl font-light text-neutral-600">(</span>
                <span className="font-spacegrotesk text-sm tracking-widest uppercase font-bold text-white">Introduction</span>
                <span className="text-4xl sm:text-5xl font-light text-neutral-600">)</span>
              </div>

              {/* Problem / Solution Text Blocks */}
              <div className="space-y-12 w-full max-w-sm ml-auto lg:ml-0">
                {corePrinciples.map((principle, index) => (
                  <div key={index} className="reveal-row flex flex-col gap-4 text-left opacity-0 translate-y-12">
                    <h3 className="font-spacegrotesk text-sm font-bold text-white tracking-widest uppercase">
                      {principle.title}
                    </h3>
                    <p className="font-archivo text-neutral-400 text-sm sm:text-base leading-relaxed">
                      {principle.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Leadership Section (White Block Inverted Contrast) */}
      <section className="w-full bg-white text-black pt-24 sm:pt-32 pb-32 px-6 sm:px-12 lg:px-20 rounded-t-[3rem] sm:rounded-t-[4rem]">
        <div className="max-w-7xl mx-auto">
          
          <LightDivider left="02: Leadership" center="Strategic Partners" right="2026" />

          {/* White block big text */}
          <div className="mb-24 flex flex-col items-center">
            <h2 className="font-spacegrotesk text-[clamp(3rem,8vw,9rem)] leading-[0.85] tracking-[-0.04em] font-medium text-black text-center max-w-5xl mb-16">
              digital driving force for your business
            </h2>

            {/* Pink Bracket Graphic */}
            <div className="flex items-center gap-6 mb-16 reveal-row opacity-0 translate-y-12">
              <span className="text-5xl sm:text-6xl font-light text-[#D946EF]">(</span>
              <span className="font-spacegrotesk text-[10px] sm:text-xs tracking-widest uppercase font-bold text-[#D946EF] text-center leading-tight">
                Senior<br/>Leadership
              </span>
              <span className="text-5xl sm:text-6xl font-light text-[#D946EF]">)</span>
            </div>
          </div>

          <LightDivider left="about:" center="No Junior Account Managers" right="Principal Strategy Only" />

          {/* Team List in Light Mode */}
          <div className="grid grid-cols-1 gap-8 pt-4 mb-16">
            <div className="flex flex-col gap-12 sm:gap-16">
              {team.map((member, i) => (
                <div key={member.id} className="reveal-row flex flex-col sm:flex-row sm:items-start gap-6 sm:gap-12 group block border-b border-black/10 pb-12 transition-colors duration-500 hover:border-black/30 opacity-0 translate-y-12">
                  <h3 className="font-archivo text-2xl sm:text-3xl lg:text-4xl text-neutral-400 group-hover:text-black transition-colors duration-500 sm:w-64 shrink-0 flex items-baseline">
                    <span className="text-sm align-top mr-4 font-mono text-neutral-400 group-hover:text-black transition-colors">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {member.name}
                  </h3>
                  
                  <div className="flex-1 flex flex-col gap-6">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-spacegrotesk text-sm text-black bg-neutral-100 border border-black/10 px-4 py-2 rounded-full group-hover:bg-neutral-200 transition-colors duration-500">
                        {member.role}
                      </span>
                      <span className="font-mono text-xs uppercase text-neutral-400 tracking-widest">
                        {member.market}
                      </span>
                    </div>
                    
                    <p className="font-archivo text-base sm:text-lg text-neutral-600 leading-relaxed max-w-2xl group-hover:text-black transition-colors duration-500">
                      {member.bio}
                    </p>
                    
                    <div className="pt-4">
                      <span className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">
                        Domain Specialty
                      </span>
                      <span className="text-sm text-[#D946EF] font-archivo font-medium tracking-wide">
                        {member.specialty}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* The CTA Section has a dark background in the design system, which seamlessly continues after the white block is scrolled past */}
      <CTASection />
    </AboutAnimationWrapper>
  );
}
