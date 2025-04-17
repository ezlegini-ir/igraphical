import { CardDescription } from "@igraph/ui/components/ui/card";
import React, { JSX } from "react";

interface Props {
  status: {
    title: string;
    trigger: string;
    subTitle: string;
    chart: JSX.Element;
  };
}

const StatusCard = ({ status }: Props) => {
  return (
    <div className="card flex flex-col lg:flex-row  gap-3 justify-between items-center px-4">
      <div className="text-center lg:text-right">
        <CardDescription className="text-xs">{status.title}</CardDescription>
        <div>
          <p className="text-xl font-semibold">{status.trigger}</p>
        </div>
        <CardDescription className="text-xs flex gap-2">
          {status.subTitle}
        </CardDescription>
      </div>

      {status.chart}
    </div>
  );
};

export default StatusCard;
