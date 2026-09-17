import { gsap } from "gsap";
import SplitType from "split-type";

export interface HeroAnimationElements {
  container: HTMLElement | null;
  kicker: HTMLElement | null;
  line1: HTMLElement | null;
  line2: HTMLElement | null;
  subheading: HTMLElement | null;
  ctaGroup: HTMLElement | null;
  visual: HTMLElement | null;
  bottomMeta: HTMLElement | null;
}

export interface HeroAnimationResult {
  timeline: gsap.core.Timeline;
  revert: () => void;
}

/**
 * Award-Winning Awwwards / FWA Tier Hero Reveal Timeline
 * Inspired by Rejouice, Cuberto, Locomotive, 14islands, and Active Theory.
 *
 * Sequence:
 * 1. Label kicker appears (0.2s duration / start)
 * 2. Headline Line 1 reveals: 120% Y, rotateX -45deg, blur(14px) -> blur(0), subtle physical overshoot (0.8s)
 * 3. Headline Line 2 reveals: staggered lines & characters (0.8s)
 * 4. Subheading fades & slides upward (0.6s)
 * 5. CTA button emerges with scale & magnetic aura (0.5s)
 * 6. Background 3D visual & ambient glow reacts in sync
 * Total Experience: ~2.5 - 3.2 seconds
 */
