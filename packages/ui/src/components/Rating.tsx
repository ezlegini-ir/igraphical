"use client";

import { Star } from "lucide-react";
import { useState } from "react";

const Rating = ({
  maxStars = 5,
  size = 30,
  rating,
  handleRatingSubmit,
}: {
  maxStars?: number;
  size?: number;
  handleRatingSubmit: (rating: number) => void;
  rating: number;
}) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex flex-row-reverse">
      {Array.from({ length: maxStars }, (_, index) => {
        const starValue = index + 1;
        return (
          <Star
            key={index}
            size={size}
            className={`cursor-pointer transition-all px-1 ${
              starValue <= (hover || rating)
                ? "text-yellow-400 scale-125"
                : "text-gray-300"
            }`}
            onMouseEnter={() => setHover(starValue)}
            onMouseLeave={() => setHover(0)}
            onClick={() => handleRatingSubmit(starValue)}
            fill={starValue <= (hover || rating) ? "currentColor" : "none"}
            strokeWidth={1.5}
          />
        );
      })}
    </div>
  );
};

export default Rating;
