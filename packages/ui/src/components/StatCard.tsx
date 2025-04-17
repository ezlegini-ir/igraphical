"use client";

import Bg from "@igraph/ui/components/bg";
import { MyBarChart, MyLineChart } from "@igraph/ui/components/MyCharts";
import { EllipsisVertical, MoveDownRight, MoveUpRight } from "lucide-react";
import { JSX } from "react";

export const chartColorVariants = {
  blue: "hsl(var(--chart-blue))",
  lightBlue: "hsl(var(--chart-lightBlue))",
  red: "hsl(var(--chart-red))",
  green: "hsl(var(--chart-green))",
  yellow: "hsl(var(--chart-yellow))",
  orange: "hsl(var(--chart-lightOrange))",
};

export interface StatCardProps {
  title?: string;
  icon?: JSX.Element;
  colorVariant?: keyof typeof chartColorVariants;
  total?: number;
  valueChange?: number;
  chartData: { date: string; value: number }[];
  dataKey: string;
  chartType?: "bar" | "line";
}

const StatCard = ({
  title,
  icon,
  colorVariant = "blue",
  total,
  valueChange,
  chartData,
  dataKey,
  chartType = "bar",
}: StatCardProps) => {
  return (
    <div className="card p-6 space-y-5">
      {/* //! TITLE */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Bg variant={colorVariant} size="square">
            {icon}
          </Bg>
          <p className="font-medium">{title}</p>
        </div>

        <EllipsisVertical size={18} className="text-gray-500" />
      </div>

      {/* //! CONTENT */}
      <Bg variant="natural" className="grid grid-cols-8 gap-2">
        <div className="col-span-5">
          {chartType == "bar" && (
            <MyBarChart
              chartData={chartData}
              dataKey={dataKey}
              title={title}
              colorVariant={colorVariant}
            />
          )}

          {chartType == "line" && (
            <MyLineChart
              chartData={chartData}
              dataKey={dataKey}
              title={title}
              colorVariant={colorVariant}
            />
          )}
        </div>

        <div className="col-span-3 flex items-end">
          <div className="space-y-">
            <span className="font-semibold flex text-black/75">
              {total?.toLocaleString("en-US")}
            </span>

            {valueChange !== undefined && (
              <span
                className={`flex gap-0.5 items-center text-xs font-semibold ${
                  valueChange >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {valueChange >= 0 ? (
                  <MoveUpRight size={14} strokeWidth={3} />
                ) : (
                  <MoveDownRight size={14} strokeWidth={3} />
                )}
                <span>{Math.abs(valueChange)}%</span>
              </span>
            )}
          </div>
        </div>
      </Bg>
    </div>
  );
};

export default StatCard;
