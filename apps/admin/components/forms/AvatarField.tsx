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
// import { avatar } from "@/public";
import { X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import { useLoading } from "@igraph/utils";
import Loader from "@igraph/ui/components/Loader";
import { avatar } from "@/public";

interface Props {
  control: any;
  imagePreview?: string;
  setValue: any;
  public_id?: string;
  setImagePreview: Dispatch<SetStateAction<string | undefined>>;
}

const AvatarField = ({
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
      const maxSize = 5 * 1024 * 1024; // 4MB in bytes

      if (!allowedTypes.includes(file.type)) {
        toast.error("فقط فرمت عکس مجاز می باشد.");
        input.value = "";
        return;
      }

      if (file.size > maxSize) {
        toast.error("حداکثر حجم مجاز 5 مگابایت می باشد.");
        input.value = "";
        return;
      }

      field.onChange(file);
      setImagePreview(URL.createObjectURL(file));

      input.value = "";
    }
  };

  const handleImageRemove = async () => {
    if (!public_id) {
      setImagePreview(undefined);
    } else {
      setLoading(true);

      const res = await deleteImage(public_id);

      if (res.error) {
        toast.error(res.error);
        setLoading(false);
        return;
      }

      if (res.success) {
        toast.success(res.success);
        setValue("image", undefined);
        setImagePreview(undefined);
        setLoading(false);
        router.refresh();
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <FormField
        control={control}
        name="image"
        render={({ field }) => (
          <FormItem>
            <div
              className={`relative rounded-full ${loading && "opacity-50 pointer-events-none"}`}
            >
              <FormLabel htmlFor="file-upload">
                <Image
                  alt=""
                  src={imagePreview || avatar}
                  width={100}
                  height={100}
                  className="aspect-square rounded-full object-cover border-[1px] border-slate-400 hover:drop-shadow-md border-dashed  cursor-pointer relative "
                />
              </FormLabel>
              {imagePreview && (
                <Button
                  type="button"
                  onClick={() => handleImageRemove()}
                  variant={"secondary"}
                  className="absolute h-[22px] w-[22px] border top-0 m-1 bg-white"
                  size={"icon"}
                >
                  {loading ? <Loader loading /> : <X />}
                </Button>
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

export default AvatarField;
