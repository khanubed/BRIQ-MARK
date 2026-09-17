"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function ServicesAnimationWrapper({ children }: { children: React.ReactNode }) {
  const mainRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    // 1. Hero Stagger
    const heroWords = mainRef.current?.querySelectorAll(".hero-title .reveal-word");
    if (heroWords && heroWords.length > 0) {
      gsap.to(heroWords, {
        y: 0,
        opacity: 1,
        rotate: 0,
        duration: 1.4,
        stagger: 0.08,
        ease: "expo.out",
        delay: 0.1,
      });
    }

    // 2. Scroll Triggered Animated Text
    const textContainers = mainRef.current?.querySelectorAll(".animated-text-container:not(.hero-title)");
    textContainers?.forEach((container) => {
      const words = container.querySelectorAll(".reveal-word");
      if (words.length > 0) {
        gsap.to(words, {
          y: 0,
          opacity: 1,
          rotate: 0,
          duration: 1.2,
          stagger: 0.015,
          ease: "power3.out",
          scrollTrigger: {
            trigger: container,
            start: "top 85%",
          }
        });
      }
    });

    // 3. Service Rows Reveal
    const serviceRows = mainRef.current?.querySelectorAll(".service-row");
    serviceRows?.forEach((row) => {
      gsap.fromTo(
        row,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: row,
            start: "top 85%",
          }
        }
      );
    });

    // 4. Image Parallax & Reveal
    const images = mainRef.current?.querySelectorAll(".gallery-image");
    images?.forEach((img) => {
      gsap.fromTo(
        img,
        { scale: 1.15, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1.5,
          ease: "expo.out",
          scrollTrigger: {
            trigger: img,
            start: "top 85%",
          }
        }
      );
    });
  }, { scope: mainRef });

  return (
    <main ref={mainRef} className="flex-1 bg-[#0A0A0A] text-white min-h-screen pt-32 sm:pt-48 selection:bg-white selection:text-black">
      {children}
    </main>
  );
}
