"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import {
  Flame,
  Award,
  Users,
  Utensils,
  Star,
  MapPin,
  Clock,
  ArrowLeft,
  CalendarCheck,
  Phone,
  Volume2,
  VolumeX,
  Heart,
  Leaf,
  Sparkles,
  ShoppingBag,
  Store,
  Smartphone,
  CheckCircle2,
} from "lucide-react";
import { MENU_ITEMS } from "@/lib/menuData";
import { DishCard } from "@/components/DishCard";
import { DishCarousel } from "@/components/DishCarousel";
import { ReservationSection } from "@/components/ReservationSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import TextLoop from "@/components/TextLoop";
import SplitText from "@/components/SplitText";
import AnimatedCounter from "@/components/AnimatedCounter";
import { useCart } from "@/context/CartContext";

export default function Home() {
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [isHeroMuted, setIsHeroMuted] = useState(true);
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const { addToCart } = useCart();

  const toggleHeroSound = () => {
    if (heroVideoRef.current) {
      heroVideoRef.current.muted = !heroVideoRef.current.muted;
      setIsHeroMuted(heroVideoRef.current.muted);
    }
  };

  return (
    <div className="overflow-x-hidden">
      {/* ============================================================ */}
      {/* 1. HERO SECTION WITH FULL-BLEED VIDEO BACKGROUND */}
      {/* ============================================================ */}
      <section className="relative min-h-screen  flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8 text-center">
        {/* Fallback & Pre-load Hero Image */}
        <img
          src="/hero-img.png"
          alt="مطعم نيو بورسعيد"
          className="absolute inset-0 w-full h-full object-cover -z-20 scale-105"
        />

        {/* Full-Screen Background Video */}
        <video
          ref={heroVideoRef}
          src="/Hero-vid.mp4"
          poster="/hero-img.png"
          autoPlay
          loop
          muted={isHeroMuted}
          playsInline
          className="absolute inset-0 w-full h-full object-cover -z-10 scale-105"
        />






        {/* Centered Hero Content */}

      </section>

      {/* ============================================================ */}
      {/* 2. OUR STORY SECTION */}
      {/* ============================================================ */}
      <section id="story" className="pt-24 px-4 sm:px-6 lg:px-8 bg-brand-cream relative">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-16 items-center">
          {/* Visual Image & Play Video */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white group">
              <img
                src="/story.jpg"
                alt="مطعم نيو بورسعيد من الخارج"
                className="w-full  object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>


              <div className="absolute bottom-4 right-6 text-white text-right">

                <p className="text-lg font-bold font-serif"> أفخم المأكولات والمشويات  </p>
              </div>
            </div>

            {/* Experience Pill */}
            <div className="absolute -bottom-6 -left-6 bg-brand-dark text-white p-6 rounded-3xl shadow-xl hidden sm:block border-2 border-brand-orange/40">
              <p className="text-3xl font-bold font-serif text-brand-orange">5+</p>
              <p className="text-xs font-semibold mt-1">سنوات من الخبرة والعراقة</p>
            </div>
          </div>

          {/* Story Text */}
          <div className="lg:col-span-6 space-y-6 text-right">
            <div className="inline-block text-brand-orange font-serif text-2xl font-bold italic">
              حكايتنا وقصتنا
            </div>

            <SplitText
              text="وُلدت في سوهاج، وصُنعت بشغف وكرم مصري أصيل"
              tag="h2"
              className="font-aref text-3xl sm:text-5xl font-bold text-brand-brown leading-tight block"
              splitType="words"
              delay={35}
              duration={1}
            />

            <p className="text-brand-muted text-base sm:text-lg leading-relaxed">
              من قلب سوهاح الباسلة، انطلقت رحلتنا بحلم بسيط: تقديم طعام مصري حقيقي يحتفي بالنكهة الغنية، ويجمع العائلة والأصدقاء حول موائد عامرة بالمحبة واللذة. نختار لحومنا البلدية بعناية فائقة، ونشويها بطرقنا المتوارثة لنمنحكم تجربة لا تُنسى في كل لقمة.
            </p>



          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* ANIMATED TEXT LOOP RIBBON (AFTER STORY) */}
      {/* ============================================================ */}

      <div className="w-full">
        <TextLoop
          text="طعم على أصوله ✦ من قلب سوهاج ✦ معمول بحب ✦ أكل يفرّح ✦ طعم يستاهل الرجوع"
          shape="wave"
          speed={80}
          direction="forward"
          separator="✦"
          curviness={75}
          fontSize={36}
          fontWeight={700}
          letterSpacing={0}
          uppercase={false}
          color="#ffffff"
          ribbon
          ribbonColor="#F26D21"
          ribbonWidth={76}
          pauseOnHover
        />
      </div>


      {/* ============================================================ */}
      {/* 3. SIGNATURE DISHES CAROUSEL SECTION */}
      {/* ============================================================ */}
      <section id="dishes" className="pb-24 px-4 sm:px-6 lg:px-8 bg-brand-cream  relative overflow-hidden">
        {/* Background Ambient Glows */}
        <div className="absolute right-0 top-1/3 w-96 h-96 bg-brand-orange/5 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute left-0 bottom-1/4 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <span className="text-brand-orange font-aref text-2xl sm:text-3xl font-bold tracking-wide block">
              أطباقنا الأكثر شهرة وطلباً
            </span>
            <SplitText
              text="أطايب ومشاوي نيو بورسعيد"
              tag="h2"
              className="font-aref text-4xl sm:text-5xl lg:text-6xl font-bold text-brand-brown tracking-tight block"
              textAlign="center"
              splitType="words"
              delay={35}
              duration={1}
            />
            <p className="text-brand-muted text-sm sm:text-base max-w-xl mx-auto font-medium">
              تصفح أشهى المشويات على الفحم، الصواني الملكية، وطواجن الفخار المصرية المحضرة بالخلطة السرية.
            </p>
          </div>

          {/* Interactive Delicious Dishes Carousel */}
          <DishCarousel />

          {/* View Full Menu CTA */}
          <div className="text-center mt-12">
            <Link
              href="/menu"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-brand-orange to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-10 py-4 rounded-2xl font-bold text-base shadow-xl shadow-orange-500/25 hover:scale-105 active:scale-95 transition-all group"
            >
              <span>استكشف القائمة الكاملة </span>
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. STATS COUNTER BAR */}
      {/* ============================================================ */}
      <section className="bg-gradient-to-r from-brand-orange via-orange-600 to-amber-600 py-16 px-4 sm:px-6 lg:px-8 text-white relative overflow-hidden shadow-inner">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 text-center relative z-10">
          <div className="space-y-2 p-4">
            <Award className="w-10 h-10 mx-auto opacity-90 mb-2" />
            <p className="text-4xl sm:text-5xl font-extrabold font-aref">
              <AnimatedCounter end={5} suffix="+" duration={2} />
            </p>
            <p className="text-xs sm:text-sm font-semibold tracking-wide text-white/90">
              سنوات من التميز والشغف
            </p>
          </div>

          <div className="space-y-2 p-4">
            <Utensils className="w-10 h-10 mx-auto opacity-90 mb-2" />
            <p className="text-4xl sm:text-5xl font-extrabold font-aref">
              <AnimatedCounter end={25} suffix="+" duration={2.2} />
            </p>
            <p className="text-xs sm:text-sm font-semibold tracking-wide text-white/90">
              طبق ووصفة حصرية خاصة
            </p>
          </div>

          <div className="space-y-2 p-4">
            <Users className="w-10 h-10 mx-auto opacity-90 mb-2" />
            <p className="text-4xl sm:text-5xl font-extrabold font-aref">
              <AnimatedCounter end={10000} suffix="+" duration={2.5} />
            </p>
            <p className="text-xs sm:text-sm font-semibold tracking-wide text-white/90">
              عميل وضيف سعيد
            </p>
          </div>

          <div className="space-y-2 p-4">
            <Store className="w-10 h-10 mx-auto opacity-90 mb-2" />
            <p className="text-4xl sm:text-5xl font-extrabold font-aref">
              <AnimatedCounter end={1} duration={1.8} />
            </p>
            <p className="text-xs sm:text-sm font-semibold tracking-wide text-white/90">
              فرعنا في قلب سوهاج
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. TESTIMONIALS SECTION */}
      {/* ============================================================ */}
      {/* <section id="reviews" className="py-24 px-4 sm:px-6 lg:px-8 bg-brand-cream paper-texture relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-brand-orange font-serif text-2xl font-bold italic">
              آراء ضيوفنا الكرام
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-brand-brown">
              بيقولوا إيه عن نيو بورسعيد؟
            </h2>
            <p className="text-brand-muted text-sm sm:text-base">
              فخورون بثقة ضيوفنا وتقييماتهم الرائعة على مدار السنوات
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-brand-orange/15 relative flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex text-amber-500 gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500" />
                  ))}
                </div>
                <p className="text-brand-brown text-base leading-relaxed font-medium">
                  "أحلى مشويات أكلتها في بورسعيد بلا منازع! الكباب دايب دوب والتتبيلة مظبوطة بالملي، وخدمة الشباب ممتازة وسريعة جداً."
                </p>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                <div className="w-12 h-12 rounded-full bg-brand-orange/20 text-brand-orange font-bold flex items-center justify-center font-serif text-lg">
                  ن
                </div>
                <div>
                  <h4 className="font-bold text-brand-brown text-sm">نورهان علي</h4>
                  <p className="text-xs text-brand-muted">دليل محلي - مرشد جوجل</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-xl border-2 border-brand-orange/30 relative flex flex-col justify-between space-y-6 md:-translate-y-3">
              <div className="absolute -top-3.5 right-6 bg-brand-orange text-white px-3 py-0.5 rounded-full text-[11px] font-bold shadow">
                أحدث تقييم
              </div>
              <div className="space-y-4">
                <div className="flex text-amber-500 gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500" />
                  ))}
                </div>
                <p className="text-brand-brown text-base leading-relaxed font-medium">
                  "المكان المفضل لعائلتنا كل ويك إند. طاجن اللحمة بالبصل وصينية الباشا الملكية حكاية تانية خالص! شكراً على المستوى الراقي."
                </p>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                <div className="w-12 h-12 rounded-full bg-brand-dark/20 text-brand-dark font-bold flex items-center justify-center font-serif text-lg">
                  أ
                </div>
                <div>
                  <h4 className="font-bold text-brand-brown text-sm">المهندس أحمد محمود</h4>
                  <p className="text-xs text-brand-muted">عميل دائم</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg border border-brand-orange/15 relative flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex text-amber-500 gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500" />
                  ))}
                </div>
                <p className="text-brand-brown text-base leading-relaxed font-medium">
                  "تجربة استثنائية من لحظة الدخول والاستقبال وحتى الحلى. أم علي بالقشطة ختام مثالي للعزومة! أنصح الجميع بزيارته."
                </p>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                <div className="w-12 h-12 rounded-full bg-brand-gold/30 text-brand-brown font-bold flex items-center justify-center font-serif text-lg">
                  س
                </div>
                <div>
                  <h4 className="font-bold text-brand-brown text-sm">سارة خليل</h4>
                  <p className="text-xs text-brand-muted">مدونة طعام وسياحة</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* ============================================================ */}
      {/* 6. MOMENTS GALLERY SECTION */}
      {/* ============================================================ */}
      {/* 6. MOMENTS GALLERY SECTION */}
      {/* ============================================================ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-brand-cream">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
            <div className="space-y-2 text-right">
              <span className="text-brand-orange font-aref text-2xl sm:text-3xl font-bold block">
                لحظاتنا وأجواؤنا
              </span>
              <SplitText
                text="شوف لحظات لا تُنسى في نيو بورسعيد"
                tag="h2"
                className="font-aref text-3xl sm:text-5xl font-bold text-brand-brown block"
                splitType="words"
                delay={35}
                duration={1}
              />
              <p className="text-brand-muted text-sm sm:text-base">
                ذكريات ولمّات حلوة من قلب مطعمنا وسفرة عامرة بالحب
              </p>
            </div>
          </div>

          {/* Masonry Asymmetric Grid with Real Gallery Images */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[240px]">
            {/* Gallery Image 1: Main Group with Logo */}
            <div className="col-span-1 sm:col-span-2 row-span-2 rounded-3xl overflow-hidden group relative shadow-xl border-2 border-brand-orange/20">
              <img
                src="/gallery/1.jpg"
                alt="لمة الأصدقاء في مطعم نيو بورسعيد"
                className="w-full h-full object-cover group-hover:scale-108 transition duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex items-end">
                <span className="text-white font-bold text-lg font-aref">لمة الأحباب في قلب مطعم نيو بورسعيد</span>
              </div>
            </div>

            {/* Gallery Image 2: Chef Serving Big Feast */}
            <div className="row-span-2 rounded-3xl overflow-hidden group relative shadow-xl border-2 border-brand-orange/20">
              <img
                src="/gallery/2.jpg"
                alt="الشيف يخدم العزومات والمشويات"
                className="w-full h-full object-cover group-hover:scale-108 transition duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex items-end">
                <span className="text-white font-bold text-base font-aref">خدمة فندقية وسفرة عزومات فاخرة</span>
              </div>
            </div>

            {/* Gallery Image 3: Celebrations and Big Gathering */}
            <div className="rounded-3xl overflow-hidden group relative shadow-xl border-2 border-brand-orange/20">
              <img
                src="/gallery/3.jpg"
                alt="فرحة العائلات والاحتفالات"
                className="w-full h-full object-cover group-hover:scale-108 transition duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex items-end">
                <span className="text-white font-bold text-sm font-aref">أحلى الأوقات والاحتفالات</span>
              </div>
            </div>

            {/* Gallery Image 4: Outdoor Terrace Gathering */}
            <div className="rounded-3xl overflow-hidden group relative shadow-xl border-2 border-brand-orange/20">
              <img
                src="/gallery/4.jpg"
                alt="جلسات التراس الخارجي المضيئة"
                className="w-full h-full object-cover group-hover:scale-108 transition duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex items-end">
                <span className="text-white font-bold text-sm font-aref">جلسات خارجية ساحرة</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6.5. TESTIMONIALS SECTION ("ريفيوهات بتحكي") */}
      {/* ============================================================ */}
      <TestimonialsSection />


      {/* 7. BRANCH SECTION (SOHAG) */}
      {/* ============================================================ */}
      <section id="branches" className="py-24 px-4 sm:px-6 lg:px-8 bg-brand-cream relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-brand-orange font-aref text-2xl font-bold block">
              موقعنا في خدمتك
            </span>
            <SplitText
              text="مستنيينك تنورنا في فرع سوهاج"
              tag="h2"
              className="font-aref text-3xl sm:text-5xl font-bold text-brand-brown block"
              textAlign="center"
              splitType="words"
              delay={35}
              duration={1}
            />
            <p className="text-brand-muted text-sm sm:text-base">
              جلسات عائلية فاخرة وخدمة فندقية في قلب محافظة سوهاج
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-brand-orange/20 flex flex-col md:flex-row gap-8 items-center group hover:border-brand-orange/40 transition-all">
              <div className="w-full md:w-1/2 h-64 sm:h-80 overflow-hidden rounded-2xl bg-gray-100 relative shadow-md">
                <img
                  src="/branch.png"
                  alt="فرع مطعم نيو بورسعيد في سوهاج"
                  className="h-full w-full object-cover group-hover:scale-105 transition duration-700"
                />
                <div className="absolute top-3 right-3 bg-brand-orange text-white text-xs font-bold px-3.5 py-1 rounded-full shadow-md">
                  فرع سوهاج الرئيسي
                </div>
              </div>

              <div className="w-full md:w-1/2 space-y-5 text-right">
                <div>
                  <h3 className="font-aref font-bold text-3xl text-brand-brown mb-2">
                    مطعم نيو بورسعيد - سوهاج
                  </h3>
                  <p className="text-sm text-brand-muted flex items-start gap-2 leading-relaxed">
                    <MapPin className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                    <span>سوهاج الجديدة - مول ريتاج 1 - محافظة سوهاج</span>
                  </p>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-brand-brown bg-brand-cream p-3.5 rounded-xl border border-brand-orange/15">
                    <Clock className="w-4 h-4 text-brand-orange shrink-0" />
                    <span>مواعيد العمل: ١٢:٠٠ ظهراً حتى ٠٢:٠٠ بعد منتصف الليل</span>
                  </div>

                  <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-brand-brown bg-brand-cream p-3.5 rounded-xl border border-brand-orange/15">
                    <Phone className="w-4 h-4 text-brand-orange shrink-0" />
                    <span>خدمة الدليفري والحجز: <span dir="ltr" className="font-bold font-sans">01007375151</span></span>
                  </div>
                </div>

                <a
                  href="https://maps.app.goo.gl/ygWeMaiA9ZP5QNsd6"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-gradient-to-r from-brand-orange to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 hover:scale-102 active:scale-95 transition"
                >
                  <MapPin className="w-5 h-5" />
                  <span>الموقع على خرائط جوجل (Google Maps)</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 8. DELIVERY PROMO SECTION */}
      {/* ============================================================ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-brand-orange to-orange-600 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-1/3 h-full bg-white/10 blob-shape -z-0 translate-x-1/4 -translate-y-1/4"></div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-7 space-y-6 text-right">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-sm">
              <Smartphone className="w-4 h-4" />
              <span>توصيل دليفري سريع وساخن</span>
            </span>

            <SplitText
              text="أكلك المفضل من نيو بورسعيد يوصلك لحد باب بيتك سخن ومقرمش!"
              tag="h2"
              className="font-aref text-3xl sm:text-5xl font-bold leading-tight block text-white"
              splitType="words"
              delay={35}
              duration={1}
            />

            <p className="text-white/90 text-base sm:text-lg max-w-xl leading-relaxed">
              اطلب الآن عبر موقعنا الإلكتروني، واستمتع بأسرع خدمة توصيل مجهزة بصناديق حرارية تحافظ على نكهة الفحم وسخونة الطواجن.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                href="/menu"
                className="bg-brand-dark hover:bg-black text-white px-8 py-4 rounded-2xl font-bold text-base shadow-xl flex items-center gap-3 transition hover:scale-105"
              >
                <ShoppingBag className="w-5 h-5 text-brand-orange" />
                <span>اطلب أونلاين الآن</span>
              </Link>

              <a

                href="tel:01234567890"
                className="bg-white/15 hover:bg-white/25 text-white border border-white/30 px-6 py-4 rounded-2xl font-bold text-base transition backdrop-blur-sm"
              >
                <span >الخط الساخن: <span dir="ltr" > 012-345-678-90</span>   </span>
              </a>
            </div>
          </div>



          <div className="lg:col-span-5 flex justify-center">


            <img
              src='/delivery.png'
              alt="تطبيق نيو بورسعيد للجوال"
              className="w-full"
            />
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 9. TABLE RESERVATION SECTION */}
      {/* ============================================================ */}
      {/* <ReservationSection /> */}


    </div>
  );
}
