"use client";

import { createSlider, updateSlider } from "@/actions/slider";
import { Button } from "@igraph/ui/components/ui/button";
import { Form } from "@igraph/ui/components/ui/form";
import { SlidersFormType, slidersFormSchema } from "@/lib/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image, Slider } from "@igraph/database";
import { useLoading } from "@igraph/utils";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import SlidersForm from "./SlidersForm";

export interface Sliders extends Slider {
  image: Image | null;
}

export interface SlidersProps {
  sliders?: Sliders[];
}

const MainSlidersForm = ({ sliders }: SlidersProps) => {
  // HOOKS
  const { loading, setLoading } = useLoading();
  const router = useRouter();

  const form = useForm<SlidersFormType>({
    resolver: zodResolver(slidersFormSchema),
    mode: "onSubmit",
    defaultValues: {
      images: sliders?.map((slider) => ({
        active: slider.active,
        link: slider.link || "", // Ensure it's always a string
        image: undefined, // File remains undefined if not provided
      })) || [
        {
          active: false,
          link: "", // Default to empty string
          image: undefined,
        },
      ],
    },
  });

  const { append, remove, fields } = useFieldArray({
    name: "images",
    control: form.control,
  });

  const onSubmit = async (data: SlidersFormType) => {
    setLoading(true);

    const operationPromise = sliders?.length
      ? updateSlider(
          data,
          "PANEL",
          sliders.map((s) => s.id)
        )
      : createSlider(data, "PANEL");
    toast.promise(operationPromise, {
      loading: "Saving sliders...",
      success: (res) => {
        if (res.success) {
          router.refresh();
          form.reset(data);
          setLoading(false);
          return res.success;
        }
      },
      error: "Failed to update/create slider.",
    });
  };

  return (
    <div className="w-full">
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex justify-between items-center">
            <h3>Main Slider</h3>

            <Button
              size={"sm"}
              className="px-10"
              type="submit"
              variant={"lightBlue"}
              disabled={
                loading || !form.formState.isValid || !form.formState.isDirty
              }
            >
              Save
            </Button>
          </div>

          <SlidersForm
            fields={fields}
            form={form}
            remove={remove}
            sliders={sliders}
          />
        </form>
      </Form>

      <Button
        type="button"
        onClick={() => append({ link: "", active: false, image: undefined })}
        variant="secondary"
        className="flex items-center gap-2 w-full mt-3"
      >
        <Plus size={16} />
        Add Slider
      </Button>
    </div>
  );
};

export default MainSlidersForm;
