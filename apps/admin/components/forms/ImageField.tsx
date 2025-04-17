"use client";

import { deleteImage } from "@igraph/utils";
import { Button } from "@igraph/ui/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@igraph/ui/components/ui/form";
import { Input } from "@igraph/ui/components/ui/input";
import { useLoading } from "@igraph/utils";
// import { placeHolder } from "@/public";
import { X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, Dispatch, SetStateAction } from "react";
import Loader from "@igraph/ui/components/Loader";
import { toast } from "sonner";
import { placeHolder } from "@/public";

interface Props {
  control: any;
  imagePreview?: string;
  setValue: any;
  public_id?: string;
  setImagePreview: Dispatch<SetStateAction<string | undefined>>;
}

const ImageField = ({
  control,
  imagePreview,
  setImagePreview,
  setValue,
  public_id,
}: Props) => {
  //HOOKS
  const router = useRouter();
  const { loading, setLoading } = useLoading();

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>, field: any) => {
    const input = e.target;

    if (input.files?.length && input.files[0]) {
      const file = input.files[0];

      // Allowed MIME types
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ];
      const maxSize = 4 * 1024 * 1024; // 5MB in bytes

      if (!allowedTypes.includes(file.type)) {
        toast.error("Only Image Types Are Allowed.");
        input.value = "";
        return;
      }

      if (file.size > maxSize) {
        toast.error("must be less than 4mb");
        input.value = "";
        return;
      }

      field.onChange(file);
      setImagePreview(URL.createObjectURL(file));

      input.value = "";
    }
  };

  const handleImageRemove = async () => {
    setLoading(true);

    if (public_id) {
      const res = await deleteImage(public_id);

      if (res.error) {
        toast.error(res.error);
        setLoading(false);
        return;
      }

      if (res.success) {
        toast.success(res.success);
        setValue("image", undefined);
        setLoading(false);
        router.refresh();
      }

      setImagePreview(undefined);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <FormField
        control={control}
        name="image"
        render={({ field }) => (
          <FormItem className="w-full">
            <div className="relative overflow-hidden rounded-md">
              <FormLabel htmlFor="file-upload">
                <Image
                  alt=""
                  src={imagePreview || placeHolder} //todo
                  width={400}
                  height={400}
                  className="aspect-video w-full rounded-sm object-cover border-[1px] border-slate-400 hover:drop-shadow-md border-dashed  cursor-pointer relative "
                />
              </FormLabel>
              {imagePreview && (
                <Button
                  type="button"
                  onClick={() => handleImageRemove()}
                  variant={"secondary"}
                  className="absolute h-6 w-6 border top-0 m-1 bg-white"
                  size={"icon"}
                >
                  <X />
                </Button>
              )}

              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/50">
                  <Loader loading />
                </div>
              )}
            </div>

            <FormControl>
              <Input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageChange(e, field)}
                id="file-upload"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ImageField;
