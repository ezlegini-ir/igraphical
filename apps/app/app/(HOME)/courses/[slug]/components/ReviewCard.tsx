import Avatar from "@igraph/ui/components/Avatar";
import { avatar } from "@/public";
import { Star } from "lucide-react";
import { ReviewType } from "./CourseReviews";
import { formatJalaliDate } from "@igraph/utils";

interface Props {
  review: ReviewType;
}

const ReviewCard = ({ review }: Props) => {
  return (
    <div className="border rounded-lg p-5 space-y-3 h-min mb-3">
      <p className=" text-sm">{review.content}</p>
      <div className="flex gap-2">
        <Avatar src={review.user.image?.url || avatar} />

        <div>
          <span className="text-sm font-medium">{review.user.fullName}</span>

          <div className="flex gap-4 text-gray-400 text-[10px] font-medium">
            <span className="flex gap-1 items-center ">
              <Star size={13} className="text-orange-400" />
              {review.rate}
            </span>

            <span className="flex gap-1 items-center ">
              {formatJalaliDate(review.createdAt, { useMonthName: false })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
