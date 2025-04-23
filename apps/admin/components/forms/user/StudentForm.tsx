"use client";

import { createUser, deleteUser, updateUser } from "@/actions/user";
import { UserType } from "@/app/(DASHBOARD)/students/StudentsList";
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
import { useImagePreview } from "@igraph/utils";
import { StudentFormType, studentFormSchema } from "@/lib/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLoading } from "@igraph/utils";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import AvatarField from "@/components/forms/AvatarField";

interface Props {
  user?: UserType;
  type: "NEW" | "UPDATE";
}

const StudentForm = ({ type, user }: Props) => {
  // HOOKS
  const router = useRouter();
  const { loading, setLoading } = useLoading();
  const { imagePreview, setImagePreview } = useImagePreview(user?.image?.url);

  const isUpdateType = type === "UPDATE";

  const form = useForm<StudentFormType>({
    resolver: zodResolver(studentFormSchema),
    mode: "onSubmit",
    defaultValues: {
      email: user?.email || "",
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      nationalId: user?.nationalId || "",
      phone: user?.phone || "09",
    },
  });

  const onSubmit = async (data: StudentFormType) => {
    setLoading(true);

    let res;
    if (isUpdateType) {
      res = await updateUser(data, user?.id!);
    } else {
      res = await createUser(data);
    }

    if (res.error) {
      toast.error(res.error);
      setLoading(false);
      return;
    }
    if (res.success) {
      toast.success(res.success);
      router.refresh();
      router.refresh();
      setLoading(false);
      form.reset();
    }
  };

  const onDelete = async () => {
    setLoading(true);

    const res = await deleteUser(user?.id!);

    if (res.error) {
      toast.error(res.error);
      setLoading(false);
    }

    if (res.success) {
      toast.success(res.success);
      router.refresh();
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <AvatarField
          control={form.control}
          imagePreview={imagePreview}
          setImagePreview={setImagePreview}
          public_id={user?.image?.public_id}
          setValue={form.setValue}
        />

        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input maxLength={11} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="nationalId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>National Id</FormLabel>
              <FormControl>
                <Input maxLength={10} {...field} />
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
          {<Loader loading={loading} />}
          {isUpdateType ? "Update" : "Create"}
        </Button>

        {isUpdateType && <DeleteButton onDelete={onDelete} />}
      </form>
    </Form>
  );
};

export default StudentForm;
