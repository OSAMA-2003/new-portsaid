"use client";

import React, { useState, useEffect } from "react";
import { X, ChevronRight, ChevronLeft } from "lucide-react";
import SplitText from "./SplitText";

export const GALLERY_ROW_1 = [
  "/gallery/1.jpg",
  "/gallery/2.jpg",
  "/gallery/3.jpg",

  "/gallery/4.jpg",
  "/gallery/5.jpg",
  "/gallery/6.jpg",

  "/gallery/7.jpg",


];

export const GALLERY_ROW_2 = [
  "/gallery/7.jpg",
  "/gallery/6.jpg",
  "/gallery/5.jpg",
  "/gallery/4.jpg",
  "/gallery/3.jpg",
  "/gallery/2.jpg",
  "/gallery/1.jpg",

];

export const GallerySection: React.FC = () => {
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  const allPhotos = [...GALLERY_ROW_1, ...GALLERY_ROW_2];

  // Infinite marquee streams (repeated for seamless infinite loops)
  const row1Stream = [...GALLERY_ROW_1, ...GALLERY_ROW_1, ...GALLERY_ROW_1, ...GALLERY_ROW_1];
  const row2Stream = [...GALLERY_ROW_2, ...GALLERY_ROW_2, ...GALLERY_ROW_2, ...GALLERY_ROW_2];

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activePhotoIndex === null) return;
      if (e.key === "Escape") setActivePhotoIndex(null);
      if (e.key === "ArrowRight") {
        setActivePhotoIndex((prev) => (prev === null || prev === 0 ? allPhotos.length - 1 : prev - 1));
      }
      if (e.key === "ArrowLeft") {
        setActivePhotoIndex((prev) => (prev === null || prev === allPhotos.length - 1 ? 0 : prev + 1));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activePhotoIndex, allPhotos.length]);

  return (
    <section id="gallery" className="py-20 bg-brand-cream/80 relative overflow-hidden">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
        <span className="text-brand-orange font-aref text-2xl sm:text-3xl font-bold block mb-2">
          لحظاتنا وأجواؤنا
        </span>
        <SplitText
          text="أجواء لا تُنسى في ضيافة نيو بورسعيد"
          tag="h2"
          className="font-aref text-3xl sm:text-5xl font-bold text-brand-brown block"
          textAlign="center"
          splitType="words"
          delay={35}
          duration={1}
        />
      </div>

      {/* Dual Pure Continuous Image Marquee Showcase */}
      <div className="space-y-4 sm:space-y-6 select-none">
        {/* Row 1: Right-to-Left */}
        <div className="relative w-full overflow-hidden py-1" dir="ltr">
          {/* Left & Right Edge Fade Gradients */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-36 bg-gradient-to-r from-brand-cream to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-36 bg-gradient-to-l from-brand-cream to-transparent z-10 pointer-events-none" />

          <div
            className="animate-marquee-rtl flex gap-4 sm:gap-6"
            style={{ animationDuration: "35s" }}
          >
            {row1Stream.map((src, idx) => (
              <div
                key={`r1-${src}-${idx}`}
                onClick={() => {
                  const originalIndex = allPhotos.indexOf(src);
                  setActivePhotoIndex(originalIndex !== -1 ? originalIndex : 0);
                }}
                className="w-56 h-56 sm:w-72 sm:h-72 lg:w-80 lg:h-80 shrink-0 rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group cursor-pointer hover:scale-103"
              >
                <img
                  src={src}
                  alt="لحظات مطعم نيو بورسعيد"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 pointer-events-none"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Row 2: Left-to-Right */}
        <div className="relative w-full overflow-hidden py-1" dir="ltr">
          {/* Left & Right Edge Fade Gradients */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-36 bg-gradient-to-r from-brand-cream to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-36 bg-gradient-to-l from-brand-cream to-transparent z-10 pointer-events-none" />

          <div
            className="animate-marquee-ltr flex gap-4 sm:gap-6"
            style={{ animationDuration: "38s" }}
          >
            {row2Stream.map((src, idx) => (
              <div
                key={`r2-${src}-${idx}`}
                onClick={() => {
                  const originalIndex = allPhotos.indexOf(src);
                  setActivePhotoIndex(originalIndex !== -1 ? originalIndex : 0);
                }}
                className="w-56 h-56 sm:w-72 sm:h-72 lg:w-80 lg:h-80 shrink-0 rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group cursor-pointer hover:scale-103"
              >
                <img
                  loading="lazy"
                  src={src}
                  alt="لحظات مطعم نيو بورسعيد"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 pointer-events-none"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {activePhotoIndex !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 select-none animate-in fade-in duration-200"
          onClick={() => setActivePhotoIndex(null)}
          dir="rtl"
        >
          <div
            className="relative max-w-4xl w-full bg-black/95 rounded-3xl overflow-hidden shadow-2xl border border-white/20 animate-in zoom-in-95 duration-200 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActivePhotoIndex(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-brand-orange text-white flex items-center justify-center transition shadow-md"
              aria-label="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>

            {/* High-Resolution Picture View */}
            <div className="relative flex items-center justify-center max-h-[80vh] overflow-hidden p-2">
              <img
                src={allPhotos[activePhotoIndex]}
                alt="معرض صور نيو بورسعيد"
                className="w-full max-h-[78vh] object-contain rounded-2xl"
              />

              {/* Prev / Next Navigation Arrows */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActivePhotoIndex((prev) =>
                    prev === null || prev === 0 ? allPhotos.length - 1 : prev - 1
                  );
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-brand-orange text-white border border-white/20 flex items-center justify-center transition shadow-xl"
                aria-label="الصورة السابقة"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActivePhotoIndex((prev) =>
                    prev === null || prev === allPhotos.length - 1 ? 0 : prev + 1
                  );
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-brand-orange text-white border border-white/20 flex items-center justify-center transition shadow-xl"
                aria-label="الصورة التالية"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default GallerySection;
