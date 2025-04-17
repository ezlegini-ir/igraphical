import { Badge } from "@igraph/ui/components/ui/badge";
import { SidebarTrigger } from "@igraph/ui/components/ui/sidebar";
import { getSessionAdmin } from "@/data/admin";
import { getOnlineUsers } from "@/data/ga";
import { database } from "@igraph/database";
import { Home, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";
import AdminUserBar from "./AdminUserBar";
import { redirect } from "next/navigation";
import { loginPageRoute } from "@/middleware";

const AdminDashboardHeader = async () => {
  const sessionUser = await getSessionAdmin();
  if (!sessionUser) redirect(loginPageRoute);
  const onlineUsers = (await getOnlineUsers()).data;

  const pendingTicketsCount = await database.ticket.count({
    where: { status: "PENDING" },
  });

  const pendingContactsCount = await database.contact.count({
    where: { status: "PENDING" },
  });

  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-3 items-center">
        <SidebarTrigger className="h-6 w-6" />
        <Badge variant={"blue"} className="py-3 px-4 text-sm leading-none">
          Online: {onlineUsers}
        </Badge>
      </div>

      <div className="flex items-center gap-5 lg:gap-6 text-gray-500/75">
        <div>
          <Link href={"/tickets/list?status=PENDING"} className="relative">
            <MessageCircle size={22} />
            {pendingTicketsCount > 0 && (
              <Badge
                variant={"red"}
                className="p-0 w-4 h-4 justify-center absolute -top-[7px] -right-[7px]"
              >
                {pendingTicketsCount}
              </Badge>
            )}
          </Link>
        </div>

        <div>
          <Link href={"/contact?status=PENDING"} className="relative">
            <Phone size={22} />
            {pendingContactsCount > 0 && (
              <Badge
                variant={"blue"}
                className="p-0 w-4 h-4 justify-center absolute -top-[7px] -right-[7px]"
              >
                {pendingContactsCount}
              </Badge>
            )}
          </Link>
        </div>

        <div>
          <Link
            target="_blank"
            href={`${process.env.NEXT_PUBLIC_BASE_URL}`}
            className="relative"
          >
            <Home size={22} />
          </Link>
        </div>

        <AdminUserBar user={sessionUser} />
      </div>
    </div>
  );
};

export default AdminDashboardHeader;
