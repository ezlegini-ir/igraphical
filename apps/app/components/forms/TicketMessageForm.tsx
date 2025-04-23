"use client";

import { sendTicketMessage } from "@/actions/ticket";
import CardBox from "@/app/panel/components/CardBox";
import { truncateFileName, useFileName } from "@igraph/utils";
import { useLoading } from "@igraph/utils";
import {
  ticketMessageFormSchema,
  TicketMessageFormType,
} from "@/lib/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { ControllerRenderProps, useForm } from "react-hook-form";
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
import Loader from "@igraph/ui/components/Loader";
import { Textarea } from "@igraph/ui/components/ui/textarea";
import { toast } from "sonner";
import { getSessionUser } from "@/data/user";
import { allowedFomatsForUplaod } from "@/data/utils";

const TicketMessageForm = ({ ticketId }: { ticketId: number }) => {
  // HOOKS
  const router = useRouter();
  const { loading, setLoading } = useLoading();
  const { fileName, setFileName } = useFileName();

  const form = useForm<TicketMessageFormType>({
    resolver: zodResolver(ticketMessageFormSchema),
    defaultValues: {
      message: "",
      file: undefined,
    },
  });

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: ControllerRenderProps<TicketMessageFormType, "file">
  ) => {
    const file = e.target.files?.[0];

    if (file) {
      const allowedFormats = allowedFomatsForUplaod;
      const maxSize = 5 * 1024 * 1024;

      if (!allowedFormats.includes(file.type)) {
        toast.error("این فرمت مجاز نمی‌باشد!");
        e.target.value = "";
        return;
      }

      if (file.size > maxSize) {
        toast.error("حداکثر حجم فایل 5 مگابایت می‌باشد!");
        e.target.value = "";
        return;
      }

      field.onChange(file);
      setFileName(file.name);
    }
  };

  const onSubmit = async (data: TicketMessageFormType) => {
    const userId = (await getSessionUser())?.id;
    if (!data || !userId) return;

    setLoading(true);
    const res = await sendTicketMessage(data, ticketId, userId);

    if (res.error) {
      toast.error(res.error);
      setLoading(false);
      return;
    }

    if (res.success) {
      toast.success(res.success);
      router.refresh();
      form.reset();
      setFileName("");
      setLoading(false);
    }
  };

  return (
    <CardBox title="ارسال پیام جدید">
      <Form {...form}>
        <form className="space-y-3 " onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>پیغام</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="لطفا پیام خود را در این قسمت بنویسید"
                    {...field}
                    className="min-h-[110px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between items-center">
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  {fileName ? (
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-gray-600">
                        {truncateFileName(fileName)}
                      </span>
                      <Button
                        onClick={() => {
                          setFileName("");
                          form.setValue("file", undefined);
                        }}
                        variant={"link"}
                        size={"icon"}
                        className="w-5 h-5"
                      >
                        <X size={12} />
                      </Button>
                    </div>
                  ) : (
                    <FormLabel
                      htmlFor="file-upload"
                      className="cursor-pointer flex items-center gap-2"
                    >
                      <div className="flex gap-1 items-center">
                        <Link
                          size={24}
                          className="text-gray-400 hover:text-blue-500 transition pt-1"
                        />
                        <p className="flex flex-col">
                          <span className="text-xs text-gray-400 font-normal">
                            حداکثر 5 مگابایت
                          </span>
                          <span className="text-xs text-gray-400 font-normal">
                            عکس یا .zip
                          </span>
                        </p>
                      </div>
                    </FormLabel>
                  )}
                  <FormControl>
                    <Input
                      accept=".jpg,.jpeg,.png,.gif,.webp,.zip"
                      type="file"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, field)}
                      id="file-upload"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              disabled={!form.formState.isValid || loading}
              className="flex gap-2"
              type="submit"
            >
              {<Loader loading={loading} />}
              ارسال پیام
            </Button>
          </div>
        </form>
      </Form>
    </CardBox>
  );
};

export default TicketMessageForm;
