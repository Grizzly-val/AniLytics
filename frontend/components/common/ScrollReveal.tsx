"use client";

import React, { ElementType } from "react";
import { useScrollReveal } from "@/lib/hooks/useScrollReveal";

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  duration?: number;
  className?: string;
  as?: ElementType;
  id?: string;
}

export function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 500,
  className = "",
  as: Component = "div",
  id,
}: ScrollRevealProps) {
  const { ref, isVisible } = useScrollReveal<HTMLElement>();

  const getTransformStyle = () => {
    if (isVisible) return "translate-x-0 translate-y-0 opacity-100";
    switch (direction) {
      case "up":
        return "translate-y-8 opacity-0";
      case "down":
        return "-translate-y-8 opacity-0";
      case "left":
        // Slide from right to left (initial offset is positive X on the right)
        return "translate-x-8 opacity-0";
      case "right":
        // Slide from left to right (initial offset is negative X on the left)
        return "-translate-x-8 opacity-0";
      default:
        return "translate-y-8 opacity-0";
    }
  };

  return (
    <Component
      ref={ref}
      id={id}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        willChange: "transform, opacity",
      }}
      className={`transition-all ease-out ${getTransformStyle()} ${className}`}
    >
      {children}
    </Component>
  );
}
