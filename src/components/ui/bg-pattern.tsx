import React from "react";
import { cn } from "@/lib/utils";

type BGVariantType =
  | "dots"
  | "diagonal-stripes"
  | "grid"
  | "horizontal-lines"
  | "vertical-lines"
  | "checkerboard";
type BGMaskType =
  | "fade-center"
  | "fade-edges"
  | "fade-top"
  | "fade-bottom"
  | "fade-left"
  | "fade-right"
  | "fade-x"
  | "fade-y"
  | "none";

type BGPatternProps = React.ComponentProps<"div"> & {
  variant?: BGVariantType;
  mask?: BGMaskType;
  size?: number;
  fill?: string;
};

const maskStyles: Record<BGMaskType, React.CSSProperties> = {
  "fade-edges": {
    maskImage: "radial-gradient(ellipse at center, black 42%, transparent 78%)",
    WebkitMaskImage: "radial-gradient(ellipse at center, black 42%, transparent 78%)",
  },
  "fade-center": {
    maskImage: "radial-gradient(ellipse at center, transparent 18%, black 70%)",
    WebkitMaskImage: "radial-gradient(ellipse at center, transparent 18%, black 70%)",
  },
  "fade-top": {
    maskImage: "linear-gradient(to bottom, transparent, black 28%)",
    WebkitMaskImage: "linear-gradient(to bottom, transparent, black 28%)",
  },
  "fade-bottom": {
    maskImage: "linear-gradient(to bottom, black 72%, transparent)",
    WebkitMaskImage: "linear-gradient(to bottom, black 72%, transparent)",
  },
  "fade-left": {
    maskImage: "linear-gradient(to right, transparent, black 28%)",
    WebkitMaskImage: "linear-gradient(to right, transparent, black 28%)",
  },
  "fade-right": {
    maskImage: "linear-gradient(to right, black 72%, transparent)",
    WebkitMaskImage: "linear-gradient(to right, black 72%, transparent)",
  },
  "fade-x": {
    maskImage: "linear-gradient(to right, transparent, black 18%, black 82%, transparent)",
    WebkitMaskImage: "linear-gradient(to right, transparent, black 18%, black 82%, transparent)",
  },
  "fade-y": {
    maskImage: "linear-gradient(to bottom, transparent, black 9rem, black calc(100% - 9rem), transparent)",
    WebkitMaskImage:
      "linear-gradient(to bottom, transparent, black 9rem, black calc(100% - 9rem), transparent)",
  },
  none: {},
};

function getBgImage(variant: BGVariantType, fill: string, size: number) {
  switch (variant) {
    case "dots":
      return `radial-gradient(${fill} 1px, transparent 1px)`;
    case "grid":
      return `linear-gradient(to right, ${fill} 1px, transparent 1px), linear-gradient(to bottom, ${fill} 1px, transparent 1px)`;
    case "diagonal-stripes":
      return `repeating-linear-gradient(45deg, ${fill}, ${fill} 1px, transparent 1px, transparent ${size}px)`;
    case "horizontal-lines":
      return `linear-gradient(to bottom, ${fill} 1px, transparent 1px)`;
    case "vertical-lines":
      return `linear-gradient(to right, ${fill} 1px, transparent 1px)`;
    case "checkerboard":
      return `linear-gradient(45deg, ${fill} 25%, transparent 25%), linear-gradient(-45deg, ${fill} 25%, transparent 25%), linear-gradient(45deg, transparent 75%, ${fill} 75%), linear-gradient(-45deg, transparent 75%, ${fill} 75%)`;
    default:
      return undefined;
  }
}

const BGPattern = ({
  variant = "grid",
  mask = "none",
  size = 24,
  fill = "#252525",
  className,
  style,
  ...props
}: BGPatternProps) => {
  const bgSize = `${size}px ${size}px`;
  const backgroundImage = getBgImage(variant, fill, size);

  return (
    <div
      className={cn("bg-pattern", className)}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        backgroundImage,
        backgroundSize: bgSize,
        ...maskStyles[mask],
        ...style,
      }}
      {...props}
    />
  );
};

BGPattern.displayName = "BGPattern";
export { BGPattern };
