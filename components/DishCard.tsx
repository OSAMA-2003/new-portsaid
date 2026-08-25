"use client";

import React, { useState } from "react";
import { Plus, Check, Flame, Sparkles, Clock, Users } from "lucide-react";
import { MenuItemData } from "@/lib/menuData";
import { useCart } from "@/context/CartContext";

interface DishCardProps {
  dish: MenuItemData;
  featured?: boolean;
}

export const DishCard: React.FC<DishCardProps> = ({ dish, featured = false }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(dish, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div
      className={`bg-white rounded-3xl overflow-hidden transition-all duration-300 group flex flex-col justify-between border border-brand-orange/15 hover:border-brand-orange/40 hover:shadow-xl ${
        featured ? "shadow-xl ring-2 ring-brand-orange/20" : "custom-shadow"
      }`}
    >
      {/* Dish Image Container */}
      <div className="relative h-56 sm:h-64 overflow-hidden bg-gray-100">
        <img
          src={dish.image}
          alt={dish.name}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
        />

        {/* Badge overlay */}
        {dish.badge && (
          <div
            className={`absolute top-3.5 right-3.5 px-3 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1 ${
              dish.badge === "الأكثر طلباً"
                ? "bg-brand-orange text-white"
                : dish.badge === "اختيار الشيف"
                ? "bg-brand-dark text-white border border-brand-gold/40"
                : "bg-brand-gold text-brand-brown"
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>{dish.badge}</span>
          </div>
        )}

        {/* Spicy Indicator */}
        {dish.isSpicy && (
          <div className="absolute top-3.5 left-3.5 bg-red-600 text-white p-1.5 rounded-full shadow-md">
            <Flame className="w-3.5 h-3.5" />
          </div>
        )}

        {/* Price Tag Pill */}
        <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm px-3.5 py-1.5 rounded-xl font-extrabold text-sm text-brand-orange shadow-md border border-brand-orange/20">
          {dish.price} <span className="text-xs font-semibold text-brand-brown">ج.م</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="font-serif font-bold text-lg text-brand-brown leading-snug group-hover:text-brand-orange transition-colors">
              {dish.name}
            </h3>
          </div>

          <p className="text-xs sm:text-sm text-brand-muted leading-relaxed line-clamp-2">
            {dish.description}
          </p>

          {/* Quick Meta */}
          <div className="flex items-center gap-3 pt-2 text-[11px] font-semibold text-brand-brown/70">
            {dish.portion && (
              <span className="flex items-center gap-1 bg-brand-cream px-2 py-0.5 rounded-md border border-brand-orange/15">
                <Users className="w-3 h-3 text-brand-orange" />
                <span>{dish.portion}</span>
              </span>
            )}
            {dish.preparationTime && (
              <span className="flex items-center gap-1 bg-brand-cream px-2 py-0.5 rounded-md border border-brand-orange/15">
                <Clock className="w-3 h-3 text-brand-orange" />
                <span>{dish.preparationTime}</span>
              </span>
            )}
          </div>
        </div>

        {/* Add to Order Button */}
        <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs font-bold text-brand-muted">
            {dish.calories ? `${dish.calories} سعرة` : "طازج يومياً"}
          </span>

          <button
            onClick={handleAdd}
            className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm ${
              added
                ? "bg-green-600 text-white scale-105"
                : "bg-brand-orange hover:bg-orange-600 text-white hover:scale-[1.02] active:scale-95"
            }`}
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>تمت الإضافة!</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>أضف للطلب</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
