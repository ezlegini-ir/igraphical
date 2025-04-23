import { Discount } from "@igraph/database";
import React from "react";
import { Badge } from "@igraph/ui/components/ui/badge";

interface Props {
  basePrice: number;
  price: number;
  discount: Discount | null;
}

const Price = ({ basePrice, price, discount }: Props) => {
  return (
    <>
      {!discount ? (
        <>
          {price ? (
            <div>
              <span className="text-primary font-semibold tracking-wider text-lg">
                {price.toLocaleString("en-US")}
              </span>
              <span className="text-slate-400 text-xs mr-1">تومان</span>
            </div>
          ) : (
            <Badge variant={"green"}>رایگان</Badge>
          )}
        </>
      ) : (
        <div className="w-full flex items-center">
          <div className="relative flex gap-2">
            <span className="text-slate-400 tracking-wider text-lg relative before:absolute before:content-[''] before:w-full before:h-[2px] before:bg-red-500 before:top-1/2 before:left-0 before:-rotate-6">
              {basePrice.toLocaleString("en-US")}
            </span>

            <span className="text-primary font-semibold tracking-wider text-lg">
              {price.toLocaleString("en-US")}
            </span>
          </div>
          <span className="text-slate-400 text-xs mr-1">تومان</span>
        </div>
      )}
    </>
  );
};

export default Price;
