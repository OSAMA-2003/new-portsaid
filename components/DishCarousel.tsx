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
} from "lucide-react";
import { useCart, MenuItem } from "@/context/CartContext";

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
    description: "تشكيلة فاخرة من سجق بلدي + كباب ضاني + كفتة مشوية + فراخ عالفحم مع أرز بسمتي بالزعفران وسلطات وطحينة سمسم.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD36-TZoKJowpy9x82axM8Fqne6mo0run_D4kmZZWiOog84SRZvpqx0X_JSwrVZaPVUpK_7CKz_4uMoJ918upJkL_a_s0tKrN_dUj5YWth2sPMOW1FrdoCxVzaTM6Lr4QddskZnje09rQ77ctdFVTSdZUdtUNcZzHE6Qb7wObHh0rO__bVgDfErd9VvE5qvglHgo09OPZNbyzUV8SfY2_v9gcjx8jQ_APUJzmvYcvKzzkgY6SiGJp_6xg",
    badge: "الأكثر مبيعاً 🔥",
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
    description: "العزومة الملكية: 1/2 كباب + 1/2 كفتة + 1/2 نيفة + 1/2 مندي فراخ + 1/2 سجق + 2 لحم مندي + 3 حواوشي + محشي مشكل + ممبار + سمبوسك + 3 ملوخية + 8 شوربة.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCKW2CXhxJ6kBZux7iohwBiQ5scBIlgGsFUpz6XRKViel4VM3BWAREB4xoMNAXi6Rp7mPp-BqFQ7F2GpIJTEj4vM7IEdi3F9aPfMtBmwchTA6FIhv6vitZvim45xKHVGEEtBPatIRKi4dpblvpBVwPfI8GAC8gGlnZovUQK0rJfDz8BqoAtsu69znpgyncvkQd7CQS4ajaSCBZ1oPnIr5l9ka-osONM4GyvJlQPbg6Sc0s77x753ddmSA",
    badge: "العزومة الكبرى 👑",
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
    description: "ضلوع لحمة بلدي دايبة في طاجن فخار مسواة مع ورق عنب بالليمون وبصل مكرمل بالسمن البلدي والتوابل السرية.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBL6L0-dlINvY12z4Cg7jhDNBp-Exi581BuQAXZ-6_xbHyG_QkyxUA80gVwf6w8VneOlYSGB2YX4nSjJ64wTut6jOlzlC0vihYaoPqWUnmBKk9MtOwBf7TgAG-kC4QljHeVhF_jWJK-qhvZYadpc5Qf5Uk_ROJnt0U6_JD-dQyYA80PSXktgV3wuHPIok_aWI3ggJ3I2vGseq_qKTfw2mhL9vaXjlUjrjb-yYqplew082713qxwCCy4WA",
    badge: "طاجن الموسم 🍯",
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
    description: "تشكيلة البشوات: سجق جريل مخصوص + كفتة حاتي + ممبار مقرمش + حمام محشي فريك + أرز بسمتي بالمكسرات.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBwKQXoMQ_bE95cgfOrLjTI0RbN78-dbPlRh_GPLa17GnFll8KO39DylTiRQnh62nasHBqFu9qM6sISprZNaEn9FGlrG7pb9XoIBtpIpjf1Zvzg2-qiJtigHREzee1YRq9OJeY5QmUtVUbkhV_1Mom8B3AmOYvMbHKmln_DK4qZgOEaX8cLj3ni-EhyDnsJ0vO6Ff_9xmOVboc-7Jc1p39MSFbAyx-GqwHHEA1_x3_bVw-mqZzJXk-4mA",
    badge: "اختيار الملوك ⭐",
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
    description: "أرز بسمتي بالبهارات + محاشي مشكلة + 1/2 مندي فراخ دايب + 1/4 لحم مندي + 1/4 كفتة حاتي + سلطات وطحينة.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuARQNCZLWoktE0AAD2ysgzsbx8jHZvCbRu3jTK0sNEmAnbDR32oeEcJpOFUZx0p3fp-4u4sRknmjv6LxeGwHD1zFKbkQIM-YUT0vJt6aUt1SJdaNbbcXYJdeLbceFIJk9vkvEYMls5WF-6TgBFfGZiYDzdOmyTX5Scg5ibPBuy_FpV7NHOM7z_Ay_gxzCyrb5GLjlgX1LVtcdahpY9TonlSpng6ThO4snBQfTonyVFAnuHYus0g4x8yVQ",
    badge: "لمة العيلة 👨‍👩‍👧‍👦",
    highlightTag: "مندي + كفتة + محاشي",
    portionText: "تكفي 3-4 أفراد",
    rating: 4.9,
  },
  {
    id: "sig-6",
    name: "موزة ضاني فتة بالصلصة",
    category: "oriental",
    categoryName: "المطبخ الشرقي",
    price: 450,
    description: "موزة ضاني كاملة مطهوة على نار هادية حتى الذوبان، تقدم فوق فتة مصرية عريقة بالعيش المحمص والخل والتوم.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBL6L0-dlINvY12z4Cg7jhDNBp-Exi581BuQAXZ-6_xbHyG_QkyxUA80gVwf6w8VneOlYSGB2YX4nSjJ64wTut6jOlzlC0vihYaoPqWUnmBKk9MtOwBf7TgAG-kC4QljHeVhF_jWJK-qhvZYadpc5Qf5Uk_ROJnt0U6_JD-dQyYA80PSXktgV3wuHPIok_aWI3ggJ3I2vGseq_qKTfw2mhL9vaXjlUjrjb-yYqplew082713qxwCCy4WA",
    badge: "دايبة دوب 🥩",
    highlightTag: "طشة الخل والتوم",
    portionText: "لحم ضاني 100%",
    rating: 4.9,
  },
  {
    id: "sig-7",
    name: "جرة كوارع ورق عنب",
    category: "claypot",
    categoryName: "الجرة الفخارية",
    price: 295,
    description: "جرة فخارية مدفونة في الجمر مليئة بالكوارع المخلية وورق العنب المحشو بالأرز المتبل والمسقى بالشوربة الدسمة.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD36-TZoKJowpy9x82axM8Fqne6mo0run_D4kmZZWiOog84SRZvpqx0X_JSwrVZaPVUpK_7CKz_4uMoJ918upJkL_a_s0tKrN_dUj5YWth2sPMOW1FrdoCxVzaTM6Lr4QddskZnje09rQ77ctdFVTSdZUdtUNcZzHE6Qb7wObHh0rO__bVgDfErd9VvE5qvglHgo09OPZNbyzUV8SfY2_v9gcjx8jQ_APUJzmvYcvKzzkgY6SiGJp_6xg",
    badge: "طاقة ونكهة ⚡",
    highlightTag: "مطهوة في الجمر",
    portionText: "نكهة أصيلة",
    rating: 4.8,
  },
  {
    id: "sig-8",
    name: "طاجن عكاوي بالبصل المكرمل",
    category: "tajines",
    categoryName: "طواجن الفخار",
    price: 300,
    description: "قطع عكاوي بقري بلدي متبلة ومطهوة لساعات في طواجن الفخار حتى تذوب مع البصل المكرمل وصوص البهارات.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCKW2CXhxJ6kBZux7iohwBiQ5scBIlgGsFUpz6XRKViel4VM3BWAREB4xoMNAXi6Rp7mPp-BqFQ7F2GpIJTEj4vM7IEdi3F9aPfMtBmwchTA6FIhv6vitZvim45xKHVGEEtBPatIRKi4dpblvpBVwPfI8GAC8gGlnZovUQK0rJfDz8BqoAtsu69znpgyncvkQd7CQS4ajaSCBZ1oPnIr5l9ka-osONM4GyvJlQPbg6Sc0s77x753ddmSA",
    badge: "سر الصنعة 🧅",
    highlightTag: "بصل مكرمل وسمن بلدي",
    portionText: "طبق مصري عريق",
    rating: 4.9,
  },
];

