"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Info,
  X,
  Utensils,
  Layers,
  Sparkles,
} from "lucide-react";
import { MENU_DATA, RESTAURANT_INFO } from "@/lib/data.js";
import { getMenuCategoriesWithItems, getRestaurantSettings, DbCategory, DbRestaurantSettings, DbMenuItem } from "@/lib/dbService";
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

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedDishForDetails, setSelectedDishForDetails] = useState<{
    item: DbMenuItem;
    categoryTitle?: string;
  } | null>(null);

  const { items: cartItems, addToCart, updateQuantity, totalCount, totalPrice } = useCart();

  // Load dynamic menu & settings from Supabase / localStorage
  useEffect(() => {
    async function fetchData() {
      try {
        const [dbCats, dbSetts] = await Promise.all([
          getMenuCategoriesWithItems(),
          getRestaurantSettings(),
        ]);
        if (dbCats && dbCats.length > 0) setCategories(dbCats);
        if (dbSetts) setSettings(dbSetts);
      } catch (err) {
        console.error("Error loading menu data:", err);
      }
    }
    fetchData();
  }, []);

  // Keyboard navigation for Details Modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedDishForDetails && e.key === "Escape") {
        setSelectedDishForDetails(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedDishForDetails]);

  // Filter Categories and Items based on Search Query and Active Tab
  const filteredCategories = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return categories
      .filter((cat) => {
        if (activeCategory === "all") return true;
        return cat.id === activeCategory;
      })
      .map((cat) => {
        const items = (cat.items || []).filter((item) => {
          if (!query) return true;
          const matchName = item.name.toLowerCase().includes(query);
          const matchDesc = item.description && item.description.toLowerCase().includes(query);
          return matchName || matchDesc;
        });

        return {
          ...cat,
          filteredItems: items,
        };
      })
      .filter((cat) => cat.filteredItems.length > 0);
  }, [categories, activeCategory, searchQuery]);

  const getItemQty = (itemId: string) => {
    const found = cartItems.find((i) => i.id === itemId);
    return found ? found.quantity : 0;
  };

  return (
    <div className="min-h-screen bg-brand-cream/60" dir="rtl">
      {/* 1. HERO HEADER SECTION */}
      <section
        className="relative pt-28 sm:pt-36 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 text-white overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/footer-bg.png')",
        }}
      >
        {/* Background Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/80 to-brand-dark/95" />

        {/* Ambient Decorative Accents */}
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-brand-orange/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-brand-gold/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-4">
          <span className="inline-block bg-brand-orange text-white text-xs sm:text-sm font-bold px-4 py-1.5 rounded-full shadow-lg border border-white/20">
            {settings.tagline || "أصل المشويات والطواجن في سوهاج"}
          </span>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-aref text-white tracking-wide drop-shadow-md">
            قائمة مأكولات {settings.name}
          </h1>

          <p className="text-xs sm:text-base text-brand-cream/90 max-w-xl mx-auto font-medium">
            تصفح أكثر من ١٥٠ صنفاً من أشهى المشويات، الطواجن الفخارية، الصواني الملكية، والمأكولات البحرية والشرقية.
          </p>

          {/* Quick Search Bar */}
          <div className="pt-4 sm:pt-6 max-w-xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن طبقك المفضل (كباب، طاجن، فراخ، سي فود...)"
                className="w-full bg-white/95 text-brand-brown pr-12 pl-4 py-3.5 sm:py-4 rounded-2xl shadow-xl text-xs sm:text-base focus:outline-none focus:ring-2 focus:ring-brand-orange placeholder:text-brand-muted/70 font-medium"
              />
              <Search className="w-5 h-5 text-brand-orange absolute top-3.5 sm:top-4.5 right-4 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute left-4 top-3.5 sm:top-4 text-xs bg-gray-200 text-gray-700 px-2.5 py-1 rounded-full hover:bg-gray-300 transition"
                >
                  مسح
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORY FILTER TABS WITH IMAGES */}
      <div className="sticky top-20 z-30 bg-white/95 backdrop-blur-md border-y border-brand-orange/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
            {/* All Categories Tab */}
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-4 py-2 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all flex items-center gap-2 shrink-0 border ${
                activeCategory === "all"
                  ? "bg-brand-orange text-white border-brand-orange shadow-md shadow-orange-500/25"
                  : "bg-brand-cream/60 text-brand-brown border-brand-orange/15 hover:bg-brand-orange/10"
              }`}
            >
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                <Layers className="w-3.5 h-3.5" />
              </div>
              <span>جميع الأصناف</span>
              <span className="text-[11px] opacity-80">
                ({categories.reduce((a, c) => a + (c.items?.length || 0), 0)})
              </span>
            </button>

            {/* Individual Category Tabs with Real Images */}
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-3.5 py-2 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all flex items-center gap-2 shrink-0 border ${
                  activeCategory === category.id
                    ? "bg-brand-orange text-white border-brand-orange shadow-md shadow-orange-500/25"
                    : "bg-brand-cream/60 text-brand-brown border-brand-orange/15 hover:bg-brand-orange/10"
                }`}
              >
                <img
                  src={category.image || "/footer-bg.png"}
                  alt={category.title}
                  className="w-6 h-6 rounded-full object-cover shrink-0 border border-white/40 shadow-xs"
                />
                <span>{category.title}</span>
                <span className="text-[11px] opacity-80">({(category.items || []).length})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. MENU ITEMS & CATEGORY SECTIONS WITH BANNERS */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 sm:space-y-16">
        {filteredCategories.length === 0 ? (
          /* Empty Search State */
          <div className="text-center py-16 sm:py-20 bg-white rounded-3xl p-8 border border-brand-orange/20 shadow-sm max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 bg-brand-orange/10 text-brand-orange rounded-full flex items-center justify-center mx-auto">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold font-aref text-brand-brown">لم نجد أي طبق بهذا الاسم</h3>
            <p className="text-xs text-brand-muted">جرب البحث بكلمة أخرى أو تصفح الأقسام الرئيسية في الأعلى</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("all");
              }}
              className="bg-brand-orange text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md hover:bg-orange-600 transition"
            >
              عرض جميع الأصناف
            </button>
          </div>
        ) : (
          filteredCategories.map((category) => (
            <section key={category.id} id={category.id} className="scroll-mt-36">
              <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-brand-orange/15 space-y-6">
                {/* Category Hero Banner with Real Photo */}
                <div className="relative h-36 sm:h-48 w-full overflow-hidden bg-brand-dark flex items-end">
                  <img
                    src={category.image || "/footer-bg.png"}
                    alt={category.title}
                    className="w-full h-full object-cover opacity-60 scale-105 transition-transform duration-700 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                  {/* Category Title & Info Overlay */}
                  <div className="absolute inset-0 p-5 sm:p-8 flex flex-col justify-end text-white z-10">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h2 className="text-2xl sm:text-4xl font-bold font-aref text-white drop-shadow-md">
                            {category.title}
                          </h2>
                        </div>

                        {category.description && (
                          <p className="text-xs sm:text-sm text-white/80 max-w-2xl line-clamp-1 sm:line-clamp-2">
                            {category.description}
                          </p>
                        )}
                      </div>

                      <span className="bg-brand-orange text-white text-xs font-bold px-3.5 py-1 rounded-full self-start sm:self-auto shadow-md shrink-0">
                        {category.filteredItems.length} أصناف
                      </span>
                    </div>
                  </div>
                </div>

                {/* Items Grid */}
                <div className="p-4 sm:p-6 lg:p-8 pt-0 grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {category.filteredItems.map((item) => {
                    const qty = getItemQty(item.id);
                    const isDailyPrice = item.is_daily || item.price === "يومي";

                    return (
                      <div
                        key={item.id}
                        className={`p-3.5 sm:p-5 rounded-2xl border transition-all flex items-center justify-between gap-3 group ${
                          qty > 0
                            ? "bg-brand-orange/5 border-brand-orange shadow-md"
                            : "bg-brand-cream/40 hover:bg-brand-cream/80 border-brand-orange/15 hover:border-brand-orange/40 hover:shadow-sm"
                        }`}
                      >
                        {/* Food Info */}
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                            <h4
                              onClick={() =>
                                setSelectedDishForDetails({
                                  item,
                                  categoryTitle: category.title,
                                })
                              }
                              className="font-bold text-sm sm:text-base text-brand-brown font-aref tracking-wide group-hover:text-brand-orange transition-colors cursor-pointer leading-snug"
                            >
                              {item.name}
                            </h4>
                            {item.badge && (
                              <span className="bg-brand-orange/15 text-brand-orange text-[10px] font-bold px-2 py-0.5 rounded-full border border-brand-orange/25">
                                {item.badge}
                              </span>
                            )}
                          </div>

                          {item.description && (
                            <p className="text-[11px] sm:text-xs text-brand-muted leading-relaxed line-clamp-2">
                              {item.description}
                            </p>
                          )}

                          {/* Quick Details & Price Bar */}
                          <div className="pt-1 flex items-center justify-between gap-2">
                            <div className="flex items-baseline gap-1">
                              {isDailyPrice ? (
                                <span className="text-[11px] font-bold text-brand-orange bg-brand-orange/10 px-2 py-0.5 rounded-md">
                                  سعر يومي
                                </span>
                              ) : (
                                <>
                                  <span className="text-base sm:text-xl font-extrabold text-brand-brown font-sans">
                                    {item.price}
                                  </span>
                                  <span className="text-xs font-bold text-brand-orange">ج.م</span>
                                </>
                              )}
                            </div>

                            <button
                              onClick={() =>
                                setSelectedDishForDetails({
                                  item,
                                  categoryTitle: category.title,
                                })
                              }
                              className="text-[11px] font-bold text-brand-orange hover:text-orange-700 flex items-center gap-1 transition p-1"
                            >
                              <Info className="w-3 h-3" />
                              <span>تفاصيل</span>
                            </button>
                          </div>
                        </div>

                        {/* Quantity / Add Button */}
                        <div className="shrink-0 flex items-center gap-1.5">
                          {qty > 0 ? (
                            <div className="flex items-center gap-1.5 bg-white rounded-xl p-1 shadow-sm border border-brand-orange/30">
                              <button
                                onClick={() => updateQuantity(item.id, qty - 1)}
                                className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-gray-100 hover:bg-red-50 text-brand-brown hover:text-red-600 flex items-center justify-center transition"
                                aria-label="تقليل الكمية"
                              >
                                <Minus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                              </button>
                              <span className="w-4 sm:w-5 text-center font-bold text-xs sm:text-sm text-brand-brown font-sans">
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
                                className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-brand-orange text-white hover:bg-orange-600 flex items-center justify-center transition shadow-xs"
                                aria-label="زيادة الكمية"
                              >
                                <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
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
                              className="inline-flex items-center gap-1 bg-brand-orange hover:bg-orange-600 text-white px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all"
                            >
                              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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

      {/* 4. FLOATING BOTTOM CART BAR */}
      {totalCount > 0 && (
        <div className="fixed bottom-4 inset-x-3 sm:inset-x-4 max-w-xl mx-auto z-40 animate-in slide-in-from-bottom duration-300">
          <div className="bg-brand-dark text-white rounded-2xl p-3 sm:p-4 shadow-2xl border-2 border-brand-orange flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-brand-orange flex items-center justify-center text-white font-bold shadow-md shrink-0">
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <p className="text-[11px] sm:text-xs text-white/70">
                  {totalCount} {totalCount === 1 ? "صنف" : "أصناف"} في السلة
                </p>
                <p className="text-sm sm:text-lg font-bold font-sans text-amber-300">
                  {totalPrice} ج.م
                </p>
              </div>
            </div>

            <Link
              href="/cart"
              className="bg-gradient-to-r from-brand-orange to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-lg flex items-center gap-1.5 sm:gap-2 hover:scale-105 transition"
            >
              <span>عرض السلة</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* 5. FOOD DETAILS MODAL */}
      {selectedDishForDetails && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 select-none animate-in fade-in duration-200"
          onClick={() => setSelectedDishForDetails(null)}
          dir="rtl"
        >
          <div
            className="bg-white rounded-3xl sm:rounded-[2.5rem] overflow-hidden max-w-lg w-full shadow-2xl border-2 border-brand-orange/30 animate-in zoom-in-95 duration-200 flex flex-col text-right relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Image */}
            <div className="relative h-48 sm:h-64 w-full bg-brand-cream overflow-hidden">
              <img
                src={selectedDishForDetails.item.image || "/footer-bg.png"}
                alt={selectedDishForDetails.item.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={() => setSelectedDishForDetails(null)}
                className="absolute top-3 left-3 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-brand-orange text-white flex items-center justify-center transition shadow-md"
                aria-label="إغلاق"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Category & Badge */}
              <div className="absolute bottom-3 inset-x-4 sm:inset-x-6 flex items-center justify-between text-white">
                <span className="bg-brand-orange text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                  {selectedDishForDetails.categoryTitle || "أصناف نيو بورسعيد"}
                </span>
                {selectedDishForDetails.item.badge && (
                  <span className="bg-black/60 backdrop-blur-md border border-white/20 text-amber-300 text-xs font-bold px-3 py-1 rounded-full">
                    {selectedDishForDetails.item.badge}
                  </span>
                )}
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-8 space-y-5 sm:space-y-6">
              <div className="space-y-1">
                <h3 className="font-aref font-bold text-2xl sm:text-3xl text-brand-brown">
                  {selectedDishForDetails.item.name}
                </h3>
              </div>

              {/* Full Description & Ingredients */}
              <div className="space-y-1.5 sm:space-y-2 bg-brand-cream/50 p-3.5 sm:p-4 rounded-2xl border border-brand-orange/15">
                <h4 className="text-xs font-bold text-brand-muted flex items-center gap-1.5">
                  <Utensils className="w-3.5 h-3.5 text-brand-orange" />
                  <span>المكونات والتحضير:</span>
                </h4>
                <p className="text-brand-brown text-xs sm:text-base leading-relaxed">
                  {selectedDishForDetails.item.description ||
                    "طبق طازج ولذيذ يُحضر يومياً بأعلى معايير الجودة والنظافة في مطبخ نيو بورسعيد."}
                </p>
              </div>

              {/* Price & Action Bottom Bar */}
              <div className="pt-3 sm:pt-4 border-t border-gray-100 flex items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] sm:text-xs text-brand-muted block font-semibold">السعر</span>
                  <div className="flex items-baseline gap-1">
                    {selectedDishForDetails.item.is_daily ||
                    selectedDishForDetails.item.price === "يومي" ? (
                      <span className="text-base sm:text-lg font-bold text-brand-orange">سعر يومي</span>
                    ) : (
                      <>
                        <span className="text-2xl sm:text-3xl font-extrabold text-brand-brown font-sans">
                          {selectedDishForDetails.item.price}
                        </span>
                        <span className="text-xs font-bold text-brand-orange">ج.م</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex-1 max-w-[180px] sm:max-w-[200px]">
                  {getItemQty(selectedDishForDetails.item.id) > 0 ? (
                    <div className="flex items-center justify-between bg-brand-cream px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-2xl border-2 border-brand-orange/40 shadow-sm">
                      <button
                        onClick={() =>
                          updateQuantity(
                            selectedDishForDetails.item.id,
                            getItemQty(selectedDishForDetails.item.id) - 1
                          )
                        }
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white text-brand-brown hover:text-red-600 flex items-center justify-center transition shadow-xs"
                      >
                        <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                      <span className="font-bold text-sm sm:text-base text-brand-brown font-sans">
                        {getItemQty(selectedDishForDetails.item.id)}
                      </span>
                      <button
                        onClick={() =>
                          addToCart(
                            {
                              id: selectedDishForDetails.item.id,
                              name: selectedDishForDetails.item.name,
                              price:
                                typeof selectedDishForDetails.item.price === "number"
                                  ? selectedDishForDetails.item.price
                                  : 0,
                              category: selectedDishForDetails.item.category_id,
                              description: selectedDishForDetails.item.description,
                              image: selectedDishForDetails.item.image,
                              badge: selectedDishForDetails.item.badge,
                            },
                            1
                          )
                        }
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-brand-orange text-white hover:bg-orange-600 flex items-center justify-center transition shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() =>
                        addToCart(
                          {
                            id: selectedDishForDetails.item.id,
                            name: selectedDishForDetails.item.name,
                            price:
                              typeof selectedDishForDetails.item.price === "number"
                                ? selectedDishForDetails.item.price
                                : 0,
                            category: selectedDishForDetails.item.category_id,
                            description: selectedDishForDetails.item.description,
                            image: selectedDishForDetails.item.image,
                            badge: selectedDishForDetails.item.badge,
                          },
                          1
                        )
                      }
                      className="w-full py-3 sm:py-3.5 bg-gradient-to-r from-brand-orange to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/25 flex items-center justify-center gap-1.5 sm:gap-2 transition text-xs sm:text-sm"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>أضف للسلة</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
