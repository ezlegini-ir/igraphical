"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@igraph/ui/components/ui/select";
import { Dispatch, SetStateAction } from "react";

interface Props {
  timeRange: string;
  setTimeRange: Dispatch<SetStateAction<string>>;
}

const RangeSelector = ({ timeRange, setTimeRange }: Props) => {
  return (
    <Select dir="ltr" value={timeRange} onValueChange={setTimeRange}>
      <SelectTrigger
        className="w-[140px] rounded-md sm:ml-auto "
        aria-label="Select a value"
      >
        <SelectValue placeholder="Last 3 months" />
      </SelectTrigger>
      <SelectContent className="rounded-xl en-digits">
        <SelectItem value={"90"} className="rounded-md">
          Last 3 months
        </SelectItem>
        <SelectItem value="30" className="rounded-md">
          Last 30 days
        </SelectItem>
        <SelectItem value="7" className="rounded-md">
          Last 7 days
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export default RangeSelector;
