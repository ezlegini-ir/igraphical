"use client";

import DeleteButton from "@igraph/ui/components/DeleteButton";
import { Button } from "@igraph/ui/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@igraph/ui/components/ui/form";
import { Input } from "@igraph/ui/components/ui/input";
import {
  AdminFormType,
  adminFormSchema,
  adminRoles,
} from "@/lib/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLoading } from "@igraph/utils";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { createAdmin, deleteAdmin, updateAdmin } from "@/actions/admin";
import { AdminType } from "@/app/(DASHBOARD)/admins/AdminsList";
import Loader from "@igraph/ui/components/Loader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@igraph/ui/components/ui/select";
import { useImagePreview } from "@igraph/utils";
import { toast } from "sonner";
import AvatarField from "@/components/forms/AvatarField";

interface Props {
  admin?: AdminType;
  type: "NEW" | "UPDATE";
}

const AdminForm = ({ type, admin }: Props) => {
  // HOOKS
  const router = useRouter();
  const { loading, setLoading } = useLoading();
  const { imagePreview, setImagePreview } = useImagePreview(admin?.image?.url);
  const isUpdateType = type === "UPDATE";

  const form = useForm<AdminFormType>({
    resolver: zodResolver(adminFormSchema),
    mode: "onBlur",
    defaultValues: {
      name: admin?.name || "",
      displayName: admin?.displayName || "",
      password: "",
      email: admin?.email || "",
      phone: admin?.phone || "",
      role: admin?.role || "ADMIN",
      image: undefined,
    },
  });

  const onSubmit = async (data: AdminFormType) => {
    setLoading(true);

    let res;
    if (isUpdateType) {
      res = await updateAdmin(data, admin?.id!);
    } else {
      res = await createAdmin(data);
    }

    if (res.error) {
      toast.error(res.error);
      setLoading(false);
      return;
    }
    if (res.success) {
      toast.success(res.success);
      router.refresh();
      setLoading(false);
      form.reset();
    }
  };

  const onDelete = async () => {
    setLoading(true);

    const res = await deleteAdmin(admin?.id!);

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
          public_id={admin?.image?.public_id}
          setValue={form.setValue}
        />

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
          name="displayName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display Name</FormLabel>
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
                <Input className="en-digits" {...field} />
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
                <Input maxLength={11} className="en-digits" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {isUpdateType ? "New Password" : "Password"}{" "}
              </FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              {isUpdateType && (
                <FormDescription className="text-xs">
                  Leave Empty if you don't want to change password
                </FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role for admin..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {adminRoles.map((role, index) => (
                    <SelectItem key={index} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          disabled={
            !form.formState.isValid || !form.formState.isDirty || loading
          }
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

export default AdminForm;
