"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@igraph/ui/components/ui/card";

interface QueryCardProps {
  name?: string;
  options: { label: string; value: string }[];
  defaultValue?: string;
  title: string;
}

const QueryCard: React.FC<QueryCardProps> = ({
  name = "filter",
  options,
  defaultValue = "all",
  title,
}) => {
  const searchParams = useSearchParams();

  const currentQuery = searchParams.get(name) || defaultValue;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <span className="text-base">{title}</span>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <ul className="space-y-3 text-sm text-slate-500 mr-5">
          {options.map((option) => {
            const isActive = option.value === currentQuery;
            const params = new URLSearchParams(
              Array.from(searchParams.entries())
            );

            if (isActive) {
              params.delete(name);
            } else {
              params.set(name, option.value);
            }

            return (
              <li key={option.value}>
                <Link
                  href={`?${params.toString()}`}
                  className={`${
                    isActive ? "font-bold text-blue-500" : "text-gray-600"
                  }`}
                >
                  {option.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
};

export default QueryCard;
