import { Sidebar } from "@igraph/ui/components/ui/sidebar";
import DashboardSidebarContent from "./DashboardSidebarContect";
import DashboardSidebarHeader from "./DashboardSidebarHeader";

export default function DashboardSidebar() {
  return (
    <Sidebar className="p-1 border-dashed border-gray-300">
      {/* //! HEADER */}
      <DashboardSidebarHeader />

      {/* //! CONTENT */}
      <DashboardSidebarContent />
    </Sidebar>
  );
}
