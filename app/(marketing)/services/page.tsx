import React from "react";
import Link from "next/link";
import servicesData from "../../../content/services.json";
import { ServicesAnimationWrapper } from "./ServicesAnimationWrapper";
import { CTASection } from "../../../components/sections/CTASection";
import { GuitarString } from "../../../components/ui/GuitarString";
import { WaterImage } from "../../../components/ui/WaterImage";

export const metadata = {
  title: "Services & Solutions | NAVIGO",
  description: "Crafting meaningful connections between businesses and people.",
};

const AnimatedText = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => {
  return (
    <span className={`animated-text-container ${className || ""}`}>
      {text.split(" ").map((word, i) => (
        <span
          key={i}
          className="inline-flex overflow-hidden mr-[0.25em] align-bottom pb-1"
        >
          <span className="reveal-word block translate-y-[110%] opacity-0 rotate-2">
            {word}
          </span>
        </span>
      ))}
    </span>
  );
};

export default function ServicesPage() {
  return (
    <ServicesAnimationWrapper>
      {/* Hero Section */}
      <section className="px-6 sm:px-12 lg:px-20 mb-32">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col mb-16">
            <h1 className="hero-title font-spacegrotesk text-[clamp(4rem,10vw,12rem)] leading-[0.85] tracking-[-0.04em] font-medium text-white mb-2">
              <AnimatedText text="Services" />
            </h1>
            <h1 className="hero-title font-spacegrotesk text-[clamp(4rem,10vw,12rem)] leading-[0.85] tracking-[-0.04em] font-medium text-neutral-400 self-end text-right sm:pr-12">
              <AnimatedText text="& Solutions" />
            </h1>
          </div>

          <div className="w-full relative z-10 pointer-events-auto mb-8">
            <GuitarString
              height={48}
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
              <p className="font-archivo text-4xl text-neutral-200 font-bold uppercase tracking-widest">
                Approach
              </p>
            </div>
            <div className="md:col-span-8 lg:col-span-9 max-w-3xl">
              <h2 className="font-spacegrotesk text-xl sm:text-2xl md:text-4xl text-neutral-200  leading-tight sm:leading-snug mb-8">
                <AnimatedText text="We believe in well-crafted digital experiences through strategic foundations, collaborative design, and creative development." />
              </h2>
              <p className="font-spacegrotesk text-BASE sm:text-xl text-neutral-300 leading-relaxed max-w-2xl">
                <AnimatedText text="Whether you require help with strategy, web or product design, development, app creation, or innovative tech, we have the expertise and experience to deliver uniquely branded and interactive solutions for your audience." />
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cinematic Video Section */}
      <section className="p-4 sm:p-14  w-full mb-32">
        <div className="relative  w-full aspect-video  rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-2xl border border-white/10 bg-neutral-900">
          <video
            src="/assets/services/service-page-vid.webm"
            autoPlay
            loop
            muted
            playsInline
            className="parallax-media absolute top-[-15%] left-0 w-full h-[130%] object-cover"
          ></video>
        </div>
      </section>

      {/* Services List Section */}
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
            <div className="md:col-span-4 lg:col-span-3 sticky top-32 md:top-40 self-start z-20">
              <p className="font-archivo text-4xl text-neutral-200 font-bold uppercase tracking-widest">
                Services
              </p>
            </div>
            <div className="md:col-span-8 lg:col-span-9 flex flex-col gap-16 md:gap-24">
              {servicesData.map((service: any) => (
                <Link
                  href={`/services/${service.id}`}
                  key={service.id}
                  className="service-row flex flex-col sm:flex-row sm:items-start gap-6 sm:gap-12 group block p-6   sm:p-8 -mx-6 sm:-mx-8  transition-colors duration-500  border-b-1 "
                >
                  <h3 className="font-archivo text-2xl sm:text-3xl lg:text-4xl text-neutral-400 group-hover:text-white transition-colors duration-500 sm:w-64 shrink-0 flex items-baseline">
                    <span className="text-sm align-top mr-4 font-mono text-neutral-200 group-hover:text-white transition-colors">
                      {service.number}
                    </span>
                    {service.title}
                  </h3>

                  <div className="flex-1 flex flex-col gap-6">
                    <p className="font-archivo text-base sm:text-lg text-neutral-200 leading-relaxed max-w-2xl group-hover:text-white transition-colors duration-500">
                      {service.description}
                    </p>

                    <ul className="flex flex-wrap gap-2">
                      {service.capabilities.map((item: any, i: number) => (
                        <li
                          key={i}
                          className="font-spacegrotesk text-xs sm:text-sm text-neutral-300 font-medium bg-[#0A0A0A] border border-white/10 px-3 py-1.5 rounded-full group-hover:text-white group-hover:border-white/20 transition-all duration-500"
                        >
                          {item.title}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="hidden sm:flex shrink-0 items-center justify-center w-12 h-12 rounded-full border border-white/10 group-hover:border-white/30 group-hover:bg-white text-neutral-500 group-hover:text-black transition-all duration-500 sm:self-start mt-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="transform -rotate-45 group-hover:rotate-0 transition-transform duration-500"
                    >
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Branded Experiences / Image Gallery */}
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
            <div className="md:col-span-12 max-w-4xl mb-12">
              <h2 className="font-archivo text-2xl sm:text-4xl text-white font-light leading-snug">
                <AnimatedText text="Branded Experiences — Websites, products, campaigns. We engineer digital brands and ecosystems that are both highly functional and structurally dominant." />
              </h2>
            </div>

            {/* Masonry / Grid Images */}
            <div className="md:col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <WaterImage
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop"
                alt="Creative Campaign"
                className="relative aspect-[4/5] sm:aspect-square w-full rounded-xs overflow-hidden"
              />
              <WaterImage
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop"
                alt="Data Dashboard"
                className="relative aspect-[4/5] sm:aspect-square w-full rounded-xs overflow-hidden"
              />
              <WaterImage
                src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1200&auto=format&fit=crop"
                alt="AI Implementation"
                className="relative aspect-[4/5] sm:aspect-square w-full rounded-xs overflow-hidden sm:col-span-2 lg:col-span-1"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <CTASection theme="light" />
    </ServicesAnimationWrapper>
  );
}
