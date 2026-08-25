"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Phone,
  ShoppingBag,
  Menu,
  X,
  CalendarCheck,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { RESTAURANT_INFO } from "@/lib/data.js";

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { totalCount, openCart } = useCart();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 25) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isTransparentAtTop = pathname === "/" && !isScrolled;

  const navLinks = [
    { name: "الرئيسية", href: "/" },
    { name: "قائمة الطعام", href: "/menu" },
    { name: "قصتنا", href: "/#story" },
    { name: "أطباقنا المميزة", href: "/#dishes" },
    { name: "فروعنا", href: "/#branches" },
    { name: "آراء العملاء", href: "/#reviews" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-[99] transition-all duration-300 ${
          isTransparentAtTop
            ? "bg-transparent py-4 text-white"
            : "bg-white shadow-md border-b border-brand-orange/15 py-2.5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src="/logo.png"
              alt="شعار نيو بورسعيد"
              className="h-12 sm:h-14 w-auto object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300"
            />
            <div className="flex flex-col">
              <span
                className={`text-2xl sm:text-3xl font-bold font-aref tracking-wide leading-none transition-colors ${
                  isTransparentAtTop
                    ? "text-white drop-shadow-md group-hover:text-amber-300"
                    : "text-brand-brown group-hover:text-brand-orange"
                }`}
              >
                نيو بورسعيد
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-base font-semibold transition-all relative py-1 hover:text-brand-orange ${
                    isActive
                      ? "text-brand-orange font-bold"
                      : isTransparentAtTop
                      ? "text-white hover:text-amber-300 drop-shadow-sm"
                      : "text-brand-text"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-orange rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Phone Hotline Callout */}
            <a
              href={`tel:${RESTAURANT_INFO.phones[0]}`}
              className={`hidden md:flex items-center gap-2 px-3.5 py-2 rounded-full font-bold text-sm transition-all border ${
                isTransparentAtTop
                  ? "bg-black/30 hover:bg-black/50 text-white border-white/30 backdrop-blur-md"
                  : "bg-brand-orange/10 hover:bg-brand-orange/20 text-brand-brown border-brand-orange/20"
              }`}
              title="اتصل بنا الآن"
            >
              <Phone className="w-4 h-4 text-brand-orange animate-bounce" />
              <span dir="ltr" className="font-sans">
                {RESTAURANT_INFO.phones[0]}
              </span>
            </a>

            {/* Cart Trigger */}
            <button
              onClick={openCart}
              className={`relative p-2.5 rounded-full shadow-sm transition-all group ${
                isTransparentAtTop
                  ? "bg-black/30 hover:bg-brand-orange text-white border border-white/30 backdrop-blur-md"
                  : "bg-white hover:bg-brand-orange hover:text-white text-brand-brown border border-brand-orange/20"
              }`}
              aria-label="سلة الطلبات"
            >
              <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-orange text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow animate-pulse">
                  {totalCount}
                </span>
              )}
            </button>

            {/* Reservation CTA Button */}
            <Link
              href="/#branches"
              className="hidden sm:inline-flex items-center gap-2 bg-gradient-to-r from-brand-orange to-orange-600 text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-lg shadow-orange-500/25 hover:opacity-95 transition-all hover:scale-[1.02]"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>موقعنا وفروعنا</span>
            </Link>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2.5 rounded-xl transition-colors ${
                isTransparentAtTop
                  ? "bg-black/30 text-white hover:bg-brand-orange border border-white/25"
                  : "bg-brand-orange/10 text-brand-brown hover:bg-brand-orange hover:text-white border border-brand-orange/20"
              }`}
              aria-label="القائمة"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden bg-black/60 backdrop-blur-sm transition-opacity">
          <div className="fixed top-0 right-0 bottom-0 w-4/5 max-w-sm bg-white shadow-2xl p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-brand-orange/20">
                <div className="flex items-center gap-2">
                  <img
                    src="/logo.png"
                    alt="شعار نيو بورسعيد"
                    className="h-10 w-auto object-contain"
                  />
                  <div>
                    <h3 className="font-bold font-aref text-xl text-brand-brown">نيو بورسعيد</h3>
                    <p className="text-xs text-brand-orange font-semibold">أكل بشوات</p>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-6 flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-lg font-bold text-brand-text hover:text-brand-orange hover:pr-2 transition-all py-2 border-b border-gray-100 flex items-center justify-between"
                  >
                    <span>{link.name}</span>
                    <span className="text-xs text-brand-orange">←</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-brand-orange/20">
              <a
                href={`tel:${RESTAURANT_INFO.phones[0]}`}
                className="flex items-center justify-center gap-3 bg-brand-orange/10 text-brand-brown py-3 rounded-xl font-bold text-sm border border-brand-orange/30"
              >
                <Phone className="w-4 h-4 text-brand-orange" />
                <span dir="ltr" className="font-sans">
                  {RESTAURANT_INFO.phones[0]}
                </span>
              </a>

              <Link
                href="/menu"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full bg-gradient-to-r from-brand-orange to-orange-600 text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>قائمة الطعام الكاملة</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
