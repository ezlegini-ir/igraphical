"use client";

import { deleteImage } from "@/actions/image";
import { deleteSlider } from "@/actions/slider";
import { SlidersFormType } from "@/lib/validationSchema";
import { sliderPlaceholder } from "@/public";
import Loader from "@igraph/ui/components/Loader";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@igraph/ui/components/ui/accordion";
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
import { useLoading } from "@igraph/utils";
import { Trash } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FieldArrayWithId,
  UseFieldArrayRemove,
  UseFormReturn,
} from "react-hook-form";
import { toast } from "sonner";
import { Sliders } from "./MainSlidersForm";

interface Props {
  form: UseFormReturn<SlidersFormType>;
  sliders?: Sliders[];
  remove: UseFieldArrayRemove;
  fields: FieldArrayWithId<SlidersFormType, "images", "id">[];
}

const SlidersForm = ({ form, remove, fields, sliders }: Props) => {
  // HOOKS
  const [previews, setPreviews] = useState<
    { id?: string; url?: string; public_id?: string }[]
  >([]);
  const router = useRouter();
  const { loading, setLoading } = useLoading();
  const { loading: imageRemoveLoading, setLoading: setImageRemoveLoading } =
    useLoading();

  useEffect(() => {
    if (sliders && previews.length === 0 && fields.length > 0) {
      setPreviews(
        sliders.map((slider) => ({
          id: slider.id.toString(),
          url: slider.image?.url,
          public_id: slider.image?.public_id,
        }))
      );
    }
  }, []);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue(`images.${index}.image`, file, { shouldValidate: true });

      const objectUrl = URL.createObjectURL(file);
      setPreviews((prev) => {
        const newPreviews = [...prev];
        newPreviews[index] = { id: fields[index].id, url: objectUrl };
        return newPreviews;
      });
    }
  };

  const handleImageRemove = async (
    index: number,
    public_id: string | undefined
  ) => {
    setImageRemoveLoading(true);
    form.setValue(`images.${index}.image`, undefined, { shouldValidate: true });

    toast.promise(deleteImage(public_id!), {
      loading: "Deleting Image...",
      success: (res) => {
        if (res.success) {
          router.refresh();
          setImageRemoveLoading(false);
          return res.success;
        }
      },
      error: "Failed to Delete Image.",
    });

    setPreviews((prev) => prev.filter((_, i) => i !== index));
    setImageRemoveLoading(false);
    router.refresh();
  };

  const handleRemoveSlider = async (
    index: number,
    sliderId?: number,
    public_id?: string
  ) => {
    setLoading(true);

    form.setValue(`images.${index}.image`, undefined, { shouldValidate: true });

    toast.promise(deleteSlider(sliderId!, public_id), {
      loading: "Deleting Image...",
      success: (res) => {
        if (res.success) {
          router.refresh();
          router.refresh();
          setLoading(false);
          remove(index);
          setPreviews((prev) => prev.filter((_, i) => i !== index));
          setImageRemoveLoading(false);
          return res.success;
        }
      },
      error: "Failed to Delete Image.",
    });
  };

  return (
    <div>
      <FormItem>
        <div className="space-y-2">
          {fields.map((field, index) => (
            <div key={fields[index].id} className="flex flex-col gap-2">
              <Accordion type="single" collapsible>
                <AccordionItem value={`item-${index}`} className="card py-0">
                  <AccordionTrigger>
                    <div className="flex gap-3 items-center">
                      <Image
                        alt=""
                        src={previews[index]?.url || sliderPlaceholder}
                        width={60}
                        height={60}
                        className="aspect-[22/10] object-cover rounded-sm"
                      />
                      Slider {index + 1}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                      <FormField
                        control={form.control}
                        name={`images.${index}.active`}
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center gap-3">
                              <FormLabel>Active</FormLabel>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div>
                        <FormField
                          control={form.control}
                          name={`images.${index}.image`}
                          render={() => (
                            <FormItem className="flex flex-col gap-2">
                              <FormLabel htmlFor={`slider-${fields[index].id}`}>
                                <div className="relative group">
                                  <Image
                                    alt="Preview"
                                    src={
                                      previews[index]?.url || sliderPlaceholder
                                    }
                                    width={500}
                                    height={500}
                                    className="w-full h-[150px] object-cover overflow-hidden rounded-sm cursor-pointer"
                                  />
                                  {previews[index] && (
                                    <Button
                                      disabled={imageRemoveLoading}
                                      type="button"
                                      onClick={() =>
                                        handleImageRemove(
                                          index,
                                          previews[index].public_id
                                        )
                                      }
                                      variant="destructive"
                                      className="absolute top-0 left-0 m-1 hidden group-hover:flex"
                                      size={"icon"}
                                    >
                                      {imageRemoveLoading ? (
                                        <Loader />
                                      ) : (
                                        <Trash />
                                      )}
                                    </Button>
                                  )}
                                </div>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  disabled={imageRemoveLoading}
                                  type="file"
                                  id={`slider-${fields[index].id}`}
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => handleFileChange(e, index)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name={`images.${index}.link`}
                        render={({ field }) => (
                          <FormItem className="px-0.5 w-full">
                            <FormLabel>Link</FormLabel>
                            <FormControl>
                              <Input
                                placeholder={`Link ${index + 1}`}
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <Button
                        type="button"
                        disabled={loading}
                        onClick={() =>
                          handleRemoveSlider(
                            index,
                            previews[index]?.id
                              ? Number(previews[index]?.id)
                              : undefined,
                            previews[index]?.public_id
                          )
                        }
                        variant="secondary"
                        size="icon"
                      >
                        {loading ? <Loader /> : <Trash />}
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          ))}
        </div>
      </FormItem>
    </div>
  );
};

export default SlidersForm;
