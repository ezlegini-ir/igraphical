"use client";

import CardBox from "@/app/panel/components/CardBox";
import React from "react";
import TicketStatus from "../../components/TicketStatus";
import { Separator } from "@igraph/ui/components/ui/separator";
import { Button } from "@igraph/ui/components/ui/button";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@igraph/ui/components/ui/alert-dialog";
import { Ticket, TicketDepartment } from "@igraph/database";
import { closeTicket } from "@/actions/ticket";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { formatJalaliDate } from "@igraph/utils";

interface Props {
  ticket: Ticket;
}

const TicketSidebar = ({ ticket }: Props) => {
  //HOOKS
  const router = useRouter();

  const onCloseTicket = async () => {
    const res = await closeTicket(ticket.id);

    if (res?.error) {
      toast.error(res.error);
      return;
    }

    if (res.success) {
      toast.success(res.success);
      router.refresh();
    }
  };

  const getDepartmentName = (department: TicketDepartment) => {
    switch (department) {
      case "COURSE":
        return "آموزش";
      case "FINANCE":
        return "مالی";
      case "SUGGEST":
        return "پیشنهادات و انتقادات";
      case "TECHNICAL":
        return "فنی";
    }
  };

  return (
    <CardBox title="خلاصه">
      <div className="space-y-2">
        <div className="text-gray-500 text-sm">وضعیت</div>
        <TicketStatus wide type={ticket.status} className="p-3" />
        <Separator />
      </div>

      <div className="space-y-2">
        <div className="text-gray-500 text-sm">موضوع</div>
        <div>{ticket.subject}</div>
        <Separator />
      </div>

      <div className="space-y-2">
        <div className="">واحد</div>
        <div>{getDepartmentName(ticket.department)}</div>
        <Separator />
      </div>

      <div className="space-y-2">
        <div className="text-gray-500 text-sm">زمان ایجاد</div>
        <div>
          {formatJalaliDate(ticket.createdAt, {
            withTime: true,
          })}
        </div>
        <Separator />
      </div>

      <div className="space-y-3 hidden md:block">
        {ticket.status !== "CLOSED" && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant={"lightBlue"} className="w-full">
                ممنون، مشکلم حل شد.
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent dir="rtl">
              <AlertDialogHeader>
                <AlertDialogTitle>مطمئن هستید؟</AlertDialogTitle>
                <AlertDialogDescription>
                  آیا مطمئن هستید که این تیکت را به عنوان حل‌شده می‌بندید؟
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="gap-0 sm:gap-2">
                <AlertDialogCancel>بازگشت</AlertDialogCancel>
                <AlertDialogAction onClick={onCloseTicket}>
                  بله، بستن تیکت
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
        <div>
          <Link href={"/panel/tickets"}>
            <Button className="w-full" variant={"secondary"}>
              بازگشت
            </Button>
          </Link>
        </div>
      </div>
    </CardBox>
  );
};

export default TicketSidebar;
