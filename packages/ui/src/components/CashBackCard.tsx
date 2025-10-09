import { Badge } from "@igraph/ui/components/ui/badge";
import { Banknote } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@igraph/ui/components/ui/tooltip";
import { cashBackCalculator } from "@igraph/utils";

const CashBackCard = ({
  price,
  dontApplyCashback,
}: {
  price: number;
  dontApplyCashback?: boolean;
}) => {
  const cashBackAmount = cashBackCalculator(price, dontApplyCashback ?? false);

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger className="w-full">
          <Badge
            variant={dontApplyCashback ? "red" : "green"}
            className="w-full font-medium py-2 flex justify-between"
          >
            <span className="flex items-center gap-1.5">
              <Banknote size={20} />
              برگشت به کیف پول:
            </span>
            <span>{cashBackAmount.toLocaleString("en-US")} تومان</span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent className="bg-muted-foreground text-background">
          {dontApplyCashback ? (
            <p>در روش پرداخت اقساطی، برگشت به کیف پول مقدور نمی باشد.</p>
          ) : (
            <p>
              به ازای هر 100 هزار تومان پرداخت = 5 هزار تومان برگشت به کیف پول
            </p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CashBackCard;