export const DishCarousel: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [addedItem, setAddedItem] = useState<string | null>(null);
  const { addToCart, items: cartItems, updateQuantity } = useCart();

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const maxScroll = scrollWidth - clientWidth;
      const currentScroll = Math.abs(scrollLeft);

      setCanScrollLeft(currentScroll > 10);
      setCanScrollRight(currentScroll < maxScroll - 10);

      const itemWidth = 360;
      const index = Math.round(currentScroll / itemWidth);
      setActiveIndex(Math.min(index, SIGNATURE_DISHES.length - 1));
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll);
      checkScroll();
      return () => el.removeEventListener("scroll", checkScroll);
    }
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 380;
      const delta = direction === "right" ? scrollAmount : -scrollAmount;
      scrollRef.current.scrollBy({ left: delta, behavior: "smooth" });
    }
  };

  const scrollToIndex = (index: number) => {
    if (scrollRef.current) {
      const itemWidth = 380;
      const target = index * itemWidth;
      scrollRef.current.scrollTo({ left: -target, behavior: "smooth" });
      setActiveIndex(index);
    }
  };

  const handleAddToCart = (dish: SignatureDish) => {
    addToCart(dish, 1);
    setAddedItem(dish.id);
    setTimeout(() => {
      setAddedItem(null);
    }, 1200);
  };

  const getQtyInCart = (id: string) => {
    const found = cartItems.find((i) => i.id === id);
    return found ? found.quantity : 0;
  };

  return (
    <div className="relative">
      {/* Top Header & Controls */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-brand-orange/15 text-brand-orange flex items-center justify-center font-bold text-lg shadow-sm">
            <Flame className="w-5 h-5 text-brand-orange" />
          </div>
          <div>
            <span className="text-xs font-bold text-brand-orange block">الأكثر طلباً ومحبة</span>
            <h3 className="text-lg sm:text-xl font-bold text-brand-brown font-aref">مشويات وطواجن نيو بورسعيد</h3>
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

      {/* Carousel Track with Crystal-Clear Full Hero Cards */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-10 pt-2 scroll-smooth hide-scrollbar snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {SIGNATURE_DISHES.map((dish) => {
          const qty = getQtyInCart(dish.id);
          const isJustAdded = addedItem === dish.id;

          return (
            <div
              key={dish.id}
              className="w-[305px] sm:w-[345px] lg:w-[365px] shrink-0 snap-center bg-white rounded-[2rem] shadow-xl hover:shadow-2xl border border-brand-orange/20 hover:border-brand-orange/60 transition-all duration-500 group flex flex-col justify-between overflow-hidden hover:-translate-y-2"
            >
              {/* TOP: Large, Crystal-Clear Food Photo */}
              <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-gray-100">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 brightness-[1.02] contrast-[1.03]"
                />

                {/* Subtle bottom shadow to make category badge readable */}
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />





                {/* Bottom Overlay Info (Category & Portion) */}
                <div className="absolute bottom-3 inset-x-4 flex items-center justify-between text-xs text-white font-semibold z-10">
                  <span className="bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-lg text-amber-300 border border-white/15">
                    {dish.categoryName}
                  </span>

                </div>
              </div>

              {/* BOTTOM: Dish Info, Price & Order Action */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between gap-4 text-right bg-white">
                <div className="space-y-2">
                  <h3 className="font-aref font-bold text-2xl text-brand-brown group-hover:text-brand-orange transition-colors leading-tight">
                    {dish.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-brand-muted leading-relaxed line-clamp-2 min-h-[2.5rem]">
                    {dish.description}
                  </p>

                </div>

                {/* Price & Order Action Bar */}
                <div className="pt-4 border-t border-brand-orange/15 flex items-center justify-between gap-3">
                  {/* Big Clear Price */}
                  <div>
                    <span className="text-[10px] text-brand-muted block font-semibold">السعر</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl sm:text-3xl font-extrabold text-brand-brown font-sans">
                        {dish.price}
                      </span>
                      <span className="text-xs font-bold text-brand-orange">ج.م</span>
                    </div>
                  </div>

                  {/* Add To Cart / Stepper */}
                  <div>
                    {qty > 0 ? (
                      <div className="flex items-center gap-2 bg-brand-cream px-2 py-1.5 rounded-2xl border-2 border-brand-orange/40 shadow-sm">
                        <button
                          onClick={() => updateQuantity(dish.id, qty - 1)}
                          className="w-8 h-8 rounded-xl bg-white hover:bg-red-50 text-brand-brown hover:text-red-600 flex items-center justify-center transition shadow-xs"
                          aria-label="تقليل"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-6 text-center font-bold text-base text-brand-brown font-sans">
                          {qty}
                        </span>
                        <button
                          onClick={() => addToCart(dish, 1)}
                          className="w-8 h-8 rounded-xl bg-brand-orange text-white hover:bg-orange-600 flex items-center justify-center transition shadow-xs"
                          aria-label="زيادة"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAddToCart(dish)}
                        className={`px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-md flex items-center gap-2 active:scale-95 ${isJustAdded
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
                            <span>أضف للطلب</span>
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

      {/* Pagination Dots */}
      <div className="flex items-center justify-center gap-2">
        {SIGNATURE_DISHES.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToIndex(i)}
            className={`h-2.5 rounded-full transition-all duration-300 ${activeIndex === i
              ? "w-8 bg-brand-orange shadow-md shadow-orange-500/40"
              : "w-2.5 bg-brand-orange/25 hover:bg-brand-orange/50"
              }`}
            aria-label={`الانتقال إلى الطبق ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default DishCarousel;
