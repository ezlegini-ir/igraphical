import "@igraph/ui/globals.css";
import { Toaster } from "sonner";
import "./fonts.css";
import { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      style={{ fontFamily: "KalamehWebFaNum" }}
      lang="fa"
      dir="rtl"
      className="antialiased custom-scrollbar"
    >
      <GoogleAnalytics gaId={process.env.GA_MEASUREMENT_ID!} />
      <body>
        {children}
        <Toaster
          theme="system"
          position="top-right"
          richColors
          style={{ fontFamily: "KalamehWebFaNum" }}
        />
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  title: {
    default: "آی‌گرافیکال",
    template: "%s - آی‌گرافیکال",
  },
  description: "آی‌گرافیکال: جایی که خلاقیت جان می‌گیرد!",
  icons: {
    icon: "/favicon.svg",
  },
  keywords: [
    "آی‌گرافیکال",
    "آی گرافیک",
    "igraphical",
    "آموزش گرافیک",
    "دیزاین",
    "آموزش ایلاستریتور",
    "آموزش فتوشاپ",
    "طراحی بسته‌بندی",
    "طراحی لوگو",
    "گرافیک دیزاین",
  ],
  authors: [{ name: "iGraphical", url: process.env.NEXT_PUBLIC_BASE_URL }],
  creator: "iGraphical",
  publisher: "iGraphical",
  openGraph: {
    title: "آی‌گرافیکال",
    description: "آی‌گرافیکال: جایی که خلاقیت جان می‌گیرد!",
    url: process.env.NEXT_PUBLIC_BASE_URL,
    siteName: "iGraphical",
    locale: "fa_IR",
    type: "website",
    images: [
      {
        url: "/og-cover.png",
        width: 1200,
        height: 630,
        alt: "iGraphical",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "آی‌گرافیکال",
    description: "آی‌گرافیکال: جایی که خلاقیت جان می‌گیرد!",
    images: ["/og-cover.png"],
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL!),
  alternates: {
    canonical: "/",
  },
};
