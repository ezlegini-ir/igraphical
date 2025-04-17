import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import DecorativeImage from "@igraph/ui/components/DecorativeImage";
import NotifBar from "@igraph/ui/components/NotifBar";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
      </main>
      <Footer />
    </div>
  );
}
