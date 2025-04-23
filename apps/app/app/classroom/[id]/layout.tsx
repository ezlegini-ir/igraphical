import NavBar from "@/components/NavBar";
import SimpleFooter from "@/components/SimpleFooter";
import { authenticateSession } from "@/lib/auth";
import DecorativeImage from "@igraph/ui/components/DecorativeImage";
import NotifBar from "@igraph/ui/components/NotifBar";
import { Metadata } from "next";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await authenticateSession();

  return (
    <div
      className={`px-3 lg:px-10 py-3 grid grid-cols-1 grid-rows-[auto_1fr_auto] h-screen`}
    >
      <div>
        <NotifBar />
        <NavBar />
      </div>
      <main className="relative py-6 lg:py-10">
        <DecorativeImage />
        {children}
      </main>
      <SimpleFooter />
    </div>
  );
}

export const metadata: Metadata = {
  title: {
    default: "کلاس درس",
    template: "%s - کلاس درس",
  },
  description: "کلاس درس آی گرافیکال، جایی که مهارت آموزشی شکل می گیرد.",
};
