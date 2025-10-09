import { Discount } from "@igraph/database";
import { Badge } from "@igraph/ui/components/ui/badge";
import { formatPriceBy3Digits } from "@igraph/utils";

interface Props {
  basePrice: number;
  price: number;
  discount: Discount | null;
  size?: "lg" | "md";
}

const Price = ({ basePrice, price, discount, size = "md" }: Props) => {
  return (
    <>
      {!discount ? (
        <>
          {price ? (
            <div>
              <span
                className={`text-primary font-semibold tracking-wider ${size === "md" ? "text-lg" : "text-[19px]"}`}
              >
                {formatPriceBy3Digits(price)}
              </span>
              <span className="text-slate-400 text-xs mr-1">تومان</span>
            </div>
          ) : (
            <Badge className="p-2" variant={"green"}>
              رایگان
            </Badge>
          )}
        </>
      ) : (
        <div className="w-full flex items-center">
          <div className="relative flex gap-2">
            <span
              className={`text-muted-foreground tracking-wider relative before:absolute before:content-[''] before:w-full before:h-[2px] before:bg-red-500 before:top-1/2 before:left-0 before:-rotate-6 ${size === "md" ? "text-lg" : "text-[19px]"}`}
            >
              {basePrice.toLocaleString("en-US")}
            </span>

            <span
              className={`text-primary font-semibold tracking-wider ${size === "md" ? "text-lg" : "text-[19px]"}`}
            >
              {price.toLocaleString("en-US")}
            </span>
          </div>
          <span className="text-muted-foreground text-xs mr-1">تومان</span>
        </div>
      )}
    </>
  );
};

export default Price;
