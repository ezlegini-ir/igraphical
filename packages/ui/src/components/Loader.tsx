import { LoaderCircle } from "lucide-react";
import React from "react";

const Loader = ({
  loading = true,
  className,
}: {
  loading?: boolean;
  className?: string;
}) => {
  return loading ? (
    <LoaderCircle strokeWidth={2.5} className={`animate-spin ${className}`} />
  ) : null;
};

export default Loader;
