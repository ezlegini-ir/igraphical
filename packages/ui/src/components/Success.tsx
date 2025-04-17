import { Check } from "lucide-react";
import React, { JSX } from "react";

const Success = ({
  success,
  icon,
}: {
  success: string;
  icon?: JSX.Element;
}) => {
  if (!success) return null;

  return (
    <p className="alert alert-success mb-3 flex items-center justify-center gap-1">
      {icon ? icon : <Check size={20} />}
      {success}
    </p>
  );
};

export default Success;
