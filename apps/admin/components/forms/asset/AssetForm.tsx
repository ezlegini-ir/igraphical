"use client";

import { createAsset, deleteAsset, updateAsset } from "@/actions/asset";
import { AssetType } from "@/app/(DASHBOARD)/assets/list/AssetsList";
import { assetFormSchema, AssetFormType } from "@/lib/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { AssetCategory } from "@igraph/database";
import CardBox from "@igraph/ui/components/CardBox";
import DeleteButton from "@igraph/ui/components/DeleteButton";
import Loader from "@igraph/ui/components/Loader";
import { Button } from "@igraph/ui/components/ui/button";
import { Checkbox } from "@igraph/ui/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@igraph/ui/components/ui/form";
import { Input } from "@igraph/ui/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@igraph/ui/components/ui/select";
import { Separator } from "@igraph/ui/components/ui/separator";
import { Skeleton } from "@igraph/ui/components/ui/skeleton";
import { deleteImage, useImagePreview, useLoading } from "@igraph/utils";
import { Plus, X } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import ImageField from "../ImageField";

const TextEditor = dynamic(() => import("@igraph/editor/Editor"), {
  ssr: false,
  loading: () => (
    <Skeleton className="w-full h-[450px] bg-white border rounded-sm" />
  ),
});

export interface CategoriesType {
  category: AssetCategory;
  postId: number;
  categoryId: number;
}

interface Props {
  type: "NEW" | "UPDATE";
  asset?: AssetType;
  categories: AssetCategory[];
}

const AssetForm = ({ type, asset, categories }: Props) => {
  // HOOKS
  const router = useRouter();
  const { loading, setLoading } = useLoading();
  const { imagePreview, setImagePreview } = useImagePreview(asset?.image?.url);
  const { loading: removeImageLoading, setLoading: setRemoveImageLoading } =
    useLoading();
  const [galleryPreviews, setGalleryPreviews] = useState<
    { public_id?: string; url: string }[] | undefined
  >();

  // CONSTS
  const isUpdateType = type === "UPDATE";

  const form = useForm<AssetFormType>({
    resolver: zodResolver(assetFormSchema),
    defaultValues: {
      title: asset?.title || "",
      url: asset?.url || "",
      description: asset?.description || "",
      status: asset?.status,
      categories: asset?.categories?.map((c) => c.category.id.toString()) || [],
      image: undefined,
      fileUrl: asset?.fileUrl || "",
      format: asset?.format || "",
    },
    mode: "onChange",
  });

  const handleGalleryPreview = (files: File[]) => {
    const imageUrls = files.map((file) => ({
      url: URL.createObjectURL(file),
    }));

    setGalleryPreviews((prev = []) => [...prev, ...imageUrls]);
  };

  const handleGalleryRemove = async (publicId: string) => {
    setRemoveImageLoading(true);

    const res = await deleteImage(publicId); //TODO

    if (res.error) {
      toast.error(res.error);
      setRemoveImageLoading(false);
      return;
    }

    router.refresh();
    setRemoveImageLoading(false);
  };

  const handleGalleryPreviewRemove = async (index: number) => {
    setGalleryPreviews((prev) => prev?.filter((_, i) => i !== index));

    form.setValue(
      "gallery",
      form.getValues("gallery")?.filter((_, i) => i !== index) || []
    );
  };

  // onSubmit handles post creation/updating.
  const onSubmit = async (data: AssetFormType) => {
    setLoading(true);

    const res = isUpdateType
      ? await updateAsset(data, asset?.id!)
      : await createAsset(data);

    if (res.error) {
      toast.error(res.error);
      setLoading(false);
      return;
    }

    if (res.success) {
      toast.success(res.success);
      setLoading(false);
      if (isUpdateType) {
        router.refresh();
      } else {
        router.push(`/assets/${res.data?.id}`);
      }
    }
  };

  const onDelete = async () => {
    setLoading(true);

    const res = await deleteAsset(asset?.id!);

    if (res.error) {
      toast.error(res.error);
      setLoading(false);
    }

    if (res.success) {
      toast.success(res.success);
      router.push("/assets/list");
    }
  };

  return (
    <Form {...form}>
      <form
        className="grid grid-cols-12 gap-5"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="col-span-12 md:col-span-9 space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input dir="rtl" className="text-left" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Url</FormLabel>
                  <FormControl>
                    <Input dir="rtl" className="text-left" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isUpdateType && (
              <Link
                href={`${process.env.NEXT_PUBLIC_BASE_URL}/${asset?.url}`}
                className="text-xs text-gray-500"
              >
                <p>
                  {process.env.NEXT_PUBLIC_BASE_URL}/{asset?.url}
                </p>
              </Link>
            )}
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="pb-10">
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <TextEditor onChange={field.onChange} value={field.value} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="col-span-12 md:col-span-3 space-y-4 order-first md:order-last">
          <CardBox title="Actions">
            <Button
              disabled={
                !form.formState.isValid || loading || !form.formState.isDirty
              }
              className="w-full flex gap-2"
              type="submit"
            >
              {<Loader loading={loading} />}
              {type === "NEW" ? "Create" : "Update"}
            </Button>

            <Separator />

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
                        <SelectItem value="DRAFT">⬜ Draft</SelectItem>
                        <SelectItem value="PUBLISHED">🟩 Published</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isUpdateType && (
              <div className="space-y-5">
                <DeleteButton disabled={loading} onDelete={onDelete} />

                <Separator />

                <div className="flex justify-between text-gray-500 text-xs">
                  <p className="flex flex-col">
                    <span>Published At</span>
                    <span className="text-sm">
                      {asset?.createdAt.toLocaleString()}
                    </span>
                  </p>

                  <div>
                    <Separator orientation="vertical" />
                  </div>

                  <p className="flex flex-col">
                    <span>Last Update</span>
                    <span className="text-sm">
                      {asset?.updatedAt.toLocaleString()}
                    </span>
                  </p>
                </div>
              </div>
            )}
          </CardBox>

          <FormField
            control={form.control}
            name="fileUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>File URL</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="format"
            render={({ field }) => (
              <FormItem>
                <FormLabel>File Format</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <CardBox title="Image">
            <ImageField
              control={form.control}
              setImagePreview={setImagePreview}
              imagePreview={imagePreview}
              setValue={form.setValue}
              public_id={asset?.image?.public_id}
            />
          </CardBox>

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
              {asset?.gallery?.image.map((image, index) => (
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

          <CardBox title="Categories">
            <FormField
              control={form.control}
              name="categories"
              render={({ field }) => (
                <FormItem>
                  {categories?.map((item) => {
                    const isChecked = field.value?.includes(item.id.toString());

                    return (
                      <FormItem
                        key={item.id}
                        className="flex flex-row items-center gap-3 pb-1.5"
                      >
                        <FormControl>
                          <Checkbox
                            checked={isChecked}
                            onCheckedChange={(checked) => {
                              const updatedCategories = checked
                                ? [...field.value, item.id.toString()]
                                : field.value.filter(
                                    (value) => value !== item.id.toString()
                                  );

                              field.onChange(updatedCategories);
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal cursor-pointer">
                          {item.name}
                        </FormLabel>
                      </FormItem>
                    );
                  })}
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardBox>
        </div>
      </form>
    </Form>
  );
};

export default AssetForm;
