import React, { ReactNode } from "react";

const Flex = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div className={`flex gap-1 items-center ${className}`}>{children}</div>
  );
};

export default Flex;
