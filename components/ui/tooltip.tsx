"use client";

import { ReactNode, useState } from "react";

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  delay?: number;
}

export function Tooltip({ content, children, side = "top", delay = 200 }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    const id = setTimeout(() => setIsVisible(true), delay);
    setTimeoutId(id);
  };

  const handleMouseLeave = () => {
    if (timeoutId) clearTimeout(timeoutId);
    setIsVisible(false);
  };

  const sideClasses = {
    top: "bottom-full mb-2 left-1/2 -translate-x-1/2",
    bottom: "top-full mt-2 left-1/2 -translate-x-1/2",
    left: "right-full mr-2 top-1/2 -translate-y-1/2",
    right: "left-full ml-2 top-1/2 -translate-y-1/2",
  };

  return (
    <div className="relative inline-block" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {children}
      {isVisible && (
        <div
          className={`absolute z-50 rounded-lg bg-slate-900 text-white text-xs font-medium px-2.5 py-1.5 whitespace-nowrap shadow-lg pointer-events-none animate-fade-in ${sideClasses[side]}`}
        >
          {content}
          {/* Arrow */}
          <div
            className={`absolute w-1.5 h-1.5 bg-slate-900 transform rotate-45 ${
              side === "top"
                ? "top-full left-1/2 -translate-x-1/2 -translate-y-1/2"
                : side === "bottom"
                  ? "bottom-full left-1/2 -translate-x-1/2 translate-y-1/2"
                  : side === "left"
                    ? "left-full top-1/2 -translate-y-1/2 translate-x-1/2"
                    : "right-full top-1/2 -translate-y-1/2 -translate-x-1/2"
            }`}
          />
        </div>
      )}
    </div>
  );
}
