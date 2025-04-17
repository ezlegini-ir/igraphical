"use client";

import { Line, LineChart } from "recharts";

import { ChartConfig, ChartContainer } from "@igraph/ui/components/ui/chart";

const chartConfig = {
  desktop: {
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

interface Props {
  chartData: {
    date: string;
    minutes: number;
  }[];
}

export default function LinearChart({ chartData }: Props) {
  return (
    <ChartContainer
      className="aspect-square h-[70px] max-h-[80px]"
      config={chartConfig}
    >
      <LineChart accessibilityLayer data={chartData}>
        <Line
          dataKey="minutes"
          type="natural"
          stroke="var(--color-desktop)"
          strokeWidth={3}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  );
}
