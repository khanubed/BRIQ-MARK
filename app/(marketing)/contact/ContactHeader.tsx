"use client";

import { motion, Variants } from "framer-motion";

export function ContactHeader() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const textVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.21, 0.47, 0.32, 0.98],
      },
    },
  };

  return (
    <motion.div
      className="w-full  text-LEFT mb-16 sm:mb-24 space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h1 className="text-5xl max-w-5xl mr-auto sm:text-7xl md:text-[5.5rem] font-bold tracking-tighter text-white leading-[1.05] font-archivo">
        <span className="block overflow-hidden">
          <motion.span className="block" variants={textVariants}>
            Initiate a Strategic
          </motion.span>
        </span>
        <span className="block overflow-hidden">
          <motion.span className="block" variants={textVariants}>
            Briefing.
          </motion.span>
        </span>
      </h1>
      <div className="overflow-hidden text-left">
        <motion.p
          className="text-lg sm:text-xl  text-neutral-400 font-light max-w-4xl  font-archivo"
          variants={textVariants}
        >
          We accept a limited roster of client engagements per quarter to ensure
          singular focus. Complete the form to schedule a confidential dialogue.
        </motion.p>
      </div>
    </motion.div>
  );
}
