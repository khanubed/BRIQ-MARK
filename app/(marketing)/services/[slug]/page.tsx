import React from "react";
import { notFound } from "next/navigation";
import servicesData from "../../../../content/services.json";
import { CTASection } from "../../../../components/sections/CTASection";
import { GuitarString } from "../../../../components/ui/GuitarString";

// 1. Generate Static Params so Next.js statically builds all pages for SEO
export function generateStaticParams() {
  return servicesData.map((service) => ({
    slug: service.id,
  }));
}

// 2. Generate Dynamic SEO Metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const service = servicesData.find((s) => s.id === resolvedParams.slug);

  if (!service) {
    return {
      title: "Service Not Found",
    };
  }

  return {
    title: service.seoMetaTitle,
    description: service.seoMetaDescription,
    openGraph: {
      title: service.seoMetaTitle,
      description: service.seoMetaDescription,
    },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const service = servicesData.find((s) => s.id === resolvedParams.slug);

  if (!service) {
    notFound();
  }

  return (
    <main className="flex-1 bg-[#0A0A0A] text-white min-h-screen pt-32 sm:pt-48 selection:bg-white selection:text-black">
      {/* Hero Section */}
      <section className="px-6 sm:px-12 lg:px-20 mb-20 sm:mb-32">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col mb-16">
            <h1 className="font-spacegrotesk text-[clamp(3.5rem,8vw,10rem)] leading-[0.85] tracking-[-0.04em] font-medium text-white mb-2 uppercase">
              {service.title}
            </h1>
          </div>

          <div className="w-full relative z-10 pointer-events-auto mb-8">
            <GuitarString
              height={32}
              strokeColor="rgba(255, 255, 255, 0.15)"
              activeColor="#ffffff"
              strokeWidth={1.2}
              maxDeflection={15}
              showEndpoints={true}
              showRipple={true}
              className="w-full"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4">
            <div className="md:col-span-4 lg:col-span-3">
              <h2 className="font-archivo font-semibold text-xl text-white  uppercase tracking-widest">
                Service Overview
              </h2>
            </div>
            <div className="md:col-span-8 lg:col-span-9 max-w-4xl">
              <p className="font-archivo text-2xl sm:text-3xl md:text-5xl text-neutral-100 font-light leading-tight sm:leading-snug mb-8">
                {service.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cinematic Video Section */}
      <section className="px-4 sm:px-8 w-full mb-32">
        <div className="relative w-full aspect-video sm:aspect-[21/9] rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-2xl border border-white/10 bg-neutral-900">
          <video
            src={service.video}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-80"
          ></video>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/80 via-transparent to-transparent" />
        </div>
      </section>

      {/* Deep Dive & Capabilities */}
      <section className="px-6 sm:px-12 lg:px-20 mb-32">
        <div className="max-w-7xl mx-auto">
          <div className="w-full relative z-10 pointer-events-auto mb-8">
            <GuitarString
              height={32}
              strokeColor="rgba(255, 255, 255, 0.15)"
              activeColor="#ffffff"
              strokeWidth={1.2}
              maxDeflection={15}
              showEndpoints={true}
              showRipple={true}
              className="w-full"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-8">
            <div className="md:col-span-4 lg:col-span-3">
              <h2 className="font-archivo font-semibold text-xl text-white  uppercase tracking-widest sticky top-32">
                The Details
              </h2>
            </div>
            <div className="md:col-span-8 lg:col-span-9 flex flex-col gap-12">
              <article>
                <p className="font-archivo text-lg sm:text-xl md:text-2xl text-neutral-100 leading-relaxed max-w-3xl">
                  {service.longDescription}
                </p>
              </article>

              <div className="mt-16 border-t border-white/5 pt-12">
                <h3 className="font-archivo text-xl text-neutral-100 uppercase tracking-widest mb-10">
                  Core Capabilities
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-12">
                  {service.capabilities.map((cap: any, i: number) => (
                    <div key={i} className="flex flex-col gap-4 group">
                      <div className="w-12 h-px bg-white/20 group-hover:bg-white/60 transition-colors duration-500 mb-2"></div>
                      <h4 className="font-archivo text-xl sm:text-2xl text-white group-hover:text-white transition-colors duration-500">
                        {cap.title}
                      </h4>
                      <p className="font-spacegrotesk text-base text-neutral-300 leading-relaxed group-hover:text-neutral-400 transition-colors duration-500">
                        {cap.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Outcomes */}
      <section className="px-6 sm:px-12 lg:px-20 mb-32">
        <div className="max-w-7xl mx-auto">
          <div className="w-full relative z-10 pointer-events-auto mb-8">
            <GuitarString
              height={32}
              strokeColor="rgba(255, 255, 255, 0.15)"
              activeColor="#ffffff"
              strokeWidth={1.2}
              maxDeflection={15}
              showEndpoints={true}
              showRipple={true}
              className="w-full"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-8">
            <div className="md:col-span-4 lg:col-span-3">
              <h2 className="font-archivo font-semibold text-xl text-white  uppercase tracking-widest sticky top-32">
                The Outcomes
              </h2>
            </div>
            <div className="md:col-span-8 lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              {service.benefits?.map((benefit: string, i: number) => (
                <div
                  key={i}
                  className="flex flex-col text-black gap-4 p-8 rounded-[2rem] bg-white border border-white/5 hover:bg-neutral-200 transition-colors duration-500"
                >
                  <span className="font-mono text-xs text-neutral-500">
                    0{i + 1}
                  </span>
                  <p className="font-archivo text-xl sm:text-2xl  font-light text-black">
                    {benefit}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* The Process */}
      <section className="px-6 sm:px-12 lg:px-20 mb-32">
        <div className="max-w-7xl mx-auto">
          <div className="w-full relative z-10 pointer-events-auto mb-8">
            <GuitarString
              height={32}
              strokeColor="rgba(255, 255, 255, 0.15)"
              activeColor="#ffffff"
              strokeWidth={1.2}
              maxDeflection={15}
              showEndpoints={true}
              showRipple={true}
              className="w-full"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-8">
            <div className="md:col-span-4 lg:col-span-3">
              <h2 className="font-archivo font-semibold text-xl text-white  uppercase tracking-widest sticky top-32">
                Execution Model
              </h2>
            </div>
            <div className="md:col-span-8 lg:col-span-9 flex flex-col gap-12 sm:gap-16">
              {service.process?.map((step: any, i: number) => (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row gap-4 sm:gap-12 group"
                >
                  <span className="font-spacegrotesk text-sm sm:text-base text-neutral-300 group-hover:text-neutral-400 transition-colors duration-500 mt-1">
                    {step.step}
                  </span>
                  <div className="flex flex-col gap-4 max-w-2xl">
                    <h3 className="font-archivo text-2xl sm:text-3xl text-white group-hover:text-white transition-colors duration-500">
                      {step.title}
                    </h3>
                    <p className="font-spacegrotesk text-base sm:text-lg text-neutral-100 leading-relaxed group-hover:text-neutral-300 transition-colors duration-500">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <CTASection theme="light" />
    </main>
  );
}
