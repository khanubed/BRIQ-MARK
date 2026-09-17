import { gsap } from "gsap";

export function createStaggerReveal(
  elements: HTMLElement[] | NodeListOf<HTMLElement>,
  options: {
    stagger?: number;
    duration?: number;
    y?: number;
  } = {}
) {
  const { stagger = 0.15, duration = 0.8, y = 24 } = options;

  return gsap.fromTo(
    elements,
    { opacity: 0, y },
    {
      opacity: 1,
      y: 0,
      duration,
      stagger,
      ease: "power2.out",
    }
  );
}

export function cleanupGsap() {
  gsap.killTweensOf("*");
}
