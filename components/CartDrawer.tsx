"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, Trash2, Plus, Minus, Send, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";

export const CartDrawer: React.FC = () => {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    deliveryFee,
    totalPrice,
    sendWhatsAppOrder,
  } = useCart();

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [orderNotes, setOrderNotes] = useState("");

  if (!isOpen) return null;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    sendWhatsAppOrder({
      name: customerName,
      phone: customerPhone,
      address: customerAddress,
      notes: orderNotes,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="absolute inset-0" onClick={closeCart} />

      <div className="fixed inset-y-0 left-0 max-w-full flex">
        <div className="w-screen max-w-md bg-brand-cream shadow-2xl flex flex-col justify-between overflow-hidden border-r border-brand-orange/20 animate-in slide-in-from-left duration-300">
          {/* Header */}
          <div className="p-5 bg-white border-b border-brand-orange/20 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-orange/15 text-brand-orange flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold font-serif text-brand-brown">سلة طلباتك</h2>
                <p className="text-xs text-brand-muted">
                  {items.length > 0 ? `${items.length} أصناف مختارة` : "السلة فارغة"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {items.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs font-semibold text-red-600 hover:text-red-700 px-2 py-1 rounded bg-red-50 hover:bg-red-100 transition-colors"
                  title="تفريغ السلة"
                >
                  تفريغ
                </button>
              )}
              <button
                onClick={closeCart}
                className="p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-20 h-20 rounded-full bg-brand-orange/10 text-brand-orange mx-auto flex items-center justify-center mb-4">
                  <ShoppingBag className="w-10 h-10 opacity-70" />
                </div>
                <h3 className="text-xl font-bold font-serif text-brand-brown mb-2">
                  سلتك لسه فاضية!
                </h3>
                <p className="text-sm text-brand-muted max-w-xs mx-auto mb-6">
                  استكشف ألذ مشويات وطواجن نيو بورسعيد وأضف أطباقك المفضلة لبدء طلبك.
                </p>
                <button
                  onClick={closeCart}
                  className="inline-flex items-center gap-2 bg-brand-orange text-white px-6 py-3 rounded-full font-bold text-sm shadow-md hover:bg-orange-600 transition"
                >
                  <span>تصفح القائمة الآن</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-white rounded-2xl border border-brand-orange/15 shadow-sm flex gap-3 relative group"
                  >
                    <div className="w-20 h-20 rounded-xl overflow-hidden relative shrink-0 bg-gray-100">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="font-bold text-sm text-brand-brown leading-snug line-clamp-1">
                            {item.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                            title="حذف"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-xs font-bold text-brand-orange mt-0.5">
                          {item.price} ج.م
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                        {/* Quantity controls */}
                        <div className="flex items-center gap-2 bg-brand-cream px-2 py-1 rounded-lg border border-brand-orange/20">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 rounded bg-white text-brand-brown flex items-center justify-center font-bold text-xs hover:bg-brand-orange hover:text-white transition shadow-xs"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 rounded bg-white text-brand-brown flex items-center justify-center font-bold text-xs hover:bg-brand-orange hover:text-white transition shadow-xs"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="font-bold text-sm text-brand-brown">
                          {(typeof item.price === "number" ? item.price : 0) * item.quantity} ج.م
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer & Checkout Form */}
          {items.length > 0 && (
            <div className="p-5 bg-white border-t border-brand-orange/20 shadow-lg space-y-4">
              {/* Quick Customer Info */}
              <div className="space-y-2.5 bg-brand-cream/60 p-3.5 rounded-2xl border border-brand-orange/15">
                <p className="text-xs font-bold text-brand-brown flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
                  بيانات التوصيل السريع (اختياري):
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="الاسم الكريم"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full text-xs bg-white border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-brand-orange"
                  />
                  <input
                    type="tel"
                    placeholder="رقم الهاتف"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full text-xs bg-white border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-brand-orange"
                  />
                </div>
                <input
                  type="text"
                  placeholder="العنوان بالتفصيل (الشارع - العمارة - الدور)"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="w-full text-xs bg-white border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-brand-orange"
                />
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-brand-muted">
                <div className="flex justify-between">
                  <span>المجموع الفرعي:</span>
                  <span className="font-semibold text-brand-brown">{subtotal} ج.م</span>
                </div>
                <div className="flex justify-between">
                  <span>رسوم التوصيل المقدرة:</span>
                  <span className="font-semibold text-brand-brown">{deliveryFee} ج.م</span>
                </div>
                <div className="flex justify-between text-base font-bold text-brand-brown pt-2 border-t border-gray-100">
                  <span className="font-serif">الإجمالي النهائي:</span>
                  <span className="text-brand-orange font-sans">{totalPrice} ج.م</span>
                </div>
              </div>

              {/* Direct WhatsApp Order CTA */}
              <button
                onClick={handleCheckout}
                className="w-full bg-[#25D366] hover:bg-[#1EBE5D] text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-green-600/20 hover:scale-[1.01] active:scale-[0.99] transition-all"
              >
                <Send className="w-4 h-4" />
                <span>إرسال الطلب عبر واتساب مباشرة</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
