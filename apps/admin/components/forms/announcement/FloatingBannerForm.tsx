"use client";

import {
  createFloatingBanner,
  updateFloatingBanner,
} from "@/actions/floatingBanner";
import SearchCoupons from "@/components/SearchCoupons";
import {
  floatingBannerSchema,
  FloatingBannerType,
} from "@/lib/validationSchema";
import { placeHolder } from "@/public";
import { zodResolver } from "@hookform/resolvers/zod";
import { Coupon, FloatingBanner, Image as ImageType } from "@igraph/database";
import Loader from "@igraph/ui/components/Loader";
import { Button } from "@igraph/ui/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@igraph/ui/components/ui/form";
import { Input } from "@igraph/ui/components/ui/input";
import { Switch } from "@igraph/ui/components/ui/switch";
import { deleteImage, useLoading } from "@igraph/utils";
import { Trash } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface MyFloatingBannerType extends FloatingBanner {
  image: ImageType | null;
  coupon: Coupon | null;
}

interface Props {
  floatingBanner?: MyFloatingBannerType | null;
}

const FloatingBannerForm = ({ floatingBanner }: Props) => {
  const [imagePreview, setImagePreview] = useState<{
    url?: string;
    public_id?: string;
  } | null>({
    url: floatingBanner?.image?.url,
    public_id: floatingBanner?.image?.public_id,
  });

  const { loading, setLoading } = useLoading();
  const { loading: imageRemoveLoading, setLoading: setImageRemoveLoading } =
    useLoading();
  const router = useRouter();

  const form = useForm<FloatingBannerType>({
    resolver: zodResolver(floatingBannerSchema),
    mode: "onChange",
    defaultValues: {
      link: floatingBanner?.link || "",
      active: floatingBanner?.active || false,
      couponId: floatingBanner?.coupon?.id || 0,
    },
  });

  const onSubmit = async (data: FloatingBannerType) => {
    setLoading(true);

    const res = floatingBanner
      ? await updateFloatingBanner(data)
      : await createFloatingBanner(data);

    if (res.error) {
      toast.warning(res.error);
      setLoading(false);
      return;
    }

    if (res.success) {
      toast.success(res.success);
      setLoading(false);
    }

    setLoading(false);
  };

  const handleImageRemove = async (public_id?: string) => {
    if (!public_id) {
      setImagePreview(null);
      return;
    }
    setImageRemoveLoading(true);
    form.setValue("image", undefined, { shouldValidate: true });

    toast.promise(deleteImage(public_id), {
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

    setImagePreview(null);
    setImageRemoveLoading(false);
    router.refresh();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file, { shouldValidate: true });

      const objectUrl = URL.createObjectURL(file);
      setImagePreview({ url: objectUrl });
    }
  };

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <h3>Floating Banner</h3>

          <div className="card">
            <div className="space-y-3">
              <FormField
                control={form.control}
                name={"active"}
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

              <FormField
                control={form.control}
                name="image"
                render={() => (
                  <FormItem className="flex flex-col gap-2">
                    <FormLabel htmlFor="banner-upload">
                      <div className="relative group">
                        <Image
                          alt="Preview"
                          src={imagePreview?.url || placeHolder}
                          width={500}
                          height={500}
                          className="w-full aspect-[3/2] object-cover overflow-hidden rounded-sm cursor-pointer"
                        />
                        {imagePreview && (
                          <Button
                            disabled={imageRemoveLoading}
                            type="button"
                            onClick={() =>
                              handleImageRemove(imagePreview.public_id)
                            }
                            variant="destructive"
                            className="absolute top-0 left-0 m-1"
                            size={"icon"}
                          >
                            {imageRemoveLoading ? <Loader /> : <Trash />}
                          </Button>
                        )}
                      </div>
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={imageRemoveLoading}
                        type="file"
                        id="banner-upload"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter link" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={"couponId"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Coupon</FormLabel>
                    <SearchCoupons
                      field={field}
                      code={floatingBanner?.coupon?.code}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button
                  size={"sm"}
                  className="px-10"
                  type="submit"
                  disabled={
                    form.formState.isSubmitting || !form.formState.isDirty
                  }
                >
                  <Loader loading={loading} />
                  Save
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FloatingBannerForm;
