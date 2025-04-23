"use client";

import { deleteCourse } from "@/actions/course";
import { deleteImage } from "@/actions/image";
import Avatar from "@igraph/ui/components/Avatar";
import CardBox from "@igraph/ui/components/CardBox";
import ComboField from "@igraph/ui/components/ComboField";
import DeleteButton from "@igraph/ui/components/DeleteButton";
import { Badge } from "@igraph/ui/components/ui/badge";
import { Button } from "@igraph/ui/components/ui/button";
import { Calendar } from "@igraph/ui/components/ui/calendar";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@igraph/ui/components/ui/form";
import { Input } from "@igraph/ui/components/ui/input";
import { Label } from "@igraph/ui/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@igraph/ui/components/ui/popover";
import {
  RadioGroup,
  RadioGroupItem,
} from "@igraph/ui/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@igraph/ui/components/ui/select";
import { Separator } from "@igraph/ui/components/ui/separator";
import { Switch } from "@igraph/ui/components/ui/switch";
import { useImagePreview } from "@igraph/utils";
import { useLoading } from "@igraph/utils";
import { cn } from "@igraph/utils";
import { CourseFormType } from "@/lib/validationSchema";
import { CourseCategory } from "@igraph/database";
import { addDays, format } from "date-fns";
import { BadgePercent, CalendarIcon, Plus, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { DateRange } from "react-day-picker";
import { UseFormReturn } from "react-hook-form";
import { CourseType, TutorType } from "./CourseForm";
import { toast } from "sonner";
import Loader from "@igraph/ui/components/Loader";
import ImageField from "@/components/forms/ImageField";

interface Props {
  loading: boolean;
  tutors: TutorType[];
  categories: CourseCategory[];
  course?: CourseType | null;
  disocuntDateEnabled: boolean;
  galleryPreviews:
    | {
        public_id?: string;
        url: string;
      }[]
    | undefined;
  setDiscountDateEnabled: Dispatch<SetStateAction<boolean>>;
  form: UseFormReturn<CourseFormType>;
  type: "NEW" | "UPDATE";
  setGalleryPreviews: Dispatch<
    SetStateAction<
      | {
          public_id?: string;
          url: string;
        }[]
      | undefined
    >
  >;
}

const CourseFormSidebar = ({
  galleryPreviews,
  loading,
  categories,
  disocuntDateEnabled,
  tutors,
  form,
  setGalleryPreviews,
  course,
  setDiscountDateEnabled,
  type,
}: Props) => {
  // HOOKS
  const { loading: removeImageLoading, setLoading: setRemoveImageLoading } =
    useLoading();
  const { imagePreview, setImagePreview } = useImagePreview(course?.image?.url);
  const [discountEnabled, setDiscountEnabled] = useState(!!course?.discount);
  const router = useRouter();

  const isUpdateType = type === "UPDATE";

  const handleGalleryPreview = (files: File[]) => {
    const imageUrls = files.map((file) => ({
      url: URL.createObjectURL(file),
    }));

    setGalleryPreviews((prev = []) => [...prev, ...imageUrls]);
  };

  const handleGalleryPreviewRemove = async (index: number) => {
    setGalleryPreviews((prev) => prev?.filter((_, i) => i !== index));

    form.setValue(
      "gallery",
      form.getValues("gallery")?.filter((_, i) => i !== index) || []
    );
  };

  const handleGalleryRemove = async (publicId: string) => {
    setRemoveImageLoading(true);

    const res = await deleteImage(publicId);

    if (res.error) {
      toast.error(res.error);
      setRemoveImageLoading(false);
      return;
    }

    router.refresh();
    setRemoveImageLoading(false);
  };

  const onDelete = async () => {
    const res = await deleteCourse(course?.id!);

    if (res.error) {
      toast.error(res.error);
      return;
    }

    if (res.success) {
      router.push("/courses/list");
      toast.success(res.success);
    }
  };

  const handleDiscountToggle = (checked: boolean) => {
    setDiscountEnabled(checked);
    if (!checked) {
      form.setValue("discount", undefined);
    }
  };

  const handleDiscountDateToggle = (checked: boolean) => {
    setDiscountDateEnabled(checked);

    if (!checked) {
      form.setValue("discount.date", undefined);
    }
  };

  return (
    <>
      <div className="col-span-12 md:col-span-3 space-y-4 order-first md:order-last">
        <CardBox title="Actions">
          <Button
            disabled={
              !form.formState.isValid || loading || !form.formState.isDirty
            }
            className="w-full flex gap-2"
            type="submit"
          >
            <Loader loading={loading} />
            {type === "NEW" ? "Create" : "Update"}
          </Button>

          <div className="space-y-5">
            {isUpdateType && <DeleteButton onDelete={onDelete} />}

            <Separator />

            {/* //! STATUS */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="0">⬜ Draft</SelectItem>
                        <SelectItem value="1">🟩 Published</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            {isUpdateType && (
              <div className="flex justify-between text-gray-500 text-xs">
                <p className="flex flex-col">
                  <span>Published At</span>
                  <span className="text-sm">
                    {course?.createdAt.toLocaleString()}
                  </span>
                </p>

                <div>
                  <Separator orientation="vertical" />
                </div>

                <p className="flex flex-col">
                  <span>Last Update</span>
                  <span className="text-sm">
                    {course?.updatedAt.toLocaleString()}
                  </span>
                </p>
              </div>
            )}
          </div>
        </CardBox>

        {/* //! PRICE */}
        <CardBox title="Price">
          {isUpdateType && (
            <>
              <div className="flex justify-between text-sm items-center text-gray-500">
                <p className="flex gap-1 items-center">
                  {course?.discount && (
                    <span className="text-primary font-medium">
                      <BadgePercent />
                    </span>
                  )}
                  Final Price
                </p>
                <span className="text-primary font-semibold">
                  {course?.price === 0 ? (
                    <Badge variant={"green"}>Free</Badge>
                  ) : (
                    course?.price.toLocaleString("en-US") + " T"
                  )}
                </span>
              </div>
              <Separator />
            </>
          )}

          <FormField
            control={form.control}
            name="basePrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Base Price (T)</FormLabel>
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

          {/* //! DISCOUNT */}
          <div className="flex items-center space-x-2 py-3">
            <Switch
              id="disocunt"
              onCheckedChange={handleDiscountToggle}
              defaultChecked={discountEnabled}
            />
            <Label htmlFor="disocunt" className="cursor-pointer">
              Apply Discount
            </Label>
          </div>

          {discountEnabled && (
            <CardBox title="Discount">
              <FormField
                control={form.control}
                name="discount.amount"
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

              <FormField
                control={form.control}
                name="discount.type"
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
                        <SelectItem value="FIXED">
                          <div className="flex items-center gap-1 font-medium">
                            <span className="text-xl pr-1 text-primary">$</span>{" "}
                            Fixed
                          </div>
                        </SelectItem>
                        <SelectItem value="PERCENT">
                          <div className="flex items-center gap-1 font-medium">
                            <span className="text-xl pr-1 text-orange-500">
                              %
                            </span>{" "}
                            Percent
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center space-x-2 py-3">
                <Switch
                  id="disocunt-date"
                  onCheckedChange={handleDiscountDateToggle}
                  defaultChecked={disocuntDateEnabled}
                />
                <Label htmlFor="disocunt-date" className="cursor-pointer">
                  From / To
                </Label>
              </div>

              {disocuntDateEnabled && (
                <div>
                  <FormField
                    control={form.control}
                    name="discount.date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        {/* <FormLabel>Date of birth</FormLabel> */}
                        <Popover>
                          <PopoverTrigger asChild>
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
                                    {format(
                                      field.value.from || new Date(),
                                      "MMMM dd"
                                    )}
                                    <span>-</span>
                                    {format(
                                      field.value.to || addDays(new Date(), 4),
                                      "MMMM dd"
                                    )}{" "}
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
                              disabled={(date) => date < new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </CardBox>
          )}
        </CardBox>

        {/* //! IMAGE */}

        <CardBox title="Image">
          <ImageField
            control={form.control}
            setImagePreview={setImagePreview}
            setValue={form.setValue}
            imagePreview={imagePreview}
            public_id={course?.image?.public_id}
          />
        </CardBox>

        {/* //! CATEGORY */}
        <CardBox title="Category">
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    {categories?.map((category, index) => (
                      <FormItem
                        key={index}
                        className="flex items-center space-x-3 space-y-0"
                      >
                        <FormControl>
                          <RadioGroupItem value={category.id.toString()} />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">
                          {category.name}
                        </FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardBox>

        {/* //! TUTOR */}
        <FormField
          control={form.control}
          name="tutorId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="mb-1">Tutor</FormLabel>
              <ComboField<TutorType>
                options={tutors}
                getLabel={(tutor) => (
                  <div className="flex items-center gap-2">
                    <Avatar src={tutor.image?.url} size={22} />
                    {tutor.name}
                  </div>
                )}
                getValue={(tutor) => tutor.id.toString()}
                getSearchText={(tutor) => tutor.name}
                onSelect={(tutor) => field.onChange(tutor.id.toString())}
                placeholder="Select Tutor"
                defaultValue={course?.tutorId?.toString() || ""}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        {/* //! TIZER URL */}
        <FormField
          control={form.control}
          name="tizerUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tizer Url</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* //! DURATION */}
        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration (min)</FormLabel>
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

        {/* //! Gallery */}
        <CardBox title="Gallery">
          <FormField
            control={form.control}
            name="gallery"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="gallery">
                  <div className="flex gap-2 justify-center items-center bg-secondary  p-3 rounded-sm w-full cursor-pointer hover:bg-neutral-200/60">
                    <Plus size={18} />
                    Add Image
                  </div>
                </FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    id="gallery"
                    className="hidden"
                    multiple
                    onChange={(e) => {
                      if (e.target.files) {
                        const newFilesArray = Array.from(e.target.files);
                        const allFiles = [
                          ...(field.value || []),
                          ...newFilesArray,
                        ];
                        field.onChange(allFiles);
                        handleGalleryPreview(newFilesArray);
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {galleryPreviews && galleryPreviews?.length > 0 && (
            <div className="space-y-3">
              <div className="grid grid-cols-4 gap-1">
                {galleryPreviews?.map((image, index) => (
                  <div className="relative group" key={index}>
                    <Image
                      alt=""
                      src={image.url}
                      className="aspect-square object-cover rounded-sm"
                      width={100}
                      height={100}
                    />
                    <Button
                      type="button"
                      onClick={() => handleGalleryPreviewRemove(index)}
                      className="h-4 w-4 absolute top-0 left-0 m-1 hidden group-hover:block"
                      size={"icon"}
                      variant={"secondary"}
                    >
                      <X />
                    </Button>
                  </div>
                ))}
              </div>
              <Separator />
            </div>
          )}

          <div className="grid grid-cols-4 gap-1">
            {course?.gallery?.image.map((image, index) => (
              <div
                className="relative group overflow-hidden rounded-sm"
                key={index}
              >
                <Image
                  alt=""
                  src={image.url}
                  className="aspect-square object-cover rounded-sm"
                  width={100}
                  height={100}
                />
                <Button
                  type="button"
                  onClick={() => handleGalleryRemove(image.public_id!)}
                  className={`w-6 h-6 rounded-full absolute top-0 left-0 m-1 hidden group-hover:flex`}
                  size={"icon"}
                  variant={"destructive"}
                >
                  <Loader loading={removeImageLoading} />

                  {!removeImageLoading && <X />}
                </Button>
              </div>
            ))}
          </div>
        </CardBox>
      </div>
    </>
  );
};

export default CourseFormSidebar;
