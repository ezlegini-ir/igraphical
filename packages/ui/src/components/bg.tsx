import React, { ReactNode } from "react";

export const bgColorVariants = {
  blue: "bg-blue-100 text-blue-500",
  lightBlue: "bg-blue-50 text-blue-500",
  red: "bg-red-100 text-red-500",
  green: "bg-green-100 text-green-500",
  yellow: "bg-yellow-100 text-yellow-500",
  orange: "bg-orange-100 text-orange-500",
  natural: "bg-slate-100/60 text-black",
} as const;

const sizeVariants = {
  square: "w-9 h-9 flex items-center justify-center px-0 py-0",
  full: "w-full px-5 py-3",
} as const;

interface Props {
  children: ReactNode;
  variant?: keyof typeof bgColorVariants;
  size?: keyof typeof sizeVariants;
  className?: string;
}

const Bg = ({
  children,
  variant = "blue",
  size = "full",
  className,
}: Props) => {
  return (
    <div
      className={`rounded-md ${bgColorVariants[variant]} ${sizeVariants[size]} ${className}`}
    >
      {children}
    </div>
  );
};

export default Bg;
