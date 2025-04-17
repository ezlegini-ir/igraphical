import { LoaderCircle } from "lucide-react";
import React from "react";

const Loader = ({ loading = true }: { loading?: boolean }) => {
  return loading ? (
    <LoaderCircle strokeWidth={2.5} className="animate-spin" />
  ) : null;
};

export default Loader;
