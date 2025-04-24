"use client";

import { createAskTutor } from "@/actions/askTutor";
import { truncateFileName, useFileName } from "@igraph/utils";
import { useLoading } from "@igraph/utils";
import {
  AskTutorFormType,
  ticketMessageFormSchema,
  TicketMessageFormType,
} from "@/lib/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, RefreshCcw, X } from "lucide-react";
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
import { AskTutorStatus } from "@igraph/database";
import { Badge } from "@igraph/ui/components/ui/badge";

interface Props {
  classRoomId: string;
  tutorId: number;
  userId: number;
  courseId: number;
  askTutorId: number | null;
  status: AskTutorStatus;
}

const AskTutorForm = ({
  classRoomId,
  tutorId,
  userId,
  courseId,
  status,
  askTutorId,
}: Props) => {
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
    field: ControllerRenderProps<AskTutorFormType, "file">
  ) => {
    const file = e.target.files?.[0];

    if (file) {
      const allowedFormats = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "application/zip",
      ];
      const maxSize = 5 * 1024 * 1024;

      if (!allowedFormats.includes(file.type)) {
        toast.error("این فرمت مجاز نمی‌باشد!");
        return;
      }

      if (file.size > maxSize) {
        toast.error("حداکثر حجم فایل 5 مگابایت می‌باشد!");
        return;
      }

      field.onChange(file);
      setFileName(file.name);
    }
  };

  const onSubmit = async (data: TicketMessageFormType) => {
    setLoading(true);

    const res = await createAskTutor(
      data,
      classRoomId,
      tutorId,
      userId,
      courseId,
      askTutorId
    );

    if (res?.error) {
      toast.error(res.error);
      setLoading(false);
      return;
    }

    if (res?.success) {
      toast.success(res.success);
      setLoading(false);
      form.reset();
      setFileName("");
      router.refresh();
    }
  };

  const statuses = status ? (
    status === "PENDING" ? (
      <Badge className="text-[10px]" variant={"orange"}>
        در انتظار پاسخ
      </Badge>
    ) : (
      <Badge className="text-[10px]" variant={"green"}>
        پاسخ داده شده
      </Badge>
    )
  ) : null;

  return (
    <>
      <div className="flex justify-between items-center">
        <p className="font-semibold">پرسش از مدرس</p>
        <div className="flex items-center gap-3">
          <Button
            disabled={!askTutorId}
            onClick={() => {
              router.refresh();
              toast.success("پیام ها به روز شدند.");
            }}
            variant="link"
            size="icon"
            className="w-8 h-8 text-gray-500 hover:text-primary"
          >
            <RefreshCcw />
          </Button>
          <span>{statuses}</span>
        </div>
      </div>
      <div className="card">
        <Form {...form}>
          <form className="space-y-3 " onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="سوال خود را در یک پیام بنویسید"
                      {...field}
                      className="h-[100px]"
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
      </div>
    </>
  );
};

export default AskTutorForm;
