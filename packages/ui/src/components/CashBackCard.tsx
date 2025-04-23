import { Badge } from "@igraph/ui/components/ui/badge";
import { Banknote } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@igraph/ui/components/ui/tooltip";
import { cashBackCalculator } from "@igraph/utils";

const CashBackCard = ({ price }: { price: number }) => {
  const cashBackAmount = cashBackCalculator(price);

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger className="w-full">
          <Badge className="w-full bg-green-50 text-green-500 font-medium py-2 flex  hover:bg-green-50 justify-between">
            <span className="flex items-center gap-1.5">
              <Banknote size={20} />
              برگشت به کیف پول:
            </span>
            <span>{cashBackAmount.toLocaleString("en-US")} تومان</span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent className="bg-slate-500 text-background">
          <p>
            به ازای هر 100 هزار تومان پرداخت = 10 هزار تومان برگشت به کیف پول
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CashBackCard;
