"use client";

import React, { useEffect, useState } from "react";

export const Preloader: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    // Increment progress smoothly
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          return prev;
        }
        const step = Math.floor(Math.random() * 12) + 5;
        return Math.min(prev + step, 90);
      });
    }, 120);

    const handleComplete = () => {
      setProgress(100);
      setTimeout(() => {
        setFadingOut(true);
        setTimeout(() => {
          setLoading(false);
        }, 600);
      }, 300);
    };

    // Check if document and fonts/media are loaded
    if (document.readyState === "complete") {
      setTimeout(handleComplete, 800);
    } else {
      window.addEventListener("load", handleComplete);
    }

    // Safety fallback timeout (max 3.2s)
    const timeout = setTimeout(handleComplete, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
      window.removeEventListener("load", handleComplete);
    };
  }, []);

  if (!loading) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-[#2A0E12] flex flex-col items-center justify-center transition-all duration-700 select-none ${fadingOut ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"
        }`}
      dir="rtl"
    >
      {/* Ambient Background Glows */}
      <div className="absolute w-96 h-96 bg-brand-orange/20 rounded-full blur-[100px] pointer-events-none animate-pulse" />
      <div className="absolute w-72 h-72 bg-brand-gold/15 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center space-y-6 px-4">
        {/* Animated Glowing Logo Container */}
        <div className="relative flex items-center justify-center">
          {/* Outer Rotating Ring */}
          <div className="absolute w-36 h-36 sm:w-44 sm:h-44 rounded-full border-2 border-dashed border-brand-orange/40 animate-spin" style={{ animationDuration: "14s" }} />

          {/* Inner Glowing Aura */}
          <div className="absolute w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-tr from-brand-orange/30 to-brand-gold/30 blur-md animate-pulse" />

          {/* Restaurant Logo */}
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-white/5 border border-white/15 backdrop-blur-md p-3.5 shadow-2xl flex items-center justify-center">
            <img
              src="/logo.png"
              alt="شعار مطعم نيو بورسعيد"
              className="w-full h-full object-contain drop-shadow-lg"
            />
          </div>
        </div>

        {/* Brand Name & Tagline */}
        <div className="space-y-1.5">
          <h1 className="text-3xl sm:text-4xl font-bold font-aref tracking-wide text-white drop-shadow-md">
            مطعم نيو بورسعيد
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-brand-orange tracking-wider">
            أكل بشوات •    ...
          </p>
        </div>

        {/* Sleek Progress Bar */}
        <div className="w-52 sm:w-64 space-y-2 pt-2">
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-brand-orange via-orange-400 to-amber-300 rounded-full transition-all duration-300 shadow-sm shadow-orange-500/50"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[11px] font-bold text-white/50 px-1 font-sans">

            <span>{progress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preloader;
