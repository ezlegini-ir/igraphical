import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@igraph/ui/components/ui/chart";
import { RadialBar, RadialBarChart, PolarRadiusAxis, Label } from "recharts";

interface RadialChartProps {
  chartData: { left: number; right: number }[];
  chartConfig: any;
  total: string;
  innerRadius?: number;
  outerRadius?: number;
  dataKeys: { left: string; right: string };
  label: string;
}

const RadialChartBar = ({
  chartData,
  chartConfig,
  total,
  innerRadius = 80,
  outerRadius = 135,
  dataKeys,
  label,
}: RadialChartProps) => {
  return (
    <div className="relative h-[100px] w-[185px] overflow-hidden mx-auto">
      <ChartContainer
        config={chartConfig}
        className="h-[185px] aspect-square absolute top-0 left-0"
      >
        <RadialBarChart
          data={chartData}
          endAngle={180}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          className="overflow-visible"
        >
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) - 25}
                        className="fill-foreground text-2xl font-bold"
                      >
                        {total}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + -6}
                        className="fill-muted-foreground"
                      >
                        {label}
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </PolarRadiusAxis>
          <RadialBar
            dataKey={dataKeys?.right!}
            stackId="a"
            cornerRadius={5}
            fill="var(--color-right)"
            className="stroke-transparent stroke-2"
          />
          <RadialBar
            dataKey={dataKeys?.left!}
            fill="var(--color-left)"
            stackId="a"
            cornerRadius={5}
            className="stroke-transparent stroke-2"
          />
        </RadialBarChart>
      </ChartContainer>
    </div>
  );
};

export default RadialChartBar;
