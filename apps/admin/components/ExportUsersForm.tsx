"use client";

import { customUserExport } from "@/actions/export";
import SearchCourses from "@/components/SearchCourses";
import {
  ExportUsersFormType,
  exportUsersFormSchema,
} from "@/lib/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Coupon, Course } from "@igraph/database";
import Loader from "@igraph/ui/components/Loader";
import { Button } from "@igraph/ui/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@igraph/ui/components/ui/form";
import { useLoading } from "@igraph/utils";
import { Plus, Trash } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";

export interface CouponType extends Coupon {
  courseInclude: Course[] | null;
  courseExclude: Course[] | null;
}

interface Props {
  coupon?: CouponType;
}

const CouponForm = ({ coupon }: Props) => {
  // HOOKS
  const { loading, setLoading } = useLoading();

  const form = useForm<ExportUsersFormType>({
    resolver: zodResolver(exportUsersFormSchema),
    mode: "onSubmit",
    defaultValues: {
      includedCourses: [],
      excludedCourses: [],
    },
  });

  const onSubmit = async (data: ExportUsersFormType) => {
    setLoading(true);

    const includedCourses = data.includedCourses.map((i) => i.id);
    const excludedCourses = data.excludedCourses.map((i) => i.id);

    const base64 = await customUserExport({ excludedCourses, includedCourses });

    const blob = new Blob(
      [Uint8Array.from(atob(base64), (c) => c.charCodeAt(0))],
      {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }
    );

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "users.xlsx";
    a.click();
    window.URL.revokeObjectURL(url);

    form.reset();
    setLoading(false);
  };

  // COURSE INCLUDE FIELDS
  const {
    append: appendCourseInclude,
    remove: removeCourseInclude,
    fields: courseIncludeFields,
  } = useFieldArray({
    name: "includedCourses",
    control: form.control,
  });

  // COURSE EXCLUDE FIELDS
  const {
    append: appendCourseExclude,
    remove: removeCourseExclude,
    fields: courseExcludeFields,
  } = useFieldArray({
    name: "excludedCourses",
    control: form.control,
  });

  return (
    <Form {...form}>
      <form className="grid gap-5" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="col-span-12 md:col-span-6 space-y-3">
          {/* //! Course Include */}
          <FormItem>
            <FormLabel>Course Includes</FormLabel>
            <div className="w-full">
              {courseIncludeFields.map((arrayField, index) => (
                <div key={arrayField.id} className="space-y-6">
                  <div className="flex items-center gap-2">
                    <FormField
                      control={form.control}
                      name={`includedCourses.${index}.id`}
                      render={({ field }) => (
                        <FormItem className="w-full border-b last:border-none flex items-center gap-3">
                          <div className="w-full">
                            <div className="flex gap-1 items-center space-y-2">
                              <div
                                className={`w-full ${form.getValues("includedCourses")?.[index].id && "pointer-events-none"}`}
                              >
                                <SearchCourses
                                  field={field}
                                  courseId={coupon?.courseInclude?.[index]?.id}
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
            <FormMessage />
          </FormItem>

          {/* //! Course Exclude */}
          <FormItem>
            <FormLabel>Course Excludes</FormLabel>
            <div className="w-full">
              {courseExcludeFields.map((arrayField, index) => (
                <div key={arrayField.id} className="space-y-6">
                  <div className="flex items-center gap-2">
                    <FormField
                      control={form.control}
                      name={`excludedCourses.${index}.id`}
                      render={({ field }) => (
                        <FormItem className="w-full border-b last:border-none flex items-center gap-3">
                          <div className="w-full">
                            <div className="flex gap-1 items-center space-y-2">
                              <div
                                className={`w-full ${form.getValues("excludedCourses")?.[index].id && "pointer-events-none"}`}
                              >
                                <SearchCourses
                                  field={field}
                                  courseId={coupon?.courseExclude?.[index]?.id}
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
            <FormMessage />
          </FormItem>
        </div>

        <Button
          disabled={!form.formState.isValid || loading}
          className="w-full flex gap-2"
          type="submit"
        >
          {<Loader loading={loading} />}
          Start Export
        </Button>
      </form>
    </Form>
  );
};

export default CouponForm;
