"use client";

import Table from "@igraph/ui/components/Table";
import { Button } from "@igraph/ui/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@igraph/ui/components/ui/form";
import { Input } from "@igraph/ui/components/ui/input";
import { Switch } from "@igraph/ui/components/ui/switch";
import { TableCell, TableRow } from "@igraph/ui/components/ui/table";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@igraph/ui/components/ui/toggle-group";
import { CourseFormType } from "@/lib/validationSchema";
import { Download, File, Plus, Trash, Video, X } from "lucide-react";
import { Control, useFieldArray } from "react-hook-form";

interface SectionProps {
  sectionIndex: number;
  control: Control<CourseFormType>;
  removeSection: (index: number) => void;
}

const CurriculumSectionsForm: React.FC<SectionProps> = ({
  sectionIndex,
  control,
  removeSection,
}) => {
  // Single hook instance for lessons for this section
  const {
    fields: lessonFields,
    append: appendLesson,
    remove: removeLesson,
  } = useFieldArray({
    name: `curriculum.${sectionIndex}.lessons` as const,
    control,
  });

  // Render a row for a single lesson using its index
  const renderRows = (item: any, index: number = 0) => (
    <TableRow className="odd:bg-slate-50" key={item.id || index}>
      <TableCell className="p-1.5">
        <div className="card p-0 w-10 aspect-square flex items-center justify-center text-gray-500 font-medium text-sm">
          {sectionIndex + 1}-{index + 1}
        </div>
      </TableCell>

      <TableCell className="p-1.5">
        <FormField
          control={control}
          name={`curriculum.${sectionIndex}.lessons.${index}.title` as const}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  dir="rtl"
                  className="text-left text-gray-700"
                  placeholder="Lesson Title"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </TableCell>

      <TableCell className="p-1.5">
        <FormField
          control={control}
          name={`curriculum.${sectionIndex}.lessons.${index}.url` as const}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  className="text-gray-700"
                  placeholder="Lesson Url"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </TableCell>

      <TableCell className="p-1.5 w-[20px]">
        <FormField
          control={control}
          name={`curriculum.${sectionIndex}.lessons.${index}.duration` as const}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  className="w-[60px]"
                  min={0}
                  type="number"
                  value={field.value ?? ""}
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
      </TableCell>

      <TableCell>
        <FormField
          control={control}
          name={`curriculum.${sectionIndex}.lessons.${index}.type` as const}
          render={({ field }) => (
            <FormItem>
              <div className="flex flex-col gap-1">
                <div className="flex justify-start">
                  <ToggleGroup
                    className="data-[state=on]:bg-primary"
                    type="single"
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <ToggleGroupItem
                      className="h-8 w-8 p-5 aspect-square data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                      value="VIDEO"
                      aria-label="Video"
                    >
                      <Video />
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      className="h-8 w-8 p-5 data-[state=on]:bg-orange-400 data-[state=on]:text-primary-foreground"
                      value="ASSET"
                      aria-label="Asset"
                    >
                      <Download />
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      className="h-8 w-8 p-5  data-[state=on]:bg-slate-200 data-[state=on]:text-secondary-foreground"
                      value="FILE"
                      aria-label="File"
                    >
                      <File />
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
      </TableCell>

      <TableCell>
        <FormField
          control={control}
          name={`curriculum.${sectionIndex}.lessons.${index}.isFree` as const}
          render={({ field }) => (
            <FormItem>
              <div className="flex flex-col gap-1">
                <FormControl>
                  <Switch
                    className="data-[state=checked]:bg-green-500"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </TableCell>

      <TableCell className="p-1">
        <div className="flex justify-end items-end w-full">
          <Button
            type="button"
            variant="outline"
            size={"icon"}
            onClick={() => removeLesson(index)}
            className="bg-transparent w-9 h-9 aspect-square hover:bg-destructive hover:text-destructive-foreground"
          >
            <Trash />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );

  return (
    <div className="space-y-3">
      <div className=" card mb-4 p-4 border space-y-3">
        <FormField
          control={control}
          name={`curriculum.${sectionIndex}.sectionTitle` as const}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Section Title</FormLabel>
              <FormControl>
                <div className="flex gap-2">
                  <div className="card p-4 font-medium text-sm h-10 aspect-square flex items-center justify-center bg-blue-100">
                    {sectionIndex + 1}
                  </div>

                  <Input
                    dir="rtl"
                    className="text-left"
                    placeholder="Section Title"
                    {...field}
                  />

                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => removeSection(sectionIndex)}
                  >
                    <X className="text-destructive" />
                    Remove
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Table
          columns={columns}
          data={lessonFields}
          renderRows={renderRows}
          noDataMessage="No Lessons Added"
        />

        <div className="space-y-2">
          <Button
            size={"sm"}
            variant="secondary"
            type="button"
            onClick={() =>
              appendLesson({
                title: "",
                duration: undefined,
                url: "",
                isFree: false,
                type: "VIDEO",
              })
            }
          >
            <Plus />
            Add Lesson
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CurriculumSectionsForm;

const columns = [
  { label: "Num", className: "w-[15px] text-left p-0" },
  { label: "Title", className: "text-left p-0" },
  { label: "Url", className: "text-left p-0" },
  { label: "Duration", className: "text-left p-0" },
  { label: "Type", className: "w-[80px] text-center p-0" },
  { label: "Is Free?", className: "w-[80px] text-center p-0" },
  { label: "Delete", className: "text-right w-[40px] p-0" },
];
