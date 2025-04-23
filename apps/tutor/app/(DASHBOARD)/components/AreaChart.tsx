"use client";

import * as React from "react";
import { Area, AreaChart as MyAreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@igraph/ui/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@igraph/ui/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@igraph/ui/components/ui/select";
import { subMonths } from "date-fns";

export interface ChartDataItem {
  date: string;
  revenue: number;
}

interface AreaChartProps {
  chartData: ChartDataItem[];
}

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-blue))",
  },
} satisfies ChartConfig;

export function AreaChart({ chartData }: AreaChartProps) {
  const [timeRange, setTimeRange] = React.useState("thisMonth");

  const filteredData = React.useMemo(() => {
    return chartData.filter((item) => {
      const date = new Date(item.date);
      const now = new Date();

      if (timeRange === "thisMonth") {
        return (
          date.getMonth() === now.getMonth() &&
          date.getFullYear() === now.getFullYear()
        );
      }

      if (timeRange === "lastMonth") {
        const lastMonth = subMonths(now, 1);
        return (
          date.getMonth() === lastMonth.getMonth() &&
          date.getFullYear() === lastMonth.getFullYear()
        );
      }

      let daysToSubtract = 90;
      if (timeRange === "30d") {
        daysToSubtract = 30;
      } else if (timeRange === "7d") {
        daysToSubtract = 7;
      }

      const startDate = new Date(now);
      startDate.setDate(startDate.getDate() - daysToSubtract);
      return date >= startDate;
    });
  }, [chartData, timeRange]);

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Revenue Chart</CardTitle>
          <CardDescription>
            Total revenue for the selected period
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="thisMonth" className="rounded-lg">
              This Month
            </SelectItem>
            <SelectItem value="lastMonth" className="rounded-lg">
              Last Month
            </SelectItem>
            <SelectItem value="90d" className="rounded-lg">
              Last 3 Months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 Days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 Days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <MyAreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-revenue)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-revenue)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value: string) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  labelFormatter={(value: string) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />

            <Area
              dataKey="revenue"
              type="natural"
              fill="url(#fillRevenue)"
              stroke="var(--color-revenue)"
              stackId="a"
            />

            <ChartLegend content={<ChartLegendContent />} />
          </MyAreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
