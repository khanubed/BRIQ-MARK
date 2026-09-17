import React from "react";
import { cn } from "../../lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

export function Card({
  className,
  hoverEffect = true,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "relative rounded-2xl bg-neutral-900/60 border border-neutral-800/80 p-6 backdrop-blur-md transition-all duration-300",
        hoverEffect &&
          "hover:border-neutral-700 hover:bg-neutral-900/90 hover:shadow-[0_8px_30px_rgb(0,0,0,0.4)]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
