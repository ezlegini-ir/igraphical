"use client";

import { Badge } from "@igraph/ui/components/ui/badge";
import { Card } from "@igraph/ui/components/ui/card";
import { formatPrice } from "@igraph/utils";
import { Dispatch } from "react";

export type metricsKeyTypes =
  | "gross"
  | "net"
  | "total"
  | "expenses"
  | "coupons";

const metrics: {
  label: string;
  key: metricsKeyTypes;
}[] = [
  { label: "Gross Sales", key: "gross" },
  { label: "Coupons", key: "coupons" },
  { label: "Net Sales", key: "net" },
];

interface Props {
  setActiveMetric: Dispatch<React.SetStateAction<metricsKeyTypes>>;
  activeMetric: metricsKeyTypes;
  totalGross: number;
  totalNet: number;
  totalCoupons: number;
}

const IncomMetrics = ({
  setActiveMetric,
  activeMetric,
  totalCoupons,
  totalGross,
  totalNet,
}: Props) => {
  const handleMetricClick = (key: metricsKeyTypes) => {
    setActiveMetric(key);
  };

  return (
    <div className="flex">
      {metrics.map((item, idx) => (
        <Card
          className={`rounded-none first:rounded-l-lg last:rounded-r-lg hover:cursor-pointer w-full text-muted-foreground h-auto flex-col items-start p-8 py-4 text-left ${item.key === activeMetric && "bg-accent"}`}
          key={idx}
          onClick={() => handleMetricClick(item.key)}
        >
          <span className="text-sm">{item.label}</span>
          <div className="flex justify-between">
            <span className="text-foreground font-medium text-xl">
              {formatPrice(
                item.key === "gross"
                  ? totalGross
                  : item.key === "net"
                    ? totalNet
                    : totalCoupons
              )}
            </span>
            <Badge className="p-0.5 rounded" variant={"green"}>
              0%
            </Badge>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default IncomMetrics;
