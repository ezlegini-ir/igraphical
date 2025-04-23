"use client";

import { ChartConfig } from "@igraph/ui/components/ui/chart";
import { EllipsisVertical } from "lucide-react";
import RadialChartBar from "./RadialChartBar";

interface Props {
  chartData: { left: number; right: number }[];
}

const GraduateVsEnrolled = ({ chartData }: Props) => {
  const total =
    "%" + ((chartData[0].left / chartData[0].right) * 100).toFixed(1);

  return (
    <div className="card p-6 col-span-12 sm:col-span-6 xl:col-span-3 space-y-5">
      <div className="flex justify-between items-center">
        <p className="font-medium">Completion Rate</p>
        <EllipsisVertical size={18} className="text-gray-500" />
      </div>

      <RadialChartBar
        chartConfig={chartConfig}
        chartData={chartData}
        total={total}
        dataKeys={{ left: "left", right: "right" }}
        label="Completion Rate"
      />
    </div>
  );
};

export default GraduateVsEnrolled;

const chartConfig = {
  left: {
    label: "Completed",
    color: "hsl(var(--chart-blue))",
  },
  right: {
    label: "Enrolled",
    color: "hsl(var(--chart-lightBlue))",
  },
} satisfies ChartConfig;
