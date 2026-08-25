"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Minus,
  ShoppingBag,
  Flame,
  Phone,
  MapPin,
  Sparkles,
  ArrowRight,
  Check,
  Share2,
} from "lucide-react";
import { MENU_DATA, RESTAURANT_INFO } from "@/lib/data.js";
import { getMenuCategoriesWithItems, getRestaurantSettings, DbCategory, DbRestaurantSettings } from "@/lib/dbService";
import { useCart } from "@/context/CartContext";

export default function MenuPage() {
  const [categories, setCategories] = useState<DbCategory[]>(MENU_DATA as unknown as DbCategory[]);
  const [settings, setSettings] = useState<DbRestaurantSettings>({
    name: RESTAURANT_INFO.name,
    name_en: RESTAURANT_INFO.nameEn,
    tagline: RESTAURANT_INFO.tagline,
    phones: RESTAURANT_INFO.phones,
    address: RESTAURANT_INFO.address,
    whatsapp: RESTAURANT_INFO.whatsapp,
    working_hours: "يومياً من ١٢:٠٠ ظهراً حتى ٠٢:٠٠ صباحاً",
    facebook_url: "https://facebook.com",
    instagram_url: "https://instagram.com",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const { items: cartItems, addToCart, updateQuantity, openCart, totalCount, totalPrice } = useCart();

  // Load Dynamic Data from Supabase
  useEffect(() => {
    async function loadData() {
      try {
        const [cats, setts] = await Promise.all([
          getMenuCategoriesWithItems(),
          getRestaurantSettings(),
        ]);
        if (cats && cats.length > 0) setCategories(cats);
        if (setts) setSettings(setts);
      } catch (err) {
        console.warn("Using local fallback in menu:", err);
      }
    }
    loadData();
  }, []);

  // Helper to get current quantity of item in cart
  const getItemQuantity = (itemId: string) => {
    const found = cartItems.find((i) => i.id === itemId);
    return found ? found.quantity : 0;
  };

  // Filter categories and items based on search and selected category tab
  const filteredData = useMemo(() => {
    let list = categories;

    if (activeCategory !== "all") {
      list = list.filter((cat) => cat.id === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return list
        .map((cat) => {
          const matchingItems = (cat.items || []).filter(
            (item) =>
              item.is_available !== false &&
              (item.name.toLowerCase().includes(q) ||
                (item.description && item.description.toLowerCase().includes(q)) ||
                (item.badge && item.badge.toLowerCase().includes(q)))
          );
          return {
            ...cat,
            items: matchingItems,
          };
        })
        .filter((cat) => (cat.items || []).length > 0);
    }

    return list.map((cat) => ({
      ...cat,
      items: (cat.items || []).filter((i) => i.is_available !== false),
    }));
  }, [categories, activeCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-brand-cream/60 pb-28 pt-10">
      {/* Top Banner Header with footer-bg.png */}
      <section
        className="relative bg-brand-dark text-white py-16 px-4 sm:px-6 lg:px-8 overflow-hidden shadow-xl border-b border-brand-orange/20 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: " url('/footer-bg.png')",
        }}
      >
        <div className="absolute right-0 top-0 w-96 h-96 bg-brand-orange/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute left-0 bottom-0 w-80 h-80 bg-brand-gold/15 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center space-y-4 relative z-10">


          <h1 className="text-4xl sm:text-6xl font-bold font-aref tracking-wide text-white drop-shadow-md mb-10">
            منيو{settings.name}
          </h1>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-orange/20 border border-brand-orange/40 text-amber-300 text-xs sm:text-sm font-bold backdrop-blur-sm">
            <span>{settings.tagline}</span>
          </div>
        </div>
      </section>

      {/* Sticky Search and Category Navigation */}
      <div className="sticky top-[68px] sm:top-[76px] z-40 bg-white/95 backdrop-blur-md shadow-md border-b border-brand-orange/15 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          {/* Search Input */}
          <div className="relative max-w-xl mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن طبق، مشويات، طاجن، أو صينية..."
              className="w-full bg-brand-cream/80 hover:bg-white focus:bg-white text-brand-text placeholder-brand-muted/70 pr-11 pl-10 py-2.5 sm:py-3 rounded-2xl border border-brand-orange/20 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 outline-none text-sm transition-all shadow-inner"
            />
            <Search className="w-5 h-5 text-brand-orange absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-gray-700 bg-gray-200 hover:bg-gray-300 w-5 h-5 rounded-full flex items-center justify-center transition"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Horizontal Scroll Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 hide-scrollbar">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all shadow-xs shrink-0 ${activeCategory === "all"
                ? "bg-brand-orange text-white shadow-md shadow-orange-500/30 scale-102"
                : "bg-brand-surface hover:bg-brand-orange/10 text-brand-brown border border-brand-orange/15"
                }`}
            >
              جميع الأقسام ({categories.reduce((acc, c) => acc + (c.items?.length || 0), 0)})
            </button>

            {categories.map((cat) => {
              const isSelected = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all shadow-xs shrink-0 ${isSelected
                    ? "bg-brand-orange text-white shadow-md shadow-orange-500/30 scale-102"
                    : "bg-brand-surface hover:bg-brand-orange/10 text-brand-brown border border-brand-orange/15"
                    }`}
                >
                  {cat.title} ({(cat.items || []).length})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Categories and Food Listing */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-14">
        {filteredData.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl p-8 border border-brand-orange/15 shadow-sm space-y-4">

            <h3 className="text-xl font-bold font-aref text-brand-brown">
              لم نجد نتائج مطابقة لـ "{searchQuery}"
            </h3>
            <p className="text-xs sm:text-sm text-brand-muted">
              جرب البحث بكلمات أخرى مثل "كباب"، "كفتة"، "طاجن"، "صينية"، أو "مكرونة".
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("all");
              }}
              className="bg-brand-orange text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow hover:bg-orange-600 transition"
            >
              عرض كل القائمة
            </button>
          </div>
        ) : (
          filteredData.map((category) => (
            <section
              key={category.id}
              id={category.id}
              className="bg-white rounded-3xl shadow-xl border border-brand-orange/15 overflow-hidden transition-all"
            >
              {/* Category Cover Picture Banner */}
              <div className="relative h-44 sm:h-56 lg:h-64 w-full overflow-hidden group">
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/60 to-black/30" />

                {/* Category Header Info */}
                <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end text-white">
                  <div className="flex flex-wrap items-end justify-between gap-4">
                    <div className="space-y-1.5">

                      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-aref tracking-wide text-white drop-shadow-md">
                        {category.title}
                      </h2>
                      {category.description && (
                        <p className="text-white/85 text-xs sm:text-sm max-w-xl line-clamp-2">
                          {category.description}
                        </p>
                      )}
                    </div>

                    <div className="bg-white/15 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 text-xs sm:text-sm font-bold text-amber-300 shrink-0">
                      {(category.items || []).length} صنف متاح
                    </div>
                  </div>
                </div>
              </div>

              {/* Food Items List */}
              <div className="p-4 sm:p-6 lg:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                  {(category.items || []).map((item) => {
                    const qty = getItemQuantity(item.id);
                    const isDailyPrice = typeof item.price === "string" || item.is_daily;

                    return (
                      <div
                        key={item.id}
                        className={`p-4 sm:p-5 rounded-2xl border transition-all flex items-center justify-between gap-4 group ${qty > 0
                          ? "bg-brand-orange/5 border-brand-orange shadow-md"
                          : "bg-brand-cream/40 hover:bg-brand-cream/80 border-brand-orange/15 hover:border-brand-orange/40 hover:shadow-sm"
                          }`}
                      >
                        {/* Food Info */}
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-bold text-base sm:text-lg text-brand-brown font-aref tracking-wide group-hover:text-brand-orange transition-colors">
                              {item.name}
                            </h4>
                            {item.badge && (
                              <span className="bg-brand-orange/15 text-brand-orange text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-brand-orange/25">
                                {item.badge}
                              </span>
                            )}
                          </div>

                          {item.description && (
                            <p className="text-xs text-brand-muted leading-relaxed line-clamp-2">
                              {item.description}
                            </p>
                          )}

                          {/* Price Tag */}
                          <div className="pt-1 flex items-baseline gap-1.5">
                            {isDailyPrice ? (
                              <span className="text-xs font-bold text-brand-orange bg-brand-orange/10 px-2 py-0.5 rounded-md">
                                حسب السعر اليومي
                              </span>
                            ) : (
                              <>
                                <span className="text-lg sm:text-xl font-extrabold text-brand-brown font-sans">
                                  {item.price}
                                </span>
                                <span className="text-xs font-bold text-brand-orange">ج.م</span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Quantity / Add Button */}
                        <div className="shrink-0 flex items-center gap-2">
                          {qty > 0 ? (
                            <div className="flex items-center gap-2 bg-white rounded-xl p-1 shadow-sm border border-brand-orange/30">
                              <button
                                onClick={() => updateQuantity(item.id, qty - 1)}
                                className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-red-50 text-brand-brown hover:text-red-600 flex items-center justify-center transition"
                                aria-label="تقليل الكمية"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="w-5 text-center font-bold text-sm text-brand-brown font-sans">
                                {qty}
                              </span>
                              <button
                                onClick={() =>
                                  addToCart(
                                    {
                                      id: item.id,
                                      name: item.name,
                                      price: typeof item.price === "number" ? item.price : 0,
                                      category: item.category_id,
                                      description: item.description,
                                      image: item.image,
                                      badge: item.badge,
                                    },
                                    1
                                  )
                                }
                                className="w-7 h-7 rounded-lg bg-brand-orange text-white hover:bg-orange-600 flex items-center justify-center transition shadow-xs"
                                aria-label="زيادة الكمية"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() =>
                                addToCart(
                                  {
                                    id: item.id,
                                    name: item.name,
                                    price: typeof item.price === "number" ? item.price : 0,
                                    category: item.category_id,
                                    description: item.description,
                                    image: item.image,
                                    badge: item.badge,
                                  },
                                  1
                                )
                              }
                              className="inline-flex items-center gap-1.5 bg-brand-orange hover:bg-orange-600 text-white px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all"
                            >
                              <Plus className="w-4 h-4" />
                              <span>أضف</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          ))
        )}
      </main>

      {/* Floating Bottom Cart Bar */}
      {totalCount > 0 && (
        <div className="fixed bottom-4 inset-x-4 max-w-xl mx-auto z-40 animate-in slide-in-from-bottom duration-300">
          <div className="bg-brand-dark text-white rounded-2xl p-3 sm:p-4 shadow-2xl border-2 border-brand-orange flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-brand-orange flex items-center justify-center text-white font-bold shadow-md">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-white/70">
                  {totalCount} {totalCount === 1 ? "صنف" : "أصناف"} في السلة
                </p>
                <p className="text-base sm:text-lg font-bold font-sans text-amber-300">
                  {totalPrice} ج.م
                </p>
              </div>
            </div>

            <button
              onClick={openCart}
              className="bg-gradient-to-r from-brand-orange to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-5 sm:px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-lg flex items-center gap-2 hover:scale-105 transition"
            >
              <span>إتمام الطلب عبر واتساب</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
