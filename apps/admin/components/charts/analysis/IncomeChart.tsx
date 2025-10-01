"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { getIncomeData } from "@/actions/analysys/income";
import { Payment } from "@igraph/database";
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
  ChartTooltip,
  ChartTooltipContent,
} from "@igraph/ui/components/ui/chart";
import { formatPrice } from "@igraph/utils";
import {
  endOfMonth,
  endOfYear,
  formatDate,
  startOfMonth,
  startOfYear,
  subMonths,
  subYears,
} from "date-fns";
import { useEffect, useState } from "react";
import IncomMetrics, { metricsKeyTypes } from "./components/IncomMetrics";
import PeriodPicker from "./components/PeriodPicker";

export const description = "An interactive line chart";

const chartConfig = {
  views: {
    label: "Income",
  },
  income: {
    label: "Income",
    color: "hsl(var(--chart-lightBlue))",
  },
} satisfies ChartConfig;

export default function IncomeChart() {
  const [activeMetric, setActiveMetric] = useState<metricsKeyTypes>("gross");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("month");
  const [payments, setPayments] = useState<Payment[]>();
  const [chartData, setChartData] = useState<
    { date: string; income: number }[]
  >([]);

  const getDateRange = () => {
    const now = new Date();
    let start: Date, end: Date;

    switch (selectedPeriod) {
      case "lastMonth":
        start = startOfMonth(subMonths(now, 1));
        end = endOfMonth(subMonths(now, 1));
        break;
      case "year":
        start = startOfYear(now);
        end = now;
        break;
      case "lastYear":
        start = startOfYear(subYears(now, 1));
        end = endOfYear(subYears(now, 1));
        break;
      default:
        start = startOfMonth(now);
        end = now;
        break;
    }

    return { start, end };
  };

  useEffect(() => {
    const { start, end } = getDateRange();

    const fetchIncomeData = async () => {
      const { payments } = await getIncomeData({
        date: { from: start, to: end },
      });

      setPayments(payments);

      const generatedChartData = payments?.map((item) => ({
        date: formatDate(item.paidAt!, "yyyy-MM-dd"),
        income:
          activeMetric === "gross"
            ? item.itemsTotal
            : activeMetric === "net"
              ? item.total
              : item.discountAmount || 0,
      }));

      if (generatedChartData) {
        setChartData(generatedChartData);
      }
    };

    fetchIncomeData();
  }, [selectedPeriod, activeMetric]);

  const totalNet = payments?.reduce((acc, curr) => acc + curr.total, 0) ?? 0;
  const totalGross =
    payments?.reduce((acc, curr) => acc + curr.itemsTotal, 0) ?? 0;
  const totalCoupons =
    payments?.reduce((acc, curr) => acc + (curr.discountAmount || 0), 0) ?? 0;

  return (
    <div className="space-y-4">
      <PeriodPicker
        selectedPeriod={selectedPeriod}
        onChange={(newPeriod) => setSelectedPeriod(newPeriod)}
      />

      <IncomMetrics
        activeMetric={activeMetric}
        setActiveMetric={setActiveMetric}
        totalNet={totalNet}
        totalGross={totalGross}
        totalCoupons={totalCoupons}
      />

      <Card className="py-4 sm:py-0">
        <CardHeader className="flex flex-col items-stretch border-b px-0 sm:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
            <CardTitle>
              {formatPrice(
                activeMetric === "gross"
                  ? totalGross
                  : activeMetric === "net"
                    ? totalNet
                    : totalCoupons
              )}
            </CardTitle>
            <CardDescription>
              Total value for the selected period
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="px-2 sm:p-6">
          <ChartContainer
            className="aspect-auto h-[250px] w-full"
            config={chartConfig}
          >
            <AreaChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="w-[175px]"
                    nameKey="views"
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });
                    }}
                  />
                }
              />
              <defs>
                <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-income)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-income)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <Area
                dataKey="income"
                type="natural"
                fill="url(#fill)"
                fillOpacity={0.4}
                stroke="var(--color-income)"
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
