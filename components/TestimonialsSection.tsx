"use client";

import React, { useState } from "react";
import { Star, Sparkles, Play, Pause } from "lucide-react";
import SplitText from "@/components/SplitText";

export const TESTIMONIALS_IMAGES = [
  { id: 1, src: "/testimonials/1.jpg", alt: "ريفيو عميل عن طواجن نيو بورسعيد" },
  { id: 2, src: "/testimonials/2.jpg", alt: "ريفيو عميل عن مشويات نيو بورسعيد" },
  { id: 3, src: "/testimonials/3.jpg", alt: "ريفيو عميل عن صواني وعزومات نيو بورسعيد" },
  { id: 4, src: "/testimonials/4.jpg", alt: "ريفيو عميل عن خدمة وطعم نيو بورسعيد" },
  { id: 5, src: "/testimonials/5.jpg", alt: "ريفيو عميل عن جودة ولذاذة الأكل" },
  { id: 6, src: "/testimonials/6.jpg", alt: "ريفيو عميل عن كرم وضيافة نيو بورسعيد" },
];

export const TestimonialsSection: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Duplicated list for infinite seamless marquee loop
  const marqueeItems = [...TESTIMONIALS_IMAGES, ...TESTIMONIALS_IMAGES, ...TESTIMONIALS_IMAGES];

  return (
    <section id="reviews" className="py-14 bg-brand-cream/80 relative overflow-hidden ">
      {/* Background Decorative Glows */}
      <div className="absolute right-0 top-1/4 w-96 h-96 bg-brand-orange/5 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute left-0 bottom-1/4 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="space-y-3 text-right">
            <SplitText
              text="ريفيوهات بتحكي • كلام حبايبنا"
              tag="h2"
              className="text-3xl sm:text-5xl font-bold font-aref text-brand-brown block"
              splitType="words"
              delay={35}
              duration={1}
            />
            <p className="text-brand-muted text-sm sm:text-base max-w-xl">
              شهادات وتقييمات زبائننا الكرام وأهل سوهاج اللي بنتشرف بخدمتهم يومياً بأعلى معايير الكرم والجودة.
            </p>
          </div>


        </div>
      </div>

      {/* Infinite Seamless Marquee Track (Right-to-Left) */}
      <div className="relative w-full overflow-hidden py-4" dir="ltr">
        {/* Left & Right Fade Masks for Smooth Infinite Flow */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-brand-cream/90 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-brand-cream/90 to-transparent z-10 pointer-events-none" />

        <div
          className="animate-marquee-rtl flex gap-6"
          style={{
            animationPlayState: isPaused ? "paused" : "running",
            animationDuration: "35s",
          }}
        >
          {marqueeItems.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              onClick={() => setSelectedImage(item.src)}
              className="w-[280px] sm:w-[320px] lg:w-[350px] shrink-0 rounded-[2.5rem] bg-white p-3.5 shadow-xl hover:shadow-2xl border-2 border-brand-orange/20 hover:border-brand-orange/60 transition-all duration-500 group cursor-pointer overflow-hidden hover:-translate-y-2 select-none"
              dir="rtl"
            >
              {/* Testimonial Graphic Card */}
              <div className="relative aspect-square w-full rounded-[2rem] overflow-hidden bg-brand-cream/60">
                <img
                  src={item.src}
                  alt={item.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                />

                {/* Subtle Hover Overlay */}
                <div className="absolute inset-0 bg-brand-dark/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">

                </div>
              </div>


            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-xl w-full rounded-3xl overflow-hidden shadow-2xl border-2 border-white/20 animate-in zoom-in-95 duration-200">
            <img src={selectedImage} alt="ريفيو عميل" className="w-full h-auto object-contain" />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-black/70 hover:bg-brand-orange text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition shadow-lg"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default TestimonialsSection;
