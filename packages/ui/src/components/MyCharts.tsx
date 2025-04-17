import { StatCardProps } from "@igraph/ui/components/StatCard";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@igraph/ui/components/ui/chart";
import { Bar, BarChart, Line, LineChart } from "recharts";

export const chartColorVariants = {
  blue: "hsl(var(--chart-blue))",
  lightBlue: "hsl(var(--chart-lightBlue))",
  red: "hsl(var(--chart-red))",
  green: "hsl(var(--chart-green))",
  yellow: "hsl(var(--chart-yellow))",
  orange: "hsl(var(--chart-lightOrange))",
};

export const MyBarChart = ({
  chartData,
  dataKey,
  title,
  colorVariant = "blue",
}: StatCardProps) => {
  const chartConfig: ChartConfig = {
    [dataKey]: {
      label: title,
      color: chartColorVariants[colorVariant],
    },
  };

  return (
    <ChartContainer config={chartConfig} className="h-[70px] w-full">
      <BarChart accessibilityLayer data={chartData}>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel indicator="line" />}
        />
        <Bar
          dataKey={dataKey}
          fill={chartColorVariants[colorVariant]}
          radius={3.5}
        />
      </BarChart>
    </ChartContainer>
  );
};

export const MyLineChart = ({
  chartData,
  dataKey,
  title,
  colorVariant = "blue",
}: StatCardProps) => {
  const chartConfig: ChartConfig = {
    [dataKey]: {
      label: title,
      color: chartColorVariants[colorVariant],
    },
  };

  return (
    <ChartContainer config={chartConfig} className="h-[70px] w-full">
      <LineChart
        margin={{
          top: 12,
          bottom: 10,
          left: 10,
          right: 10,
        }}
        accessibilityLayer
        data={chartData}
      >
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Line
          dataKey={dataKey}
          type="natural"
          stroke={chartColorVariants[colorVariant]}
          strokeWidth={2.5}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  );
};

import {
  ChartLegend,
  ChartLegendContent,
} from "@igraph/ui/components/ui/chart";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

interface Props {
  data: any[];
  config: {
    [key: string]: {
      label: string;
      color: string;
    };
  };
}

export default function MyLineChartWide({ data, config }: Props) {
  return (
    <ChartContainer className="h-[200px] w-full" config={config}>
      <AreaChart
        accessibilityLayer
        data={data}
        margin={{
          left: 12,
          right: 12,
          top: 10,
        }}
      >
        <CartesianGrid
          stroke="#000"
          strokeDasharray="6 3"
          vertical={false}
          strokeOpacity={0.2}
          strokeWidth={0.6}
        />

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

        <YAxis tickLine={false} axisLine={false} tickMargin={8} />

        <ChartTooltip cursor={true} content={<ChartTooltipContent />} />

        <defs>
          {Object.keys(config).map((key) => (
            <linearGradient key={key} id={key} x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor={config[key].color}
                stopOpacity={0.4}
              />
              <stop
                offset="80%"
                stopColor={config[key].color}
                stopOpacity={0.0}
              />
            </linearGradient>
          ))}
        </defs>

        <ChartLegend content={<ChartLegendContent />} />

        {Object.keys(config).map((key, index) => (
          <Area
            key={key}
            dataKey={key}
            type="monotone"
            fill={`url(#${key})`}
            fillOpacity={0.6}
            stroke={config[key].color}
            strokeWidth={1}
            stackId={`stack-${index}`}
          />
        ))}
      </AreaChart>
    </ChartContainer>
  );
}
