"use client";

import { createTutor, deleteTutor, updateTutor } from "@/actions/tutor";
import { TutorType } from "@/app/(DASHBOARD)/tutors/TutorsList";
import DeleteButton from "@igraph/ui/components/DeleteButton";
import Loader from "@igraph/ui/components/Loader";
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
import { Textarea } from "@igraph/ui/components/ui/textarea";
import { useImagePreview } from "@igraph/utils";
import { useLoading } from "@igraph/utils";
import { TutorFormType, tutorFormSchema } from "@/lib/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import AvatarField from "../AvatarField";

interface Props {
  tutor?: TutorType;
  type: "NEW" | "UPDATE";
}

const TutorForm = ({ type, tutor }: Props) => {
  // HOOKS
  const router = useRouter();
  const { loading, setLoading } = useLoading();
  const { imagePreview, setImagePreview } = useImagePreview(tutor?.image?.url);

  const isUpdateType = type === "UPDATE";

  const form = useForm<TutorFormType>({
    resolver: zodResolver(tutorFormSchema),
    mode: "onBlur",
    defaultValues: {
      name: tutor?.name || "",
      displayName: tutor?.displayName || "",
      password: "",
      email: tutor?.email || "",
      phone: tutor?.phone || "",
      slug: tutor?.slug || "",
      bio: tutor?.bio || "",
      titles: tutor?.titles || "",
      profit: tutor?.profit || 0,
    },
  });

  const onSubmit = async (data: TutorFormType) => {
    setLoading(true);

    let res;
    if (isUpdateType) {
      res = await updateTutor({ ...data, id: tutor?.id! });
    } else {
      res = await createTutor(data);
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
    }
  };

  const onDelete = async () => {
    setLoading(true);

    const res = await deleteTutor(tutor?.id!);

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
      <form
        className="space-y-4 grid grid-cols-2 gap-5"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="space-y-3">
          <AvatarField
            control={form.control}
            setImagePreview={setImagePreview}
            setValue={form.setValue}
            imagePreview={imagePreview}
            public_id={tutor?.image?.public_id}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
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
              <FormItem className="w-full">
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
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
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
              <FormItem className="w-full">
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
              <FormItem className="w-full">
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
            name="profit"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-primary font-semibold">
                  Profit (%)
                </FormLabel>
                <FormControl>
                  <Input
                    min={0}
                    max={100}
                    type="number"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value === "" ? 0 : Number(value));
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-3">
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea className="h-48" dir="rtl" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="titles"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Titles</FormLabel>
                <FormControl>
                  <Textarea className="h-28" dir="rtl" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            disabled={
              !form.formState.isValid || loading || !form.formState.isDirty
            }
            className="w-full flex gap-2"
            type="submit"
          >
            {<Loader loading={loading} />}
            {isUpdateType ? "Update" : "Create"}
          </Button>

          {isUpdateType && <DeleteButton onDelete={onDelete} />}
        </div>
      </form>
    </Form>
  );
};

export default TutorForm;
