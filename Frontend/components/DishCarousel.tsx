"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Check,
  Flame,
  Sparkles,
  ShoppingBag,
  Star,
  Users,
  Utensils,
  Clock,
  ArrowLeft,
  Info,
  X,
  Eye,
} from "lucide-react";
import {
  useCart,
  MenuItem,
  PortionType,
  PORTIONS,
  PORTION_KEYS,
  calculatePortionPrice,
} from "@/context/CartContext";

export interface SignatureDish extends MenuItem {
  categoryName: string;
  portionText: string;
  highlightTag: string;
  rating: number;
}

export const SIGNATURE_DISHES: SignatureDish[] = [
  {
    id: "sig-1",
    name: "ميكس بورسعيد المشوي",
    category: "grills",
    categoryName: "مشويات عالفحم",
    price: 450,
    description:
      "تشكيلة فاخرة من سجق بلدي + كباب ضاني + كفتة مشوية + فراخ عالفحم مع أرز بسمتي بالزعفران وسلطات وطحينة سمسم.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD36-TZoKJowpy9x82axM8Fqne6mo0run_D4kmZZWiOog84SRZvpqx0X_JSwrVZaPVUpK_7CKz_4uMoJ918upJkL_a_s0tKrN_dUj5YWth2sPMOW1FrdoCxVzaTM6Lr4QddskZnje09rQ77ctdFVTSdZUdtUNcZzHE6Qb7wObHh0rO__bVgDfErd9VvE5qvglHgo09OPZNbyzUV8SfY2_v9gcjx8jQ_APUJzmvYcvKzzkgY6SiGJp_6xg",
    badge: "الأكثر مبيعاً",
    highlightTag: "سر الشواء البورسعيدي",
    portionText: "يكفي فردين",
    rating: 4.9,
  },
  {
    id: "sig-2",
    name: "صينية نيو بورسعيد الكبرى",
    category: "trays",
    categoryName: "صواني وعزومات",
    price: 3550,
    description:
      "العزومة الملكية: 1/2 كباب + 1/2 كفتة + 1/2 نيفة + 1/2 مندي فراخ + 1/2 سجق + 2 لحم مندي + 3 حواوشي + محشي مشكل + ممبار + سمبوسك + 3 ملوخية + 8 شوربة.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCKW2CXhxJ6kBZux7iohwBiQ5scBIlgGsFUpz6XRKViel4VM3BWAREB4xoMNAXi6Rp7mPp-BqFQ7F2GpIJTEj4vM7IEdi3F9aPfMtBmwchTA6FIhv6vitZvim45xKHVGEEtBPatIRKi4dpblvpBVwPfI8GAC8gGlnZovUQK0rJfDz8BqoAtsu69znpgyncvkQd7CQS4ajaSCBZ1oPnIr5l9ka-osONM4GyvJlQPbg6Sc0s77x753ddmSA",
    badge: "العزومة الكبرى",
    highlightTag: "تكفي 8-10 أفراد",
    portionText: "عزومة فاخرة",
    rating: 5.0,
  },
  {
    id: "sig-3",
    name: "طاجن بورسعيد (ضلوع + ورق عنب)",
    category: "tajines",
    categoryName: "طواجن الفخار",
    price: 460,
    description:
      "ضلوع لحمة بلدي دايبة في طاجن فخار مسواة مع ورق عنب بالليمون وبصل مكرمل بالسمن البلدي والتوابل السرية.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBL6L0-dlINvY12z4Cg7jhDNBp-Exi581BuQAXZ-6_xbHyG_QkyxUA80gVwf6w8VneOlYSGB2YX4nSjJ64wTut6jOlzlC0vihYaoPqWUnmBKk9MtOwBf7TgAG-kC4QljHeVhF_jWJK-qhvZYadpc5Qf5Uk_ROJnt0U6_JD-dQyYA80PSXktgV3wuHPIok_aWI3ggJ3I2vGseq_qKTfw2mhL9vaXjlUjrjb-yYqplew082713qxwCCy4WA",
    badge: "طاجن الموسم",
    highlightTag: "دايب في الفرن البلدي",
    portionText: "وجبة دسمة",
    rating: 4.9,
  },
  {
    id: "sig-4",
    name: "طبق الملوك الملكي",
    category: "grills",
    categoryName: "مشويات شرقية",
    price: 470,
    description:
      "تشكيلة البشوات: سجق جريل مخصوص + كفتة حاتي + ممبار مقرمش + حمام محشي فريك + أرز بسمتي بالمكسرات.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBwKQXoMQ_bE95cgfOrLjTI0RbN78-dbPlRh_GPLa17GnFll8KO39DylTiRQnh62nasHBqFu9qM6sISprZNaEn9FGlrG7pb9XoIBtpIpjf1Zvzg2-qiJtigHREzee1YRq9OJeY5QmUtVUbkhV_1Mom8B3AmOYvMbHKmln_DK4qZgOEaX8cLj3ni-EhyDnsJ0vO6Ff_9xmOVboc-7Jc1p39MSFbAyx-GqwHHEA1_x3_bVw-mqZzJXk-4mA",
    badge: "اختيار الملوك",
    highlightTag: "حمام + كفتة + ممبار",
    portionText: "يكفي 1-2 فرد",
    rating: 4.8,
  },
  {
    id: "sig-5",
    name: "صينية العمدة الفاخرة",
    category: "trays",
    categoryName: "صواني العزومات",
    price: 880,
    description:
      "أرز بسمتي بالبهارات + محاشي مشكلة + 1/2 مندي فراخ دايب + 1/4 لحم مندي + 1/4 كفتة حاتي + سلطات وطحينة.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuARQNCZLWoktE0AAD2ysgzsbx8jHZvCbRu3jTK0sNEmAnbDR32oeEcJpOFUZx0p3fp-4u4sRknmjv6LxeGwHD1zFKbkQIM-YUT0vJt6aUt1SJdaNbbcXYJdeLbceFIJk9vkvEYMls5WF-6TgBFfGZiYDzdOmyTX5Scg5ibPBuy_FpV7NHOM7z_Ay_gxzCyrb5GLjlgX1LVtcdahpY9TonlSpng6ThO4snBQfTonyVFAnuHYus0g4x8yVQ",
    badge: "لمة العيلة",
    highlightTag: "مندي + كفتة + محاشي",
    portionText: "تكفي 3-4 أفراد",
    rating: 4.9,
  },

  {
    id: "sig-6",
    name: "طاجن كوارع بورق العنب",
    category: "tajines",
    categoryName: "طواجن حصرية",
    price: 295,
    description:
      "جرة فخارية مدفونة في الجمر مليئة بالكوارع المخلية وورق العنب المحشو بالأرز المتبل والمسقى بالشوربة الدسمة.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD36-TZoKJowpy9x82axM8Fqne6mo0run_D4kmZZWiOog84SRZvpqx0X_JSwrVZaPVUpK_7CKz_4uMoJ918upJkL_a_s0tKrN_dUj5YWth2sPMOW1FrdoCxVzaTM6Lr4QddskZnje09rQ77ctdFVTSdZUdtUNcZzHE6Qb7wObHh0rO__bVgDfErd9VvE5qvglHgo09OPZNbyzUV8SfY2_v9gcjx8jQ_APUJzmvYcvKzzkgY6SiGJp_6xg",
    badge: "طاقة ونكهة",
    highlightTag: "مطهوة في الجمر",
    portionText: "نكهة أصيلة",
    rating: 4.8,
  },
  {
    id: "sig-7",
    name: "طاجن عكاوي بالبصل المكرمل",
    category: "tajines",
    categoryName: "طواجن الفخار",
    price: 300,
    description:
      "قطع عكاوي بقري بلدي متبلة ومطهوة لساعات في طواجن الفخار حتى تذوب مع البصل المكرمل وصوص البهارات.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCKW2CXhxJ6kBZux7iohwBiQ5scBIlgGsFUpz6XRKViel4VM3BWAREB4xoMNAXi6Rp7mPp-BqFQ7F2GpIJTEj4vM7IEdi3F9aPfMtBmwchTA6FIhv6vitZvim45xKHVGEEtBPatIRKi4dpblvpBVwPfI8GAC8gGlnZovUQK0rJfDz8BqoAtsu69znpgyncvkQd7CQS4ajaSCBZ1oPnIr5l9ka-osONM4GyvJlQPbg6Sc0s77x753ddmSA",
    badge: "سر الصنعة",
    highlightTag: "بصل مكرمل وسمن بلدي",
    portionText: "طبق مصري عريق",
    rating: 4.9,
  },
];

