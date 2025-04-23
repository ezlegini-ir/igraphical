import { bgPattern } from "@/public";
import Image from "next/image";
import NotifBar from "@igraph/ui/components/NotifBar";
import { Metadata } from "next";
import SimpleFooter from "@/components/SimpleFooter";
import { authenticateSession } from "@/lib/auth";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await authenticateSession();

  return (
    <div
      className={`max-w-screen-xl mx-auto p-3 grid grid-cols-1 grid-rows-[auto_1fr_auto] h-screen `}
    >
      <div>
        <NotifBar />
      </div>
      <main className="relative mt-20">
        <Image
          width={500}
          height={500}
          src={bgPattern}
          alt=""
          className="absolute -top-40 md:right-40 select-none pointer-events-none -z-10"
        />
        {children}
      </main>
      <SimpleFooter />
    </div>
  );
}

export const metadata: Metadata = {
  title: {
    default: "سبد خرید",
    template: "%s - آی‌گرافیکال",
  },
  description: "آی‌گرافیکال: جایی که خلاقیت جان می‌گیرد!",
};
