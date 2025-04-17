"use client";

import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Select as UiSelect,
} from "@igraph/ui/components/ui/select";
import { useValue } from "@igraph/utils";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

interface SelectProps {
  name?: string;
  options: { label: string; value: string }[];
  defaultValue?: string;
  placeholder?: string;
}

const Filter: React.FC<SelectProps> = ({
  name = "filter",
  options,
  defaultValue = "all",
  placeholder = "Select...",
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentQuery = searchParams.get(name) || defaultValue;
  const { value, setValue } = useValue(currentQuery);

  const handleChange = (newValue: string) => {
    setValue(newValue);
    const params = new URLSearchParams(Array.from(searchParams.entries()));

    if (newValue === "all") {
      params.delete(name);
    } else {
      params.set(name, newValue);
    }

    router.push(`?${params.toString()}`);
  };

  useEffect(() => {
    setValue(currentQuery);
  }, [currentQuery]);

  return (
    <UiSelect dir="rtl" value={value} onValueChange={handleChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={"all"}>{placeholder}</SelectItem>
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className="capitalize"
          >
            {option.label.toLowerCase()}
          </SelectItem>
        ))}
      </SelectContent>
    </UiSelect>
  );
};

export default Filter;
