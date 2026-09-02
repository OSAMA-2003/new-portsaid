"use client";

import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";

const VIEW_W = 1200;
const VIEW_H = 340;
const CX = VIEW_W / 2;
const CY = VIEW_H / 2;
const EDGE_PAD = 6;

// Universal cross-platform Arabic font stack (iOS / Android / macOS / Windows)
const UNIVERSAL_FONT_STACK =
  "var(--font-changa), 'Changa', -apple-system, BlinkMacSystemFont, 'Geeza Pro', 'Noto Sans Arabic', 'Noto Kufi Arabic', 'Cairo', 'Segoe UI', Tahoma, Arial, sans-serif";

const buildPath = (shape: string, curviness: number, ribbonWidth: number) => {
  const c = Math.max(0, curviness);
  const room = Math.max(20, CY - Math.max(0, ribbonWidth) / 2 - EDGE_PAD);

  switch (shape) {
    case "circle": {
      const r = Math.min(90 + c * 0.95, room);
      return `M ${CX - r} ${CY} A ${r} ${r} 0 1 1 ${CX + r} ${CY} A ${r} ${r} 0 1 1 ${CX - r} ${CY} Z`;
    }
    case "infinity": {
      const r = 150 + c * 1.4;
      const h = Math.min(60 + c * 0.95, room);
      return [
        `M ${CX} ${CY}`,
        `C ${CX + r * 0.55} ${CY - h} ${CX + r} ${CY - h} ${CX + r} ${CY}`,
        `C ${CX + r} ${CY + h} ${CX + r * 0.55} ${CY + h} ${CX} ${CY}`,
        `C ${CX - r * 0.55} ${CY - h} ${CX - r} ${CY - h} ${CX - r} ${CY}`,
        `C ${CX - r} ${CY + h} ${CX - r * 0.55} ${CY + h} ${CX} ${CY}`,
        "Z",
      ].join(" ");
    }
    case "arch": {
      const rise = Math.min(120 + c * 1.1, room * 2);
      return `M 120 ${CY + rise / 2} Q ${CX} ${CY - rise * 1.5} ${VIEW_W - 120} ${CY + rise / 2}`;
    }
    case "line":
      return `M -500 ${CY} L ${VIEW_W + 500} ${CY}`;
    case "wave":
    default: {
      const a = Math.min(c * 1.35, room);
      return `M -400 ${CY} Q -200 ${CY - a} 0 ${CY} T 400 ${CY} T 800 ${CY} T 1200 ${CY} T 1600 ${CY} T ${VIEW_W + 400} ${CY}`;
    }
  }
};

