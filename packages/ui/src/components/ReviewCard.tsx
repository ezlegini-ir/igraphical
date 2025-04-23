import Avatar from "@igraph/ui/components/Avatar";
import { Course, Review, User } from "@igraph/database";
import { Star } from "lucide-react";
import CardBox from "./CardBox";

export interface ReviewType extends Review {
  user: User;
  course: Course;
}

export interface ReviewCardProps {
  review: ReviewType;
}

const ReviewCard = ({ review }: ReviewCardProps) => {
  return (
    <CardBox title={review.course.title}>
      <p className=" text-sm">{review.content}</p>
      <div className="flex gap-2">
        <Avatar src={"./avtar.svg"} />

        <div>
          <span className="text-sm font-medium">
            {review.user.firstName} {review.user.lastName}
          </span>

          <div className="flex gap-4 text-gray-400 text-[10px] font-medium">
            <span className="flex gap-1 items-center ">
              <Star size={13} fill="#fb923c" className="text-orange-400" />
              {review.rate}
            </span>

            <span className="flex gap-1 items-center ">
              {review.createdAt.toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </CardBox>
  );
};

export default ReviewCard;
