import FloatingBanner from "@/components/FloatingBanner";
import Footer from "@/components/Footer";
import MobileNavbar from "@/components/MobileNavbar";
import NavBar from "@/components/NavBar";
import { getFloatingBanner } from "@/data/floatingBanner";
import DecorativeImage from "@igraph/ui/components/DecorativeImage";
import NotifBar from "@igraph/ui/components/NotifBar";

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const floatingBanner = await getFloatingBanner();

  return (
    <div
      className={`antialiased max-w-screen-xl mx-auto p-4 grid grid-rows-[auto_1fr_auto] min-h-screen`}
    >
      <div>
        <NotifBar />
        <NavBar />
      </div>
      <main className="relative">
        <DecorativeImage />
        {children}
        <FloatingBanner floatingBanner={floatingBanner} />
        <MobileNavbar />
      </main>
      <Footer />
    </div>
  );
}
