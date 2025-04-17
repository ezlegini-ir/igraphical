"use client";

import { EnrollmentFormType } from "@/lib/validationSchema";
import { placeHolder } from "@/public";
import { User, Wallet } from "@igraph/database";
import Avatar from "@igraph/ui/components/Avatar";
import DateField from "@igraph/ui/components/DateField";
import { Button } from "@igraph/ui/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@igraph/ui/components/ui/form";
import { formatPrice } from "@igraph/utils";
import { Plus, Trash } from "lucide-react";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { CourseType, PaymentType } from "./PaymentForm";
import { priceType } from "./PaymentFormSidebar";
import { getUserById } from "@/data/user";
import { getWalletByUserId } from "@/data/wallet";
import { getAllCoursesByIds } from "@/data/course";
import SearchCourses from "@/components/SearchCourses";
import SearchUsers from "@/components/SearchUsers";

interface Props {
  form: UseFormReturn<EnrollmentFormType>;
  prices: priceType[] | undefined;
  setPrices: Dispatch<
    SetStateAction<{ price: number; originalPrice: number }[]>
  >;
  setSelectedUser: Dispatch<SetStateAction<User | undefined>>;
  setSelectedCourses: Dispatch<SetStateAction<CourseType[]>>;
  setWallet: Dispatch<SetStateAction<Wallet | undefined>>;
  selectedCourses: CourseType[] | undefined;
  type: "NEW" | "UPDATE";
  payment?: PaymentType;
}

const PaymentFormBody = ({
  form,
  prices,
  setPrices,
  setSelectedUser,
  selectedCourses,
  setSelectedCourses,
  type,
  setWallet,
  payment,
}: Props) => {
  const isUpdateType = type === "UPDATE";

  const { append, remove, fields } = useFieldArray({
    name: "courses",
    control: form.control,
  });

  //! SEARCH FIELDS
  const userId = form.getValues("userId");
  useEffect(() => {
    const fetchSelectedUser = async () => {
      if (userId) {
        const user = await getUserById(userId);
        const wallet = await getWalletByUserId(userId);
        setSelectedUser(user || undefined);
        setWallet(wallet || undefined);
      }
    };

    fetchSelectedUser();
  }, [userId]);

  //! setSelectedCourse + setPrices
  const watchedCourses = form.watch("courses");
  const courseIds = watchedCourses?.map((c) => c.courseId);

  useEffect(() => {
    const fetchSelectedCourses = async () => {
      if (courseIds.length > 0) {
        const courses = await getAllCoursesByIds(courseIds);

        setSelectedCourses(courses);
        setPrices(
          courses.map((course) => ({
            price: course.price,
            originalPrice: course.basePrice,
          }))
        );
      } else {
        setSelectedCourses([]);
        setPrices([]);
      }
    };
    fetchSelectedCourses();
  }, [JSON.stringify(courseIds)]);

  return (
    <div className="col-span-12 lg:col-span-6 xl:col-span-9 space-y-3">
      <div className="card flex gap-3 items-end">
        {/* //! User */}
        <FormField
          control={form.control}
          name={"userId"}
          render={({ field }) => (
            <FormItem
              className={`w-full ${isUpdateType && "pointer-events-none"}`}
            >
              <FormLabel>User</FormLabel>
              <SearchUsers
                field={field}
                placeHolder="Search Users..."
                userId={userId}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        {/* //! Date */}
        <div className="w-full">
          <DateField form={form} />
        </div>
      </div>

      {/* //! Course */}
      <FormItem>
        <div className="card">
          <div className="w-full">
            {fields.map((arrayField, index) => (
              <div key={arrayField.id} className="space-y-6">
                <div className="flex items-center gap-2">
                  <FormField
                    control={form.control}
                    name={`courses.${index}.courseId`}
                    render={({ field }) => (
                      <FormItem className="w-full border-b last:border-none py-3 flex items-center gap-3">
                        {selectedCourses?.[index] && (
                          <div className="flex items-center justify-between w-full">
                            <div className="flex gap-2 items-center">
                              <Image
                                alt=""
                                src={
                                  selectedCourses[index]?.image?.url ||
                                  placeHolder
                                }
                                width={90}
                                height={90}
                                className="rounded-sm object-cover aspect-video"
                              />

                              <div className="flex flex-col gap-1">
                                <span>{selectedCourses[index]?.title}</span>
                                <span className="text-xs text-gray-500 flex items-center gap-2">
                                  <Avatar
                                    src={
                                      selectedCourses[index]?.tutor?.image?.url
                                    }
                                    size={16}
                                  />
                                  {selectedCourses[index]?.tutor?.name}
                                </span>
                              </div>
                            </div>

                            <div className="flex space-x-14">
                              <div className="flex flex-col items-end">
                                <span className="text-xs text-gray-500">
                                  Original Price
                                </span>
                                <span className="text-gray-500 text-right">
                                  {formatPrice(
                                    payment
                                      ? payment.enrollment[index]
                                          .courseOriginalPrice
                                      : prices?.[index].originalPrice,
                                    { showNumber: true }
                                  )}
                                </span>
                              </div>

                              <div className="flex flex-col items-end">
                                <span className="text-xs text-gray-500">
                                  Final Price
                                </span>
                                <span className="text-gray-500 text-right text-primary">
                                  {formatPrice(
                                    payment
                                      ? payment.enrollment[index].price
                                      : prices?.[index].price,
                                    { showNumber: true }
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        {!selectedCourses?.[index] && (
                          <div className="w-full">
                            <FormLabel>Course {index + 1}</FormLabel>
                            <div className="flex gap-3 items-center">
                              <SearchCourses
                                field={field}
                                courseId={courseIds[index]}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => remove(index)}
                              >
                                <Trash className="text-gray-400" size={16} />
                              </Button>
                            </div>
                          </div>
                        )}

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {selectedCourses?.[index] && !isUpdateType && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                    >
                      <Trash className="text-gray-400" size={16} />
                    </Button>
                  )}
                </div>
              </div>
            ))}

            {!isUpdateType && (
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  const courseIds = form
                    .watch("courses")
                    .map((c) => c.courseId);

                  // Check if the course is already selected
                  if (courseIds.includes(0)) {
                    toast.info("Try to add a course first...");
                    return;
                  }

                  append({
                    courseId: 0,
                    price: 0,
                    originalPrice: 0,
                  });
                }}
                className="my-3"
              >
                <Plus className="text-gray-400" size={16} />
                Add Course
              </Button>
            )}
          </div>
        </div>
        <FormMessage />
      </FormItem>
    </div>
  );
};

export default PaymentFormBody;
