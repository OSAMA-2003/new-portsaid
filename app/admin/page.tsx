"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Lock,
  KeyRound,
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
  Save,
  Phone,
  Sparkles,
  ExternalLink,
  Copy,
  AlertCircle,
  CheckCircle2,
  Star,
  MessageSquareHeart,
  Inbox,
  Lightbulb,
  ShieldAlert,
  Send,
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
  getAllCustomerReviewsAdmin,
  updateReviewStatus,
  deleteCustomerReview,
  getAllFeedbackAdmin,
  markFeedbackAsRead,
  deleteFeedback,
  DbCategory,
  DbMenuItem,
  DbRestaurantSettings,
  DbCustomerReview,
  DbFeedback,
} from "@/lib/dbService";

export default function AdminPage() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [savedPin, setSavedPin] = useState("1234");
  const [authError, setAuthError] = useState("");

  // Navigation Tab State
  const [activeTab, setActiveTab] = useState<
    "items" | "categories" | "reviews" | "feedback" | "settings" | "database"
  >("items");

  // Data States
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<DbCategory[]>([]);
  const [settings, setSettings] = useState<DbRestaurantSettings | null>(null);
  const [reviews, setReviews] = useState<DbCustomerReview[]>([]);
  const [feedbackList, setFeedbackList] = useState<DbFeedback[]>([]);

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("all");
  const [reviewFilter, setReviewFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [feedbackFilter, setFeedbackFilter] = useState<"all" | "unread" | "suggestion" | "complaint">("all");

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
      const [cats, setts, revs, fbs] = await Promise.all([
        getMenuCategoriesWithItems(),
        getRestaurantSettings(),
        getAllCustomerReviewsAdmin(),
        getAllFeedbackAdmin(),
      ]);
      setCategories(cats);
      setSettings(setts);
      setReviews(revs || []);
      setFeedbackList(fbs || []);
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

  // Change PIN Handler
  const handleChangePin = () => {
    const newPin = prompt("أدخل رمز PIN الجديد المكون من 4 إلى 8 أرقام:");
    if (!newPin || newPin.trim().length < 4) {
      alert("يجب أن يتكون الرمز من 4 أرقام على الأقل");
      return;
    }
    setSavedPin(newPin.trim());
    localStorage.setItem("new_portsaid_admin_pin", newPin.trim());
    showToast("تم تحديث رمز PIN بنجاح!");
  };

  // Logout Handler
  const handleLogout = () => {
    sessionStorage.removeItem("new_portsaid_admin_auth");
    setIsAuthenticated(false);
    setPinInput("");
  };

  // ----------------------------------------------------
  // ITEM HANDLERS
  // ----------------------------------------------------
  const handleOpenItemModal = (item?: DbMenuItem) => {
    if (item) {
      setEditingItem({ ...item });
    } else {
      setEditingItem({
        id: "",
        category_id: categories[0]?.id || "grills",
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
    const itemName = editingItem?.name?.trim() || "";
    if (!itemName) {
      showToast("يرجى كتابة اسم الطبق أولاً", "error");
      return;
    }

    try {
      await upsertMenuItem({
        id: editingItem?.id?.trim() || undefined,
        category_id: editingItem?.category_id || categories[0]?.id || "grills",
        name: itemName,
        price: editingItem?.is_daily ? "يومي" : Number(editingItem?.price) || 0,
        is_daily: editingItem?.is_daily,
        badge: editingItem?.badge,
        description: editingItem?.description,
        image: editingItem?.image,
        is_available: editingItem?.is_available ?? true,
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
    const categoryTitle = editingCategory?.title?.trim() || "";
    if (!categoryTitle) {
      showToast("يرجى كتابة اسم القسم", "error");
      return;
    }

    try {
      await upsertCategory({
        id: editingCategory?.id?.trim() || undefined,
        title: categoryTitle,
        titleEn: editingCategory?.titleEn,
        image: editingCategory?.image,
        description: editingCategory?.description,
        icon: editingCategory?.icon,
      });
      setCategoryModalOpen(false);
      showToast("تم حفظ بيانات القسم بنجاح!");
      loadAllData();
    } catch (err: any) {
      console.error(err);
      showToast("حدث خطأ أثناء حفظ القسم", "error");
    }
  };

  const handleDeleteCategory = async (catId: string, catTitle: string) => {
    if (!confirm(`تحذير: سيتم حذف قسم "${catTitle}" وجميع الأطباق التابعة له. هل أنت متأكد؟`)) return;

    try {
      await deleteCategory(catId);
      showToast(`تم حذف قسم "${catTitle}"`);
      loadAllData();
    } catch (err: any) {
      console.error(err);
      showToast("تعذر حذف القسم", "error");
    }
  };

  // ----------------------------------------------------
  // REVIEWS HANDLERS
  // ----------------------------------------------------
  const handleSetReviewStatus = async (reviewId: string, status: "approved" | "rejected" | "pending") => {
    try {
      await updateReviewStatus(reviewId, status);
      showToast(
        status === "approved"
          ? "تم قبول ونشر التقييم في الموقع بنجاح!"
          : status === "rejected"
          ? "تم رفض وتجاهل التقييم"
          : "تم تعيين التقييم كقيد المراجعة"
      );
      loadAllData();
    } catch (err) {
      console.error(err);
      showToast("حدث خطأ أثناء تحديث حالة التقييم", "error");
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا التقييم نهائياً؟")) return;
    try {
      await deleteCustomerReview(reviewId);
      showToast("تم حذف التقييم نهائياً");
      loadAllData();
    } catch (err) {
      console.error(err);
      showToast("تعذر حذف التقييم", "error");
    }
  };

  // ----------------------------------------------------
  // FEEDBACK HANDLERS
  // ----------------------------------------------------
  const handleToggleFeedbackRead = async (feedbackId: string, currentRead: boolean) => {
    try {
      await markFeedbackAsRead(feedbackId, !currentRead);
      showToast(!currentRead ? "تم تمييز الرسالة كمقروءة" : "تم تمييز الرسالة كغير مقروءة");
      loadAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteFeedbackItem = async (feedbackId: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الرسالة؟")) return;
    try {
      await deleteFeedback(feedbackId);
      showToast("تم حذف الرسالة بنجاح");
      loadAllData();
    } catch (err) {
      console.error(err);
      showToast("تعذر حذف الرسالة", "error");
    }
  };

  // ----------------------------------------------------
  // SETTINGS HANDLER
  // ----------------------------------------------------
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    try {
      await updateRestaurantSettings(settings);
      showToast("تم تحديث وحفظ بيانات المطعم بنجاح!");
    } catch (err: any) {
      console.error(err);
      showToast("تعذر حفظ الإعدادات", "error");
    }
  };

  // ----------------------------------------------------
  // 1-CLICK DATABASE SEEDING
  // ----------------------------------------------------
  const handleSeedDatabase = async () => {
    if (!confirm("هل ترغب في رفع وتهيئة جميع الأقسام والـ 152 صنفاً من data.js إلى قاعدة بيانات Supabase؟")) return;

    setSeedingLoading(true);
    try {
      const res = await seedDatabaseFromDataJS();
      showToast(res.message);
      await loadAllData();
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "حدث خطأ أثناء نقل البيانات.", "error");
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

  const filteredReviews = reviews.filter((r) => {
    if (reviewFilter === "all") return true;
    return r.status === reviewFilter;
  });

  const filteredFeedback = feedbackList.filter((f) => {
    if (feedbackFilter === "unread") return !f.is_read;
    if (feedbackFilter === "suggestion") return f.type === "suggestion";
    if (feedbackFilter === "complaint") return f.type === "complaint";
    return true;
  });

  // ----------------------------------------------------
  // 1. PIN LOGIN SCREEN
  // ----------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-brand-cream/80 flex items-center justify-center p-4 pt-20" dir="rtl">
        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10 max-w-md w-full border-2 border-brand-orange/30 text-center space-y-6 animate-in zoom-in-95 duration-300">
          <div className="w-20 h-20 bg-brand-orange/15 text-brand-orange rounded-3xl flex items-center justify-center mx-auto shadow-inner border border-brand-orange/30">
            <Lock className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold font-aref text-brand-brown">
              لوحة تحكم مطعم نيو بورسعيد
            </h1>
            <p className="text-xs sm:text-sm text-brand-muted">
              أدخل رمز المرور (PIN) للوصول إلى إدارة المنيو والطلبات والتقييمات
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
  // 2. AUTHENTICATED ADMIN DASHBOARD
  // ----------------------------------------------------
  const pendingReviewsCount = reviews.filter((r) => r.status === "pending").length;
  const unreadFeedbackCount = feedbackList.filter((f) => !f.is_read).length;

  return (
    <div className="min-h-screen bg-brand-cream/60 py-8 sm:py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-[100] px-5 py-3 rounded-2xl shadow-2xl font-bold text-sm flex items-center gap-2 border animate-in slide-in-from-bottom-5 duration-300 ${
            toastMessage.type === "success"
              ? "bg-green-600 text-white border-green-500"
              : "bg-red-600 text-white border-red-500"
          }`}
        >
          {toastMessage.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Dashboard Top Header */}
        <div className="bg-brand-dark text-white rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 z-10">
            <div className="flex items-center gap-3">
              <span className="bg-brand-orange text-white text-xs font-bold px-3 py-1 rounded-full">
                لوحة الإدارة الشاملة
              </span>
              <span className="text-xs text-amber-300/80 font-sans">
                Supabase Connected 🟢
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold font-aref">
              إدارة مطعم نيو بورسعيد
            </h1>
            <p className="text-xs sm:text-sm text-white/70">
              تحكم كامل في الأطباق، الأسعار، التقييمات، الشكاوى والإعدادات
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 z-10">
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
              <span>تغيير PIN</span>
            </button>

            <Link
              href="/menu"
              target="_blank"
              className="p-3 bg-brand-orange hover:bg-orange-600 rounded-2xl text-white font-bold text-xs flex items-center gap-2 transition shadow-md"
            >
              <ExternalLink className="w-4 h-4" />
              <span>المنيو الحي</span>
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
              <span>إجمالي الأطباق</span>
              <UtensilsCrossed className="w-4 h-4 text-brand-orange" />
            </div>
            <p className="text-3xl font-extrabold font-sans text-brand-brown">{allItems.length}</p>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-brand-orange/15 space-y-1">
            <div className="flex items-center justify-between text-brand-muted text-xs">
              <span>إجمالي الأقسام</span>
              <Layers className="w-4 h-4 text-brand-orange" />
            </div>
            <p className="text-3xl font-extrabold font-sans text-brand-brown">{categories.length}</p>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-brand-orange/15 space-y-1">
            <div className="flex items-center justify-between text-brand-muted text-xs">
              <span>تقييمات جديدة للمراجعة</span>
              <Star className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-3xl font-extrabold font-sans text-amber-500">
              {pendingReviewsCount}
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-brand-orange/15 space-y-1">
            <div className="flex items-center justify-between text-brand-muted text-xs">
              <span>شكاوى واقتراحات غير مقروءة</span>
              <Inbox className="w-4 h-4 text-red-500" />
            </div>
            <p className="text-3xl font-extrabold font-sans text-red-500">
              {unreadFeedbackCount}
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 hide-scrollbar border-b border-brand-orange/20">
          <button
            onClick={() => setActiveTab("items")}
            className={`px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shrink-0 ${
              activeTab === "items"
                ? "bg-brand-orange text-white shadow-lg shadow-orange-500/25"
                : "bg-white text-brand-brown hover:bg-brand-orange/10 border border-brand-orange/15"
            }`}
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>الأطباق والمنيو ({allItems.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("categories")}
            className={`px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shrink-0 ${
              activeTab === "categories"
                ? "bg-brand-orange text-white shadow-lg shadow-orange-500/25"
                : "bg-white text-brand-brown hover:bg-brand-orange/10 border border-brand-orange/15"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>الأقسام ({categories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("reviews")}
            className={`px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shrink-0 ${
              activeTab === "reviews"
                ? "bg-brand-orange text-white shadow-lg shadow-orange-500/25"
                : "bg-white text-brand-brown hover:bg-brand-orange/10 border border-brand-orange/15"
            }`}
          >
            <MessageSquareHeart className="w-4 h-4" />
            <span>
              إدارة التقييمات {pendingReviewsCount > 0 && `(🔔 ${pendingReviewsCount})`}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("feedback")}
            className={`px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shrink-0 ${
              activeTab === "feedback"
                ? "bg-brand-orange text-white shadow-lg shadow-orange-500/25"
                : "bg-white text-brand-brown hover:bg-brand-orange/10 border border-brand-orange/15"
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>
              صندوق الشكاوى والاقتراحات {unreadFeedbackCount > 0 && `(🔴 ${unreadFeedbackCount})`}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shrink-0 ${
              activeTab === "settings"
                ? "bg-brand-orange text-white shadow-lg shadow-orange-500/25"
                : "bg-white text-brand-brown hover:bg-brand-orange/10 border border-brand-orange/15"
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>بيانات المطعم</span>
          </button>

          <button
            onClick={() => setActiveTab("database")}
            className={`px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shrink-0 ${
              activeTab === "database"
                ? "bg-brand-orange text-white shadow-lg shadow-orange-500/25"
                : "bg-white text-brand-brown hover:bg-brand-orange/10 border border-brand-orange/15"
            }`}
          >
            <Database className="w-4 h-4" />
            <span>قاعدة البيانات والنقل</span>
          </button>
        </div>

        {/* ---------------------------------------------------- */}
        {/* TAB 1: MENU ITEMS MANAGEMENT */}
        {/* ---------------------------------------------------- */}
        {activeTab === "items" && (
          <div className="space-y-6">
            {/* Search & Actions Bar */}
            <div className="bg-white p-4 sm:p-6 rounded-3xl shadow-sm border border-brand-orange/15 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex flex-1 items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 max-w-md">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ابحث عن طبق بالاسم أو الوصف..."
                    className="w-full bg-brand-cream/50 pr-10 pl-4 py-3 rounded-2xl border border-brand-orange/20 focus:border-brand-orange outline-none text-sm"
                  />
                  <Search className="w-4 h-4 text-brand-muted absolute top-3.5 right-3.5" />
                </div>

                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  className="bg-brand-cream/50 px-4 py-3 rounded-2xl border border-brand-orange/20 text-xs sm:text-sm font-bold text-brand-brown outline-none"
                >
                  <option value="all">جميع الأقسام ({allItems.length})</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} ({(c.items || []).length})
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => handleOpenItemModal()}
                className="w-full md:w-auto px-6 py-3.5 bg-gradient-to-r from-brand-orange to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition"
              >
                <Plus className="w-5 h-5" />
                <span>إضافة طبق جديد</span>
              </button>
            </div>

            {/* Items Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-brand-orange/15 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-sm">
                  <thead className="bg-brand-cream/80 text-brand-brown font-aref text-sm border-b border-brand-orange/15">
                    <tr>
                      <th className="p-4">الطبق</th>
                      <th className="p-4">القسم</th>
                      <th className="p-4">السعر</th>
                      <th className="p-4">الشارة</th>
                      <th className="p-4">الحالة</th>
                      <th className="p-4 text-center">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium">
                    {filteredItems.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-brand-muted">
                          لم يتم العثور على أطباق مطابقة للبحث
                        </td>
                      </tr>
                    ) : (
                      filteredItems.map((item) => (
                        <tr key={item.id} className="hover:bg-brand-cream/30 transition">
                          <td className="p-4">
                            <div className="font-bold text-brand-brown text-base">{item.name}</div>
                            {item.description && (
                              <div className="text-xs text-brand-muted max-w-xs truncate">{item.description}</div>
                            )}
                          </td>
                          <td className="p-4">
                            <span className="bg-brand-cream px-3 py-1 rounded-full text-xs font-bold text-brand-brown border border-brand-orange/15">
                              {item.categoryTitle}
                            </span>
                          </td>
                          <td className="p-4 font-bold font-sans text-brand-orange">
                            {item.is_daily ? "سعر يومي" : `${item.price} ج.م`}
                          </td>
                          <td className="p-4">
                            {item.badge ? (
                              <span className="bg-brand-orange/10 text-brand-orange text-xs font-bold px-2.5 py-0.5 rounded-full">
                                {item.badge}
                              </span>
                            ) : (
                              <span className="text-gray-300 text-xs">-</span>
                            )}
                          </td>
                          <td className="p-4">
                            <button
                              onClick={() => handleToggleItemAvailability(item)}
                              className={`px-3 py-1 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
                                item.is_available !== false
                                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                                  : "bg-red-100 text-red-700 hover:bg-red-200"
                              }`}
                            >
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  item.is_available !== false ? "bg-green-500" : "bg-red-500"
                                }`}
                              />
                              <span>{item.is_available !== false ? "متوفر" : "نفذ"}</span>
                            </button>
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleOpenItemModal(item)}
                                className="p-2 bg-brand-cream hover:bg-brand-orange hover:text-white rounded-xl text-brand-brown transition"
                                title="تعديل"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteItem(item.id, item.name)}
                                className="p-2 bg-red-50 hover:bg-red-600 hover:text-white rounded-xl text-red-600 transition"
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
            <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-brand-orange/15">
              <div>
                <h3 className="font-aref font-bold text-xl text-brand-brown">
                  أقسام المنيو الرئيسية ({categories.length})
                </h3>
                <p className="text-xs text-brand-muted">
                  يمكنك تعديل أسماء الأقسام، الصور، والأوصاف التوضيحية
                </p>
              </div>
              <button
                onClick={() => handleOpenCategoryModal()}
                className="px-6 py-3.5 bg-brand-orange hover:bg-orange-600 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/25 flex items-center gap-2 transition text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة قسم جديد</span>
              </button>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="bg-white rounded-3xl overflow-hidden shadow-sm border border-brand-orange/15 group hover:shadow-xl transition-all"
                >
                  <div className="h-40 relative bg-gray-100 overflow-hidden">
                    <img
                      src={cat.image || "/footer-bg.png"}
                      alt={cat.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end text-white">
                      <h4 className="font-aref font-bold text-2xl">{cat.title}</h4>
                      {cat.titleEn && <p className="text-xs text-amber-300 font-sans">{cat.titleEn}</p>}
                    </div>
                  </div>

                  <div className="p-5 space-y-4">
                    <p className="text-xs text-brand-muted line-clamp-2">
                      {cat.description || "لا يوجد وصف مدخل لهذا القسم"}
                    </p>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <span className="text-xs font-bold text-brand-orange bg-brand-cream px-3 py-1 rounded-full border border-brand-orange/15">
                        {(cat.items || []).length} أصناف
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenCategoryModal(cat)}
                          className="p-2 bg-brand-cream hover:bg-brand-orange hover:text-white rounded-xl text-brand-brown transition"
                          title="تعديل القسم"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat.id, cat.title)}
                          className="p-2 bg-red-50 hover:bg-red-600 hover:text-white rounded-xl text-red-600 transition"
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
        {/* TAB 3: REVIEWS MODERATION (NEW!) */}
        {/* ---------------------------------------------------- */}
        {activeTab === "reviews" && (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="bg-white p-4 sm:p-6 rounded-3xl shadow-sm border border-brand-orange/15 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setReviewFilter("all")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                    reviewFilter === "all" ? "bg-brand-brown text-white" : "bg-brand-cream text-brand-brown"
                  }`}
                >
                  الكل ({reviews.length})
                </button>
                <button
                  onClick={() => setReviewFilter("pending")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                    reviewFilter === "pending" ? "bg-amber-500 text-white" : "bg-brand-cream text-amber-700"
                  }`}
                >
                  قيد المراجعة ({pendingReviewsCount})
                </button>
                <button
                  onClick={() => setReviewFilter("approved")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                    reviewFilter === "approved" ? "bg-green-600 text-white" : "bg-brand-cream text-green-700"
                  }`}
                >
                  معتمدة في الموقع ({reviews.filter((r) => r.status === "approved").length})
                </button>
              </div>

              <span className="text-xs text-brand-muted">
                التقييمات المعتمدة تظهر فوراً في شريط التقييمات بالصفحة الرئيسية
              </span>
            </div>

            {/* Reviews Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReviews.length === 0 ? (
                <div className="col-span-full bg-white rounded-3xl p-12 text-center text-brand-muted">
                  لا توجد تقييمات مطابقة لهذا الفلتر حالياً
                </div>
              ) : (
                filteredReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className={`bg-white rounded-3xl p-6 shadow-sm border-2 transition-all space-y-4 flex flex-col justify-between ${
                      rev.status === "approved"
                        ? "border-green-500/30"
                        : rev.status === "pending"
                        ? "border-amber-500/40 bg-amber-50/20"
                        : "border-red-400/30 bg-red-50/10"
                    }`}
                  >
                    <div className="space-y-3">
                      {/* Top Meta */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < rev.rating ? "fill-brand-orange text-brand-orange" : "text-gray-200"
                              }`}
                            />
                          ))}
                        </div>

                        <span
                          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                            rev.status === "approved"
                              ? "bg-green-100 text-green-700"
                              : rev.status === "pending"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {rev.status === "approved" ? "معتمد ومنشور" : rev.status === "pending" ? "بانتظار الموافقة" : "مرفوض"}
                        </span>
                      </div>

                      {/* Comment */}
                      <p className="text-brand-brown text-sm sm:text-base font-semibold leading-relaxed">
                        "{rev.comment}"
                      </p>

                      {/* Customer Info */}
                      <div className="pt-2 text-xs text-brand-muted space-y-0.5 border-t border-gray-100">
                        <div className="font-bold text-brand-brown">{rev.name}</div>
                        {rev.phone && (
                          <div className="font-sans text-[11px]" dir="ltr">
                            {rev.phone}
                          </div>
                        )}
                        {rev.created_at && (
                          <div className="text-[10px] text-gray-400">
                            {new Date(rev.created_at).toLocaleDateString("ar-EG")}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
                      {rev.status !== "approved" ? (
                        <button
                          onClick={() => handleSetReviewStatus(rev.id, "approved")}
                          className="flex-1 py-2 px-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-xs transition flex items-center justify-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>قبول ونشر</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleSetReviewStatus(rev.id, "rejected")}
                          className="flex-1 py-2 px-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-xs transition flex items-center justify-center gap-1"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>إخفاء من الموقع</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleDeleteReview(rev.id)}
                        className="p-2 bg-red-50 hover:bg-red-600 hover:text-white text-red-600 rounded-xl transition"
                        title="حذف التقييم نهائياً"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 4: FEEDBACK & COMPLAINTS INBOX (NEW!) */}
        {/* ---------------------------------------------------- */}
        {activeTab === "feedback" && (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="bg-white p-4 sm:p-6 rounded-3xl shadow-sm border border-brand-orange/15 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFeedbackFilter("all")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                    feedbackFilter === "all" ? "bg-brand-brown text-white" : "bg-brand-cream text-brand-brown"
                  }`}
                >
                  جميع الرسائل ({feedbackList.length})
                </button>
                <button
                  onClick={() => setFeedbackFilter("unread")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                    feedbackFilter === "unread" ? "bg-red-600 text-white" : "bg-brand-cream text-red-700"
                  }`}
                >
                  غير مقروءة ({unreadFeedbackCount})
                </button>
                <button
                  onClick={() => setFeedbackFilter("suggestion")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                    feedbackFilter === "suggestion" ? "bg-amber-500 text-white" : "bg-brand-cream text-amber-700"
                  }`}
                >
                  💡 اقتراحات ({feedbackList.filter((f) => f.type === "suggestion").length})
                </button>
                <button
                  onClick={() => setFeedbackFilter("complaint")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                    feedbackFilter === "complaint" ? "bg-red-500 text-white" : "bg-brand-cream text-red-700"
                  }`}
                >
                  ⚠️ شكاوى ({feedbackList.filter((f) => f.type === "complaint").length})
                </button>
              </div>

              <span className="text-xs text-brand-muted">
                يمكنك الاتصال بالعميل أو مراسلته عبر واتساب بنقرة واحدة
              </span>
            </div>

            {/* Feedback List */}
            <div className="space-y-4">
              {filteredFeedback.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center text-brand-muted">
                  لا توجد رسائل في هذا الصندوق حالياً
                </div>
              ) : (
                filteredFeedback.map((fb) => (
                  <div
                    key={fb.id}
                    className={`bg-white rounded-3xl p-6 shadow-sm border-2 transition-all space-y-4 ${
                      !fb.is_read ? "border-brand-orange bg-orange-50/20" : "border-gray-100"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                            fb.type === "suggestion"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {fb.type === "suggestion" ? <Lightbulb className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
                          <span>{fb.type === "suggestion" ? "اقتراح تطوير" : "شكوى عميل"}</span>
                        </span>

                        <h4 className="font-bold text-brand-brown text-base">{fb.name}</h4>

                        {!fb.is_read && (
                          <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            جديد
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-brand-muted font-sans" dir="ltr">
                        {fb.created_at ? new Date(fb.created_at).toLocaleString("ar-EG") : ""}
                      </div>
                    </div>

                    <p className="text-brand-brown text-sm sm:text-base leading-relaxed bg-brand-cream/40 p-4 rounded-2xl border border-brand-orange/10 whitespace-pre-wrap">
                      {fb.message}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <div className="flex items-center gap-2">
                        {/* Call Button */}
                        <a
                          href={`tel:${fb.phone}`}
                          className="px-3.5 py-2 bg-brand-cream hover:bg-brand-orange hover:text-white rounded-xl text-xs font-bold text-brand-brown flex items-center gap-1.5 transition border border-brand-orange/20"
                        >
                          <Phone className="w-3.5 h-3.5 text-brand-orange" />
                          <span dir="ltr" className="font-sans">{fb.phone}</span>
                        </a>

                        {/* WhatsApp Button */}
                        <a
                          href={`https://wa.me/${fb.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                            `مرحباً أستاذ ${fb.name}، بخصوص رسالتكم الكريمة لمطعم نيو بورسعيد...`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3.5 py-2 bg-green-50 hover:bg-green-600 hover:text-white rounded-xl text-xs font-bold text-green-700 flex items-center gap-1.5 transition border border-green-200"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>رد عبر واتساب</span>
                        </a>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleFeedbackRead(fb.id, fb.is_read)}
                          className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition"
                        >
                          {fb.is_read ? "تمييز كغير مقروء" : "تمييز كمقروء ✓"}
                        </button>

                        <button
                          onClick={() => handleDeleteFeedbackItem(fb.id)}
                          className="p-2 bg-red-50 hover:bg-red-600 hover:text-white text-red-600 rounded-xl transition"
                          title="حذف الرسالة"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 5: RESTAURANT SETTINGS */}
        {/* ---------------------------------------------------- */}
        {activeTab === "settings" && settings && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-brand-orange/15 max-w-3xl mx-auto space-y-6 text-right">
            <div>
              <h3 className="font-aref font-bold text-2xl text-brand-brown">
                بيانات المطعم والعناوين وأرقام الهواتف
              </h3>
              <p className="text-xs text-brand-muted">
                يتم تحديث هذه البيانات وعرضها في الفوتر والنافبار وصفحة التواصل
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
        {/* TAB 6: DATABASE & SUPABASE SYNC */}
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

-- 4. Customer Reviews
CREATE TABLE IF NOT EXISTS public.customer_reviews (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT,
    rating INT DEFAULT 5,
    comment TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Feedback
CREATE TABLE IF NOT EXISTS public.feedback (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    type TEXT DEFAULT 'suggestion',
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);`);
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
CREATE TABLE IF NOT EXISTS public.restaurant_settings (...);
CREATE TABLE IF NOT EXISTS public.customer_reviews (...);
CREATE TABLE IF NOT EXISTS public.feedback (...);`}
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