export const DishCarousel: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { addToCart, updateQuantity, getItemPortionQty } = useCart();
  const [addedItem, setAddedItem] = useState<string | null>(null);
  const [selectedDishForDetails, setSelectedDishForDetails] = useState<SignatureDish | null>(null);

  // Selected portion per dish in carousel
  const [selectedPortions, setSelectedPortions] = useState<Record<string, PortionType>>({});
  // Selected portion in modal
  const [modalPortion, setModalPortion] = useState<PortionType>("whole");

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

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 380;
      const delta = direction === "right" ? scrollAmount : -scrollAmount;
      scrollRef.current.scrollBy({ left: delta, behavior: "smooth" });
    }
  };

  const handleOpenDetails = (dish: SignatureDish) => {
    const p = selectedPortions[dish.id] || "whole";
    setModalPortion(p);
    setSelectedDishForDetails(dish);
  };

  const handleAddToCart = (dish: SignatureDish, portion: PortionType = "whole") => {
    addToCart(dish, 1, portion);
    const key = `${dish.id}_${portion}`;
    setAddedItem(key);
    setTimeout(() => {
      setAddedItem(null);
    }, 1200);
  };

  return (
    <div className="relative" dir="rtl">
      {/* Top Header & Controls */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-brand-orange/15 text-brand-orange flex items-center justify-center font-bold text-lg shadow-sm">
            <Flame className="w-5 h-5 text-brand-orange" />
          </div>
          <div>
            <span className="text-xs font-bold text-brand-orange block">الأكثر طلباً ومحبة</span>
            <h3 className="text-lg sm:text-xl font-bold text-brand-brown font-aref">
              مشويات وطواجن نيو بورسعيد
            </h3>
          </div>
        </div>

        {/* Navigation Arrow Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll("right")}
            className="w-12 h-12 rounded-2xl bg-white hover:bg-brand-orange text-brand-brown hover:text-white border border-brand-orange/20 hover:border-brand-orange flex items-center justify-center transition-all shadow-md active:scale-95 group"
            title="السابق"
            aria-label="السابق"
          >
            <ChevronRight className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <button
            onClick={() => scroll("left")}
            className="w-12 h-12 rounded-2xl bg-white hover:bg-brand-orange text-brand-brown hover:text-white border border-brand-orange/20 hover:border-brand-orange flex items-center justify-center transition-all shadow-md active:scale-95 group"
            title="التالي"
            aria-label="التالي"
          >
            <ChevronLeft className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Carousel Track */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-10 pt-2 scroll-smooth hide-scrollbar snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {SIGNATURE_DISHES.map((dish) => {
          const currentPortion = selectedPortions[dish.id] || "whole";
          const currentPortionPrice = calculatePortionPrice(dish.price, currentPortion);
          const portionQty = getItemPortionQty(dish.id, currentPortion);
          const itemKey = `${dish.id}_${currentPortion}`;
          const isJustAdded = addedItem === itemKey;

          return (
            <div
              key={dish.id}
              className="w-[305px] sm:w-[345px] lg:w-[365px] shrink-0 snap-center bg-white rounded-[2rem] shadow-xl hover:shadow-2xl border border-brand-orange/20 hover:border-brand-orange/60 transition-all duration-500 group flex flex-col justify-between overflow-hidden hover:-translate-y-2"
            >
              {/* TOP: Food Photo */}
              <div
                className="relative h-64 sm:h-72 w-full overflow-hidden bg-gray-100 cursor-pointer"
                onClick={() => handleOpenDetails(dish)}
              >
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 brightness-[1.02] contrast-[1.03]"
                />

                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

                {/* View Details Overlay */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <span className="bg-white/95 text-brand-brown text-xs font-bold px-4 py-2 rounded-full shadow-lg border border-brand-orange/30 flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-brand-orange" />
                    <span>عرض التفاصيل والكميات</span>
                  </span>
                </div>

                {/* Badge if exists */}
                {dish.badge && (
                  <span className="absolute top-4 right-4 bg-brand-orange text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md z-10 animate-pulse">
                    {dish.badge}
                  </span>
                )}

                {/* Category Pill at bottom of image */}
                <div className="absolute bottom-3 right-4 z-10 flex items-center gap-2">
                  <span className="bg-black/60 backdrop-blur-md text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-white/20">
                    {dish.categoryName}
                  </span>
                </div>
              </div>

              {/* BODY: Dish info & Portion Selector */}
              <div className="p-5 sm:p-6 flex flex-col justify-between flex-1 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <h4
                      onClick={() => handleOpenDetails(dish)}
                      className="font-aref font-bold text-xl text-brand-brown group-hover:text-brand-orange transition-colors cursor-pointer"
                    >
                      {dish.name}
                    </h4>
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-bold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 shrink-0">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{dish.rating}</span>
                    </div>
                  </div>

                  <p className="text-xs text-brand-muted line-clamp-2 leading-relaxed font-sans">
                    {dish.description}
                  </p>
                </div>

                {/* Portion Selector Buttons */}
                <div className="space-y-1 bg-brand-cream/40 p-2 rounded-2xl border border-brand-orange/15">
                  <div className="flex items-center justify-between text-[11px] font-bold text-brand-muted">
                    <span>اختر الحجم:</span>
                    <span className="text-brand-orange">{PORTIONS[currentPortion].label}</span>
                  </div>

                  <div className="grid grid-cols-4 gap-1 bg-white p-1 rounded-xl border border-brand-orange/20">
                    {PORTION_KEYS.map((pKey) => {
                      const pInfo = PORTIONS[pKey];
                      const isSelected = currentPortion === pKey;
                      const hasPortionInCart = getItemPortionQty(dish.id, pKey) > 0;

                      return (
                        <button
                          key={pKey}
                          type="button"
                          onClick={() =>
                            setSelectedPortions((prev) => ({
                              ...prev,
                              [dish.id]: pKey,
                            }))
                          }
                          className={`py-1 px-1 rounded-lg text-center font-bold text-[11px] transition-all relative ${isSelected
                            ? "bg-brand-orange text-white shadow-xs"
                            : "bg-brand-cream/50 text-brand-brown hover:bg-brand-orange/15 hover:text-brand-orange"
                            }`}
                        >
                          <span>{pInfo.shortLabel}</span>
                          {hasPortionInCart && (
                            <span
                              className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${isSelected ? "bg-amber-300" : "bg-brand-orange"
                                }`}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* FOOTER: Price & Add To Cart Button */}
                <div className="pt-2 border-t border-brand-orange/15 flex items-center justify-between gap-2">
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl sm:text-3xl font-extrabold text-brand-brown font-sans">
                        {currentPortionPrice}
                      </span>
                      <span className="text-xs font-bold text-brand-orange">ج.م</span>
                    </div>
                    {currentPortion !== "whole" && (
                      <span className="text-[10px] text-brand-muted block font-sans">
                        (الكامل: {dish.price} ج.م)
                      </span>
                    )}
                  </div>

                  {/* Add To Cart / Stepper */}
                  <div>
                    {portionQty > 0 ? (
                      <div className="flex items-center gap-1.5 bg-brand-cream px-2 py-1 rounded-2xl border-2 border-brand-orange/40 shadow-sm">
                        <button
                          onClick={() => updateQuantity(itemKey, portionQty - 1)}
                          className="w-7 h-7 rounded-xl bg-white hover:bg-red-50 text-brand-brown hover:text-red-600 flex items-center justify-center transition shadow-xs"
                          aria-label="تقليل"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-5 text-center font-bold text-sm text-brand-brown font-sans">
                          {portionQty}
                        </span>
                        <button
                          onClick={() => handleAddToCart(dish, currentPortion)}
                          className="w-7 h-7 rounded-xl bg-brand-orange text-white hover:bg-orange-600 flex items-center justify-center transition shadow-xs"
                          aria-label="زيادة"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAddToCart(dish, currentPortion)}
                        className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-md flex items-center gap-1.5 active:scale-95 ${isJustAdded
                          ? "bg-green-600 text-white scale-105"
                          : "bg-gradient-to-r from-brand-orange to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-orange-500/25 hover:scale-105"
                          }`}
                      >
                        {isJustAdded ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>تمت الإضافة!</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-4 h-4" />
                            <span>أضف {PORTIONS[currentPortion].shortLabel}</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Food Details Modal */}
      {selectedDishForDetails && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in duration-200"
          onClick={() => setSelectedDishForDetails(null)}
          dir="rtl"
        >
          <div
            className="bg-white rounded-[2.5rem] overflow-hidden max-w-lg w-full shadow-2xl border-2 border-brand-orange/30 animate-in zoom-in-95 duration-200 flex flex-col text-right relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Image */}
            <div className="relative h-64 sm:h-72 w-full bg-brand-cream">
              <img
                src={selectedDishForDetails.image}
                alt={selectedDishForDetails.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={() => setSelectedDishForDetails(null)}
                className="absolute top-4 left-4 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-brand-orange text-white flex items-center justify-center transition shadow-md"
                aria-label="إغلاق"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Badges on Modal Image */}
              <div className="absolute bottom-4 inset-x-6 flex items-center justify-between text-white">
                <span className="bg-brand-orange text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                  {selectedDishForDetails.categoryName}
                </span>
                {selectedDishForDetails.badge && (
                  <span className="bg-black/60 backdrop-blur-md border border-white/20 text-amber-300 text-xs font-bold px-3 py-1 rounded-full">
                    {selectedDishForDetails.badge}
                  </span>
                )}
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="space-y-2">
                <h3 className="font-aref font-bold text-3xl text-brand-brown">
                  {selectedDishForDetails.name}
                </h3>
                {selectedDishForDetails.highlightTag && (
                  <p className="text-xs font-bold text-brand-orange">
                    {selectedDishForDetails.highlightTag}
                  </p>
                )}
              </div>

              {/* Full Description & Ingredients */}
              <div className="space-y-2 bg-brand-cream/50 p-4 rounded-2xl border border-brand-orange/15">
                <h4 className="text-xs font-bold text-brand-muted flex items-center gap-1.5">
                  <Utensils className="w-3.5 h-3.5 text-brand-orange" />
                  <span>المكونات وطريقة التقديم:</span>
                </h4>
                <p className="text-brand-brown text-sm sm:text-base leading-relaxed">
                  {selectedDishForDetails.description}
                </p>
              </div>

              {/* Portion Selector Grid */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs sm:text-sm font-bold text-brand-brown flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-brand-orange" />
                    <span>اختر حجم الوجبة / الكمية بالكيلو:</span>
                  </h4>
                  <span className="text-xs text-brand-orange font-bold font-sans">
                    {PORTIONS[modalPortion].label}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {PORTION_KEYS.map((pKey) => {
                    const pInfo = PORTIONS[pKey];
                    const isSelected = modalPortion === pKey;
                    const calculated = calculatePortionPrice(
                      selectedDishForDetails.price,
                      pKey
                    );

                    return (
                      <button
                        key={pKey}
                        type="button"
                        onClick={() => {
                          setModalPortion(pKey);
                          setSelectedPortions((prev) => ({
                            ...prev,
                            [selectedDishForDetails.id]: pKey,
                          }));
                        }}
                        className={`p-3 rounded-2xl border-2 text-center transition-all flex flex-col items-center justify-between gap-1 relative ${isSelected
                          ? "bg-brand-orange text-white border-brand-orange shadow-md shadow-orange-500/25 scale-[1.02]"
                          : "bg-brand-cream/60 hover:bg-brand-cream text-brand-brown border-brand-orange/20 hover:border-brand-orange/50"
                          }`}
                      >
                        {isSelected && (
                          <span className="absolute top-1.5 right-1.5 bg-white text-brand-orange rounded-full p-0.5 shadow-xs">
                            <Check className="w-3 h-3" />
                          </span>
                        )}
                        <span className="font-bold text-xs sm:text-sm">
                          {pInfo.shortLabel}
                        </span>
                        <span
                          className={`text-sm sm:text-base font-extrabold font-sans ${isSelected ? "text-amber-200" : "text-brand-orange"
                            }`}
                        >
                          {calculated} ج.م
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price & Action Bottom Bar */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-brand-muted block font-semibold">
                    السعر المطلوب
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-brand-brown font-sans">
                      {calculatePortionPrice(selectedDishForDetails.price, modalPortion)}
                    </span>
                    <span className="text-xs font-bold text-brand-orange">ج.م</span>
                  </div>
                </div>

                <div className="flex-1 max-w-[200px]">
                  {getItemPortionQty(selectedDishForDetails.id, modalPortion) > 0 ? (
                    <div className="flex items-center justify-between bg-brand-cream px-3 py-2 rounded-2xl border-2 border-brand-orange/40 shadow-sm">
                      <button
                        onClick={() =>
                          updateQuantity(
                            `${selectedDishForDetails.id}_${modalPortion}`,
                            getItemPortionQty(selectedDishForDetails.id, modalPortion) - 1
                          )
                        }
                        className="w-8 h-8 rounded-xl bg-white text-brand-brown hover:text-red-600 flex items-center justify-center transition shadow-xs"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-bold text-base text-brand-brown font-sans">
                        {getItemPortionQty(selectedDishForDetails.id, modalPortion)}
                      </span>
                      <button
                        onClick={() =>
                          handleAddToCart(selectedDishForDetails, modalPortion)
                        }
                        className="w-8 h-8 rounded-xl bg-brand-orange text-white hover:bg-orange-600 flex items-center justify-center transition shadow-xs"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleAddToCart(selectedDishForDetails, modalPortion)}
                      className="w-full py-3.5 bg-gradient-to-r from-brand-orange to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>أضف ({PORTIONS[modalPortion].shortLabel})</span>
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
};

export default DishCarousel;
