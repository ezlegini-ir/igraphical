import { Button } from "@igraph/ui/components/ui/button";
import { Headset, Plus } from "lucide-react";
import Link from "next/link";
import React from "react";
import CardBox from "../../components/CardBox";

const FaqBanner = () => {
  return (
    <CardBox title="ارسال تیکت" className="h-full">
      <div className="flex flex-col gap-3 justify-center items-center py-10">
        <Headset size={90} className="text-slate-400" />

        <div className="text-center">
          <p>
            با مراجعه به صفحه
            <span className="text-primary font-semibold">
              {" "}
              "سوالات متداول"{" "}
            </span>
            می توانید به سرعت مشکل خود را حل کنید!
          </p>

          <p className="font-semibold">
            (<span className="text-destructive">توجه:</span> برای{" "}
            <span className="text-primary">ارتباط با مدرس</span> به کلاس درس
            مراجعه کنید.)
          </p>
        </div>

        <div className="flex gap-3">
          <Link href={"/faq"}>
            <Button>سوالات متداول</Button>
          </Link>
          <Link href={"/panel/tickets/new"}>
            <Button variant={"secondary"}>
              <Plus />
              تیکت جدید
            </Button>
          </Link>
        </div>
      </div>
    </CardBox>
  );
};

export default FaqBanner;
