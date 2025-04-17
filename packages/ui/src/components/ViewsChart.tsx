"use client";

import { ChartConfig } from "@igraph/ui/components/ui/chart";

import MyLineChartWide from "@igraph/ui/components/MyCharts";
import { useTimeRange } from "@igraph/utils";
import { formatNumber, getSumByTimeRange } from "@igraph/utils";
import { ArrowUpRight } from "lucide-react";
import RangeSelector from "./RangeSelector";

interface Props {
  chartData: { date: string; views: number; sessions: number }[];
}

const DashboardViewsChart = ({ chartData }: Props) => {
  const { timeRange, setTimeRange } = useTimeRange("30");

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);

    let daysToSubtract = 90;
    if (timeRange === "30") {
      daysToSubtract = 31;
    } else if (timeRange === "7") {
      daysToSubtract = 8;
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysToSubtract);

    return date > startDate;
  });

  //* Data Calculations -----------------------------------------------
  const totalViews = getSumByTimeRange(chartData, "views", timeRange);
  const totalViewsLastPeroid =
    getSumByTimeRange(chartData, "views", +timeRange * 2) - totalViews;

  const viewsComparison =
    ((totalViews - totalViewsLastPeroid) / totalViewsLastPeroid) * 100;

  const totalSessions = getSumByTimeRange(chartData, "sessions", timeRange);
  const lastPeroidTotalSessions =
    getSumByTimeRange(chartData, "sessions", +timeRange * 2) - totalSessions;

  const sessionsComparison =
    ((totalSessions - lastPeroidTotalSessions) / lastPeroidTotalSessions) * 100;

  return (
    <>
      <div className="card col-span-12 2xl:col-span-6 p-6 space-y-10">
        <div className="flex justify-between">
          <div className="flex gap-6">
            <div className="flex flex-col">
              <span className="text-gray-500 text-sm">Sessions</span>
              <div className="flex gap-1">
                <span className="font-semibold text-xl">
                  {formatNumber(totalSessions)}
                </span>
                <span
                  className={`flex text-xs ${
                    viewsComparison > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  <ArrowUpRight size={16} /> {sessionsComparison.toFixed(0)}%
                </span>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-gray-500 text-sm">Views</span>
              <div className="flex gap-1">
                <span className="font-semibold text-xl">
                  {formatNumber(totalViews)}
                </span>
                <span
                  className={`flex text-xs ${
                    viewsComparison > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  <ArrowUpRight size={16} /> {viewsComparison.toFixed(0)}%
                </span>
              </div>
            </div>
          </div>

          <RangeSelector timeRange={timeRange} setTimeRange={setTimeRange} />
        </div>

        <MyLineChartWide config={chartConfig} data={filteredData} />
      </div>
    </>
  );
};

export default DashboardViewsChart;

const chartConfig = {
  views: {
    label: "Views",
    color: "hsl(var(--chart-blue))",
  },
  sessions: {
    label: "Sessions",
    color: "hsl(var(--chart-orange))",
  },
} satisfies ChartConfig;
