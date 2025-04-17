"use client";

import {
  createTicket,
  deleteTicket,
  deleteTicketMessage,
  sendTicketMessage,
  updateTicket,
} from "@/actions/ticket";
import Avatar from "@igraph/ui/components/Avatar";
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
import { Textarea } from "@igraph/ui/components/ui/textarea";
import { useFileName } from "@igraph/utils";
import { useLoading } from "@igraph/utils";
import { formatMiladiDate } from "@igraph/utils";
import { truncateFileName as truncateName } from "@igraph/utils";
import {
  TicketFormSchema,
  TicketFormType,
  ticketDepartment,
  ticketStatus,
} from "@/lib/validationSchema";
import { igraphLogoCard } from "@/public";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  File,
  Image as ImageType,
  Ticket,
  TicketMessage,
  User,
} from "@igraph/database";
import { Download, Link as LinkIcon, Send, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import SearchUsers from "@/components/SearchUsers";

export interface TicketType extends Ticket {
  messages: (TicketMessage & {
    user: (User & { image: ImageType | null }) | null;
    attachment: File | null;
  })[];
  user: User & { image: ImageType | null };
}

interface Props {
  type: "NEW" | "UPDATE";
  ticket?: TicketType;
}

const TicketForm = ({ type, ticket }: Props) => {
  // HOOKS
  const router = useRouter();
  const { loading: sendMessageLoading, setLoading: setSendMessageLoading } =
    useLoading();
  const { fileName, setFileName } = useFileName();

  const isUpdateType = type === "UPDATE";
  const initalMessage = `با سلام و وقت بخیر،
  کاربر محترم آی‌گرافیکال:`;

  const form = useForm<TicketFormType>({
    resolver: zodResolver(TicketFormSchema),
    mode: "onSubmit",
    defaultValues: {
      subject: ticket?.subject || "",
      file: undefined,
      message: initalMessage,
      status: ticket?.status || "REPLIED",
      userId: ticket?.user.id || 0,
      department: ticket?.department || "COURSE",
    },
  });

  const { isValid, dirtyFields, isSubmitting } = form.formState;

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: any
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

  const onSubmit = async (data: TicketFormType) => {
    const res = isUpdateType
      ? await updateTicket(data, ticket?.id!)
      : await createTicket(data);

    if (res.error) {
      toast.error(res.error);
      return;
    }

    if (res.success) {
      toast.success(res.success);
      if (isUpdateType) router.refresh();
      else router.push(`/tickets/${res.data.id}`);
    }
  };

  const onSendMessage = async () => {
    setSendMessageLoading(true);

    const message = form.watch("message");
    const file = form.watch("file");

    const data = { message, file };

    const res = await sendTicketMessage(data, ticket?.id!);

    if (res?.error) {
      toast.error(res.error);
      setSendMessageLoading(false);
      return;
    }

    if (res?.success) {
      toast.success(res.success);
      setSendMessageLoading(false);
      form.reset({ message: initalMessage, file: undefined });
      setFileName("");
      router.refresh();
      return;
    }
  };

  const onDelete = async () => {
    const res = await deleteTicket(ticket?.id!);

    if (res?.error) {
      toast.error(res.error);
      return;
    }

    if (res.success) {
      toast.success(res.success);
      router.push("/tickets/list");
    }
  };

  const onDeleteMessage = async (id: number) => {
    const res = await deleteTicketMessage(id);

    if (res?.error) {
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

              {isUpdateType && (
                <Button
                  disabled={
                    sendMessageLoading ||
                    !(dirtyFields.message || dirtyFields.file)
                  }
                  onClick={onSendMessage}
                  type="button"
                >
                  <Loader loading={sendMessageLoading} />
                  <Send />
                  Send
                </Button>
              )}
            </div>

            {ticket?.messages && ticket.messages.length > 0 && <Separator />}

            {isUpdateType && (
              <div
                className="py-3 space-y-3 max-h-[750px] overflow-auto"
                dir="rtl"
              >
                {ticket?.messages?.map((message, index) => (
                  <div key={index} className="space-y-3 text-sm">
                    <div
                      className={`card py-2 group relative ${
                        message.senderType === "ADMIN" && "bg-slate-100"
                      }`}
                    >
                      <Button
                        variant={"link"}
                        size={"icon"}
                        className="absolute left-0 top-0 hidden group-hover:flex"
                        onClick={() => onDeleteMessage(message.id)}
                      >
                        <X />
                      </Button>

                      <div className="w-full">
                        <div className="flex items-center gap-2">
                          {message.senderType === "ADMIN" ? (
                            <Image
                              alt=""
                              src={igraphLogoCard}
                              width={40}
                              height={40}
                            />
                          ) : (
                            <Avatar src={message.user?.image?.url} />
                          )}
                          <div className="flex flex-col">
                            <span>
                              {message.senderType === "ADMIN"
                                ? "آی‌گرافیکال"
                                : message.user?.fullName}
                            </span>
                            <span className="text-xs text-gray-500 en-digits">
                              {formatMiladiDate(message.createdAt)}
                            </span>
                          </div>
                        </div>
                        <pre
                          style={{
                            lineHeight: 1.8,
                            fontFamily: "KalamehWebFaNum",
                            whiteSpace: "pre-wrap", // Allows text wrapping
                            wordBreak: "break-word", // Break long words if needed
                          }}
                          className="text-black bg-transparent"
                        >
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
            )}
          </CardBox>
        </div>

        <CardBox
          title="Summery"
          className="col-span-12 lg:col-span-4 xl:col-span-3 h-min order-first lg:order-last"
        >
          {isUpdateType && (
            <div className="space-y-3">
              <div className="flex justify-between text-gray-500 text-xs">
                <p className="flex flex-col">
                  <span>Created At</span>
                  <span className="text-sm">
                    {formatMiladiDate(ticket?.createdAt!)}
                  </span>
                </p>
                <div>
                  <Separator orientation="vertical" />
                </div>
                <p className="flex flex-col">
                  <span>Last Update</span>
                  <span className="text-sm">
                    {formatMiladiDate(ticket?.updatedAt!)}
                  </span>
                </p>
              </div>

              <Separator />

              <ul className="text-xs text-gray-500">
                <li className="flex justify-between">
                  <span>User</span>
                  <span>{ticket?.user.fullName}</span>
                </li>
                <li className="flex justify-between">
                  <span>Email</span>
                  <span>{ticket?.user.email}</span>
                </li>
                <li className="flex justify-between">
                  <span>Phone</span>
                  <span>{ticket?.user.phone}</span>
                </li>
              </ul>

              <Separator />
            </div>
          )}
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a verified email to display" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ticketStatus.map((status, index) => (
                      <SelectItem key={index} value={status}>
                        <span
                          className={`capitalize font-medium ${
                            status === "REPLIED"
                              ? "text-green-600"
                              : status === "PENDING"
                                ? "text-yellow-500"
                                : "text-red-500"
                          }`}
                        >
                          {status.toLowerCase()}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {!isUpdateType && (
            <FormField
              control={form.control}
              name={"userId"}
              render={({ field }) => (
                <FormItem
                  className={`w-full ${isUpdateType && "pointer-events-none"}`}
                >
                  <FormLabel>User</FormLabel>
                  <SearchUsers
                    field={field}
                    placeHolder="Search Users..."
                    userId={ticket?.userId}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a user...." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ticketDepartment.map((department, index) => (
                      <SelectItem
                        key={index}
                        className="capitalize"
                        value={department}
                      >
                        {department.toLowerCase()}
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
              !isValid ||
              !(
                dirtyFields.subject ||
                dirtyFields.status ||
                dirtyFields.department
              ) ||
              isSubmitting
            }
            className="w-full flex gap-2"
            type="submit"
          >
            {<Loader loading={isSubmitting} />}
            {isUpdateType ? "Update" : "Create"}
          </Button>
          {isUpdateType && <DeleteButton onDelete={onDelete} />}
        </CardBox>
      </form>
    </Form>
  );
};

export default TicketForm;
