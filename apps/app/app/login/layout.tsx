import DecorativeImage from "@igraph/ui/components/DecorativeImage";
import { Metadata } from "next";

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`max-w-screen-xl mx-auto p-3 grid grid-cols-1 grid-rows-[auto_1fr_auto] min-h-screen`}
    >
      <main className="relative">
        <DecorativeImage />
        {children}
      </main>
    </div>
  );
}

export const metadata: Metadata = {
  title: `🔏 ورود یا ثبت نام`,
  description:
    "ورود یا ثبت‌نام در آی‌گرافیکال به شما امکان دسترسی به دوره‌ها، ذخیره پیشرفت، دریافت گواهی و ارتباط مستقیم با مدرسین را می‌دهد.",
};
