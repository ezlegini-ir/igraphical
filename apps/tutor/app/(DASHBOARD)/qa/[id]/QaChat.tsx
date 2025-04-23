"use client";

import { sendAskTutorMessage } from "@/actions/askTutor";
import Avatar from "@igraph/ui/components/Avatar";
import CardBox from "@igraph/ui/components/CardBox";
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
import { Separator } from "@igraph/ui/components/ui/separator";
import { Textarea } from "@igraph/ui/components/ui/textarea";
import { useFileName } from "@igraph/utils";
import { useLoading } from "@igraph/utils";
import { formatJalaliDate } from "@igraph/utils";
import { truncateFileName as truncateName } from "@igraph/utils";
import { QaFormSchema, QaFormType } from "@/lib/validationSchema";

import { placeHolder } from "@/public";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AskTutor,
  AskTutorMessages,
  Course,
  File,
  Image as ImageType,
  Tutor,
  User,
} from "@igraph/database";
import { Download, Link as LinkIcon, Send, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ControllerRenderProps, useForm } from "react-hook-form";
import { toast } from "sonner";

interface QaType extends AskTutor {
  user: User & { image: ImageType | null };
  tutor: Tutor & { image: ImageType | null };
  course: Course & { image: ImageType | null };
  messages: (AskTutorMessages & { attachment: File | null })[];
}

interface Props {
  qa: QaType;
}

const QaChat = ({ qa }: Props) => {
  // HOOKS
  const router = useRouter();
  const { loading, setLoading } = useLoading();
  const { fileName, setFileName } = useFileName();

  const initalMessage = `با سلام و وقت بخیر،
  کاربر محترم آی‌گرافیکال:`;

  const form = useForm<QaFormType>({
    resolver: zodResolver(QaFormSchema),
    mode: "onSubmit",
    defaultValues: {
      file: undefined,
      message: initalMessage,
    },
  });

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: ControllerRenderProps<QaFormType, "file">
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

  const onSubmit = async (data: QaFormType) => {
    setLoading(true);

    const res = await sendAskTutorMessage(data, qa.id);

    if (res?.error) {
      toast.error(res.error);
      setLoading(false);
      return;
    }

    if (res?.success) {
      toast.success(res.success);
      setLoading(false);
      form.reset({ message: initalMessage, file: undefined });
      setFileName("");
      router.refresh();
      return;
    }
  };

  return (
    <Form {...form}>
      <form
        className="grid grid-cols-12 gap-5 "
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="col-span-12 lg:col-span-8 xl:col-span-9 h-min space-y-3">
          <CardBox title="Send a new message">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea dir="rtl" className="min-h-[170px]" {...field} />
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
                    <div className="flex gap-1 items-center">
                      <FormLabel
                        htmlFor="file-upload"
                        className="cursor-pointer flex items-center gap-2"
                      >
                        <div className="flex gap-2 items-center">
                          <div className="card p-2">
                            <LinkIcon
                              size={18}
                              className="text-gray-400 hover:text-blue-500"
                            />
                          </div>
                          {!fileName && (
                            <span className="text-gray-400 text-xs">
                              <div>Max: 5MB</div>
                              <div>Image or .zip</div>
                            </span>
                          )}
                        </div>
                        {fileName && (
                          <span className="text-sm text-gray-600 max-w-[200px] truncate block">
                            {truncateName(fileName)}
                          </span>
                        )}
                      </FormLabel>
                      {fileName && (
                        <Button
                          type="button"
                          variant={"ghost"}
                          size={"icon"}
                          className="w-7 h-7"
                          onClick={() => {
                            setFileName("");
                            form.setValue("file", undefined);
                          }}
                        >
                          <X className="text-gray-500 hover:text-black" />
                        </Button>
                      )}
                    </div>

                    <FormControl>
                      <Input
                        accept=".png, .zip, .jpeg, .jpg, .webp"
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
                disabled={loading || !form.formState.isValid}
                type="submit"
              >
                {<Loader loading={loading} />}
                <Send />
                Send Message
              </Button>
            </div>

            <div
              className="py-3 space-y-3 max-h-[750px] overflow-auto"
              dir="rtl"
            >
              {qa.messages &&
                qa.messages.map((message, index) => (
                  <div key={index} className="space-y-3 text-sm">
                    <div
                      className={`card py-2 group relative ${
                        message.senderType === "TUTOR" && "bg-slate-100"
                      }`}
                    >
                      <div className="w-full space-y-2">
                        <div className="flex items-center gap-2">
                          {message.senderType === "TUTOR" ? (
                            <Avatar src={qa.tutor.image?.url} />
                          ) : (
                            <Avatar src={qa.user.image?.url} />
                          )}
                          <div className="flex flex-col">
                            <span>
                              {message.senderType === "TUTOR"
                                ? qa.tutor.displayName
                                : qa.user.fullName}
                            </span>
                            <span className="text-xs text-gray-400 en-digits">
                              {formatJalaliDate(message.createdAt, {
                                useMonthName: false,
                                withTime: true,
                              })}
                            </span>
                          </div>
                        </div>
                        <pre className="text-black bg-transparent">
                          {message.message}
                        </pre>
                      </div>
                      {message.attachment && (
                        <>
                          <hr className="border-dashed border-slate-300" />
                          <Link
                            target="_blank"
                            href={message.attachment.url}
                            className="flex justify-end gap-2 items-center text-nowrap text-xs text-gray-500"
                          >
                            <span title={message.attachment.fileName}>
                              {truncateName(message.attachment.fileName, 30)}
                            </span>
                            <Button
                              variant={"lightBlue"}
                              size={"icon"}
                              className="h-8 w-8"
                              type="button"
                            >
                              <Download />
                            </Button>
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </CardBox>
        </div>

        <CardBox
          title="Summery"
          className="col-span-12 lg:col-span-4 xl:col-span-3 h-min order-first lg:order-last"
        >
          {
            <div className="space-y-3">
              <div className="flex justify-between text-gray-500 text-xs">
                <p className="flex flex-col">
                  <span>Created At</span>
                  <span dir="rtl" className="text-sm">
                    {formatJalaliDate(qa?.createdAt, { withTime: true })}
                  </span>
                </p>
                <div>
                  <Separator orientation="vertical" />
                </div>
                <p className="flex flex-col text-right">
                  <span>Last Update</span>
                  <span dir="rtl" className="text-sm">
                    {formatJalaliDate(qa?.updatedAt, { withTime: true })}
                  </span>
                </p>
              </div>

              <Separator />

              <ul className="text-sm text-gray-500">
                <li className="flex justify-between items-center">
                  <span className="flex gap-2 items-center">
                    <Avatar src={qa.user.image?.url} />
                    {qa?.user.fullName}
                  </span>
                </li>
              </ul>

              <Separator />

              <div className="flex gap-3 text-sm items-center">
                <Image
                  alt=""
                  src={qa.course.image?.url || placeHolder}
                  width={65}
                  height={65}
                  className="object-cover rounded-sm"
                />
                <span>{qa.course.title}</span>
              </div>
            </div>
          }
        </CardBox>
      </form>
    </Form>
  );
};

export default QaChat;
