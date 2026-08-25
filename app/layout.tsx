import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { Navbar } from "@/components/Navbar";
import { CartDrawer } from "@/components/CartDrawer";
import { Footer } from "@/components/Footer";

const changa = localFont({
  src: [
    {
      path: "../public/fonts/Changa-Regular-2.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Changa-SemiBold-2.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/Changa-Bold-2.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-changa",
  display: "swap",
});

const arefRuqaa = localFont({
  src: [
    {
      path: "../public/fonts/ArefRuqaa-Regular-1.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/ArefRuqaa-Bold-1.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-aref-ruqaa",
  display: "swap",
});

export const metadata: Metadata = {
  title: "مطعم نيو بورسعيد | تجربة المذاق الأصيل والمشويات الفاخرة",
  description:
    "مرحباً بكم في مطعم نيو بورسعيد. ٥ سنوات من الشغف في تقديم أشهى المشويات على الفحم، الطواجن المصرية، والصواني العائلية الفاخرة.",
  keywords: [
    "مطعم نيو بورسعيد",
    "مشويات بورسعيد",
    "كباب وكفتة",
    "طواجن مصرية",
    "أكل بورسعيدي",
    "حجز طاولة",
    "منيو نيو بورسعيد",
  ],
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "مطعم نيو بورسعيد | New Port Said Restaurant",
    description: "أصالة الطعم البورسعيدي والمشويات على الفحم",
    locale: "ar_EG",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${changa.variable} ${arefRuqaa.variable}`}>
      <body className="bg-brand-cream text-brand-text min-h-screen flex flex-col antialiased selection:bg-brand-orange selection:text-white font-sans">
        <CartProvider>
          <Navbar />
          <CartDrawer />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