export function animateHeroEntrance(
  elements: HeroAnimationElements,
  prefersReduced: boolean = false,
  onCompleteCallback?: () => void
): HeroAnimationResult {
  const {
    container,
    kicker,
    line1,
    line2,
    subheading,
    ctaGroup,
    visual,
    bottomMeta,
  } = elements;

  // Custom physical deceleration ease with subtle organic overshoot (no toy bounce)
  // Replicating high-end kinetic physics of luxury watches & precision machinery
  const physicalOvershootEase = "cubic-bezier(0.16, 1.05, 0.28, 1)";
  const cinematicSmoothEase = "cubic-bezier(0.19, 1, 0.22, 1)";

  const tl = gsap.timeline({
    paused: false,
    defaults: {
      ease: physicalOvershootEase,
    },
    onComplete: () => {
      // Mark container as animation-settled for interactive hover states
      if (container) {
        container.setAttribute("data-revealed", "true");
      }
      if (onCompleteCallback) {
        onCompleteCallback();
      }
    },
  });

  // Reduced motion support: Instant tasteful fade
  if (prefersReduced) {
    tl.set(
      [kicker, line1, line2, subheading, ctaGroup, visual, bottomMeta].filter(
        Boolean
      ),
      { opacity: 1, y: 0, filter: "none", rotateX: 0, scale: 1 }
    );
    return {
      timeline: tl,
      revert: () => tl.kill(),
    };
  }

  // 1. Split Text into lines and characters via SplitType
  let split1: SplitType | null = null;
  let split2: SplitType | null = null;

  try {
    if (line1) {
      split1 = new SplitType(line1, {
        types: "lines,words,chars",
        tagName: "span",
      });
    }

    if (line2) {
      split2 = new SplitType(line2, {
        types: "lines,words,chars",
        tagName: "span",
      });
    }
  } catch (err) {
    console.warn("SplitType initial split fallback:", err);
  }

  const chars1 = split1?.chars || [];
  const chars2 = split2?.chars || [];

  // Enforce GPU transform and 3D containment on character spans
  const prepareCharStyles = (chars: HTMLElement[]) => {
    chars.forEach((char) => {
      char.style.display = "inline-block";
      char.style.willChange = "transform, opacity, filter";
      char.style.transformStyle = "preserve-3d";
      char.style.backfaceVisibility = "hidden";
      char.style.perspective = "1200px";
    });
  };

  if (chars1.length) prepareCharStyles(chars1 as unknown as HTMLElement[]);
  if (chars2.length) prepareCharStyles(chars2 as unknown as HTMLElement[]);

  // 2. Set Initial Physical States (Fully masked & zero flash)
  if (kicker) {
    gsap.set(kicker, {
      opacity: 0,
      y: 18,
      filter: "blur(6px)",
      willChange: "transform, opacity, filter",
    });
  }

  if (chars1.length > 0) {
    gsap.set(chars1, {
      yPercent: 120,
      rotateX: -48,
      opacity: 0,
      filter: "blur(14px)",
      scale: 0.94,
      transformPerspective: 1000,
      transformOrigin: "50% 100% -25px",
    });
  }

  if (chars2.length > 0) {
    gsap.set(chars2, {
      yPercent: 120,
      rotateX: -48,
      opacity: 0,
      filter: "blur(14px)",
      scale: 0.94,
      transformPerspective: 1000,
      transformOrigin: "50% 100% -25px",
    });
  }

  if (subheading) {
    gsap.set(subheading, {
      opacity: 0,
      y: 28,
      filter: "blur(8px)",
      willChange: "transform, opacity, filter",
    });
  }

  if (ctaGroup) {
    gsap.set(ctaGroup, {
      opacity: 0,
      y: 22,
      scale: 0.95,
      filter: "blur(4px)",
      willChange: "transform, opacity, filter",
    });
  }

  if (visual) {
    gsap.set(visual, {
      opacity: 0,
      scale: 0.88,
      y: 24,
      filter: "blur(18px)",
      willChange: "transform, opacity, filter",
    });
  }

  if (bottomMeta) {
    gsap.set(bottomMeta, {
      opacity: 0,
      y: 16,
      filter: "blur(4px)",
    });
  }

  // Make headline wrappers visible now that chars are positioned off-screen
  if (line1) gsap.set(line1, { opacity: 1 });
  if (line2) gsap.set(line2, { opacity: 1 });

  // 3. Orchestrated Layered Reveal Sequence
  // Step 1: Small Kicker Label appears first (Timing: 0.2s duration, subtle rise)
  if (kicker) {
    tl.to(
      kicker,
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.45,
        ease: cinematicSmoothEase,
      },
      0.1
    );
  }

  // Step 2: Background Visual wakes up subtly and organically
  if (visual) {
    tl.to(
      visual,
      {
        opacity: 1,
        scale: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1.6,
        ease: cinematicSmoothEase,
      },
      0.15
    );
  }

  // Step 3: First Headline Line emerges ("We Engineer Growth")
  // Timing: 0.8s duration, 120% Y to 0, -48deg to 0, blur(14px) to 0
  if (chars1.length > 0) {
    tl.to(
      chars1,
      {
        yPercent: 0,
        rotateX: 0,
        scale: 1,
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.8,
        stagger: {
          amount: 0.28,
          from: "start",
          ease: "power2.out",
        },
        ease: physicalOvershootEase,
      },
      0.25
    );
  }

  // Step 4: Second Headline Line emerges ("For Ambitious Brands.")
  // Timing: 0.8s duration, staggered organically after Line 1 starts settling
  if (chars2.length > 0) {
    tl.to(
      chars2,
      {
        yPercent: 0,
        rotateX: 0,
        scale: 1,
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.8,
        stagger: {
          amount: 0.32,
          from: "start",
          ease: "power2.out",
        },
        ease: physicalOvershootEase,
      },
      0.55
    );
  }

  // Step 5: Subheading fades and slides upward
  // Timing: 0.6s duration
  if (subheading) {
    tl.to(
      subheading,
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.6,
        ease: cinematicSmoothEase,
      },
      "-=0.4"
    );
  }

  // Step 6: CTA button appears with tiny scale normalization & glow
  // Timing: 0.5s duration
  if (ctaGroup) {
    tl.to(
      ctaGroup,
      {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 0.5,
        ease: physicalOvershootEase,
      },
      "-=0.35"
    );
  }

  // Step 7: Bottom trust metrics & scroll cues settle
  if (bottomMeta) {
    tl.to(
      bottomMeta,
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.5,
        ease: cinematicSmoothEase,
      },
      "-=0.25"
    );
  }

  // Cleanup Logic
  const revert = () => {
    tl.kill();
    try {
      split1?.revert();
      split2?.revert();
    } catch {
      // ignore
    }
  };

  return { timeline: tl, revert };
}
