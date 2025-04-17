import {
  SidebarInset,
  SidebarProvider,
} from "@igraph/ui/components/ui/sidebar";
import DashboardSidebar from "../../components/sidebar/Dashboard-Sidebar";
import TutorDashboardHeader from "../../components/TutorDashboardHeader";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="en-digits">
      <SidebarProvider>
        <DashboardSidebar />

        <SidebarInset className="bg-[#fafafa]">
          <main className="w-full  mx-auto p-3 lg:px-12 lg:p-4 space-y-4 ">
            <TutorDashboardHeader />
            <div>{children}</div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
