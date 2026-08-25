"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Lock,
  Unlock,
  KeyRound,
  LayoutDashboard,
  UtensilsCrossed,
  Layers,
  Settings,
  Database,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Search,
  RefreshCw,
  Eye,
  EyeOff,
  Save,
  Phone,
  MapPin,
  Clock,
  Sparkles,
  ExternalLink,
  Copy,
  AlertCircle,
  CheckCircle2,
  SlidersHorizontal,
} from "lucide-react";
import {
  getMenuCategoriesWithItems,
  getRestaurantSettings,
  updateRestaurantSettings,
  upsertMenuItem,
  deleteMenuItem,
  upsertCategory,
  deleteCategory,
  seedDatabaseFromDataJS,
  DbCategory,
  DbMenuItem,
  DbRestaurantSettings,
} from "@/lib/dbService";

export default function AdminPage() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [savedPin, setSavedPin] = useState("1234");
  const [authError, setAuthError] = useState("");

  // Navigation Tab State
  const [activeTab, setActiveTab] = useState<"items" | "categories" | "settings" | "database">("items");

  // Data States
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<DbCategory[]>([]);
  const [settings, setSettings] = useState<DbRestaurantSettings | null>(null);

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("all");

  // Item Modal State
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<DbMenuItem> | null>(null);

  // Category Modal State
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<DbCategory> | null>(null);

  // Feedback Toast
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Seeding Status
  const [seedingLoading, setSeedingLoading] = useState(false);

  // Load Saved Pin & Auth from Session
  useEffect(() => {
    const localPin = localStorage.getItem("new_portsaid_admin_pin");
    if (localPin) setSavedPin(localPin);

    const authSession = sessionStorage.getItem("new_portsaid_admin_auth");
    if (authSession === "true") setIsAuthenticated(true);
  }, []);

  // Fetch Data when Authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
    }
  }, [isAuthenticated]);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [cats, setts] = await Promise.all([
        getMenuCategoriesWithItems(),
        getRestaurantSettings(),
      ]);
      setCategories(cats);
      setSettings(setts);
    } catch (err: any) {
      console.error("Error loading data:", err);
      showToast("تعذر جلب البيانات من السيرفر. يتم استخدام البيانات المخزنة.", "error");
    } finally {
      setLoading(false);
    }
  };

  // PIN Login Handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === savedPin) {
      setIsAuthenticated(true);
      sessionStorage.setItem("new_portsaid_admin_auth", "true");
      setAuthError("");
    } else {
      setAuthError("رمز المرور غير صحيح. الرمز الافتراضي هو 1234");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("new_portsaid_admin_auth");
    setPinInput("");
  };

  // Change PIN Handler
  const handleChangePin = () => {
    const newPin = prompt("أدخل رمز المرور الجديد (٤ أرقام أو أكثر):");
    if (newPin && newPin.trim().length >= 4) {
      setSavedPin(newPin.trim());
      localStorage.setItem("new_portsaid_admin_pin", newPin.trim());
      showToast("تم تحديث رمز الدخول بنجاح!");
    } else if (newPin) {
      alert("يجب أن يتكون رمز المرور من 4 خانات على الأقل.");
    }
  };

  // ----------------------------------------------------
  // ITEM HANDLERS
  // ----------------------------------------------------
  const handleOpenItemModal = (item?: DbMenuItem, defaultCategoryId?: string) => {
    if (item) {
      setEditingItem({ ...item });
    } else {
      setEditingItem({
        id: "",
        category_id: defaultCategoryId || (categories[0]?.id ?? "grills"),
        name: "",
        price: 0,
        is_daily: false,
        badge: "",
        description: "",
        image: "",
        is_available: true,
      });
    }
    setItemModalOpen(true);
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.name.trim()) {
      showToast("يرجى كتابة اسم الطبق أولاً", "error");
      return;
    }

    try {
      await upsertMenuItem({
        id: editingItem.id?.trim() || undefined,
        category_id: editingItem.category_id || categories[0]?.id || "grills",
        name: editingItem.name.trim(),
        price: editingItem.is_daily ? "يومي" : Number(editingItem.price) || 0,
        is_daily: editingItem.is_daily,
        badge: editingItem.badge,
        description: editingItem.description,
        image: editingItem.image,
        is_available: editingItem.is_available ?? true,
      });
      setItemModalOpen(false);
      showToast("تم حفظ بيانات الطبق بنجاح!");
      await loadAllData();
    } catch (err: any) {
      console.error("Save item error:", err);
      showToast(err?.message ? `خطأ: ${err.message}` : "حدث خطأ أثناء الحفظ في قاعدة البيانات.", "error");
    }
  };

  const handleDeleteItem = async (itemId: string, itemName: string) => {
    if (!confirm(`هل أنت متأكد من حذف طبق "${itemName}"؟`)) return;

    try {
      await deleteMenuItem(itemId);
      showToast(`تم حذف طبق "${itemName}"`);
      loadAllData();
    } catch (err: any) {
      console.error(err);
      showToast("تعذر حذف الطبق", "error");
    }
  };

  const handleToggleItemAvailability = async (item: DbMenuItem) => {
    try {
      const updatedStatus = !item.is_available;
      await upsertMenuItem({
        ...item,
        is_available: updatedStatus,
      });
      showToast(updatedStatus ? `تم تفعيل طبق "${item.name}"` : `تم إيقاف توفر طبق "${item.name}"`);
      loadAllData();
    } catch (err: any) {
      console.error(err);
      showToast("تعذر تحديث حالة الطبق", "error");
    }
  };

  // ----------------------------------------------------
  // CATEGORY HANDLERS
  // ----------------------------------------------------
  const handleOpenCategoryModal = (cat?: DbCategory) => {
    if (cat) {
      setEditingCategory({ ...cat });
    } else {
      setEditingCategory({
        id: "",
        title: "",
        titleEn: "",
        image: "",
        description: "",
        icon: "Flame",
      });
    }
    setCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editingCategory.title) return;

    try {
      await upsertCategory({
        id: editingCategory.id,
        title: editingCategory.title,
        titleEn: editingCategory.titleEn,
        image: editingCategory.image,
        description: editingCategory.description,
        icon: editingCategory.icon,
      });
      setCategoryModalOpen(false);
      showToast("تم حفظ بيانات القسم بنجاح!");
      loadAllData();
    } catch (err: any) {
      console.error(err);
      showToast("حدث خطأ أثناء حفظ القسم", "error");
    }
  };

  const handleDeleteCategory = async (catId: string, title: string) => {
    if (!confirm(`تحذير: حذف قسم "${title}" سيحذف جميع الأصناف التابعة له. هل أنت متأكد؟`)) return;

    try {
      await deleteCategory(catId);
      showToast(`تم حذف قسم "${title}"`);
      loadAllData();
    } catch (err: any) {
      console.error(err);
      showToast("تعذر حذف القسم", "error");
    }
  };

  // ----------------------------------------------------
  // SETTINGS HANDLERS
  // ----------------------------------------------------
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    try {
      await updateRestaurantSettings(settings);
      showToast("تم حفظ معلومات المطعم بنجاح!");
    } catch (err: any) {
      console.error(err);
      showToast("حدث خطأ أثناء حفظ الإعدادات", "error");
    }
  };

  // ----------------------------------------------------
  // DATABASE SEEDING
  // ----------------------------------------------------
  const handleSeedDatabase = async () => {
    if (!confirm("هل تريد نقل جميع الأقسام والأصناف من المنيو إلى قاعدة بيانات Supabase؟")) return;

    setSeedingLoading(true);
    try {
      const res = await seedDatabaseFromDataJS();
      showToast(res.message);
      loadAllData();
    } catch (err: any) {
      console.error(err);
      alert(err.message);
      showToast("فشلت عملية النقل. يرجى تشغيل سكربت SQL في Supabase أولاً.", "error");
    } finally {
      setSeedingLoading(false);
    }
  };

  // All Items Flat Array for Filtering & Management
  const allItems = categories.flatMap((cat) =>
    (cat.items || []).map((itm) => ({
      ...itm,
      categoryTitle: cat.title,
    }))
  );

  const filteredItems = allItems.filter((itm) => {
    const matchesCat = selectedCategoryFilter === "all" || itm.category_id === selectedCategoryFilter;
    const matchesQuery =
      !searchQuery.trim() ||
      itm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (itm.description && itm.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesQuery;
  });

  // ----------------------------------------------------
  // 1. PIN LOGIN SCREEN
  // ----------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-brand-cream/80 flex items-center justify-center p-4 pt-20">
        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10 max-w-md w-full border-2 border-brand-orange/30 text-center space-y-6 animate-in zoom-in-95 duration-300">
          <div className="w-20 h-20 bg-brand-orange/15 text-brand-orange rounded-3xl flex items-center justify-center mx-auto shadow-inner border border-brand-orange/30">
            <Lock className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold font-aref text-brand-brown">
              لوحة تحكم مطعم نيو بورسعيد
            </h1>
            <p className="text-xs sm:text-sm text-brand-muted">
              أدخل رمز المرور (PIN) للوصول إلى إدارة المنيو والمنتجات
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                maxLength={8}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="أدخل رمز الدخول (الافتراضي: 1234)"
                autoFocus
                className="w-full text-center text-2xl tracking-[0.5em] font-sans py-3.5 px-4 rounded-2xl border-2 border-brand-orange/30 focus:border-brand-orange outline-none bg-brand-cream/40"
              />
            </div>

            {authError && (
              <div className="text-xs text-red-600 font-bold bg-red-50 p-2.5 rounded-xl border border-red-200">
                {authError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-brand-orange to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              تسجيل الدخول للوحة التحكم
            </button>
          </form>

          <div className="text-xs text-brand-muted border-t border-gray-100 pt-4 flex items-center justify-between">
            <Link href="/" className="text-brand-orange hover:underline">
              ← العودة للموقع
            </Link>
            <span>رمز PIN الافتراضي: 1234</span>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // 2. MAIN ADMIN DASHBOARD
  // ----------------------------------------------------
  return (
    <div className="min-h-screen bg-brand-cream/40 pb-20 pt-24 sm:pt-28">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl shadow-2xl font-bold text-sm flex items-center gap-2 animate-in slide-in-from-top duration-300 text-white ${
            toastMessage.type === "success" ? "bg-green-600 shadow-green-500/30" : "bg-red-600 shadow-red-500/30"
          }`}
        >
          {toastMessage.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header & Fast Actions */}
        <div className="bg-gradient-to-r from-brand-dark via-brand-dark/95 to-brand-brown text-white p-6 sm:p-8 rounded-3xl shadow-xl border-2 border-brand-orange/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-brand-orange text-white text-xs font-bold px-3 py-1 rounded-full">
                لوحة الإدارة السحابية
              </span>
              <span className="text-xs text-amber-300">Supabase Connected 🟢</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold font-aref text-white">
              لوحة تحكم مطعم نيو بورسعيد
            </h1>
            <p className="text-white/80 text-xs sm:text-sm">
              إدارة المنتجات، قوائم الطعام، التصنيفات، ومعلومات الاتصال المباشرة
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={loadAllData}
              disabled={loading}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl text-white border border-white/20 transition flex items-center gap-2 text-xs font-bold"
              title="تحديث البيانات"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              <span>تحديث</span>
            </button>

            <button
              onClick={handleChangePin}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl text-white border border-white/20 transition flex items-center gap-2 text-xs font-bold"
            >
              <KeyRound className="w-4 h-4 text-amber-300" />
              <span>تغيير الـ PIN</span>
            </button>

            <Link
              href="/menu"
              target="_blank"
              className="p-3 bg-brand-orange hover:bg-orange-600 rounded-2xl text-white font-bold text-xs flex items-center gap-2 transition shadow-md"
            >
              <ExternalLink className="w-4 h-4" />
              <span>عرض المنيو الحي</span>
            </Link>

            <button
              onClick={handleLogout}
              className="p-3 bg-red-600/80 hover:bg-red-600 rounded-2xl text-white font-bold text-xs flex items-center gap-2 transition"
            >
              <Lock className="w-4 h-4" />
              <span>خروج</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-brand-orange/15 space-y-1">
            <div className="flex items-center justify-between text-brand-muted text-xs">
              <span>إجمالي الأقسام</span>
              <Layers className="w-4 h-4 text-brand-orange" />
            </div>
            <p className="text-3xl font-extrabold font-sans text-brand-brown">{categories.length}</p>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-brand-orange/15 space-y-1">
            <div className="flex items-center justify-between text-brand-muted text-xs">
              <span>إجمالي الأطباق</span>
              <UtensilsCrossed className="w-4 h-4 text-brand-orange" />
            </div>
            <p className="text-3xl font-extrabold font-sans text-brand-brown">{allItems.length}</p>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-brand-orange/15 space-y-1">
            <div className="flex items-center justify-between text-brand-muted text-xs">
              <span>الأطباق المتاحة</span>
              <span className="text-green-600 font-bold text-xs">متاح 🟢</span>
            </div>
            <p className="text-3xl font-extrabold font-sans text-green-600">
              {allItems.filter((i) => i.is_available !== false).length}
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-brand-orange/15 space-y-1">
            <div className="flex items-center justify-between text-brand-muted text-xs">
              <span>غير متوفر حالياً</span>
              <span className="text-red-500 font-bold text-xs">نفذت الكمية 🔴</span>
            </div>
            <p className="text-3xl font-extrabold font-sans text-red-500">
              {allItems.filter((i) => i.is_available === false).length}
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 hide-scrollbar border-b border-brand-orange/20">
          <button
            onClick={() => setActiveTab("items")}
            className={`px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all shrink-0 ${
              activeTab === "items"
                ? "bg-brand-orange text-white shadow-lg shadow-orange-500/25"
                : "bg-white text-brand-brown hover:bg-brand-orange/10 border border-brand-orange/15"
            }`}
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>إدارة الأطباق والمنيو ({allItems.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("categories")}
            className={`px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all shrink-0 ${
              activeTab === "categories"
                ? "bg-brand-orange text-white shadow-lg shadow-orange-500/25"
                : "bg-white text-brand-brown hover:bg-brand-orange/10 border border-brand-orange/15"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>إدارة الأقسام ({categories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all shrink-0 ${
              activeTab === "settings"
                ? "bg-brand-orange text-white shadow-lg shadow-orange-500/25"
                : "bg-white text-brand-brown hover:bg-brand-orange/10 border border-brand-orange/15"
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>بيانات المطعم والاتصال</span>
          </button>

          <button
            onClick={() => setActiveTab("database")}
            className={`px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all shrink-0 ${
              activeTab === "database"
                ? "bg-brand-orange text-white shadow-lg shadow-orange-500/25"
                : "bg-white text-brand-brown hover:bg-brand-orange/10 border border-brand-orange/15"
            }`}
          >
            <Database className="w-4 h-4" />
            <span>التهيئة وربط Supabase</span>
          </button>
        </div>

        {/* ---------------------------------------------------- */}
        {/* TAB 1: MENU ITEMS MANAGEMENT */}
        {/* ---------------------------------------------------- */}
        {activeTab === "items" && (
          <div className="space-y-6">
            {/* Search, Filter & Add Item Button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="flex flex-1 items-center gap-3">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ابحث عن طبق أو وصف..."
                    className="w-full bg-white pr-10 pl-4 py-2.5 rounded-xl border border-brand-orange/20 focus:border-brand-orange outline-none text-sm"
                  />
                  <Search className="w-4 h-4 text-brand-orange absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Category Filter */}
                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  className="bg-white px-4 py-2.5 rounded-xl border border-brand-orange/20 focus:border-brand-orange outline-none text-sm font-bold text-brand-brown"
                >
                  <option value="all">كل الأقسام ({allItems.length})</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} ({c.items?.length || 0})
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => handleOpenItemModal()}
                className="bg-gradient-to-r from-brand-orange to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 transition"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة طبق جديد</span>
              </button>
            </div>

            {/* Items Table */}
            <div className="bg-white rounded-3xl shadow-xl border border-brand-orange/15 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-sm">
                  <thead className="bg-brand-cream/80 text-brand-brown font-bold border-b border-brand-orange/15 text-xs">
                    <tr>
                      <th className="p-4">اسم الطبق</th>
                      <th className="p-4">القسم</th>
                      <th className="p-4">السعر</th>
                      <th className="p-4">الشارة</th>
                      <th className="p-4">الحالة</th>
                      <th className="p-4 text-center">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredItems.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-brand-muted">
                          لا توجد نتائج مطابقة لبحثك.
                        </td>
                      </tr>
                    ) : (
                      filteredItems.map((item) => (
                        <tr
                          key={item.id}
                          className={`hover:bg-brand-cream/30 transition ${
                            item.is_available === false ? "opacity-60 bg-gray-50" : ""
                          }`}
                        >
                          <td className="p-4">
                            <div className="font-bold text-brand-brown font-aref text-base">{item.name}</div>
                            {item.description && (
                              <div className="text-xs text-brand-muted line-clamp-1 max-w-xs">{item.description}</div>
                            )}
                          </td>

                          <td className="p-4">
                            <span className="bg-brand-orange/10 text-brand-orange text-xs font-bold px-2.5 py-1 rounded-lg">
                              {item.categoryTitle}
                            </span>
                          </td>

                          <td className="p-4 font-bold font-sans text-brand-brown">
                            {item.is_daily || item.price === "يومي" ? (
                              <span className="text-xs text-brand-orange">يومي</span>
                            ) : (
                              <span>{item.price} ج.م</span>
                            )}
                          </td>

                          <td className="p-4">
                            {item.badge ? (
                              <span className="bg-brand-gold/20 text-brand-brown text-[11px] font-bold px-2 py-0.5 rounded-full border border-brand-gold/40">
                                {item.badge}
                              </span>
                            ) : (
                              <span className="text-gray-300">-</span>
                            )}
                          </td>

                          <td className="p-4">
                            <button
                              onClick={() => handleToggleItemAvailability(item)}
                              className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 transition shadow-xs ${
                                item.is_available !== false
                                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                                  : "bg-red-100 text-red-700 hover:bg-red-200"
                              }`}
                            >
                              {item.is_available !== false ? (
                                <>
                                  <Check className="w-3 h-3" />
                                  <span>متاح</span>
                                </>
                              ) : (
                                <>
                                  <X className="w-3 h-3" />
                                  <span>غير متوفر</span>
                                </>
                              )}
                            </button>
                          </td>

                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleOpenItemModal(item)}
                                className="p-2 rounded-xl bg-gray-100 hover:bg-brand-orange hover:text-white text-gray-700 transition"
                                title="تعديل"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => handleDeleteItem(item.id, item.name)}
                                className="p-2 rounded-xl bg-red-50 hover:bg-red-600 hover:text-white text-red-600 transition"
                                title="حذف"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 2: CATEGORIES MANAGEMENT */}
        {/* ---------------------------------------------------- */}
        {activeTab === "categories" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold font-aref text-brand-brown">أقسام قائمة الطعام ({categories.length})</h3>
                <p className="text-xs text-brand-muted">يمكنك تعديل صور الأغلفة والأسماء والأوصاف لكل قسم</p>
              </div>

              <button
                onClick={() => handleOpenCategoryModal()}
                className="bg-brand-orange hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow flex items-center gap-2 transition"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة قسم جديد</span>
              </button>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="bg-white rounded-3xl overflow-hidden shadow-lg border border-brand-orange/15 flex flex-col justify-between group hover:border-brand-orange/40 transition"
                >
                  <div className="relative h-44 w-full bg-gray-100">
                    <img src={cat.image} alt={cat.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute bottom-3 right-4 text-white">
                      <span className="text-[10px] text-amber-300 font-bold uppercase">{cat.titleEn}</span>
                      <h4 className="font-aref font-bold text-2xl">{cat.title}</h4>
                    </div>
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-white text-xs font-bold">
                      {cat.items?.length || 0} طبق
                    </div>
                  </div>

                  <div className="p-5 space-y-4">
                    <p className="text-xs text-brand-muted line-clamp-2">{cat.description}</p>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <button
                        onClick={() => handleOpenItemModal(undefined, cat.id)}
                        className="text-xs font-bold text-brand-orange hover:underline flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>أضف طبق لهذا القسم</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenCategoryModal(cat)}
                          className="p-2 rounded-xl bg-gray-100 hover:bg-brand-orange hover:text-white transition"
                          title="تعديل القسم"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat.id, cat.title)}
                          className="p-2 rounded-xl bg-red-50 hover:bg-red-600 hover:text-white text-red-600 transition"
                          title="حذف القسم"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 3: RESTAURANT & CONTACT SETTINGS */}
        {/* ---------------------------------------------------- */}
        {activeTab === "settings" && settings && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-brand-orange/15 space-y-6 max-w-4xl mx-auto">
            <div>
              <h3 className="text-2xl font-bold font-aref text-brand-brown">بيانات ومعلومات المطعم</h3>
              <p className="text-xs sm:text-sm text-brand-muted">
                تظهر هذه البيانات في الهيدر والفوتر والواتساب وحسابات التواصل
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-brand-brown mb-1.5">اسم المطعم (عربي)</label>
                  <input
                    type="text"
                    value={settings.name}
                    onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                    className="w-full bg-brand-cream/40 p-3 rounded-xl border border-brand-orange/20 focus:border-brand-orange outline-none text-sm font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-brown mb-1.5">اسم المطعم (English)</label>
                  <input
                    type="text"
                    value={settings.name_en}
                    onChange={(e) => setSettings({ ...settings, name_en: e.target.value })}
                    className="w-full bg-brand-cream/40 p-3 rounded-xl border border-brand-orange/20 focus:border-brand-orange outline-none text-sm font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-brown mb-1.5">الشعار التسويقي (Tagline)</label>
                <input
                  type="text"
                  value={settings.tagline}
                  onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                  className="w-full bg-brand-cream/40 p-3 rounded-xl border border-brand-orange/20 focus:border-brand-orange outline-none text-sm"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-brand-brown mb-1.5">رقم الواتساب للطلبات (دولي بدون +)</label>
                  <input
                    type="text"
                    value={settings.whatsapp}
                    onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                    className="w-full bg-brand-cream/40 p-3 rounded-xl border border-brand-orange/20 focus:border-brand-orange outline-none text-sm font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-brown mb-1.5">أرقام الهواتف (مفصولة بفاصلة)</label>
                  <input
                    type="text"
                    value={settings.phones.join(", ")}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        phones: e.target.value.split(",").map((p) => p.trim()),
                      })
                    }
                    className="w-full bg-brand-cream/40 p-3 rounded-xl border border-brand-orange/20 focus:border-brand-orange outline-none text-sm font-sans"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-brand-brown mb-1.5">العنوان الرسمي</label>
                  <input
                    type="text"
                    value={settings.address}
                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                    className="w-full bg-brand-cream/40 p-3 rounded-xl border border-brand-orange/20 focus:border-brand-orange outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-brown mb-1.5">مواعيد العمل اليومية</label>
                  <input
                    type="text"
                    value={settings.working_hours}
                    onChange={(e) => setSettings({ ...settings, working_hours: e.target.value })}
                    className="w-full bg-brand-cream/40 p-3 rounded-xl border border-brand-orange/20 focus:border-brand-orange outline-none text-sm"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-brand-brown mb-1.5">رابط صفحة فيسبوك</label>
                  <input
                    type="text"
                    value={settings.facebook_url}
                    onChange={(e) => setSettings({ ...settings, facebook_url: e.target.value })}
                    className="w-full bg-brand-cream/40 p-3 rounded-xl border border-brand-orange/20 focus:border-brand-orange outline-none text-sm font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-brown mb-1.5">رابط حساب إنستجرام</label>
                  <input
                    type="text"
                    value={settings.instagram_url}
                    onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })}
                    className="w-full bg-brand-cream/40 p-3 rounded-xl border border-brand-orange/20 focus:border-brand-orange outline-none text-sm font-sans"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-4 bg-brand-orange hover:bg-orange-600 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition text-base"
                >
                  <Save className="w-5 h-5" />
                  <span>حفظ التعديلات في قاعدة البيانات</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 4: DATABASE & SUPABASE SYNC */}
        {/* ---------------------------------------------------- */}
        {activeTab === "database" && (
          <div className="space-y-6 max-w-4xl mx-auto">
            {/* 1-Click Sync Card */}
            <div className="bg-gradient-to-br from-white to-brand-cream p-8 rounded-3xl shadow-xl border-2 border-brand-orange/30 space-y-6 text-right">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-brand-orange text-white flex items-center justify-center shadow-md">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold font-aref text-brand-brown">
                    التهيئة السريعة ونقل البيانات إلى Supabase
                  </h3>
                  <p className="text-xs sm:text-sm text-brand-muted">
                    يقوم هذا الزر بنقل جميع الأقسام الـ 15 وأصناف المنيو إلى قاعدة بيانات Supabase الحية بنقرة واحدة.
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-brand-orange/20 space-y-2 text-xs text-brand-brown">
                <p className="font-bold text-sm text-brand-orange">قبل الضغط على الزر:</p>
                <p>1. تأكد من فتح لوحة تحكم Supabase لمشروعك.</p>
                <p>2. توجه إلى **SQL Editor** ونفّذ سكربت إنشاء الجداول الموضح بالأسفل.</p>
                <p>3. اضغط على الزر البرتقالي بالأسفل لنقل كافة الأطباق والأسعار والإعدادات فوراً.</p>
              </div>

              <button
                onClick={handleSeedDatabase}
                disabled={seedingLoading}
                className="w-full py-4 bg-gradient-to-r from-brand-orange via-orange-600 to-amber-600 hover:opacity-95 text-white font-bold rounded-2xl shadow-xl shadow-orange-500/30 flex items-center justify-center gap-3 transition text-base"
              >
                <Sparkles className={`w-5 h-5 ${seedingLoading ? "animate-spin" : ""}`} />
                <span>
                  {seedingLoading
                    ? "جارٍ نقل وحفظ البيانات في Supabase..."
                    : "نقل وحفظ جميع أصناف المنيو في Supabase الآن"}
                </span>
              </button>
            </div>

            {/* SQL Guide */}
            <div className="bg-brand-dark text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-brand-orange/30 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-lg font-aref text-amber-300">سكربت إنشاء جداول Supabase (SQL Schema)</h4>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`-- 1. Categories
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    title_en TEXT,
    image TEXT,
    description TEXT,
    icon TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Menu Items
CREATE TABLE IF NOT EXISTS public.menu_items (
    id TEXT PRIMARY KEY,
    category_id TEXT REFERENCES public.categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price NUMERIC NOT NULL DEFAULT 0,
    is_daily BOOLEAN DEFAULT FALSE,
    badge TEXT,
    description TEXT,
    image TEXT,
    is_available BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Settings
CREATE TABLE IF NOT EXISTS public.restaurant_settings (
    id TEXT PRIMARY KEY DEFAULT 'default_settings',
    name TEXT NOT NULL DEFAULT 'مطعم نيو بورسعيد',
    name_en TEXT DEFAULT 'New Port Said Restaurant',
    tagline TEXT DEFAULT 'أكل بشوات • طعم أصيل يُشوى بشغف',
    phones TEXT[] DEFAULT ARRAY['01007375151', '01100130080', '01008329497'],
    address TEXT DEFAULT 'سوهاج الجديدة - مول ريتاج 1',
    whatsapp TEXT DEFAULT '201007375151',
    working_hours TEXT DEFAULT 'يومياً من ١٢:٠٠ ظهراً حتى ٠٢:٠٠ صباحاً',
    facebook_url TEXT DEFAULT 'https://facebook.com',
    instagram_url TEXT DEFAULT 'https://instagram.com',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public write categories" ON public.categories FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public read menu_items" ON public.menu_items FOR SELECT USING (true);
CREATE POLICY "Public write menu_items" ON public.menu_items FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public read settings" ON public.restaurant_settings FOR SELECT USING (true);
CREATE POLICY "Public write settings" ON public.restaurant_settings FOR ALL USING (true) WITH CHECK (true);`);
                    showToast("تم نسخ سكربت SQL إلى الحافظة!");
                  }}
                  className="bg-brand-orange hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>نسخ السكربت</span>
                </button>
              </div>

              <pre className="bg-black/50 p-4 rounded-2xl text-xs text-amber-200 overflow-x-auto max-h-60 font-mono text-left" dir="ltr">
{`-- Execute this in Supabase SQL Editor:
CREATE TABLE IF NOT EXISTS public.categories (...);
CREATE TABLE IF NOT EXISTS public.menu_items (...);
CREATE TABLE IF NOT EXISTS public.restaurant_settings (...);`}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* ---------------------------------------------------- */}
      {/* MODAL: ADD / EDIT ITEM */}
      {/* ---------------------------------------------------- */}
      {itemModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-5 border-2 border-brand-orange/30 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-aref font-bold text-2xl text-brand-brown">
                {editingItem.id ? "تعديل بيانات الطبق" : "إضافة طبق جديد للمنيو"}
              </h3>
              <button
                onClick={() => setItemModalOpen(false)}
                className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-4 text-right">
              <div>
                <label className="block text-xs font-bold text-brand-brown mb-1">اسم الطبق *</label>
                <input
                  type="text"
                  required
                  value={editingItem.name || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  placeholder="مثال: كباب ضاني عالفحم"
                  className="w-full bg-brand-cream/50 p-3 rounded-xl border border-brand-orange/20 focus:border-brand-orange outline-none text-sm font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-brand-brown mb-1">القسم التابع له *</label>
                  <select
                    value={editingItem.category_id || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, category_id: e.target.value })}
                    className="w-full bg-brand-cream/50 p-3 rounded-xl border border-brand-orange/20 focus:border-brand-orange outline-none text-sm font-bold text-brand-brown"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-brown mb-1">السعر (ج.م) *</label>
                  <input
                    type="number"
                    disabled={editingItem.is_daily}
                    value={editingItem.is_daily ? "" : editingItem.price || 0}
                    onChange={(e) => setEditingItem({ ...editingItem, price: Number(e.target.value) })}
                    className="w-full bg-brand-cream/50 p-3 rounded-xl border border-brand-orange/20 focus:border-brand-orange outline-none text-sm font-bold font-sans"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 p-3 bg-brand-cream/30 rounded-xl border border-brand-orange/15">
                <label className="flex items-center gap-2 text-xs font-bold text-brand-brown cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.is_daily || false}
                    onChange={(e) => setEditingItem({ ...editingItem, is_daily: e.target.checked })}
                    className="w-4 h-4 accent-brand-orange rounded"
                  />
                  <span>حسب السعر اليومي (مثل البط/الأسماك)</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-brand-brown cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.is_available !== false}
                    onChange={(e) => setEditingItem({ ...editingItem, is_available: e.target.checked })}
                    className="w-4 h-4 accent-green-600 rounded"
                  />
                  <span>متوفر للطلب حالياً</span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-brown mb-1">الشارة المميزة (Badge)</label>
                <input
                  type="text"
                  value={editingItem.badge || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, badge: e.target.value })}
                  placeholder="مثال: الأكثر مبيعاً 🔥 أو اختيار الشيف"
                  className="w-full bg-brand-cream/50 p-3 rounded-xl border border-brand-orange/20 focus:border-brand-orange outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-brown mb-1">وصف المكونات والتقديم</label>
                <textarea
                  rows={3}
                  value={editingItem.description || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  placeholder="مكونات الطبق وطريقة الشواء والتقديم..."
                  className="w-full bg-brand-cream/50 p-3 rounded-xl border border-brand-orange/20 focus:border-brand-orange outline-none text-sm"
                />
              </div>

              <div className="pt-3 flex items-center gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3.5 bg-brand-orange hover:bg-orange-600 text-white font-bold rounded-xl shadow-md transition"
                >
                  حفظ وتحديث الطبق
                </button>
                <button
                  type="button"
                  onClick={() => setItemModalOpen(false)}
                  className="px-6 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* MODAL: ADD / EDIT CATEGORY */}
      {/* ---------------------------------------------------- */}
      {categoryModalOpen && editingCategory && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-5 border-2 border-brand-orange/30 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-aref font-bold text-2xl text-brand-brown">
                {editingCategory.id ? "تعديل بيانات القسم" : "إضافة قسم جديد"}
              </h3>
              <button
                onClick={() => setCategoryModalOpen(false)}
                className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4 text-right">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-brand-brown mb-1">اسم القسم (عربي) *</label>
                  <input
                    type="text"
                    required
                    value={editingCategory.title || ""}
                    onChange={(e) => setEditingCategory({ ...editingCategory, title: e.target.value })}
                    placeholder="مثال: المشويات"
                    className="w-full bg-brand-cream/50 p-3 rounded-xl border border-brand-orange/20 focus:border-brand-orange outline-none text-sm font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-brown mb-1">الاسم بالإنجليزية</label>
                  <input
                    type="text"
                    value={editingCategory.titleEn || ""}
                    onChange={(e) => setEditingCategory({ ...editingCategory, titleEn: e.target.value })}
                    placeholder="مثال: GRILLS"
                    className="w-full bg-brand-cream/50 p-3 rounded-xl border border-brand-orange/20 focus:border-brand-orange outline-none text-sm font-bold font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-brown mb-1">رابط صورة الغلاف (Image URL)</label>
                <input
                  type="url"
                  value={editingCategory.image || ""}
                  onChange={(e) => setEditingCategory({ ...editingCategory, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-brand-cream/50 p-3 rounded-xl border border-brand-orange/20 focus:border-brand-orange outline-none text-sm font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-brown mb-1">وصف القسم</label>
                <textarea
                  rows={3}
                  value={editingCategory.description || ""}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  placeholder="وصف مميزات هذا القسم..."
                  className="w-full bg-brand-cream/50 p-3 rounded-xl border border-brand-orange/20 focus:border-brand-orange outline-none text-sm"
                />
              </div>

              <div className="pt-3 flex items-center gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3.5 bg-brand-orange hover:bg-orange-600 text-white font-bold rounded-xl shadow-md transition"
                >
                  حفظ وتحديث القسم
                </button>
                <button
                  type="button"
                  onClick={() => setCategoryModalOpen(false)}
                  className="px-6 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
