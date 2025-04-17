"use client";

import { createReview, deleteReview, updateReview } from "@/actions/review";
import { ReviewType } from "@/app/(DASHBOARD)/courses/reviews/ReviewsList";
import DeleteButton from "@igraph/ui/components/DeleteButton";
import Loader from "@igraph/ui/components/Loader";
import { Button } from "@igraph/ui/components/ui/button";
import { Calendar } from "@igraph/ui/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@igraph/ui/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@igraph/ui/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@igraph/ui/components/ui/select";
import { Textarea } from "@igraph/ui/components/ui/textarea";
import { cn } from "@igraph/utils";
import { ReviewFormType, reviewFormSchema } from "@/lib/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLoading } from "@igraph/utils";
import { format } from "date-fns";
import { CalendarIcon, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import SearchCourses from "@/components/SearchCourses";
import SearchUsers from "@/components/SearchUsers";

interface Props {
  type: "NEW" | "UPDATE";
  review?: ReviewType;
}

const ReviewForm = ({ type, review }: Props) => {
  // HOOKS
  const router = useRouter();
  const { loading, setLoading } = useLoading();

  const isUpdateType = type === "UPDATE";

  const form = useForm<ReviewFormType>({
    resolver: zodResolver(reviewFormSchema),
    mode: "onSubmit",
    defaultValues: {
      content: review?.content || "",
      rate: review?.rate.toString() || "5",
      courseId: review?.course.id || 0,
      userId: review?.user.id || 0,
      date: review?.createdAt || new Date(),
    },
  });

  const onSubmit = async (data: ReviewFormType) => {
    setLoading(true);

    const res = isUpdateType
      ? await updateReview(data, review?.id!)
      : await createReview(data);

    if (res.error) {
      toast.error(res.error);
      setLoading(false);
      return;
    }

    if (res.success) {
      toast.success(res.success);
      router.refresh();
      setLoading(false);
    }
  };

  const onDelete = async () => {
    const res = await deleteReview(review?.id!);

    if (res.error) {
      toast.error(res.error);
      return;
    }

    if (res.success) {
      router.refresh();
      toast.success(res.success);
    }
  };

  //! SEARCH UTILS
  //HOOKS

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea dir="rtl" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rate</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Post..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <SelectItem key={index} value={(index + 1).toString()}>
                      <div className="flex gap-1">
                        {Array.from({ length: index + 1 }).map((_, index) => (
                          <Star
                            key={index}
                            size={15}
                            className="text-yellow-400"
                            fill="#facc15"
                          />
                        ))}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="courseId"
          render={({ field }) => (
            <FormItem className="overflow-visible">
              <FormLabel>Course</FormLabel>

              <SearchCourses field={field} courseId={review?.courseId} />

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="userId"
          render={({ field }) => (
            <FormItem className="overflow-visible">
              <FormLabel>User</FormLabel>

              <SearchUsers field={field} userId={review?.userId} />

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "pl-3 text-left font-normal en-digits",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    className="en-digits"
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          disabled={
            !form.formState.isValid || !form.formState.isDirty || loading
          }
          className="w-full flex gap-2"
          type="submit"
        >
          <Loader loading={loading} />
          {isUpdateType ? "Update" : "Create"}
        </Button>

        {isUpdateType && <DeleteButton onDelete={onDelete} />}
      </form>
    </Form>
  );
};

export default ReviewForm;
