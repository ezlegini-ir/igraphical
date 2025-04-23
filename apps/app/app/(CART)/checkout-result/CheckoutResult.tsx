"use client";

import { verifyPayment } from "@/actions/payment";
import { verifyQuickPayment } from "@/actions/quickPayment";
import { Button } from "@igraph/ui/components/ui/button";
import { Separator } from "@igraph/ui/components/ui/separator";
import useError from "@/hooks/useError";
import useSuccess from "@/hooks/useSuccess";
import { CircleCheckBig, CircleX, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type Status = "SUCCESS" | "FAIL" | "PENDING";

interface Props {
  authority: string;
  status: "OK" | "NOK";
  type: "QUICK" | "PAYMENT";
}

const CheckoutResult = ({ authority, status, type }: Props) => {
  const [result, setResult] = useState<Status>("PENDING");
  const [refId, setRefId] = useState<number>();
  const { error, setError } = useError();
  const { success, setSuccess } = useSuccess();

  const pending = result === "PENDING";
  const successStatus = result === "SUCCESS";
  const fail = result === "FAIL";

  useEffect(() => {
    const verifyCheckout = async () => {
      const res =
        type === "QUICK"
          ? await verifyQuickPayment(authority, status)
          : await verifyPayment(authority, status);

      if (res.error) {
        setResult("FAIL");
        setError(res.error);
        return;
      }

      if (res.success && res.refId) {
        setResult("SUCCESS");
        setSuccess(res.success);
        setRefId(res.refId);
        return;
      }
    };

    verifyCheckout();
  }, []);

  return (
    <div className="card max-w-[350px] mx-auto flex flex-col justify-center items-center space-y-3 w-full pt-5">
      {pending ? (
        <Loader2 className="animate-spin text-blue-400" size={65} />
      ) : successStatus ? (
        <CircleCheckBig className="text-green-500" size={65} />
      ) : (
        <CircleX className="text-red-500" size={65} />
      )}

      <div className="text-center">
        <div className="font-medium flex flex-col gap-1">
          {error ? error : success ? success : "در حال بررسی"}
          {error && (
            <div className="text-gray-500 text-sm flex flex-col gap-2">
              <span className="text-black">لطفا مجددا تلاش کنید</span>
              <Separator />
              در صورت کسر مبلغ از حساب شما، این مبلغ حداکثر تا 72 ساعت آینده به
              حساب شما واریز خواهد شد.
            </div>
          )}
        </div>
        {pending && (
          <p className="text-sm text-gray-500">لطفا از این صفحه خارج نشوید!</p>
        )}
      </div>

      {successStatus && (
        <div className="flex gap-8 text-xs text-gray-500">
          <p>شناسه پرداخت: {refId}</p>
        </div>
      )}

      <div className="w-full space-y-3">
        {!fail && (
          <Link href={"/panel/courses"}>
            <Button disabled={pending} className="w-full">
              دوره های من
            </Button>
          </Link>
        )}

        <div>
          <Link href={"/panel/payments"}>
            <Button variant={"secondary"} disabled={pending} className="w-full">
              لیست پرداخت‌ها
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CheckoutResult;
