"use client";

import CurriculumSectionsForm from "@/components/forms/dashboard/course/CurriculumSectionsForm";
import { Button } from "@igraph/ui/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@igraph/ui/components/ui/form";
import { Input } from "@igraph/ui/components/ui/input";
import { Separator } from "@igraph/ui/components/ui/separator";
import { Skeleton } from "@igraph/ui/components/ui/skeleton";
import { Textarea } from "@igraph/ui/components/ui/textarea";
import { CourseFormType } from "@/lib/validationSchema";
import { Plus, Trash } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { CourseType } from "./CourseForm";

const TextEditor = dynamic(() => import("@igraph/editor/Editor"), {
  ssr: false,
  loading: () => (
    <Skeleton className="w-full h-[450px] bg-white border rounded-sm" />
  ),
});

interface Props {
  form: UseFormReturn<CourseFormType>;
  type: "NEW" | "UPDATE";
  course?: CourseType | null;
}

const CourseFormBody = ({ form, type, course }: Props) => {
  const isUpdateType = type === "UPDATE";

  // 🧮 Prerequisites Field Array
  const {
    fields: prerequisiteFields,
    append: appendPrerequisite,
    remove: removePrerequisite,
  } = useFieldArray({
    name: "prerequisite",
    control: form.control,
  });

  // 🧮 Course Includes Field Array
  const {
    fields: courseIncludesFields,
    append: appendCourseInclude,
    remove: removeCourseInclude,
  } = useFieldArray({
    name: "learns",
    control: form.control,
  });

  // 🧮 Curriculums Field Array
  const {
    fields: sectionFields,
    append: appendSection,
    remove: removeSection,
  } = useFieldArray({
    name: "curriculum",
    control: form.control,
  });

  return (
    <>
      <div className="col-span-12 md:col-span-9 space-y-4">
        {/* //! TITLE */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* //! URL */}
        <div>
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Url</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {isUpdateType && (
            <Link
              href={`${process.env.NEXT_PUBLIC_BASE_URL}/courses/${course?.url}`}
              className="text-xs text-gray-500 flex w-fit"
            >
              <p>
                {process.env.NEXT_PUBLIC_BASE_URL}/courses/{course?.url}
              </p>
            </Link>
          )}
        </div>

        {/* //! DESCRIPTION */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <TextEditor onChange={field.onChange} value={field.value} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="py-5">
          <Separator />
        </div>

        <div className="grid gap-5 grid-cols-2">
          {/* //! SUMMERY */}
          <div className="col-span-2">
            <FormField
              control={form.control}
              name="summary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Summery</FormLabel>
                  <FormControl>
                    <Textarea
                      dir="rtl"
                      {...field}
                      className="min-h-[150px] leading-loose"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="audience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Audience</FormLabel>
                <FormControl>
                  <Textarea
                    dir="rtl"
                    {...field}
                    className="min-h-[100px] leading-loose"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="needs"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course Needs</FormLabel>
                <FormControl>
                  <Textarea
                    dir="rtl"
                    {...field}
                    className="min-h-[100px] leading-loose"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="col-span-2">
            <FormField
              control={form.control}
              name="jobMarket"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Market</FormLabel>
                  <FormControl>
                    <Textarea
                      dir="rtl"
                      {...field}
                      className="min-h-[100px] leading-loose"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* //! PREREQUISITE */}
        <div className="grid gap-3 grid-cols-2">
          <div>
            <FormItem>
              <FormLabel>Prerequisites</FormLabel>
              <div className="space-y-2  card p-3">
                {prerequisiteFields.map((field, index) => (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={`prerequisite.${index}.value`}
                    render={({ field }) => (
                      <FormItem className="flex gap-1 items-center">
                        <FormControl>
                          <Input
                            placeholder={`Prerequisite ${index + 1}`}
                            {...field}
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          disabled={
                            form.getValues("prerequisite")?.length === 1
                          }
                          onClick={() => removePrerequisite(index)}
                        >
                          <Trash className="text-gray-400" size={16} />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => appendPrerequisite({ value: "" })}
                        >
                          <Plus className="text-gray-400" size={16} />
                        </Button>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          </div>

          {/* //! LEARNS */}
          <div>
            <FormItem>
              <FormLabel>Learns</FormLabel>
              <div className="space-y-2 card p-3">
                {courseIncludesFields.map((field, index) => (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={`learns.${index}.value`}
                    render={({ field }) => (
                      <FormItem className="flex gap-1 items-center">
                        <FormControl>
                          <Input
                            placeholder={`Course Include ${index + 1}`}
                            {...field}
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          disabled={
                            form.getValues("prerequisite")?.length === 1
                          }
                          onClick={() => removeCourseInclude(index)}
                        >
                          <Trash className="text-gray-400" size={16} />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => appendCourseInclude({ value: "" })}
                        >
                          <Plus className="text-gray-400" size={16} />
                        </Button>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          </div>
        </div>

        <div className="py-6">
          <Separator />
        </div>

        {/* //! CURRICULUMS */}
        <div className="space-y-2">
          <FormLabel className="font-semibold text-base ">
            Curriculums
          </FormLabel>
          <div className="card">
            {sectionFields.map((section, sectionIndex) => (
              <CurriculumSectionsForm
                key={section.id}
                sectionIndex={sectionIndex}
                control={form.control}
                removeSection={removeSection}
              />
            ))}
            <Button
              type="button"
              variant={"secondary"}
              onClick={() =>
                appendSection({
                  sectionTitle: "",
                  lessons: [
                    {
                      title: "",
                      duration: undefined,
                      url: "",
                      isFree: false,
                      type: "VIDEO",
                    },
                  ],
                })
              }
            >
              <Plus />
              Add Section
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseFormBody;
