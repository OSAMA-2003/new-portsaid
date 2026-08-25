"use client";

import React, { useState } from "react";
import { CalendarCheck, Users, Clock, CheckCircle2, Phone, MapPin, Sparkles } from "lucide-react";

export const ReservationSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    guests: "2",
    branch: "portsaid-main",
    notes: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.date || !formData.time) {
      alert("يرجى ملء جميع الحقول المطلوبة لتأكيد حجزك.");
      return;
    }
    setSubmitted(true);
  };

  return (
    <section id="reserve" className="py-24 px-4 sm:px-6 lg:px-8 bg-brand-cream relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/2 -right-32 w-96 h-96 bg-brand-orange/10 blob-shape -z-0 blur-2xl"></div>
      <div className="absolute bottom-0 -left-20 w-80 h-80 bg-brand-dark/5 rounded-full -z-0 blur-xl"></div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center relative z-10">
        {/* Left Column: Heading & Value Proposition */}
        <div className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-orange/15 text-brand-orange text-sm font-bold border border-brand-orange/30">
            <Sparkles className="w-4 h-4" />
            <span>جلسات مريحة وضيافة خاصة</span>
          </div>

          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-brand-brown leading-tight">
            احجز طاولتك<br />
            <span className="text-brand-orange">وعِش التجربة البورسعيدية</span>
          </h2>

          <p className="text-brand-muted text-base sm:text-lg leading-relaxed">
            سواء كانت مناسبة خاصة، عشاء عائلي، أو لمة صحاب، فريقنا جاهز لاستقبالكم وتقديم أفضل خدمة ومذاق يليق بكم.
          </p>

          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-3 text-brand-brown font-semibold text-sm sm:text-base">
              <CheckCircle2 className="w-5 h-5 text-brand-orange shrink-0" />
              <span>تأكيد فوري للحجز وضمان أفضل الأماكن</span>
            </div>
            <div className="flex items-center gap-3 text-brand-brown font-semibold text-sm sm:text-base">
              <CheckCircle2 className="w-5 h-5 text-brand-orange shrink-0" />
              <span>غرف خاصة ومناطق عائلية هادئة</span>
            </div>
            <div className="flex items-center gap-3 text-brand-brown font-semibold text-sm sm:text-base">
              <CheckCircle2 className="w-5 h-5 text-brand-orange shrink-0" />
              <span>ترتيبات خاصة لأعياد الميلاد والاحتفالات</span>
            </div>
          </div>

          {/* Hotline Box */}
          <div className="p-4 bg-white rounded-2xl border border-brand-orange/20 shadow-sm flex items-center justify-between mt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-brand-orange text-white flex items-center justify-center shadow-md">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-brand-muted font-medium">للحجز والاستفسار المباشر:</p>
                <p dir="ltr" className="text-lg font-bold text-brand-brown font-mono">
                  012 345 678 90
                </p>
              </div>
            </div>
            <a
              href="tel:01234567890"
              className="px-4 py-2 rounded-xl bg-brand-orange/10 hover:bg-brand-orange text-brand-orange hover:text-white font-bold text-xs transition"
            >
              اتصال فوري
            </a>
          </div>
        </div>

        {/* Right Column: Interactive Booking Form */}
        <div className="lg:col-span-7">
          <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-brand-orange/20 relative">
            {submitted ? (
              <div className="text-center py-12 space-y-4 animate-in fade-in zoom-in-95 duration-400">
                <div className="w-20 h-20 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold font-serif text-brand-brown">
                  تم استلام طلب حجزك بنجاح! 🎉
                </h3>
                <p className="text-brand-muted max-w-md mx-auto text-sm leading-relaxed">
                  شكراً لك يا <strong>{formData.name}</strong>. سيقوم موظف الاستقبال بالتواصل معك على الرقم{" "}
                  <strong dir="ltr">{formData.phone}</strong> خلال دقائق لتأكيد الموعد وتجهيز طاولتك.
                </p>
                <div className="bg-brand-cream p-4 rounded-2xl border border-brand-orange/20 text-xs font-semibold text-brand-brown max-w-sm mx-auto">
                  <p>
                    📅 التاريخ: {formData.date} | ⏰ الوقت: {formData.time}
                  </p>
                  <p className="mt-1">👥 عدد الأفراد: {formData.guests} أفراد</p>
                </div>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 inline-block text-xs font-bold text-brand-orange underline hover:text-orange-700"
                >
                  تعديل بيانات الحجز أو حجز طاولة أخرى
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="border-b border-gray-100 pb-4 mb-4">
                  <h3 className="text-xl font-bold font-serif text-brand-brown">
                    استمارة الحجز المسبق
                  </h3>
                  <p className="text-xs text-brand-muted mt-1">
                    يرجى تعبئة التفاصيل أدناه لتأكيد مقعدك
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-brand-brown mb-1.5">
                      الاسم بالكامل *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: أحمد محمود"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-brand-cream/50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-orange focus:bg-white transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-brown mb-1.5">
                      رقم الهاتف للتأكيد *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="010 / 011 / 012 / 015"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-brand-cream/50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-orange focus:bg-white transition"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-brand-brown mb-1.5">
                      اختر الفرع *
                    </label>
                    <select
                      value={formData.branch}
                      onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                      className="w-full bg-brand-cream/50 border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-brand-orange focus:bg-white transition"
                    >
                      <option value="portsaid-main">بورسعيد - شارع ٢٣ يوليو</option>
                      <option value="portfouad">بورفؤاد - شارع الجمهورية</option>
                      <option value="cairo-korba">القاهرة - مصر الجديدة (الكوربة)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-brown mb-1.5">
                      تاريخ الحجز *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full bg-brand-cream/50 border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-brand-orange focus:bg-white transition text-gray-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-brown mb-1.5">
                      وقت الحضور *
                    </label>
                    <input
                      type="time"
                      required
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full bg-brand-cream/50 border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-brand-orange focus:bg-white transition text-gray-700"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-brand-brown mb-1.5">
                      عدد الأفراد
                    </label>
                    <select
                      value={formData.guests}
                      onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                      className="w-full bg-brand-cream/50 border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-brand-orange focus:bg-white transition"
                    >
                      <option value="1">فرد واحد</option>
                      <option value="2">فردين (طاولة ثنائية)</option>
                      <option value="3">٣ أفراد</option>
                      <option value="4">٤ أفراد (طاولة عائلية)</option>
                      <option value="6">٦ أفراد</option>
                      <option value="8+">٨ أفراد فأكثر (عزومة خاصة)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-brown mb-1.5">
                      ملاحظات أو طلبات خاصة (اختياري)
                    </label>
                    <input
                      type="text"
                      placeholder="جلسة هادئة، احتفال، كرسي أطفال..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full bg-brand-cream/50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-orange focus:bg-white transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-brand-orange to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-4 rounded-2xl font-bold text-base shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 mt-4"
                >
                  <CalendarCheck className="w-5 h-5" />
                  <span>تأكيد طلب الحجز الآن</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
