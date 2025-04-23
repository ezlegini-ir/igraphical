import React, { JSX } from "react";
import CardBox from "../../components/CardBox";
import StatusCard from "../../components/StatusCard";

interface Props {
  statusData: {
    title: string;
    trigger: string;
    subTitle: string;
    chart: JSX.Element;
  }[];
}

const CourseStatistics = ({ statusData }: Props) => {
  return (
    <CardBox title="آمار کلی">
      <div className="card flex justify-between text-sm">
        <div>تعداد کل دوره ها</div>
        <div>10 دوره</div>
      </div>

      <div>
        <div className="space-y-3">
          {statusData.map((status, index) => (
            <StatusCard key={index} status={status} />
          ))}
        </div>
      </div>
    </CardBox>
  );
};

export default CourseStatistics;
