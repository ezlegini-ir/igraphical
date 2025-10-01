import { database } from "@igraph/database";
import { Card } from "@igraph/ui/components/ui/card";
import { formatPrice } from "@igraph/utils";
import { formatDate, startOfYear } from "date-fns";
import React from "react";

const Expenses = async () => {
  const expenses = await database.expense.findMany({
    where: {
      from: { gte: startOfYear(new Date()) },
    },
  });

  const yearTotal = expenses.reduce((acc, curr) => acc + curr.expense, 0);

  return (
    <div className="space-y-1 max-w-sm ">
      <div className="px-3 flex justify-between">
        <span>Total of this year:</span>
        <span>{formatPrice(yearTotal)}</span>
      </div>

      <Card className="p-3">
        <ul>
          {expenses.map((exp, idx) => (
            <li
              className="p-3 text-sm flex justify-between odd:bg-muted rounded-md"
              key={idx}
            >
              <span>{formatDate(exp.from, "MMM, yyyy")}</span>
              <span>{formatPrice(exp.expense)}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
};

export default Expenses;
