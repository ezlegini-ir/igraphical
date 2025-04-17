import React from "react";
import CardBox from "../../components/CardBox";
import { Badge } from "@igraph/ui/components/ui/badge";

const Summery = () => {
  return (
    <CardBox title="خلاصه">
      <div className="flex justify-between p-4 card text-sm font-medium">
        <div>کل تیکت ها</div>
        <div>3</div>
      </div>
      <Badge variant={"green"} className="flex justify-between p-4">
        <div>پاسخ داده شده</div>
        <div>3</div>
      </Badge>
      <Badge variant={"orange"} className="flex justify-between p-4">
        <div>در انتظار پاسخ</div>
        <div>3</div>
      </Badge>
      <Badge variant={"gray"} className="flex justify-between p-4">
        <div>بسته شده</div>
        <div>3</div>
      </Badge>
    </CardBox>
  );
};

export default Summery;
