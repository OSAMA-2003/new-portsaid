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
  const finalTotal = totalPrice + deliveryFee;

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
    let msg = `* طلب جديد من موقع مطعم نيو بورسعيد*\n`;
    msg += `----------------------------------------\n`;
    msg += ` *الاسم:* ${customerName}\n`;
    msg += ` *الهاتف:* ${customerPhone}\n`;
    msg += ` *نوع الطلب:* ${orderType === "delivery" ? "توصيل دليفري" : "استلام من المطعم (تيك أواي)"}\n`;
    if (orderType === "delivery") {
      msg += `*العنوان:* ${deliveryAddress}\n`;
    }
    if (orderNotes.trim()) {
      msg += ` *ملاحظات خاصة:* ${orderNotes}\n`;
    }
    msg += `----------------------------------------\n`;
    msg += `*📋 تفاصيل الأصناف:*\n`;

    items.forEach((item: CartItem, index: number) => {
      const priceText = typeof item.price === "number" ? `${item.price * item.quantity} ج.م` : item.price;
      msg += `${index + 1}. *${item.name}* × ${item.quantity} = ${priceText}\n`;
    });

    msg += `----------------------------------------\n`;
    if (orderType === "delivery") {
      msg += ` *المجموع الفرعي:* ${totalPrice} ج.م\n`;
      msg += ` *خدمة التوصيل:* ${deliveryFee} ج.م\n`;
      msg += ` *الإجمالي الكلي:* *${finalTotal} ج.م*\n`;
    } else {
      msg += ` *الإجمالي الكلي:* *${totalPrice} ج.م*\n`;
    }
    msg += `----------------------------------------\n`;
    msg += `شكراً لاختياركم نيو بورسعيد! في انتظار التأكيد 🌟`;

    const whatsappNumber = RESTAURANT_INFO.whatsapp || "201007375151";
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`;

    setOrderSubmitted(true);
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-brand-cream/60 pt-28 pb-20 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-brand-orange/20 pb-6">
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-aref text-brand-brown">
              سلة المأكولات والطلبات
            </h1>
            <p className="text-brand-muted text-sm sm:text-base">
              راجع أصنافك المختارة وأكمل بيانات التوصيل لإرسال طلبك فوراً
            </p>
          </div>

          <Link
            href="/menu"
            className="inline-flex items-center gap-2 bg-white hover:bg-brand-orange hover:text-white text-brand-brown px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm border border-brand-orange/20 shadow-sm transition"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة لقائمة الطعام</span>
          </Link>
        </div>

        {items.length === 0 ? (
          /* Empty Cart State */
          <div className="bg-white rounded-3xl p-12 text-center max-w-xl mx-auto border border-brand-orange/20 shadow-xl space-y-6">
            <div className="w-24 h-24 rounded-full bg-brand-orange/10 text-brand-orange flex items-center justify-center mx-auto shadow-inner">
              <ShoppingBag className="w-12 h-12" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold font-aref text-brand-brown">
                سلة طلباتك فارغة حالياً
              </h2>
              <p className="text-brand-muted text-sm">
                لم تقم بإضافة أي أطباق أو وجبات بعد. تصفح قائمتنا الشهية واختر ما تحبه!
              </p>
            </div>
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-orange to-orange-600 text-white px-8 py-4 rounded-2xl font-bold text-sm shadow-lg shadow-orange-500/25 hover:scale-105 transition"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>تصفح قائمة الطعام الآن</span>
            </Link>
          </div>
        ) : (
          /* Cart Grid */
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Left/Main Column: Cart Items List */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white rounded-3xl p-6 shadow-md border border-brand-orange/15">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
                  <h3 className="font-bold font-aref text-xl text-brand-brown">
                    الأصناف المختارة ({totalCount})
                  </h3>
                  <button
                    onClick={clearCart}
                    className="text-xs font-bold text-red-500 hover:text-red-700 flex items-center gap-1 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>تفريغ السلة</span>
                  </button>
                </div>

                <div className="divide-y divide-gray-100 space-y-4">
                  {items.map((item: CartItem) => (
                    <div key={item.id} className="pt-4 first:pt-0 flex items-center justify-between gap-4">
                      {/* Item Info */}
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-brand-brown text-base sm:text-lg">
                            {item.name}
                          </h4>
                          {item.badge && (
                            <span className="text-[10px] bg-brand-orange/10 text-brand-orange font-bold px-2 py-0.5 rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-brand-orange font-bold font-sans">
                          {typeof item.price === "number" ? `${item.price} ج.م للواحد` : item.price}
                        </p>
                      </div>

                      {/* Quantity Controller */}
                      <div className="flex items-center gap-2 bg-brand-cream p-1.5 rounded-xl border border-brand-orange/20">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 rounded-lg bg-white hover:bg-brand-orange hover:text-white flex items-center justify-center font-bold transition shadow-xs"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-6 text-center font-bold text-sm font-sans text-brand-brown">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 rounded-lg bg-white hover:bg-brand-orange hover:text-white flex items-center justify-center font-bold transition shadow-xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Total Item Price */}
                      <div className="text-left font-bold text-brand-brown font-sans text-sm sm:text-base min-w-[70px]">
                        {typeof item.price === "number" ? `${item.price * item.quantity} ج.م` : item.price}
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-500 p-1.5 transition"
                        title="حذف الصنف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Delivery Information & Checkout Summary */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-brand-orange/20 space-y-6">
                <h3 className="font-bold font-aref text-2xl text-brand-brown border-b border-gray-100 pb-3">
                  بيانات استلام الطلب
                </h3>

                <form onSubmit={handleSendWhatsAppOrder} className="space-y-4">
                  {/* Order Type Selector */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setOrderType("delivery")}
                      className={`py-3 px-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border-2 transition ${orderType === "delivery"
                        ? "bg-brand-orange text-white border-brand-orange shadow-md shadow-orange-500/20"
                        : "bg-brand-cream text-brand-brown border-brand-orange/15 hover:border-brand-orange/40"
                        }`}
                    >
                      <MapPin className="w-4 h-4" />
                      <span>توصيل دليفري</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setOrderType("takeaway")}
                      className={`py-3 px-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border-2 transition ${orderType === "takeaway"
                        ? "bg-brand-brown text-white border-brand-brown shadow-md"
                        : "bg-brand-cream text-brand-brown border-brand-orange/15 hover:border-brand-orange/40"
                        }`}
                    >
                      <ShoppingBag className="w-4 h-4" />
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
                    <div className="flex justify-between text-brand-muted">
                      <span>المجموع الفرعي:</span>
                      <span className="font-bold font-sans text-brand-brown">{totalPrice} ج.م</span>
                    </div>

                    {orderType === "delivery" && (
                      <div className="flex justify-between text-brand-muted">
                        <span>خدمة التوصيل التقديرية:</span>
                        <span className="font-bold font-sans text-brand-brown">{deliveryFee} ج.م</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center text-lg font-bold text-brand-brown pt-2 border-t border-dashed border-gray-200">
                      <span>الإجمالي النهائي:</span>
                      <span className="text-2xl font-extrabold text-brand-orange font-sans">
                        {finalTotal} ج.م
                      </span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white py-4 rounded-2xl font-bold text-sm shadow-xl shadow-green-500/25 hover:scale-[1.02] active:scale-95 transition flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    <span>إرسال وتأكيد الطلب عبر واتساب </span>
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
