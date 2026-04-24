"use client";

import type {
  CSSProperties,
  ElementType,
  HTMLAttributes,
  PointerEvent,
  ReactNode,
} from "react";
import { cn } from "@/lib/utils";

type GlowColor = "amber" | "blue" | "purple" | "green" | "red" | "orange";
type GlowSize = "sm" | "md" | "lg";

interface GlowCardProps extends Omit<HTMLAttributes<HTMLElement>, "children" | "color"> {
  children: ReactNode;
  className?: string;
  glowColor?: GlowColor;
  size?: GlowSize;
  width?: string | number;
  height?: string | number;
  customSize?: boolean;
  as?: ElementType;
}

const glowColorMap: Record<GlowColor, { glow: string; border: string }> = {
  amber: { glow: "210, 140, 0", border: "235, 177, 68" },
  blue: { glow: "83, 146, 255", border: "132, 176, 255" },
  purple: { glow: "178, 116, 255", border: "203, 160, 255" },
  green: { glow: "89, 203, 137", border: "132, 221, 166" },
  red: { glow: "245, 92, 92", border: "255, 138, 138" },
  orange: { glow: "230, 118, 32", border: "255, 157, 74" },
};

function toCssSize(value?: string | number) {
  if (typeof value === "number") {
    return `${value}px`;
  }

  return value;
}

function updateSpotlightPosition(event: PointerEvent<HTMLElement>) {
  const card = event.currentTarget;
  const rect = card.getBoundingClientRect();

  card.style.setProperty("--spotlight-x", `${event.clientX - rect.left}px`);
  card.style.setProperty("--spotlight-y", `${event.clientY - rect.top}px`);
  card.dataset.spotlightActive = "true";
}

function hideSpotlight(event: PointerEvent<HTMLElement>) {
  event.currentTarget.dataset.spotlightActive = "false";
}

export function GlowCard({
  children,
  className,
  glowColor = "amber",
  size = "md",
  width,
  height,
  customSize = false,
  as = "div",
  style,
  onPointerEnter,
  onPointerMove,
  onPointerLeave,
  ...props
}: GlowCardProps) {
  const Element: ElementType = as;
  const colors = glowColorMap[glowColor];
  const cardStyle = {
    "--spotlight-rgb": colors.glow,
    "--spotlight-border-rgb": colors.border,
    width: toCssSize(width),
    height: toCssSize(height),
    ...style,
  } as CSSProperties;

  return (
    <Element
      {...props}
      data-spotlight-card
      data-spotlight-active="false"
      style={cardStyle}
      className={cn("spotlight-card", !customSize && `spotlight-card-size-${size}`, className)}
      onPointerEnter={(event: PointerEvent<HTMLElement>) => {
        updateSpotlightPosition(event);
        onPointerEnter?.(event);
      }}
      onPointerMove={(event: PointerEvent<HTMLElement>) => {
        updateSpotlightPosition(event);
        onPointerMove?.(event);
      }}
      onPointerLeave={(event: PointerEvent<HTMLElement>) => {
        hideSpotlight(event);
        onPointerLeave?.(event);
      }}
    >
      {children}
    </Element>
  );
}