export interface TextLoopProps {
  text?: string;
  shape?: "wave" | "circle" | "infinity" | "arch" | "line";
  path?: string;
  speed?: number;
  direction?: "forward" | "reverse";
  separator?: string;
  curviness?: number;
  fontSize?: number;
  fontWeight?: number | string;
  letterSpacing?: number;
  uppercase?: boolean;
  color?: string;
  ribbon?: boolean;
  ribbonColor?: string;
  ribbonWidth?: number;
  pauseOnHover?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const TextLoop: React.FC<TextLoopProps> = ({
  text = "طعم على أصوله ✦ من قلب سوهاج ✦ معمول بحب ✦ أكل يفرّح ✦ طعم يستاهل الرجوع",
  shape = "wave",
  path,
  speed = 80,
  direction = "forward",
  separator = "✦",
  curviness = 75,
  fontSize = 36,
  fontWeight = 700,
  letterSpacing = 0,
  uppercase = false,
  color = "#ffffff",
  ribbon = true,
  ribbonColor = "#F26D21",
  ribbonWidth = 76,
  pauseOnHover = false,
  className = "",
  style = {},
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const measureRef = useRef<SVGTextElement>(null);
  const textPathRef = useRef<SVGTextPathElement>(null);

  const [metrics, setMetrics] = useState({ pathLength: 2400, unitWidth: 750, reps: 5 });
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  const rawId = useId();
  const pathId = `text-loop-${rawId.replace(/:/g, "")}`;

  const d = useMemo(
    () => path || buildPath(shape, curviness, ribbonWidth),
    [path, shape, curviness, ribbonWidth]
  );

  const unit = useMemo(() => {
    const base = uppercase ? String(text).toUpperCase() : String(text);
    const gap = separator ? `\u00A0\u00A0${separator}\u00A0\u00A0` : "\u00A0\u00A0\u00A0";
    return `${base}${gap}`;
  }, [text, separator, uppercase]);

  const textStyle = useMemo(
    () => ({
      fontSize: `${fontSize}px`,
      fontWeight,
      letterSpacing: letterSpacing ? `${letterSpacing}px` : "normal",
      fontFamily: UNIVERSAL_FONT_STACK,
      WebkitFontSmoothing: "antialiased" as const,
      MozOsxFontSmoothing: "grayscale" as const,
    }),
    [fontSize, fontWeight, letterSpacing]
  );

  // Exact measurement of unit width and path length
  useEffect(() => {
    const measure = () => {
      const pathEl = pathRef.current;
      const measureEl = measureRef.current;
      if (!pathEl || !measureEl) return;

      let pLength = 0;
      let uWidth = 0;
      try {
        pLength = pathEl.getTotalLength();
        uWidth = measureEl.getComputedTextLength();
      } catch (err) {
        pLength = 2400;
        uWidth = 750;
      }

      if (!pLength || pLength < 100) pLength = 2400;
      if (!uWidth || uWidth < 50) uWidth = 750;

      // Ensure enough repetitions to cover full path and smooth 1-unit looping
      const reps = Math.max(4, Math.ceil(pLength / uWidth) + 4);
      setMetrics((prev) => {
        if (
          Math.abs(prev.pathLength - pLength) < 2 &&
          Math.abs(prev.unitWidth - uWidth) < 2 &&
          prev.reps === reps
        ) {
          return prev;
        }
        return { pathLength: pLength, unitWidth: uWidth, reps };
      });
    };

    measure();

    const t1 = setTimeout(measure, 60);
    const t2 = setTimeout(measure, 300);

    if (typeof document !== "undefined" && (document as any).fonts?.ready) {
      (document as any).fonts.ready.then(measure).catch(() => { });
    }

    window.addEventListener("resize", measure);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener("resize", measure);
    };
  }, [d, unit, textStyle]);

  // GSAP 1-unit loop animation
  useEffect(() => {
    const textPathEl = textPathRef.current;
    if (!textPathEl || metrics.unitWidth <= 0) return;

    tweenRef.current?.kill();

    const forward = direction === "forward";
    const duration = Math.max(1, metrics.unitWidth / Math.max(1, speed));
    const baseOffset = forward ? -metrics.unitWidth : 0;
    const distance = forward ? metrics.unitWidth : -metrics.unitWidth;

    textPathEl.setAttribute("startOffset", `${baseOffset}px`);

    const state = { offset: 0 };
    tweenRef.current = gsap.to(state, {
      offset: distance,
      duration: duration,
      ease: "none",
      repeat: -1,
      onUpdate: () => {
        textPathEl.setAttribute("startOffset", `${baseOffset + state.offset}px`);
      },
    });

    const root = rootRef.current;
    const pause = () => tweenRef.current?.pause();
    const resume = () => tweenRef.current?.resume();

    if (pauseOnHover && root) {
      root.addEventListener("mouseenter", pause);
      root.addEventListener("mouseleave", resume);
    }

    return () => {
      tweenRef.current?.kill();
      if (pauseOnHover && root) {
        root.removeEventListener("mouseenter", pause);
        root.removeEventListener("mouseleave", resume);
      }
    };
  }, [metrics, speed, direction, pauseOnHover]);

  const loopText = unit.repeat(metrics.reps);

  return (
    <div
      ref={rootRef}
      className={`relative w-full overflow-hidden select-none ${className}`.trim()}
      style={style}
      dir="ltr"
    >
      <svg
        className="block w-full h-auto"
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={text}
      >
        {/* Ribbon Background Path */}
        <path
          ref={pathRef}
          id={pathId}
          d={d}
          fill="none"
          stroke={ribbon ? ribbonColor : "none"}
          strokeWidth={ribbon ? ribbonWidth : 0}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Hidden measurement text element */}
        <text
          ref={measureRef}
          className="invisible pointer-events-none opacity-0 font-bold"
          style={textStyle}
          fontFamily={UNIVERSAL_FONT_STACK}
          fontSize={fontSize}
          fontWeight={fontWeight}
          xmlSpace="preserve"
          aria-hidden="true"
        >
          {unit}
        </text>

        {/* Seamless Continuous Text Path */}
        <text
          className="select-none pointer-events-none font-bold"
          style={textStyle}
          fontFamily={UNIVERSAL_FONT_STACK}
          fontSize={fontSize}
          fontWeight={fontWeight}
          fill={color}
          textRendering="geometricPrecision"
          dominantBaseline="central"
          xmlSpace="preserve"
          aria-hidden="true"
        >
          <textPath ref={textPathRef} href={`#${pathId}`} xlinkHref={`#${pathId}`}>
            {loopText}
          </textPath>
        </text>
      </svg>
    </div>
  );
};

export default TextLoop;
