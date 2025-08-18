"use client";

import { createAsset, deleteAsset, updateAsset } from "@/actions/asset";
import { AssetType } from "@/app/(DASHBOARD)/assets/list/AssetsList";
import { assetFormSchema, AssetFormType } from "@/lib/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import CardBox from "@igraph/ui/components/CardBox";
import DeleteButton from "@igraph/ui/components/DeleteButton";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@igraph/ui/components/ui/select";
import { Separator } from "@igraph/ui/components/ui/separator";
import { useImagePreview, useLoading } from "@igraph/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import ImageField from "../ImageField";

interface Props {
  type: "NEW" | "UPDATE";
  asset?: AssetType;
}

const AssetForm = ({ type, asset }: Props) => {
  // HOOKS
  const router = useRouter();
  const { loading, setLoading } = useLoading();
  const { imagePreview, setImagePreview } = useImagePreview(asset?.image?.url);

  // CONSTS
  const isUpdateType = type === "UPDATE";

  const form = useForm<AssetFormType>({
    resolver: zodResolver(assetFormSchema),
    defaultValues: {
      title: asset?.title || "",
      url: asset?.url || "",
      status: asset?.status,
      image: undefined,
      fileUrl: asset?.fileUrl || "",
      format: asset?.format || "",
      fileSize: asset?.fileSize || 0,
    },
    mode: "onChange",
  });

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
                href={`${process.env.NEXT_PUBLIC_MAIN_URL}/assets/${asset?.url}`}
                className="text-xs text-gray-500"
              >
                <p>
                  {process.env.NEXT_PUBLIC_MAIN_URL}/assets/{asset?.url}
                </p>
              </Link>
            )}
          </div>

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

          <FormField
            control={form.control}
            name={"fileSize"}
            render={({ field }) => (
              <FormItem
                className={`w-full ${isUpdateType && "pointer-events-none"}`}
              >
                <FormLabel>File Size (MB)</FormLabel>
                <Input
                  min={0}
                  type="number"
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value === "" ? 0 : Number(value));
                  }}
                />
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

          <CardBox title="Image">
            <ImageField
              control={form.control}
              setImagePreview={setImagePreview}
              imagePreview={imagePreview}
              setValue={form.setValue}
              public_id={asset?.image?.public_id}
            />
          </CardBox>
        </div>
      </form>
    </Form>
  );
};

export default AssetForm;
