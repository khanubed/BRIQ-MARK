import React from "react";
import { cn } from "../../lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "gold" | "outline" | "cyan";
}

export function Badge({
  className,
  variant = "default",
  children,
  ...props
}: BadgeProps) {
  const variants = {
    default: "bg-neutral-900 border border-neutral-800 text-neutral-300",
    gold: "bg-amber-500/10 border border-amber-500/30 text-amber-300",
    cyan: "bg-cyan-500/10 border border-cyan-500/30 text-cyan-300",
    outline: "border border-neutral-700 text-neutral-400",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider backdrop-blur-sm",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
