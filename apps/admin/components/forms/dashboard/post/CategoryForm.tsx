"use client";

import {
  CategoryFor,
  createCategory,
  deleteCategory,
  updateCategory,
} from "@/actions/category";
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
import { categoryFormSchema, CategoryFormType } from "@/lib/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLoading } from "@igraph/utils";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface Props {
  type: "NEW" | "UPDATE";
  category?: {
    id: number;
    name: string;
    url: string;
  };
  categoryFor: CategoryFor;
}

const CategoryForm = ({ type, category, categoryFor }: Props) => {
  // HOOKS
  const router = useRouter();
  const { loading, setLoading } = useLoading();

  const isUpdateType = type === "UPDATE";

  const form = useForm<CategoryFormType>({
    resolver: zodResolver(categoryFormSchema),
    mode: "onSubmit",
    defaultValues: {
      name: category?.name || "",
      url: category?.url || "",
    },
  });

  const onSubmit = async (data: CategoryFormType) => {
    setLoading(true);

    let res;
    if (type === "NEW") {
      res = await createCategory(data, categoryFor);
    } else {
      res = await updateCategory(data, category?.id!, categoryFor);
    }

    if (res.error) {
      toast.error(res.error);
      setLoading(false);
      return;
    }

    if (res.success) {
      toast.success(res.success);
      setLoading(false);
      if (type === "NEW") form.reset();
      router.refresh();
    }
  };

  const onDelete = async () => {
    const res = await deleteCategory(category?.id!, categoryFor);

    if (res.error) {
      toast.error(res.error);
      return;
    }

    if (res.success) {
      toast.success(res.success);
      router.refresh();
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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

        <Button
          disabled={!form.formState.isValid || loading}
          className="w-full flex gap-2"
          type="submit"
        >
          <Loader loading={loading} />
          {isUpdateType ? "Update" : "Create"}
        </Button>

        {isUpdateType && <DeleteButton onDelete={onDelete} />}
      </form>
    </Form>
  );
};

export default CategoryForm;
