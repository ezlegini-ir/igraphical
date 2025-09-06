"use client";

import { createReview } from "@/actions/review";
import {
  courseReviewFormSchema,
  CourseReviewFormType,
} from "@/lib/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import Loader from "@igraph/ui/components/Loader";
import Rating from "@igraph/ui/components/Rating";
import { Button } from "@igraph/ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@igraph/ui/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@igraph/ui/components/ui/form";
import { ArrowDown, ArrowUp, Star, TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
interface Props {
  userId: number;
  courseId: number;
}

const CourseRatingForm = ({ userId, courseId }: Props) => {
  //HOOKS
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<CourseReviewFormType>({
    resolver: zodResolver(courseReviewFormSchema),
    defaultValues: {
      rating: rating,
      review: "",
    },
  });

  const handleRatingSubmit = (rating: number) => {
    setRating(rating);
    form.setValue("rating", rating);
  };

  const onSubmit = async (data: CourseReviewFormType) => {
    const res = await createReview(data, userId, courseId);

    if (res.error) {
      toast.error(res.error);
      return;
    }

    if (res.success) {
      toast.success(res.success);
      setIsOpen(false);
      router.refresh();
    }
  };

  const reviewLength =
    form.watch("review")?.length > 100 ? 100 : form.watch("review")?.length;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <div className="bg-secondary flex gap-2 items-center text-xs p-2 px-3 rounded-sm text-nowrap">
          <Star size={15} />
          ثبت امتیاز
        </div>
      </DialogTrigger>

      <DialogContent>
        <div className="text-center">
          <DialogTitle className="text-lg ">امتیاز شما به این دوره</DialogTitle>
          <DialogDescription className="flex gap-1 items-center justify-center">
            <TriangleAlert size={17} className="text-red-400" />
            مقادیر زیر بعدا قابل تغییر نمی باشند. لطفا با دقت اقدام به ثبت
            نمایید
          </DialogDescription>
        </div>

        <div className="flex justify-center">
          <Rating
            size={30}
            rating={rating}
            handleRatingSubmit={handleRatingSubmit}
          />
        </div>

        <Form {...form}>
          <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="review"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    {rating && (
                      <textarea
                        {...field}
                        className="block w-full min-h-[100px] border rounded-md p-3 focus:border-blue-500 focus:ring-0.5 focus:ring-blue-500 focus:outline-none"
                        placeholder="نظر شما درباره این دوره..."
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {rating > 0 && (
              <div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span className="flex flex-col items-start font-semibold text-indigo-500">
                    عالی
                    <ArrowDown size={18} className="text-indigo-500 -mr-1" />
                  </span>

                  <span className="flex flex-col items-center">
                    خوب
                    <ArrowDown size={18} className="text-muted-foreground" />
                  </span>

                  <span className="flex flex-col items-end">
                    کوتاه
                    <ArrowDown
                      size={18}
                      className="text-muted-foreground -ml-1"
                    />
                  </span>
                </div>

                <div className="relative h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <div
                    style={{
                      transform: `translateX(-${99 - (reviewLength || 0)}%)`,
                    }}
                    className={`${reviewLength >= 100 ? "bg-green-500" : "bg-primary"} flex-1 h-full rounded-full transition-all`}
                  />
                </div>

                <div className="w-fit mx-auto">
                  <span className="flex flex-col text-xs items-center text-green-500">
                    <ArrowUp size={18} className="text-green-500" />
                    تایید
                  </span>
                </div>
              </div>
            )}

            <Button
              disabled={!form.formState.isValid || form.formState.isSubmitting}
              variant={"secondary"}
              className="w-full"
            >
              <Loader loading={form.formState.isSubmitting} />
              ثبت امتیاز
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CourseRatingForm;
