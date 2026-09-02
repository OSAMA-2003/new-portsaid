"use client";

import React, { useState, useEffect, useCallback } from "react";
import { WifiOff, RefreshCw, X, ChevronDown, CheckCircle2, AlertTriangle, Terminal } from "lucide-react";
import { checkServerConnection } from "@/lib/dbService";

export const ServerStatusAlert: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showReconnectedBadge, setShowReconnectedBadge] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const verifyConnection = useCallback(async (isManualRetry = false) => {
    if (isManualRetry) setIsRetrying(true);
    try {
      const res = await checkServerConnection();
      if (res.connected) {
        setIsConnected((prev) => {
          if (prev === false) {
            // It was previously offline, now back online!
            setShowReconnectedBadge(true);
            setTimeout(() => setShowReconnectedBadge(false), 4000);
          }
          return true;
        });
        setErrorMessage("");
      } else {
        setIsConnected(false);
        setErrorMessage(res.message || "تعذر الوصول إلى http://localhost:5000/api");
      }
    } catch (err: any) {
      setIsConnected(false);
      setErrorMessage(err?.message || "انقطع الاتصال بالسيرفر");
    } finally {
      if (isManualRetry) {
        setTimeout(() => setIsRetrying(false), 400);
      }
    }
  }, []);

  // Initial check on mount + periodic polling + window focus
  useEffect(() => {
    verifyConnection();

    // Re-check periodically every 15 seconds
    const interval = setInterval(() => {
      verifyConnection();
    }, 15000);

    // Re-check when user focuses window
    const handleFocus = () => verifyConnection();
    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  }, [verifyConnection]);

  // Don't render anything if connected or still checking for the first time
  if (isConnected === null) return null;

  // Reconnected Toast Notification
  if (showReconnectedBadge) {
    return (
      <aside
        aria-label="حالة السيرفر"
        aria-live="polite"
        className="fixed top-5 left-1/2 -translate-x-1/2 z-[9999] bg-emerald-900/95 text-white px-5 py-3 rounded-2xl shadow-2xl border border-emerald-500/50 backdrop-blur-md flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300"
        dir="rtl"
      >
        <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-bold text-emerald-300">تم استعادة الاتصال بالسيرفر 🟢</p>
          <p className="text-[11px] text-emerald-100/80">البيانات متزامنة الآن مع MongoDB Atlas</p>
        </div>
      </aside>
    );
  }

  // If server is not connected
  if (isConnected === false) {
    // Minimized Floating Pill Badge
    if (isMinimized) {
      return (
        <aside
          aria-label="حالة السيرفر"
          aria-live="assertive"
          className="fixed bottom-6 left-6 z-[9999]"
          dir="rtl"
        >
          <button
            onClick={() => setIsMinimized(false)}
            className="bg-red-950/95 hover:bg-red-900 text-white px-4 py-2.5 rounded-2xl shadow-2xl border-2 border-red-500/60 backdrop-blur-md flex items-center gap-2.5 transition hover:scale-105 group"
            title="انقر لعرض تفاصيل انقطاع السيرفر"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
            </span>
            <WifiOff className="w-4 h-4 text-red-400" />
            <span className="text-xs font-bold text-red-200">السيرفر غير متصل</span>
            <ChevronDown className="w-3.5 h-3.5 text-red-400 group-hover:translate-y-0.5 transition-transform" />
          </button>
        </aside>
      );
    }

    // Expanded Floating Alert Banner
    return (
      <aside
        aria-label="حالة السيرفر"
        aria-live="assertive"
        className="fixed top-4 sm:top-6 inset-x-4 sm:left-1/2 sm:-translate-x-1/2 sm:w-[560px] z-[9999] bg-gradient-to-b from-red-950/95 to-neutral-950/95 text-white p-4 sm:p-5 rounded-3xl shadow-2xl border-2 border-red-500/60 backdrop-blur-xl animate-in fade-in slide-in-from-top-6 duration-300"
        dir="rtl"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <div className="w-10 h-10 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center shrink-0 border border-red-500/30">
              <WifiOff className="w-5 h-5 animate-pulse" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                <h2 className="text-sm font-bold text-red-300">
                  السيرفر غير متصل (Server Not Connected)
                </h2>
              </div>
              <p className="text-xs text-red-100/80 leading-relaxed">
                تعذر الاتصال بسيرفر الباك اند (Express على المنفذ 5000). لن تعمل عمليات الإرسال والتعديل حتى يتم تشغيل السيرفر.
              </p>
              {errorMessage && (
                <p className="text-[11px] font-mono text-red-300/70 pt-0.5" dir="ltr">
                  Error: {errorMessage}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={() => setIsMinimized(true)}
            className="text-red-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition shrink-0"
            title="تصغير التنبيه"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Command Helper */}
        <div className="mt-3.5 pt-3 border-t border-red-500/20 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 text-[11px] text-red-200/90 font-mono bg-black/40 px-3 py-1.5 rounded-xl border border-red-500/20" dir="ltr">
            <Terminal className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>cd Backend &amp;&amp; npm run dev</span>
          </div>

          <button
            onClick={() => verifyConnection(true)}
            disabled={isRetrying}
            className="py-2 px-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-red-900/40 flex items-center justify-center gap-1.5 transition hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRetrying ? "animate-spin" : ""}`} />
            <span>{isRetrying ? "جارٍ الفحص..." : "إعادة محاولة الاتصال"}</span>
          </button>
        </div>
      </aside>
    );
  }

  return null;
};
