"use client";

import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import { ChartConfig, ChartContainer } from "@igraph/ui/components/ui/chart";

interface Props {
  count: number;
  totalCount: number;
  fill?: string;
}

const RadialProgress = ({ count, totalCount, fill }: Props) => {
  const chartData = [{ count, fill: `var(--color-${fill || "default"})` }];

  const percentage = (count / totalCount) * 100;
  const angel = (percentage / 100) * 360;

  const chartConfig = {
    primary: {
      color: "hsl(var(--chart-blue))",
    },
    orange: {
      color: "hsl(var(--chart-orange))",
    },
    green: {
      color: "hsl(var(--chart-green))",
    },
    gray: {
      color: "hsl(var(--chart-gray))",
    },
    yellow: {
      color: "hsl(var(--chart-yellow))",
    },
    lightOrange: {
      color: "hsl(var(--chart-lightOrange))",
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto m-0  aspect-square h-[70px] max-h-[80px]"
    >
      <RadialBarChart
        data={chartData}
        startAngle={0}
        endAngle={angel}
        innerRadius={30}
        outerRadius={45}
      >
        <PolarGrid
          gridType="circle"
          radialLines={false}
          stroke="none"
          className="first:fill-muted last:fill-background"
          polarRadius={[33, 26]}
        />
        <RadialBar dataKey="count" background cornerRadius={10} />
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-sm font-semibold"
                    >
                      %{(percentage || 0).toFixed()}
                    </tspan>
                    {/* 
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="fill-muted-foreground"
                    >
                      درصد
                    </tspan> */}
                  </text>
                );
              }
            }}
          />
        </PolarRadiusAxis>
      </RadialBarChart>
    </ChartContainer>
  );
};

export default RadialProgress;
