// components/ConfettiWrapper.tsx
"use client";

import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

interface ConfettiWrapperProps {
  show: boolean;
  recycle?: boolean;
}

const ConfettiWrapper = ({ show, recycle = true }: ConfettiWrapperProps) => {
  const { width, height } = useWindowSize();

  if (!show) return null;

  return (
    <div className="fixed top-0 right-0 z-10">
      <Confetti gravity={0.2} width={width} height={height} recycle={recycle} />
    </div>
  );
};

export default ConfettiWrapper;
