import Avatar from "@igraph/ui/components/Avatar";
import IgraphLogo from "@igraph/ui/components/IgraphLogo";
import { SidebarHeader } from "@igraph/ui/components/ui/sidebar";
import { getSessionAdmin } from "@/data/admin";
import Link from "next/link";

const DashboardSidebarHeader = async () => {
  const sessionUser = await getSessionAdmin();

  return (
    <SidebarHeader dir="ltr" className="p-4 space-y-8">
      <Link href={"/"}>
        <IgraphLogo />
      </Link>

      <div className="bg-slate-100 p-3 px-2 rounded-sm border-dashed border-slate-400/60 border-[1px] flex gap-2 items-center">
        <Avatar src={sessionUser?.image?.url} size={37} />
        <div className="flex flex-col">
          <span>{sessionUser?.name}</span>
          <span className="text-xs text-primary font-semibold">
            {sessionUser?.role}
          </span>
        </div>
      </div>
    </SidebarHeader>
  );
};

export default DashboardSidebarHeader;
