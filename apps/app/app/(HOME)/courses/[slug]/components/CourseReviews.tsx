"use client";

import React from "react";
import ReviewCard from "./ReviewCard";
import Masonry from "react-masonry-css";
import { Button } from "@igraph/ui/components/ui/button";
import { Image, Review, User } from "@igraph/database";
import { useSearchParams, useRouter } from "next/navigation";

export interface ReviewType extends Review {
  user: User & { image: Image | null };
}
interface Props {
  reviews: ReviewType[];
}

const CourseReviews = ({ reviews }: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const reviewInitialCount = 8;
  const currentReviews =
    Number(searchParams.get("reviews")) || reviewInitialCount;

  const handleLoadMore = () => {
    const newReviewsCount = currentReviews + 10;
    const params = new URLSearchParams(searchParams.toString());

    params.set("reviews", newReviewsCount.toString());

    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">نظرات دانش آموزان:</h2>

      <Masonry
        breakpointCols={{ default: 2, 1024: 1 }}
        className="flex gap-3"
        columnClassName="masonry-column"
      >
        {reviews.slice(0, currentReviews).map((review, index) => (
          <ReviewCard key={index} review={review} />
        ))}
      </Masonry>

      {reviews.length > reviewInitialCount && (
        <div className="flex justify-center mt-10">
          <Button
            size={"sm"}
            disabled={reviews.length < currentReviews}
            variant="dark"
            onClick={handleLoadMore}
          >
            مشاهده بیشتر
          </Button>
        </div>
      )}
    </div>
  );
};

export default CourseReviews;
