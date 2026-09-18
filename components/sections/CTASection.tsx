"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";

const PHRASES = ["PING US", "LET'S TALK", "SAY HELLO"];
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$*";

interface CTASectionProps {
  theme?: "dark" | "light";
}

export function CTASection({ theme = "dark" }: CTASectionProps) {
  const router = useRouter();
  const sectionRef = useRef<HTMLElement | null>(null);
  
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayText, setDisplayText] = useState(PHRASES[0]);
  const intervalRef = useRef<number | null>(null);
  const scrambleRef = useRef<number | null>(null);

  useEffect(() => {
    intervalRef.current = window.setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % PHRASES.length);
    }, 3500);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    let iteration = 0;
    const targetText = PHRASES[phraseIndex];
    if (scrambleRef.current) window.clearInterval(scrambleRef.current);
    
    scrambleRef.current = window.setInterval(() => {
      setDisplayText((prev) => {
        const currentLength = Math.max(prev.length, targetText.length);
        const next = Array.from({ length: currentLength })
          .map((_, index) => {
            if (index < iteration) {
              return targetText[index] || "";
            }
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("");
          
        if (iteration >= currentLength) {
          if (scrambleRef.current) window.clearInterval(scrambleRef.current);
          return targetText;
        }
        return next;
      });
      iteration += 1 / 2.5; // Controls speed of reveal
    }, 30);
    
    return () => {
      if (scrambleRef.current) window.clearInterval(scrambleRef.current);
    };
  }, [phraseIndex]);

  // Cursor Logic
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springX = useSpring(cursorX, { damping: 20, stiffness: 200, mass: 0.5 });
  const springY = useSpring(cursorY, { damping: 20, stiffness: 200, mass: 0.5 });
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanding, setIsExpanding] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    cursorX.set(e.clientX - rect.left);
    cursorY.set(e.clientY - rect.top);
  }, [cursorX, cursorY]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const handleClick = useCallback(() => {
    if (isExpanding) return;
    setIsExpanding(true);
    setTimeout(() => {
      router.push("/contact");
    }, 800);
  }, [isExpanding, router]);

  const isLight = theme === "light";
  
  const bgClass = isLight ? "bg-white" : "bg-[#08080a]";
  const textClass = isLight ? "text-black" : "text-white";
  const borderClass = isLight ? "border-black" : "border-white";
  const cursorBgClass = isLight ? "bg-black" : "bg-white";
  const cursorTextClass = isLight ? "text-white" : "text-black";
  const cursorDotClass = isLight ? "bg-white" : "bg-black";
  const shadowClass = isLight ? "shadow-[0_0_30px_rgba(0,0,0,0.1)]" : "shadow-[0_0_30px_rgba(255,255,255,0.2)]";
  const transitionBgClass = isLight ? "bg-[#08080a]" : "bg-white";

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setIsHovered(true)}
      onClick={handleClick}
      className={`relative w-full min-h-[100vh] ${bgClass} ${textClass} flex flex-col justify-center items-center overflow-hidden cursor-none`}
    >
      {/* Custom Pill Cursor */}
      <motion.div
        style={{ x: springX, y: springY }}
        className="pointer-events-none absolute top-0 left-0 z-50 flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
      >
        <AnimatePresence>
          {isHovered && !isExpanding && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className={`${cursorBgClass} ${cursorTextClass} px-5 py-2.5 rounded-full flex items-center gap-2 ${shadowClass}`}
            >
              <span className="font-spacegrotesk font-bold text-[10px] uppercase tracking-widest">START</span>
              <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${cursorDotClass}`} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Top Label */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 text-center w-full pointer-events-none">
        <h3 className="font-spacegrotesk text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight">
          Got Project?
        </h3>
      </div>

      {/* Main Scramble Content */}
      <div className="flex items-center justify-center w-full max-w-[100vw] mt-12 pointer-events-none">
        
        {/* Left Sonar */}
        <div className="flex gap-2 sm:gap-4 mr-4 sm:mr-16 opacity-30">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={`l-${i}`}
              animate={{ opacity: [0.1, 1, 0.1] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
              className={`w-2 sm:w-3 h-20 sm:h-40 rounded-[50%] border-l-[2px] sm:border-l-[4px] ${borderClass}`}
            />
          ))}
        </div>

        {/* Massive Text */}
        <div className="flex-1 text-center flex justify-center items-center h-40 sm:h-64">
          <h2 className="font-spacegrotesk font-bold text-[clamp(3.5rem,12vw,16rem)] leading-none tracking-tighter uppercase whitespace-nowrap">
            {displayText}
          </h2>
        </div>

        {/* Right Sonar */}
        <div className="flex gap-2 sm:gap-4 ml-4 sm:ml-16 opacity-30">
          {[3, 2, 1, 0].map((i) => (
            <motion.div
              key={`r-${i}`}
              animate={{ opacity: [0.1, 1, 0.1] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: (3 - i) * 0.2 }}
              className={`w-2 sm:w-3 h-20 sm:h-40 rounded-[50%] border-r-[2px] sm:border-r-[4px] ${borderClass}`}
            />
          ))}
        </div>
      </div>

      {/* Expansion Transition */}
      <AnimatePresence>
        {isExpanding && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 200 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className={`fixed inset-0 z-40 origin-center pointer-events-none rounded-full ${transitionBgClass}`}
            style={{ 
              left: cursorX.get(), 
              top: cursorY.get(), 
              width: "20px", 
              height: "20px", 
              marginLeft: "-10px", 
              marginTop: "-10px" 
            }}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

export default CTASection;
