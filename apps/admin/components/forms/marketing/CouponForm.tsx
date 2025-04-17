"use client";

import { createCoupon, deleteCoupon, updateCoupon } from "@/actions/coupon";
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
import { Input } from "@igraph/ui/components/ui/input";
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
import { Switch } from "@igraph/ui/components/ui/switch";
import { Textarea } from "@igraph/ui/components/ui/textarea";
import { useLoading } from "@igraph/utils";
import { cn } from "@igraph/utils";
import { CouponFormType, couponFormSchema } from "@/lib/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Coupon, Course } from "@igraph/database";
import { addDays, format } from "date-fns";
import { CalendarIcon, Plus, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import SearchCourses from "@/components/SearchCourses";

export interface CouponType extends Coupon {
  courseInclude: Course[] | null;
  courseExclude: Course[] | null;
}

interface Props {
  type: "NEW" | "UPDATE";
  coupon?: CouponType;
}

const CouponForm = ({ type, coupon }: Props) => {
  // HOOKS
  const router = useRouter();
  const [activeDate, setActiveDate] = useState(!!coupon?.from || !!coupon?.to);
  const { loading, setLoading } = useLoading();

  const isUpdateType = type === "UPDATE";

  const form = useForm<CouponFormType>({
    resolver: zodResolver(couponFormSchema),
    mode: "onSubmit",
    defaultValues: {
      amount: coupon?.amount || 0,
      code: coupon?.code || "",
      date: activeDate
        ? {
            from: coupon?.from || new Date(),
            to: coupon?.to || addDays(new Date(), 3),
          }
        : undefined,
      limit: coupon?.limit || 0,
      summery: coupon?.summery || "",
      type: coupon?.type || "FIXED_ON_COURSE",
      courseInclude: coupon?.courseInclude?.length
        ? coupon.courseInclude.map((c) => ({ id: c.id }))
        : [],
      courseExclude: coupon?.courseExclude?.length
        ? coupon.courseExclude.map((c) => ({ id: c.id }))
        : [],
    },
  });

  const onSubmit = async (data: CouponFormType) => {
    setLoading(true);

    const res = isUpdateType
      ? await updateCoupon(data, coupon?.id!)
      : await createCoupon(data);

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
    const res = await deleteCoupon(coupon?.id!);

    if (res.error) {
      toast.error(res.error);
      return;
    }

    if (res.success) {
      toast.success(res.success);
      router.refresh();
    }
  };

  // COURSE INCLUDE FIELDS
  const {
    append: appendCourseInclude,
    remove: removeCourseInclude,
    fields: courseIncludeFields,
  } = useFieldArray({
    name: "courseInclude",
    control: form.control,
  });

  // COURSE EXCLUDE FIELDS
  const {
    append: appendCourseExclude,
    remove: removeCourseExclude,
    fields: courseExcludeFields,
  } = useFieldArray({
    name: "courseExclude",
    control: form.control,
  });

  useEffect(() => {
    if (activeDate) {
      form.setValue("date", {
        from: coupon?.from || new Date(),
        to: coupon?.to || addDays(new Date(), 4),
      });
    } else {
      form.setValue("date", undefined);
    }
  }, [activeDate, coupon, form]);

  return (
    <Form {...form}>
      <form
        className="grid grid-cols-12 gap-5"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="col-span-12 md:col-span-6 space-y-3">
          {/* //! COUPON */}
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Coupon</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* //! AMOUNT */}
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input
                    min={0}
                    type="number"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value === "" ? 0 : Number(value));
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* //! TYPE */}
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Discount Type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="FIXED_ON_COURSE">
                      <div className="flex items-center gap-1 font-medium">
                        <span className="text-xl pr-1 text-primary">$</span>{" "}
                        Fixed On Course
                      </div>
                    </SelectItem>
                    <SelectItem value="FIXED_ON_CART">
                      <div className="flex items-center gap-1 font-medium">
                        <span className="text-xl pr-1 text-primary">$</span>{" "}
                        Fixed On Cart
                      </div>
                    </SelectItem>
                    <SelectItem value="PERCENT">
                      <div className="flex items-center gap-1 font-medium">
                        <span className="text-xl pr-1 text-orange-500">%</span>{" "}
                        Percent
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* //! LIMIT */}
          <FormField
            control={form.control}
            name="limit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Limit</FormLabel>
                <FormControl>
                  <Input
                    min={0}
                    type="number"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value === "" ? 0 : Number(value));
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* //! DATE RANGE */}
          <div className="flex gap-2 items-center">
            <Switch checked={activeDate} onCheckedChange={setActiveDate} />
            <span className="text-sm">Active Date</span>
          </div>
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col py-1">
                <FormLabel>From / To</FormLabel>
                <Popover>
                  <PopoverTrigger asChild disabled={!activeDate}>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          <div className="flex gap-1">
                            {format(field.value.from || new Date(), "MMMM dd")}
                            <span>-</span>
                            {format(
                              field.value.to || addDays(new Date(), 3),
                              "MMMM dd"
                            )}
                          </div>
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0 en-digits"
                    align="start"
                  >
                    <Calendar
                      mode="range"
                      selected={field.value as DateRange}
                      onSelect={field.onChange}
                      disabled={(date) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        return date < today;
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* //! SUMMERY */}
          <FormField
            control={form.control}
            name="summery"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Summery</FormLabel>
                <FormControl>
                  <Textarea dir="rtl" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            disabled={!form.formState.isValid || loading}
            className="w-full flex gap-2"
            type="submit"
          >
            {<Loader loading={loading} />}
            {isUpdateType ? "Update" : "Create"}
          </Button>
          {isUpdateType && <DeleteButton onDelete={onDelete} />}
        </div>

        <div className="col-span-12 md:col-span-6 space-y-3">
          {/* //! Course Include */}
          <FormItem>
            <FormLabel>Course Includes</FormLabel>
            <div className="card">
              <div className="w-full">
                {courseIncludeFields.map((arrayField, index) => (
                  <div key={arrayField.id} className="space-y-6">
                    <div className="flex items-center gap-2">
                      <FormField
                        control={form.control}
                        name={`courseInclude.${index}.id`}
                        render={({ field }) => (
                          <FormItem className="w-full border-b last:border-none flex items-center gap-3">
                            <div className="w-full">
                              <div className="flex gap-1 items-center space-y-2">
                                <div
                                  className={`w-full ${form.getValues("courseInclude")?.[index].id && "pointer-events-none"}`}
                                >
                                  <SearchCourses
                                    field={field}
                                    courseId={
                                      coupon?.courseInclude?.[index]?.id
                                    }
                                    placeHolder={`Course ${index + 1}`}
                                  />
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeCourseInclude(index)}
                                  className="aspect-square"
                                >
                                  <Trash className="text-gray-400" size={16} />
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  disabled={
                                    index + 1 < courseIncludeFields.length
                                  }
                                  size={"icon"}
                                  onClick={() => {
                                    appendCourseInclude({
                                      id: 0,
                                    });
                                  }}
                                  className="aspect-square"
                                >
                                  <Plus className="text-gray-400" size={16} />
                                </Button>
                              </div>
                            </div>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ))}
                {courseIncludeFields.length < 1 && (
                  <Button
                    disabled={courseExcludeFields.length > 0}
                    type="button"
                    variant="ghost"
                    size={"icon"}
                    onClick={() => {
                      appendCourseInclude({
                        id: 0,
                      });
                    }}
                    className="aspect-square"
                  >
                    <Plus className="text-gray-400" size={16} />
                  </Button>
                )}
              </div>
            </div>
            <FormMessage />
          </FormItem>

          {/* //! Course Exclude */}
          <FormItem>
            <FormLabel>Course Excludes</FormLabel>
            <div className="card">
              <div className="w-full">
                {courseExcludeFields.map((arrayField, index) => (
                  <div key={arrayField.id} className="space-y-6">
                    <div className="flex items-center gap-2">
                      <FormField
                        control={form.control}
                        name={`courseExclude.${index}.id`}
                        render={({ field }) => (
                          <FormItem className="w-full border-b last:border-none flex items-center gap-3">
                            <div className="w-full">
                              <div className="flex gap-1 items-center space-y-2">
                                <div
                                  className={`w-full ${form.getValues("courseExclude")?.[index].id && "pointer-events-none"}`}
                                >
                                  <SearchCourses
                                    field={field}
                                    courseId={
                                      coupon?.courseExclude?.[index]?.id
                                    }
                                    placeHolder={`Course ${index + 1}`}
                                  />
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeCourseExclude(index)}
                                  className="aspect-square"
                                >
                                  <Trash className="text-gray-400" size={16} />
                                </Button>
                                <Button
                                  disabled={
                                    index + 1 < courseExcludeFields.length
                                  }
                                  type="button"
                                  variant="ghost"
                                  size={"icon"}
                                  onClick={() => {
                                    appendCourseExclude({
                                      id: 0,
                                    });
                                  }}
                                  className="aspect-square"
                                >
                                  <Plus className="text-gray-400" size={16} />
                                </Button>
                              </div>
                            </div>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ))}
                {courseExcludeFields.length < 1 && (
                  <Button
                    disabled={courseIncludeFields.length > 0}
                    type="button"
                    variant="ghost"
                    size={"icon"}
                    onClick={() => {
                      appendCourseExclude({
                        id: 0,
                      });
                    }}
                    className="aspect-square"
                  >
                    <Plus className="text-gray-400" size={16} />
                  </Button>
                )}
              </div>
            </div>
            <FormMessage />
          </FormItem>
        </div>
      </form>
    </Form>
  );
};

export default CouponForm;
