"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@igraph/ui/components/ui/select";
import {
  subMonths,
  subYears,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  formatDate,
} from "date-fns";

type Props = {
  selectedPeriod: string;
  onChange: (newPeriod: string) => void;
};

const PeriodPicker: React.FC<Props> = ({ selectedPeriod, onChange }) => {
  const now = new Date();
  const lastMonth = subMonths(now, 1);
  const lastYear = subYears(now, 1);

  return (
    <Select value={selectedPeriod} onValueChange={(value) => onChange(value)}>
      <SelectTrigger className="w-fit font-medium px-4">
        <SelectValue placeholder="Select a Period..." />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="month">
          Month to Date | {formatDate(startOfMonth(new Date()), "MMM dd, yyyy")}{" "}
          - {formatDate(new Date(), "MMM dd, yyyy")}
        </SelectItem>

        <SelectItem value="lastMonth">
          Last Month | {formatDate(startOfMonth(lastMonth), "MMM dd, yyyy")} -{" "}
          {formatDate(endOfMonth(lastMonth), "MMM dd, yyyy")}
        </SelectItem>

        <SelectItem value="year">
          Year to Date | {formatDate(startOfYear(new Date()), "MMM dd, yyyy")} -{" "}
          {formatDate(new Date(), "MMM dd, yyyy")}
        </SelectItem>

        <SelectItem value="lastYear">
          Last Year | {formatDate(startOfYear(lastYear), "MMM dd, yyyy")} -{" "}
          {formatDate(endOfYear(lastYear), "MMM dd, yyyy")}
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export default PeriodPicker;
