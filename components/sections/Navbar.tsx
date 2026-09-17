"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  toggleMobileMenu,
  setMobileMenuOpen,
} from "../../store/slices/uiSlice";
import { TextRoll } from "../ui/skiper-ui/skiper58";

const navPills = [
  { name: "ABOUT US", href: "/about" },
  { name: "SERVICES", href: "/services" },
  { name: "CASES", href: "/work" },
  { name: "CONTACT", href: "/contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const isMobileMenuOpen = useAppSelector((state) => state.ui.isMobileMenuOpen);

  const headerRef = useRef<HTMLElement | null>(null);
  const isExpandedRef = useRef(false);
  const riqRef = useRef<HTMLSpanElement | null>(null);
  const riqInnerRef = useRef<HTMLSpanElement | null>(null);
  const spaceRef = useRef<HTMLSpanElement | null>(null);
  const arketingRef = useRef<HTMLSpanElement | null>(null);
  const arketingInnerRef = useRef<HTMLSpanElement | null>(null);

  // GSAP scroll trigger: "BM" at top, expands to "BRIQ MARKETING" past 50% of hero
  useGSAP(
    () => {
      // Set initial collapsed state ("BM")
      gsap.set(
        [riqRef.current, arketingRef.current, spaceRef.current].filter(Boolean),
        {
          width: 0,
          opacity: 0,
          x: -8,
        },
      );

      const onScroll = () => {
        const heroThreshold = window.innerHeight * 0.45;
        const shouldExpand = window.scrollY > heroThreshold;

        if (shouldExpand !== isExpandedRef.current) {
          isExpandedRef.current = shouldExpand;

          if (shouldExpand) {
            const riqWidth = riqInnerRef.current?.offsetWidth || 50;
            const arketingWidth = arketingInnerRef.current?.offsetWidth || 140;

            gsap.killTweensOf(
              [
                riqRef.current,
                spaceRef.current,
                arketingRef.current,
                headerRef.current,
              ].filter(Boolean),
            );

            // Expand BM -> BRIQ MARKETING
            gsap.to(riqRef.current, {
              width: riqWidth,
              opacity: 1,
              x: 0,
              duration: 0.5,
              ease: "power3.out",
            });

            gsap.to(spaceRef.current, {
              width: 8,
              opacity: 1,
              duration: 0.3,
              ease: "power2.out",
            });

            gsap.to(arketingRef.current, {
              width: arketingWidth,
              opacity: 1,
              x: 0,
              duration: 0.55,
              delay: 0.04,
              ease: "power3.out",
            });

            // Frosted glass luxury navbar backdrop
            gsap.to(headerRef.current, {
              backgroundColor: "rgba(8, 8, 10, 0.75)",
              backdropFilter: "blur(16px)",
              borderBottomColor: "rgba(255, 255, 255, 0.08)",
              duration: 0.4,
            });
          } else {
            // Collapse BRIQ MARKETING -> BM
            gsap.killTweensOf(
              [
                riqRef.current,
                spaceRef.current,
                arketingRef.current,
                headerRef.current,
              ].filter(Boolean),
            );

            gsap.to(arketingRef.current, {
              width: 0,
              opacity: 0,
              x: -8,
              duration: 0.4,
              ease: "power3.in",
            });

            gsap.to(spaceRef.current, {
              width: 0,
              opacity: 0,
              duration: 0.2,
            });

            gsap.to(riqRef.current, {
              width: 0,
              opacity: 0,
              x: -8,
              duration: 0.4,
              delay: 0.03,
              ease: "power3.in",
            });

            // Transparent navbar backdrop at top of hero
            gsap.to(headerRef.current, {
              backgroundColor: "transparent",
              backdropFilter: "blur(0px)",
              borderBottomColor: "transparent",
              duration: 0.4,
            });
          }
        }
      };

      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll(); // initial evaluation

      return () => {
        window.removeEventListener("scroll", onScroll);
      };
    },
    { scope: headerRef },
  );

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-transparent border-b border-transparent px-4 sm:px-8 py-5 select-none"
    >
      <div className="w-full flex items-center justify-between">
        {/* Animated Brand Logo: "BM" initially -> expands to "BRIQ MARKETING" on scroll */}
        <Link
          href="/"
          className="group flex z-20 items-center font-archivo font-extrabold text-2xl sm:text-4xl text-white uppercase tracking-wider cursor-pointer select-none"
          onClick={() => dispatch(setMobileMenuOpen(false))}
        >
          <span className="flex items-center">
            {/* Letter B */}
            <span className="inline-block">B</span>

            {/* Expands 'RIQ' */}
            <span
              ref={riqRef}
              className="inline-flex overflow-hidden whitespace-nowrap opacity-0"
              style={{ width: 0 }}
            >
              <span ref={riqInnerRef}>IQ</span>
            </span>

            {/* Inter-word spacing */}
            <span
              ref={spaceRef}
              className="inline-block overflow-hidden opacity-0"
              style={{ width: 0 }}
            >
              &nbsp;
            </span>

            {/* Letter M */}
            <span className="inline-block">M</span>

            {/* Expands 'ARKETING' */}
            <span
              ref={arketingRef}
              className="inline-flex overflow-hidden whitespace-nowrap opacity-0"
              style={{ width: 0 }}
            >
              <span ref={arketingInnerRef}>ARK</span>
            </span>

            {/* Electric Cyan Registered Trademark */}
            <span className="text-slate-200 ml-0.5 text-base sm:text-lg font-sans align-top leading-none">
              ®
            </span>
          </span>
        </Link>

        {/* Desktop Navigation with Skiper UI skiper58 TextRoll Hover Animation */}
        <nav className="hidden lg:flex items-center gap-1 rounded-md p-1">
          {navPills.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`px-4 py-2 text-[16px] font-mono tracking-wider font-semibold transition-all rounded ${
                  isActive
                    ? "text-white underline underline-offset-[6px] decoration-white/50"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <TextRoll className="text-[16px] font-mono mix-blend-luminosity font-semibold tracking-wider">
                  {item.name}
                </TextRoll>
              </Link>
            );
          })}
        </nav>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => dispatch(toggleMobileMenu())}
          className="lg:hidden p-2 text-neutral-300 hover:text-[#00f0ff] focus:outline-none"
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-20 bg-neutral-950/95 backdrop-blur-2xl border-b border-neutral-800 p-6 flex flex-col gap-6 animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col gap-3">
            {navPills.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => dispatch(setMobileMenuOpen(false))}
                className="text-base font-anton tracking-wider text-neutral-300 hover:text-[#00f0ff] py-2 border-b border-neutral-900"
              >
                <TextRoll className="text-base font-anton tracking-wider">
                  {item.name}
                </TextRoll>
              </Link>
            ))}
          </nav>
          <div className="pt-2">
            <Link
              href="/contact"
              onClick={() => dispatch(setMobileMenuOpen(false))}
              className="block w-full text-center py-3 bg-[#00f0ff] text-black font-anton text-sm uppercase tracking-widest"
            >
              CONTACT US
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
