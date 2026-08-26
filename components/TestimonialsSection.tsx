"use client";

import React, { useState, useEffect } from "react";
import { Star, Plus, Check, MessageSquareHeart } from "lucide-react";
import SplitText from "@/components/SplitText";
import { submitCustomerReview, getApprovedCustomerReviews, DbCustomerReview } from "@/lib/dbService";

export const TESTIMONIALS_IMAGES = [
  { id: 1, src: "/testimonials/1.jpg", alt: "ريفيو عميل عن طواجن نيو بورسعيد" },
  { id: 2, src: "/testimonials/2.jpg", alt: "ريفيو عميل عن مشويات نيو بورسعيد" },
  { id: 3, src: "/testimonials/3.jpg", alt: "ريفيو عميل عن صواني وعزومات نيو بورسعيد" },
  { id: 4, src: "/testimonials/4.jpg", alt: "ريفيو عميل عن خدمة وطعم نيو بورسعيد" },
  { id: 5, src: "/testimonials/5.jpg", alt: "ريفيو عميل عن جودة ولذاذة الأكل" },
  { id: 6, src: "/testimonials/6.jpg", alt: "ريفيو عميل عن كرم وضيافة نيو بورسعيد" },
];

export const TestimonialsSection: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [approvedReviews, setApprovedReviews] = useState<DbCustomerReview[]>([]);

  // Review Form State
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formRating, setFormRating] = useState(5);
  const [formComment, setFormComment] = useState("");
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  // Load approved reviews
  useEffect(() => {
    getApprovedCustomerReviews().then((revs) => {
      if (revs && revs.length > 0) {
        setApprovedReviews(revs);
      }
    });
  }, []);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formComment.trim()) return;

    setFormSubmitting(true);
    try {
      await submitCustomerReview({
        name: formName.trim(),
        phone: formPhone.trim(),
        rating: formRating,
        comment: formComment.trim(),
      });
      setFormSuccess(true);
      setTimeout(() => {
        setIsReviewModalOpen(false);
        setFormSuccess(false);
        setFormName("");
        setFormPhone("");
        setFormRating(5);
        setFormComment("");
      }, 2500);
    } catch (err) {
      console.error(err);
      alert("تعذر إرسال التقييم، يرجى المحاولة مرة أخرى.");
    } finally {
      setFormSubmitting(false);
    }
  };

  // Combine image cards with dynamic customer reviews
  const marqueeCards = [...TESTIMONIALS_IMAGES, ...TESTIMONIALS_IMAGES, ...TESTIMONIALS_IMAGES];

  return (
    <section id="reviews" className="py-20 bg-brand-cream/80 relative overflow-hidden ">
      {/* Background Decorative Glows */}
      <div className="absolute right-0 top-1/4 w-96 h-96 bg-brand-orange/5 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute left-0 bottom-1/4 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="space-y-3 text-right">
            <span className="text-brand-orange font-aref text-2xl sm:text-3xl font-bold block">
              آراء وتجارب حقيقية
            </span>
            <SplitText
              text="ريفيوهات بتحكي • كلام حبايبنا"
              tag="h2"
              className="text-3xl sm:text-5xl font-bold font-aref text-brand-brown block"
              splitType="words"
              delay={35}
              duration={1}
            />
            <p className="text-brand-muted text-sm sm:text-base max-w-xl">
              شهادات وتقييمات زبائننا الكرام وأهل سوهاج اللي بنتشرف بخدمتهم يومياً بأعلى معايير الكرم والجودة.
            </p>
          </div>

          {/* Add Review Button */}
          <button
            onClick={() => setIsReviewModalOpen(true)}
            className="inline-flex items-center gap-2.5 bg-gradient-to-r from-brand-orange to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-orange-500/25 hover:scale-105 active:scale-95 transition-all self-end md:self-auto"
          >
            <Plus className="w-5 h-5" />
            <span> أضف رأيك وتجربتك</span>
          </button>
        </div>
      </div>

      {/* Infinite Seamless Marquee Track (Right-to-Left) */}
      <div className="relative w-full overflow-hidden py-3" dir="ltr">
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-brand-cream to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-brand-cream to-transparent z-10 pointer-events-none" />

        <div
          className="animate-marquee-rtl flex gap-6"
          style={{ animationDuration: "35s" }}
        >
          {/* Render Approved User Reviews if available */}
          {approvedReviews.map((rev) => (
            <div
              key={rev.id}
              className="w-[280px] sm:w-[320px] lg:w-[350px] shrink-0 rounded-[2.5rem] bg-white p-6 shadow-xl hover:shadow-2xl border-2 border-brand-orange/30 hover:border-brand-orange transition-all duration-500 flex flex-col justify-between select-none relative"
              dir="rtl"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < rev.rating
                          ? "fill-brand-orange text-brand-orange"
                          : "text-gray-300"
                          }`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] font-bold text-brand-orange bg-brand-orange/10 px-2.5 py-0.5 rounded-full">
                    رأي معتمد
                  </span>
                </div>

                <p className="text-brand-brown text-sm sm:text-base font-semibold leading-relaxed line-clamp-5">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-brand-orange/15 flex items-center justify-between mt-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-brand-orange/20 text-brand-brown font-bold flex items-center justify-center font-aref text-base">
                    {rev.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-brown text-sm">{rev.name}</h4>
                    <p className="text-[11px] text-brand-muted">عميل نيو بورسعيد</p>
                  </div>
                </div>
                <MessageSquareHeart className="w-5 h-5 text-brand-orange/70" />
              </div>
            </div>
          ))}

          {/* Graphic Cards */}
          {marqueeCards.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              onClick={() => setSelectedImage(item.src)}
              className="w-[280px] sm:w-[320px] lg:w-[350px] shrink-0 rounded-[2.5rem] bg-white p-3 shadow-xl hover:shadow-2xl border-2 border-brand-orange/20 hover:border-brand-orange/60 transition-all duration-500 group cursor-pointer overflow-hidden hover:-translate-y-2 select-none"
              dir="rtl"
            >
              <div className="relative aspect-square w-full rounded-[2rem] overflow-hidden bg-brand-cream/60">
                <img
                  src={item.src}
                  alt={item.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                />

                <div className="absolute inset-0 bg-brand-dark/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-brand-orange text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg border border-white/20">
                    انقر للتكبير
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-xl w-full rounded-3xl overflow-hidden shadow-2xl border-2 border-white/20 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={selectedImage} alt="ريفيو عميل" className="w-full h-auto object-contain" />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-black/70 hover:bg-brand-orange text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition shadow-lg"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* User Review Submission Modal */}
      {isReviewModalOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsReviewModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border-2 border-brand-orange/30 relative text-right space-y-6 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-2xl font-bold font-aref text-brand-brown">
                  شاركنا رأيك وتجربتك
                </h3>
                <p className="text-xs text-brand-muted mt-1">
                  رأيك يسعدنا ويساعدنا في تقديم الأفضل دائماً
                </p>
              </div>
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="w-9 h-9 rounded-full bg-gray-100 hover:bg-brand-orange hover:text-white flex items-center justify-center transition font-bold"
              >
                ✕
              </button>
            </div>

            {formSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto shadow-inner">
                  <Check className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold font-aref text-brand-brown">
                  شكراً جزيلاً لتقييمك الكريم
                </h4>
                <p className="text-xs text-brand-muted">
                  تم استلام رأيك بنجاح وسيتم اعتماده ونشره في الموقع قريباً.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                {/* Rating Stars Selector */}
                <div>
                  <label className="block text-xs font-bold text-brand-brown mb-1.5">
                    تقييمك العام للمطعم:
                  </label>
                  <div className="flex items-center gap-2 bg-brand-cream/80 p-3 rounded-2xl border border-brand-orange/20 justify-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setFormRating(star)}
                        className="p-1 hover:scale-125 transition-transform"
                      >
                        <Star
                          className={`w-7 h-7 ${star <= formRating
                            ? "fill-brand-orange text-brand-orange"
                            : "text-gray-300"
                            }`}
                        />
                      </button>
                    ))}
                    <span className="text-sm font-bold text-brand-brown mr-2 font-sans">
                      ({formRating} من 5)
                    </span>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-xs font-bold text-brand-brown mb-1">
                    الاسم الكريم <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="مثال: أحمد مصطفى"
                    className="w-full bg-brand-cream/60 border border-brand-orange/20 rounded-xl p-3 text-sm focus:border-brand-orange outline-none"
                  />
                </div>

                {/* Phone (Optional) */}
                <div>
                  <label className="block text-xs font-bold text-brand-brown mb-1">
                    رقم الهاتف (اختياري للتحقق):
                  </label>
                  <input
                    type="tel"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="010XXXXXXXX"
                    dir="ltr"
                    className="w-full bg-brand-cream/60 border border-brand-orange/20 rounded-xl p-3 text-sm focus:border-brand-orange outline-none text-right font-sans"
                  />
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-xs font-bold text-brand-brown mb-1">
                    رأيك وتجربتك في الأكل والخدمة <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formComment}
                    onChange={(e) => setFormComment(e.target.value)}
                    placeholder="اكتب تفاصيل تجربتك، ألذ الأصناف اللي جربتها، ورأيك في الخدمة..."
                    className="w-full bg-brand-cream/60 border border-brand-orange/20 rounded-xl p-3 text-sm focus:border-brand-orange outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="w-full bg-gradient-to-r from-brand-orange to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-orange-500/25 transition flex items-center justify-center gap-2"
                >
                  {formSubmitting ? "جاري الإرسال..." : "إرسال التقييم الآن"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default TestimonialsSection;
