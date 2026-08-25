"use client";

import React from "react";
import Link from "next/link";
import { Phone, MapPin, Clock, Mail, Heart, ArrowUp } from "lucide-react";
import { RESTAURANT_INFO } from "@/lib/data.js";

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      className="text-white/90 pt-16 pb-8 border-t-4 border-brand-orange relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/footer-bg.png')",

      }}
    >
      {/* Decorative Brand Watermark */}
      <div className="absolute -right-16 -bottom-16 text-white/5 text-9xl font-aref font-bold select-none pointer-events-none">
        نيو بورسعيد
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12">
          {/* Column 1: Brand Info & Logo */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="شعار نيو بورسعيد"
                className="h-16 w-auto object-contain "
              />
              <div>

                <p className="text-xs text-brand-orange font-semibold tracking-wider">
                  {RESTAURANT_INFO.tagline}
                </p>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-white/70 max-w-sm">
              أكثر من ٥ سنوات من الشغف في تقديم أشهى المشويات على الفحم والطواجن المصرية والصواني العائلية الفاخرة. أكل بشوات على أصوله.
            </p>

            {/* Social Media Links */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-brand-orange hover:border-brand-orange text-white transition-all hover:scale-110"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-brand-orange hover:border-brand-orange text-white transition-all hover:scale-110"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 font-aref flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-orange"></span>
              أقسام القائمة
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/menu#grills" className="hover:text-brand-orange hover:mr-1 transition-all flex items-center gap-2">
                  <span>←</span> قسم المشويات عالفحم
                </Link>
              </li>
              <li>
                <Link href="/menu#trays" className="hover:text-brand-orange hover:mr-1 transition-all flex items-center gap-2">
                  <span>←</span> قسم الصواني والعزومات
                </Link>
              </li>
              <li>
                <Link href="/menu#tajines" className="hover:text-brand-orange hover:mr-1 transition-all flex items-center gap-2">
                  <span>←</span> قسم طواجن الفخار
                </Link>
              </li>
              <li>
                <Link href="/menu#oriental" className="hover:text-brand-orange hover:mr-1 transition-all flex items-center gap-2">
                  <span>←</span> المطبخ الشرقي والفتات
                </Link>
              </li>
              <li>
                <Link href="/menu#mandi" className="hover:text-brand-orange hover:mr-1 transition-all flex items-center gap-2">
                  <span>←</span> مندي بالبرميل
                </Link>
              </li>
              <li>
                <Link href="/#reserve" className="hover:text-brand-orange hover:mr-1 transition-all flex items-center gap-2">
                  <span>←</span> حجز طاولة خاصة
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Best Sellers */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 font-aref flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-orange"></span>
              أشهر الأصناف
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center justify-between border-b border-white/10 pb-2">
                <Link href="/menu#grills" className="hover:text-brand-orange transition">
                  ميكس بورسعيد
                </Link>
                <span className="text-brand-orange font-bold text-xs font-sans">450 ج.م</span>
              </li>
              <li className="flex items-center justify-between border-b border-white/10 pb-2">
                <Link href="/menu#grills" className="hover:text-brand-orange transition">
                  طبق الملوك
                </Link>
                <span className="text-brand-orange font-bold text-xs font-sans">470 ج.م</span>
              </li>
              <li className="flex items-center justify-between border-b border-white/10 pb-2">
                <Link href="/menu#trays" className="hover:text-brand-orange transition">
                  صينية العمدة
                </Link>
                <span className="text-brand-orange font-bold text-xs font-sans">880 ج.م</span>
              </li>
              <li className="flex items-center justify-between border-b border-white/10 pb-2">
                <Link href="/menu#tajines" className="hover:text-brand-orange transition">
                  طاجن بورسعيد (ضلوع + ورق عنب)
                </Link>
                <span className="text-brand-orange font-bold text-xs font-sans">460 ج.م</span>
              </li>
              <li className="flex items-center justify-between">
                <Link href="/menu#oriental" className="hover:text-brand-orange transition">
                  موزة ضاني فتة
                </Link>
                <span className="text-brand-orange font-bold text-xs font-sans">450 ج.م</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Working Hours */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 font-aref flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-orange"></span>
              خدمة العملاء والاتصال
            </h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                <span>{RESTAURANT_INFO.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-brand-orange shrink-0" />
                <div className="flex flex-col gap-0.5">
                  {RESTAURANT_INFO.phones.map((phone) => (
                    <a
                      key={phone}
                      href={`tel:${phone}`}
                      dir="ltr"
                      className="font-bold text-white tracking-wider hover:text-brand-orange font-sans transition"
                    >
                      {phone}
                    </a>
                  ))}
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">مواعيد العمل:</p>
                  <p className="text-xs text-white/70">يومياً من ١٢:٠٠ ظهراً حتى ٠٢:٠٠ صباحاً</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60">
          <p>© {new Date().getFullYear()} {RESTAURANT_INFO.name}. جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-1 text-white/70">
            <span>أكل بشوات</span>
            <Heart className="w-3.5 h-3.5 text-brand-orange fill-brand-orange inline mx-1" />
            <span>بكل فخر ومحبة</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
