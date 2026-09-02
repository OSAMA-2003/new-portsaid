"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Send,
  MapPin,
  Phone,
  User,
  FileText,
  Utensils,
} from "lucide-react";
import { useCart, CartItem } from "@/context/CartContext";
import { RESTAURANT_INFO } from "@/lib/data.js";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice, totalCount } = useCart();

  // Checkout Form State
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [orderType, setOrderType] = useState<"delivery" | "takeaway">("delivery");
  const [orderNotes, setOrderNotes] = useState("");
  const [orderSubmitted, setOrderSubmitted] = useState(false);

  const deliveryFee = orderType === "delivery" ? 25 : 0;
  const finalTotal = totalPrice + (orderType === "delivery" ? 0 : -25); // Context includes deliveryFee by default

  const handleSendWhatsAppOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      alert("يرجى إدخال الاسم ورقم الهاتف أولاً");
      return;
    }
    if (orderType === "delivery" && !deliveryAddress.trim()) {
      alert("يرجى إدخال عنوان التوصيل بالتفصيل");
      return;
    }

    // Build Formatted Arabic WhatsApp Message
    let msg = `🌟 *طلب جديد من موقع مطعم نيو بورسعيد* 🌟\n`;
    msg += `----------------------------------------\n`;
    msg += `👤 *الاسم:* ${customerName}\n`;
    msg += `📞 *الهاتف:* ${customerPhone}\n`;
    msg += `🛵 *نوع الطلب:* ${orderType === "delivery" ? "توصيل دليفري" : "استلام من المطعم (تيك أواي)"}\n`;
    if (orderType === "delivery") {
      msg += `📍 *العنوان:* ${deliveryAddress}\n`;
    }
    if (orderNotes.trim()) {
      msg += `📝 *ملاحظات خاصة:* ${orderNotes}\n`;
    }
    msg += `----------------------------------------\n`;
    msg += `📋 *تفاصيل الأصناف والكميات:*\n`;

    items.forEach((item: CartItem, index: number) => {
      const priceText = typeof item.price === "number" ? `${item.price * item.quantity} ج.م` : item.price;
      const portionText = item.portionLabel ? ` (${item.portionLabel})` : "";
      msg += `${index + 1}. *${item.name}*${portionText} × ${item.quantity} = ${priceText}\n`;
      if (item.specialInstructions) {
        msg += `   ملاحظة: ${item.specialInstructions}\n`;
      }
    });

    msg += `----------------------------------------\n`;
    if (orderType === "delivery") {
      msg += `💵 *المجموع الفرعي:* ${totalPrice - 25} ج.م\n`;
      msg += `🛵 *خدمة التوصيل:* 25 ج.م\n`;
      msg += `🔥 *الإجمالي الكلي:* *${totalPrice} ج.م*\n`;
    } else {
      msg += `🔥 *الإجمالي الكلي:* *${totalPrice - 25} ج.م*\n`;
    }
    msg += `----------------------------------------\n`;
    msg += `أكل بشوات - شكراً لاختياركم نيو بورسعيد! ❤️`;

    const whatsappNumber = RESTAURANT_INFO.whatsapp || "201007375151";
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`;

    setOrderSubmitted(true);
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-brand-cream/60 pt-24 sm:pt-28 pb-16 px-3 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-orange/20 pb-5">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold font-aref text-brand-brown">
              سلة المأكولات والطلبات
            </h1>
            <p className="text-brand-muted text-xs sm:text-base">
              راجع أصنافك المختارة وأحجامها (ربع، نصف، ٣/٤، كامل) وأكمل بيانات التوصيل
            </p>
          </div>

          <Link
            href="/menu"
            className="inline-flex items-center justify-center gap-2 bg-white hover:bg-brand-orange hover:text-white text-brand-brown px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm border border-brand-orange/20 shadow-sm transition self-start sm:self-auto"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة لقائمة الطعام</span>
          </Link>
        </div>

        {items.length === 0 ? (
          /* Empty Cart State */
          <div className="bg-white rounded-3xl p-8 sm:p-14 text-center max-w-xl mx-auto border border-brand-orange/20 shadow-xl space-y-5 sm:space-y-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-brand-orange/10 text-brand-orange flex items-center justify-center mx-auto shadow-inner">
              <ShoppingBag className="w-10 h-10 sm:w-12 sm:h-12" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold font-aref text-brand-brown">
                سلة طلباتك فارغة حالياً
              </h2>
              <p className="text-brand-muted text-xs sm:text-sm max-w-md mx-auto">
                لم تقم بإضافة أي أطباق أو وجبات بعد. تصفح قائمتنا الشهية واختر ما تحبه!
              </p>
            </div>
            <Link
              href="/menu"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-orange to-orange-600 text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl font-bold text-sm shadow-lg shadow-orange-500/25 hover:scale-105 active:scale-95 transition"
            >
              <Utensils className="w-4 h-4" />
              <span>تصفح قائمة الطعام الآن</span>
            </Link>
          </div>
        ) : (
          /* Cart Responsive Grid */
          <div className="grid lg:grid-cols-12 gap-6 sm:gap-8 items-start">
            {/* Left Column: Cart Items List */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-md border border-brand-orange/15">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
                  <h3 className="font-bold font-aref text-lg sm:text-xl text-brand-brown">
                    الأصناف المختارة ({totalCount})
                  </h3>
                  <button
                    onClick={clearCart}
                    className="text-xs font-bold text-red-500 hover:text-red-700 flex items-center gap-1 transition p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>تفريغ السلة</span>
                  </button>
                </div>

                {/* Items List */}
                <div className="divide-y divide-gray-100 space-y-3 sm:space-y-4">
                  {items.map((item: CartItem) => {
                    const itemKey = item.cartItemId || `${item.id}_${item.portion || "whole"}`;
                    return (
                      <div
                        key={itemKey}
                        className="pt-3 sm:pt-4 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-brand-cream/20 sm:bg-transparent p-3 sm:p-0 rounded-2xl sm:rounded-none border sm:border-0 border-brand-orange/10"
                      >
                        {/* Item Title & Portion Badge */}
                        <div className="flex-1 space-y-1">
                          <div className="flex items-start justify-between sm:justify-start gap-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-bold text-brand-brown text-base sm:text-lg leading-tight">
                                {item.name}
                              </h4>
                              {item.portionLabel && (
                                <span className="text-xs bg-amber-100 text-amber-900 border border-amber-300/80 font-bold px-2.5 py-0.5 rounded-lg shadow-xs">
                                  {item.portionLabel}
                                </span>
                              )}
                              {item.badge && (
                                <span className="text-[10px] bg-brand-orange/10 text-brand-orange font-bold px-2 py-0.5 rounded-full border border-brand-orange/20">
                                  {item.badge}
                                </span>
                              )}
                            </div>

                            {/* Mobile-only Trash button at top right */}
                            <button
                              onClick={() => removeFromCart(itemKey)}
                              className="sm:hidden text-gray-400 hover:text-red-500 p-1"
                              title="حذف"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="flex items-center gap-2 flex-wrap text-xs text-brand-orange font-bold font-sans">
                            <span>
                              {typeof item.price === "number" ? `${item.price} ج.م` : item.price}
                            </span>
                            {item.basePrice && item.portion !== "whole" && (
                              <span className="text-gray-400 font-normal text-[11px]">
                                (سعر الكيلو / الكامل: {item.basePrice} ج.م)
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Controls & Subtotal */}
                        <div className="flex items-center justify-between sm:justify-end gap-4 pt-1 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                          {/* Quantity Stepper */}
                          <div className="flex items-center gap-2 bg-brand-cream px-2 py-1 rounded-xl border border-brand-orange/20 shadow-xs">
                            <button
                              onClick={() => updateQuantity(itemKey, item.quantity - 1)}
                              className="w-7 h-7 rounded-lg bg-white hover:bg-red-50 text-brand-brown hover:text-red-600 flex items-center justify-center font-bold transition shadow-xs"
                              aria-label="تقليل"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-5 text-center font-bold text-sm font-sans text-brand-brown">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(itemKey, item.quantity + 1)}
                              className="w-7 h-7 rounded-lg bg-brand-orange text-white hover:bg-orange-600 flex items-center justify-center font-bold transition shadow-xs"
                              aria-label="زيادة"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Total Item Price */}
                          <div className="text-left font-bold text-brand-brown font-sans text-sm sm:text-base min-w-[75px]">
                            {typeof item.price === "number"
                              ? `${item.price * item.quantity} ج.م`
                              : item.price}
                          </div>

                          {/* Desktop Remove Button */}
                          <button
                            onClick={() => removeFromCart(itemKey)}
                            className="hidden sm:inline-flex text-gray-400 hover:text-red-500 p-1.5 transition"
                            title="حذف الصنف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Delivery Form & Checkout Summary */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xl border-2 border-brand-orange/20 space-y-5">
                <h3 className="font-bold font-aref text-xl sm:text-2xl text-brand-brown border-b border-gray-100 pb-3">
                  بيانات استلام الطلب
                </h3>

                <form onSubmit={handleSendWhatsAppOrder} className="space-y-4">
                  {/* Order Type Selector */}
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <button
                      type="button"
                      onClick={() => setOrderType("delivery")}
                      className={`py-3 px-2 sm:px-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 border-2 transition ${
                        orderType === "delivery"
                          ? "bg-brand-orange text-white border-brand-orange shadow-md shadow-orange-500/20"
                          : "bg-brand-cream text-brand-brown border-brand-orange/15 hover:border-brand-orange/40"
                      }`}
                    >
                      <MapPin className="w-4 h-4 shrink-0" />
                      <span>توصيل دليفري</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setOrderType("takeaway")}
                      className={`py-3 px-2 sm:px-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 border-2 transition ${
                        orderType === "takeaway"
                          ? "bg-brand-brown text-white border-brand-brown shadow-md"
                          : "bg-brand-cream text-brand-brown border-brand-orange/15 hover:border-brand-orange/40"
                      }`}
                    >
                      <ShoppingBag className="w-4 h-4 shrink-0" />
                      <span>استلام من الفرع</span>
                    </button>
                  </div>

                  {/* Customer Name */}
                  <div>
                    <label className="block text-xs font-bold text-brand-brown mb-1">
                      الاسم الكريم <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="مثال: مصطفى محمود"
                        className="w-full bg-brand-cream/60 border border-brand-orange/20 rounded-xl p-3 pr-10 text-sm focus:border-brand-orange outline-none"
                      />
                      <User className="w-4 h-4 text-brand-orange absolute top-3.5 right-3" />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-bold text-brand-brown mb-1">
                      رقم الهاتف للتواصل <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="010XXXXXXXX"
                        dir="ltr"
                        className="w-full bg-brand-cream/60 border border-brand-orange/20 rounded-xl p-3 pr-10 text-sm focus:border-brand-orange outline-none text-right font-sans"
                      />
                      <Phone className="w-4 h-4 text-brand-orange absolute top-3.5 right-3" />
                    </div>
                  </div>

                  {/* Delivery Address */}
                  {orderType === "delivery" && (
                    <div>
                      <label className="block text-xs font-bold text-brand-brown mb-1">
                        عنوان التوصيل بالتفصيل في سوهاج <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <textarea
                          required
                          rows={2}
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                          placeholder="الشارع، رقم العمارة، الشقة، وأقرب علامة مميزة..."
                          className="w-full bg-brand-cream/60 border border-brand-orange/20 rounded-xl p-3 pr-10 text-sm focus:border-brand-orange outline-none resize-none"
                        />
                        <MapPin className="w-4 h-4 text-brand-orange absolute top-3.5 right-3" />
                      </div>
                    </div>
                  )}

                  {/* Special Notes */}
                  <div>
                    <label className="block text-xs font-bold text-brand-brown mb-1">
                      ملاحظات خاصة للطلب (اختياري):
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={orderNotes}
                        onChange={(e) => setOrderNotes(e.target.value)}
                        placeholder="مثال: بدون بصل، زيادة طحينة وسلطات..."
                        className="w-full bg-brand-cream/60 border border-brand-orange/20 rounded-xl p-3 pr-10 text-sm focus:border-brand-orange outline-none"
                      />
                      <FileText className="w-4 h-4 text-brand-orange absolute top-3.5 right-3" />
                    </div>
                  </div>

                  {/* Summary Pricing */}
                  <div className="pt-4 border-t border-gray-100 space-y-2 text-sm">
                    <div className="flex justify-between text-brand-muted text-xs sm:text-sm">
                      <span>المجموع الفرعي للأصناف:</span>
                      <span className="font-bold font-sans text-brand-brown">
                        {totalPrice - (orderType === "delivery" ? 25 : 0)} ج.م
                      </span>
                    </div>

                    {orderType === "delivery" && (
                      <div className="flex justify-between text-brand-muted text-xs sm:text-sm">
                        <span>خدمة التوصيل:</span>
                        <span className="font-bold font-sans text-brand-brown">25 ج.م</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center text-base sm:text-lg font-bold text-brand-brown pt-2 border-t border-dashed border-gray-200">
                      <span>الإجمالي النهائي:</span>
                      <span className="text-xl sm:text-2xl font-extrabold text-brand-orange font-sans">
                        {orderType === "delivery" ? totalPrice : totalPrice - 25} ج.م
                      </span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white py-3.5 sm:py-4 rounded-2xl font-bold text-sm shadow-xl shadow-green-500/25 hover:scale-[1.02] active:scale-95 transition flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    <span>إرسال وتأكيد الطلب عبر واتساب</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
