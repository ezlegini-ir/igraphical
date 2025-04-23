"use client";

import { CreditCard, MessageCircle, Users } from "lucide-react";
import StatCard from "./StatCard";
import { calculateSum } from "@igraph/utils";

type statsDataType = {
  date: string;
  value: number;
}[];

interface Props {
  revenue: statsDataType;
  revenueComparison: number;
  students: statsDataType;
  studentComparison: number;
  solvedTickets: statsDataType;
  solvedTicketsComparison: number;
}

const StatCards = ({
  revenue,
  solvedTickets,
  students,
  studentComparison,
  revenueComparison,
  solvedTicketsComparison,
}: Props) => {
  const totalRevenue = calculateSum(revenue, "value");
  const totalStudents = calculateSum(students, "value");
  const totalSolvedTickets = calculateSum(solvedTickets, "value");

  const responsiveStyles = "col-span-12 sm:col-span-6 xl:col-span-3";

  return (
    <>
      <div className={responsiveStyles}>
        <StatCard
          chartData={students}
          dataKey="value"
          total={totalStudents}
          icon={<Users size={18} />}
          title={"Students"}
          valueChange={+studentComparison.toFixed()}
          colorVariant={"blue"}
          chartType="line"
        />
      </div>

      <div className={responsiveStyles}>
        <StatCard
          chartData={revenue}
          dataKey="value"
          total={totalRevenue}
          icon={<CreditCard size={18} />}
          title={"Revenue"}
          valueChange={+revenueComparison.toFixed()}
          colorVariant={"green"}
          chartType="line"
        />
      </div>

      <div className={responsiveStyles}>
        <StatCard
          chartData={solvedTickets}
          dataKey="value"
          total={totalSolvedTickets}
          icon={<MessageCircle size={18} />}
          title={"Solved Tickets"}
          valueChange={+solvedTicketsComparison.toFixed()}
          colorVariant={"orange"}
          chartType="line"
        />
      </div>
    </>
  );
};

export default StatCards;
