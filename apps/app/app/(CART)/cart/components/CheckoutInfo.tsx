import { Badge } from "@igraph/ui/components/ui/badge";
import { Separator } from "@igraph/ui/components/ui/separator";
import { formatPriceBy3Digits } from "@igraph/utils";
import React from "react";

interface Props {
  baseTotal: number;
  discountAmount: number;
  totalPrice: number;
  couponAmount: number;
  usedWalletAmount: number;
  cartTotal: number;
}

const CheckoutInfo = ({
  baseTotal,
  cartTotal,
  couponAmount,
  discountAmount,
  totalPrice,
  usedWalletAmount,
}: Props) => {
  return (
    <div className="space-y-3">
      <div className="flex text-nowrap items-center gap-2 text-sm font-medium">
        <span>مجموع</span>
        <div className="w-full">
          <Separator />
        </div>
        <div>
          {formatPriceBy3Digits(baseTotal)}
          <span className="text-gray-500 text-xs mr-1">تومان</span>
        </div>
      </div>

      {discountAmount > 0 && (
        <div className="flex text-nowrap items-center gap-2 text-sm text-slate-400">
          <span>تخفیف ثابت</span>
          <div className="w-full">
            <Separator />
          </div>
          <div>
            {formatPriceBy3Digits(baseTotal - totalPrice)}-{" "}
            <span className="text-xs">تومان</span>
          </div>
        </div>
      )}

      {couponAmount > 0 && (
        <div className="flex text-nowrap items-center gap-2 text-sm text-slate-400">
          <span>کسر کد تخفیف</span>
          <div className="w-full">
            <Separator />
          </div>
          <div>
            {formatPriceBy3Digits(couponAmount)}-{" "}
            <span className="text-xs">تومان</span>
          </div>
        </div>
      )}

      {usedWalletAmount > 0 && (
        <div className="flex text-nowrap items-center gap-2 text-sm text-slate-400">
          <span>کسر کیف پول</span>
          <div className="w-full">
            <Separator />
          </div>
          <div>
            {formatPriceBy3Digits(usedWalletAmount)}-{" "}
            <span className="text-xs">تومان</span>
          </div>
        </div>
      )}

      <div className="space-y-1 text-primary pt-3 font-semibold">
        <Badge
          variant={"blue"}
          className="flex p-2 py-2.5 text-nowrap items-center gap-2 text-sm"
        >
          <span>قابل پرداخت</span>
          <div className="w-full"></div>
          <div>
            {formatPriceBy3Digits(cartTotal)}
            <span className="text-xs mr-1">تومان</span>
          </div>
        </Badge>
      </div>
    </div>
  );
};

export default CheckoutInfo;
