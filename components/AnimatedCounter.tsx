"use client";

import React, { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export interface AnimatedCounterProps {
  end: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  end,
  prefix = "",
  suffix = "",
  duration = 2.2,
  className = "",
}) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  const [displayValue, setDisplayValue] = useState(0);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const obj = { val: 0 };

      gsap.to(obj, {
        val: end,
        duration: duration,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
          once: true,
        },
        onUpdate: () => {
          setDisplayValue(Math.round(obj.val));
        },
      });
    },
    { dependencies: [end, duration], scope: containerRef }
  );

  return (
    <span ref={containerRef} className={className}>
      {prefix}
      {displayValue.toLocaleString("en-US")}
      {suffix}
    </span>
  );
};

export default AnimatedCounter;
