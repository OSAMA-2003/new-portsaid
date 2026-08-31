"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type PortionType = "quarter" | "half" | "three_quarters" | "whole";

export interface PortionInfo {
  id: PortionType;
  label: string; // e.g. "ربع (1/4)"
  shortLabel: string; // e.g. "ربع"
  fraction: string; // "1/4"
  multiplier: number; // 0.25
}

export const PORTIONS: Record<PortionType, PortionInfo> = {
  quarter: {
    id: "quarter",
    label: "ربع (1/4)",
    shortLabel: "ربع",
    fraction: "1/4",
    multiplier: 0.25,
  },
  half: {
    id: "half",
    label: "نصف (1/2)",
    shortLabel: "نصف",
    fraction: "1/2",
    multiplier: 0.5,
  },
  three_quarters: {
    id: "three_quarters",
    label: "ثلاثة أرباع (3/4)",
    shortLabel: "3/4",
    fraction: "3/4",
    multiplier: 0.75,
  },
  whole: {
    id: "whole",
    label: "كامل / كيلو (1)",
    shortLabel: "كامل",
    fraction: "1",
    multiplier: 1,
  },
};

export const PORTION_KEYS: PortionType[] = ["quarter", "half", "three_quarters", "whole"];

export function calculatePortionPrice(basePrice: number | string, portion: PortionType = "whole"): number {
  if (typeof basePrice === "string" && (basePrice === "يومي" || isNaN(Number(basePrice)))) {
    return 0;
  }
  const numericPrice = typeof basePrice === "number" ? basePrice : Number(basePrice) || 0;
  const config = PORTIONS[portion] || PORTIONS.whole;
  return Math.round(numericPrice * config.multiplier);
}

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
  cartItemId: string; // e.g. "g-1_half"
  basePrice: number | string; // original price
  portion: PortionType;
  portionLabel: string;
  portionFraction: string;
  quantity: number;
  specialInstructions?: string;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (
    item: MenuItem,
    quantity?: number,
    portion?: PortionType,
    specialInstructions?: string
  ) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  getItemPortionQty: (itemId: string, portion: PortionType) => number;
  getItemTotalQty: (itemId: string) => number;
  totalCount: number;
  subtotal: number;
  deliveryFee: number;
  totalPrice: number;
  generateWhatsAppMessage: (customerInfo?: {
    name?: string;
    phone?: string;
    address?: string;
    notes?: string;
    orderType?: "delivery" | "takeaway";
  }) => string;
  sendWhatsAppOrder: (customerInfo?: {
    name?: string;
    phone?: string;
    address?: string;
    notes?: string;
    orderType?: "delivery" | "takeaway";
  }) => void;
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
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const normalizedItems: CartItem[] = parsed.map((item: any) => {
            const portion: PortionType = item.portion || "whole";
            const portionConfig = PORTIONS[portion] || PORTIONS.whole;
            const basePrice = item.basePrice ?? item.price;
            const calculatedPrice =
              typeof item.price === "number" && item.basePrice
                ? item.price
                : calculatePortionPrice(basePrice, portion);
            return {
              ...item,
              cartItemId: item.cartItemId || `${item.id}_${portion}`,
              basePrice,
              price: calculatedPrice,
              portion,
              portionLabel: item.portionLabel || portionConfig.label,
              portionFraction: item.portionFraction || portionConfig.fraction,
              quantity: item.quantity || 1,
            };
          });
          setItems(normalizedItems);
        }
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

  const addToCart = (
    item: MenuItem,
    quantity = 1,
    portion: PortionType = "whole",
    specialInstructions = ""
  ) => {
    const portionConfig = PORTIONS[portion] || PORTIONS.whole;
    const cartItemId = `${item.id}_${portion}`;
    const calculatedPrice = calculatePortionPrice(item.price, portion);

    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => (i.cartItemId || i.id) === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
          specialInstructions: specialInstructions || updated[existingIndex].specialInstructions,
        };
        return updated;
      } else {
        const newItem: CartItem = {
          ...item,
          cartItemId,
          basePrice: item.price,
          price: calculatedPrice,
          portion,
          portionLabel: portionConfig.label,
          portionFraction: portionConfig.fraction,
          quantity,
          specialInstructions,
        };
        return [...prev, newItem];
      }
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setItems((prev) => prev.filter((i) => (i.cartItemId || i.id) !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        (item.cartItemId || item.id) === cartItemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getItemPortionQty = (itemId: string, portion: PortionType) => {
    const cartItemId = `${itemId}_${portion}`;
    const found = items.find((i) => (i.cartItemId || i.id) === cartItemId);
    return found ? found.quantity : 0;
  };

  const getItemTotalQty = (itemId: string) => {
    return items
      .filter((i) => i.id === itemId)
      .reduce((acc, curr) => acc + curr.quantity, 0);
  };

  const totalCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => {
    const numPrice = typeof item.price === "number" ? item.price : 0;
    return acc + numPrice * item.quantity;
  }, 0);
  const deliveryFee = subtotal > 0 ? 25 : 0;
  const totalPrice = subtotal + deliveryFee;

  const generateWhatsAppMessage = (customerInfo = {}) => {
    const { name, phone, address, notes, orderType } = customerInfo as {
      name?: string;
      phone?: string;
      address?: string;
      notes?: string;
      orderType?: "delivery" | "takeaway";
    };

    let msg = `🌟 *طلب جديد من الموقع - مطعم نيو بورسعيد* 🌟\n\n`;
    if (name) msg += `👤 *الاسم:* ${name}\n`;
    if (phone) msg += `📞 *الهاتف:* ${phone}\n`;
    if (orderType)
      msg += `🛵 *نوع الطلب:* ${
        orderType === "delivery" ? "توصيل دليفري" : "استلام من المطعم (تيك أواي)"
      }\n`;
    if (address && orderType !== "takeaway") msg += `📍 *العنوان:* ${address}\n`;
    msg += `-----------------------------\n`;
    msg += `📋 *تفاصيل الطلب:*\n`;

    items.forEach((item, index) => {
      const portionText = item.portionLabel ? ` (${item.portionLabel})` : "";
      const itemPriceText =
        typeof item.price === "number"
          ? `${item.price * item.quantity} ج.م`
          : `${item.price}`;
      msg += `${index + 1}. *${item.name}*${portionText} × ${item.quantity} = ${itemPriceText}\n`;
      if (item.specialInstructions) {
        msg += `   ملاحظة: ${item.specialInstructions}\n`;
      }
    });

    msg += `-----------------------------\n`;
    msg += `💵 *المجموع الفرعي:* ${subtotal} ج.م\n`;
    if (orderType !== "takeaway" && deliveryFee > 0) {
      msg += `🛵 *خدمة التوصيل:* ${deliveryFee} ج.م\n`;
    }
    const finalTotal = orderType === "takeaway" ? subtotal : totalPrice;
    msg += `🔥 *الإجمالي النهائي:* ${finalTotal} ج.م\n`;

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
        getItemPortionQty,
        getItemTotalQty,
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
