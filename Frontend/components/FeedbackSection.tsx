"use client";

import React, { useState } from "react";
import { Send, CheckCircle2, ShieldAlert, Lightbulb } from "lucide-react";
import SplitText from "@/components/SplitText";
import { submitCustomerFeedback } from "@/lib/dbService";

export const FeedbackSection: React.FC = () => {
  const [feedbackType, setFeedbackType] = useState<"suggestion" | "complaint">("suggestion");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) return;

    setLoading(true);
    setErrorMessage(null);
    try {
      await submitCustomerFeedback({
        name: name.trim(),
        phone: phone.trim(),
        type: feedbackType,
        message: message.trim(),
      });
      setSubmitted(true);
      setName("");
      setPhone("");
      setMessage("");
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err: any) {
      console.error("Feedback submission error:", err);
      setErrorMessage("تعذر الإرسال: السيرفر غير متصل حالياً (Server Not Connected). يرجى التأكد من تشغيل السيرفر والمحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="feedback" className="py-20 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden border-t border-brand-orange/15">
      {/* Ambient background glows */}
      <div className="absolute right-0 top-1/3 w-80 h-80 bg-brand-orange/5 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute left-0 bottom-1/3 w-80 h-80 bg-brand-gold/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-brand-orange font-aref text-2xl font-bold block">
            صوتك يهمنا ويوصل مباشرة للإدارة
          </span>
          <SplitText
            text="صندوق الاقتراحات والشكاوى"
            tag="h2"
            className="font-aref text-3xl sm:text-5xl font-bold text-brand-brown block"
            textAlign="center"
            splitType="words"
            delay={35}
            duration={1}
          />
          <p className="text-brand-muted text-sm sm:text-base">
            نسعى دائماً لتقديم تجربة تليق بكم. أي فكرة لتطوير المطعم أو شكوى بخصوص طلبك تصل مباشرة لإدارة نيو بورسعيد للمتابعة الفورية.
          </p>
        </div>

        {/* Card Box */}
        <div className="bg-brand-cream/80 rounded-[2.5rem] p-6 sm:p-10 shadow-xl border-2 border-brand-orange/20 relative" dir="rtl">
          {submitted ? (
            <div className="py-12 text-center space-y-4 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h3 className="text-2xl font-bold font-aref text-brand-brown">
                تم استلام رسالتك باهتمام وسرية تامة!
              </h3>
              <p className="text-sm text-brand-muted max-w-md mx-auto">
                شكراً لحرصك ومشاركتنا. سيقوم فريق الإدارة بمراجعة الرسالة والتواصل معك في أقرب وقت إذا لزم الأمر.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Type Switcher */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFeedbackType("suggestion")}
                  className={`py-3.5 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 border-2 transition-all ${feedbackType === "suggestion"
                    ? "bg-brand-orange text-white border-brand-orange shadow-md shadow-orange-500/20"
                    : "bg-white text-brand-brown border-brand-orange/20 hover:border-brand-orange/40"
                    }`}
                >
                  <Lightbulb className="w-4 h-4" />
                  <span>اقتراح جديد</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFeedbackType("complaint")}
                  className={`py-3.5 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 border-2 transition-all ${feedbackType === "complaint"
                    ? "bg-red-600 text-white border-red-600 shadow-md shadow-red-500/20"
                    : "bg-white text-brand-brown border-brand-orange/20 hover:border-brand-orange/40"
                    }`}
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>شكوى أو ملاحظة</span>
                </button>
              </div>

              {/* Grid Inputs */}
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-brand-brown mb-1.5">
                    الاسم بالكامل <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: محمد السيد"
                    className="w-full bg-white border border-brand-orange/20 rounded-xl p-3.5 text-sm focus:border-brand-orange outline-none shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-brown mb-1.5">
                    رقم الهاتف للتواصل والمتابعة <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="010XXXXXXXX"
                    dir="ltr"
                    className="w-full bg-white border border-brand-orange/20 rounded-xl p-3.5 text-sm focus:border-brand-orange outline-none shadow-xs text-right font-sans"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-bold text-brand-brown mb-1.5">
                  {feedbackType === "suggestion" ? "تفاصيل اقتراحك لتطوير التجربة:" : "تفاصيل الشكوى أو الملاحظة بخصوص طلبك:"} <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    feedbackType === "suggestion"
                      ? "شاركنا أفكارك، أصناف جديدة تحب نضيفها، أو اقتراحات لتحسين الخدمة..."
                      : "يرجى كتابة تفاصيل ما حدث معك، وقت الطلب، وما واجهته لنقوم بحله فوراً..."
                  }
                  className="w-full bg-white border border-brand-orange/20 rounded-xl p-3.5 text-sm focus:border-brand-orange outline-none resize-none shadow-xs"
                />
              </div>

              {/* Error Alert */}
              {errorMessage && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-bold p-3.5 rounded-xl flex items-center gap-2 animate-in fade-in duration-200">
                  <ShieldAlert className="w-4 h-4 text-red-500 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-dark hover:bg-black text-white py-4 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4 text-brand-orange" />
                <span>{loading ? "جاري الإرسال..." : "إرسال الرسالة إلى الإدارة"}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeedbackSection;
