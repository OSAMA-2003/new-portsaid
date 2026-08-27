"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface MenuItem {
  id: string;
  name: string;
  category?: string;
  price: number | string;
  description?: string;
  image?: string;
  badge?: string;
  isSpicy?: boolean;
  calories?: number;
  preparationTime?: string;
  isDaily?: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
  specialInstructions?: string;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (item: MenuItem, quantity?: number, specialInstructions?: string) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  totalCount: number;
  subtotal: number;
  deliveryFee: number;
  totalPrice: number;
  generateWhatsAppMessage: (customerInfo?: { name?: string; phone?: string; address?: string; notes?: string }) => string;
  sendWhatsAppOrder: (customerInfo?: { name?: string; phone?: string; address?: string; notes?: string }) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const RESTAURANT_WHATSAPP_NUMBER = "201007375151"; // Real Restaurant WhatsApp Phone

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load cart from localStorage on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("new_portsaid_cart");
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load cart", e);
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("new_portsaid_cart", JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save cart", e);
    }
  }, [items]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const addToCart = (item: MenuItem, quantity = 1, specialInstructions = "") => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.id === item.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
          specialInstructions: specialInstructions || updated[existingIndex].specialInstructions,
        };
        return updated;
      } else {
        return [...prev, { ...item, quantity, specialInstructions }];
      }
    });
  };

  const removeFromCart = (itemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => {
    const numPrice = typeof item.price === "number" ? item.price : 0;
    return acc + numPrice * item.quantity;
  }, 0);
  const deliveryFee = subtotal > 0 ? 25 : 0;
  const totalPrice = subtotal + deliveryFee;

  const generateWhatsAppMessage = (customerInfo = {}) => {
    const { name, phone, address, notes } = customerInfo as {
      name?: string;
      phone?: string;
      address?: string;
      notes?: string;
    };

    let msg = `🌟 *طلب جديد من الموقع - مطعم نيو بورسعيد* 🌟\n\n`;
    if (name) msg += `👤 *الاسم:* ${name}\n`;
    if (phone) msg += `📞 *الهاتف:* ${phone}\n`;
    if (address) msg += `📍 *العنوان:* ${address}\n`;
    msg += `-----------------------------\n`;
    msg += `📋 *تفاصيل الطلب:*\n`;

    items.forEach((item, index) => {
      const itemPriceText =
        typeof item.price === "number"
          ? `${item.price * item.quantity} ج.م`
          : `${item.price}`;
      msg += `${index + 1}. ${item.name} × ${item.quantity} = ${itemPriceText}\n`;
      if (item.specialInstructions) {
        msg += `   ملاحظة: ${item.specialInstructions}\n`;
      }
    });

    msg += `-----------------------------\n`;
    msg += `💵 *المجموع الفرعي:* ${subtotal} ج.م\n`;
    msg += `🛵 *خدمة التوصيل:* ${deliveryFee} ج.م\n`;
    msg += `🔥 *الإجمالي النهائي:* ${totalPrice} ج.م\n`;

    if (notes) {
      msg += `\n📝 *ملاحظات إضافية:* ${notes}\n`;
    }
    msg += `\nأكل بشوات - شكراً لاختياركم مطعم نيو بورسعيد! ❤️`;

    return encodeURIComponent(msg);
  };

  const sendWhatsAppOrder = (customerInfo = {}) => {
    const encoded = generateWhatsAppMessage(customerInfo);
    const url = `https://wa.me/${RESTAURANT_WHATSAPP_NUMBER}?text=${encoded}`;
    window.open(url, "_blank");
  };

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart,
        closeCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalCount,
        subtotal,
        deliveryFee,
        totalPrice,
        generateWhatsAppMessage,
        sendWhatsAppOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
