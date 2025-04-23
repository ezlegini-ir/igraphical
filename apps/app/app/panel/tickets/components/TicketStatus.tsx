import { Badge } from "@igraph/ui/components/ui/badge";
import React from "react";

const TicketStatus = ({
  type,
  className,
  wide,
}: {
  type: "PENDING" | "CLOSED" | "REPLIED";
  className?: string;
  wide?: boolean;
}) => {
  const pending = type === "PENDING";
  const answered = type === "REPLIED";

  return (
    <Badge
      className={`font-normal flex justify-center ${
        wide ? "w-full" : "max-w-[100px]"
      } ${className}`}
      variant={pending ? "orange" : answered ? "green" : "gray"}
    >
      <div className="md:hidden">
        {pending ? "انتظار" : answered ? "پاسخ" : "بسته"}
      </div>
      <div className="hidden md:block">
        {pending ? "در انتظار پاسخ" : answered ? "پاسخ داده شده" : "بسته شده"}
      </div>
    </Badge>
  );
};

export default TicketStatus;
