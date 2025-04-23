import { CircleCheckBig, CircleX } from "lucide-react";
import React from "react";
interface Props {
  title: string;
  description?: string;
  type: "fail" | "success";
}

const Toast = ({ type, title, description }: Props) => {
  return (
    <div className="flex gap-2 h-full">
      {type === "success" ? (
        <div className="w-1 h-full rounded-full bg-green-500 ml-1" />
      ) : (
        <div className="w-1.5 h-full rounded-full bg-red-500 ml-1" />
      )}
      <div>
        <p className="font-semibold flex items-center gap-1">
          {type === "success" ? (
            <CircleCheckBig size={22} className="text-green-500" />
          ) : (
            <CircleX size={22} className="text-red-500" />
          )}
          {title}
        </p>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
    </div>
  );
};

export default Toast;
