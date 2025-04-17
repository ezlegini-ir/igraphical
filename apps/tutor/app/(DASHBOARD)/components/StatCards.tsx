import { formatPrice } from "@igraph/utils";
import { CircleArrowOutDownLeft, Percent, UserPlus, Users } from "lucide-react";
import { JSX } from "react";

interface Props {
  profitFactor: number;
  profit: number;
  enrollmentsThisMonth: { price: number }[];
  totalStudents: number;
}

const StatCards = ({
  profitFactor,
  profit,
  enrollmentsThisMonth,
  totalStudents,
}: Props) => {
  const cardsData = [
    {
      label: "Profit Factor",
      icon: (
        <IconWrapper bg="bg-blue-100">
          <Percent size={19} className="text-primary" />
        </IconWrapper>
      ),
      value: `${profitFactor * 100}%`,
    },
    {
      label: "Revenue of this month",
      icon: (
        <IconWrapper bg="bg-green-100">
          <CircleArrowOutDownLeft size={19} className="text-green-500" />
        </IconWrapper>
      ),
      value: formatPrice(profit),
    },
    {
      label: "Total Enrollments",
      icon: (
        <IconWrapper bg="bg-purple-100">
          <UserPlus size={19} className="text-purple-500" />
        </IconWrapper>
      ),
      value: enrollmentsThisMonth.length.toLocaleString("en-US"),
    },
    {
      label: "Total Students",
      icon: (
        <IconWrapper bg="bg-sky-100">
          <Users size={19} className="text-sky-500" />
        </IconWrapper>
      ),
      value: totalStudents.toLocaleString("en-US"),
    },
  ];

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-5 text-sm font-medium">
      {cardsData.map((item, index) => (
        <div key={index} className="card py-3 space-y-3">
          <div className="flex justify-between items-center">
            {item.label}
            {item.icon}
          </div>
          <div className="text-lg font-semibold">{item.value}</div>
        </div>
      ))}
    </div>
  );
};

export default StatCards;

const IconWrapper = ({
  children,
  bg,
}: {
  children: JSX.Element;
  bg: string;
}) => (
  <div className={`${bg} p-2.5 rounded-full flex justify-center items-center`}>
    {children}
  </div>
);
