import { SideBar } from "@/app/panel/components/SideBar";
import { getSessionUser } from "@/data/user";
import { authenticateSession } from "@/lib/auth";
import NotifBar from "@igraph/ui/components/NotifBar";
import { Button } from "@igraph/ui/components/ui/button";
import {
  SidebarProvider,
  SidebarTrigger,
} from "@igraph/ui/components/ui/sidebar";
import UserBar from "@igraph/ui/components/UserBar";
import { Home } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  await authenticateSession();

  return (
    <div>
      <SidebarProvider>
        <SideBar user={user} />
        <main className="sm:max-w-screen-xl w-full mx-auto p-4">
          <div className="flex justify-between items-center mb-3 lg:hidden">
            <div className="flex gap-2">
              <SidebarTrigger
                variant={"outline"}
                size={"icon"}
                className="p-5"
              />
              <Link className="mr-auto" href={"/"}>
                <Button
                  className=" text-slate-500"
                  size={"icon"}
                  variant={"outline"}
                >
                  <Home />
                </Button>
              </Link>
            </div>

            <UserBar user={user!} />
          </div>

          <div className="flex items-center gap-3 mb-5">
            <NotifBar />

            <div className="hidden lg:block mr-auto">
              <UserBar user={user!} />
            </div>
          </div>

          {children}
        </main>
      </SidebarProvider>
    </div>
  );
}

// SEO
export const metadata: Metadata = {
  title: {
    default: "حساب کاربری",
    template: "%s - حساب کاربری",
  },
  description: "آی‌گرافیکال: جایی که خلاقیت جان می‌گیرد!",
};
