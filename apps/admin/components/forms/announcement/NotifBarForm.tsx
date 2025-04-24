"use client";

import { createNotifBar, updateNotifBar } from "@/actions/notifBar";
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
import { useLoading } from "@igraph/utils";
import { notifbarFormSchema, NotifbarFormType } from "@/lib/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Notifbar } from "@igraph/database";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface Props {
  notifBar?: Notifbar | null;
}

const NotifBarForm = ({ notifBar }: Props) => {
  const { loading, setLoading } = useLoading();

  const form = useForm<NotifbarFormType>({
    resolver: zodResolver(notifbarFormSchema),
    mode: "onSubmit",
    defaultValues: {
      content: notifBar?.content || "Write Here...",
      link: notifBar?.link || undefined,
      active: notifBar?.active || false,
      bgColor: notifBar?.bgColor || "#3b82f6",
      textColor: notifBar?.textColor || "#ffffff",
    },
  });

  const onSubmit = async (data: NotifbarFormType) => {
    setLoading(true);

    const res = notifBar
      ? await updateNotifBar(data, notifBar.id)
      : await createNotifBar(data);

    if (res.error) {
      toast.warning(res.error);
      setLoading(false);
      return;
    }

    if (res.success) {
      toast.success(res.success);
      setLoading(false);
    }
  };

  const bgColor = form.watch("bgColor");
  const textColor = form.watch("textColor");

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <h3>Notification Bar</h3>

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
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Input
                        style={{ backgroundColor: bgColor, color: textColor }}
                        dir="rtl"
                        className="text-center"
                        placeholder="Enter content"
                        {...field}
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

              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="bgColor"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Backgound Color</FormLabel>
                      <FormControl>
                        <Input
                          type="color"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="textColor"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Text Color</FormLabel>
                      <FormControl>
                        <Input
                          type="color"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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

export default NotifBarForm;
