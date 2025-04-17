"use client";

import {
  deleteContact,
  sendContactResponse,
  updateContact,
} from "@/actions/contact";
import DeleteButton from "@igraph/ui/components/DeleteButton";
import Loader from "@igraph/ui/components/Loader";
import { Badge } from "@igraph/ui/components/ui/badge";
import { Button } from "@igraph/ui/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@igraph/ui/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@igraph/ui/components/ui/select";
import { Separator } from "@igraph/ui/components/ui/separator";
import { Textarea } from "@igraph/ui/components/ui/textarea";
import { useLoading } from "@igraph/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Contact, ContactResponse } from "@igraph/database";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const status = ["PENDING", "REPLIED"] as const;

export interface ContactType extends Contact {
  ContactResponse: ContactResponse | null;
}

const formSchema = z.object({
  status: z.enum(status),
  message: z.string().optional(),
});

type FormType = z.infer<typeof formSchema>;

const ContactForm = ({ contact }: { contact: ContactType }) => {
  const { loading: responseLoading, setLoading: setResponseLoading } =
    useLoading();
  const { loading: updateContactLoading, setLoading: setUpdateContactLoading } =
    useLoading();
  const router = useRouter();
  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: `با سلام و وقت بخیر
      کاربر محترم آی‌گرافیکال:`,
      status: contact.status,
    },
  });

  const onSendResponse = async () => {
    setResponseLoading(true);
    const message = form.getValues("message");

    if (!message) return;

    const res = await sendContactResponse({
      contactId: contact.id,
      email: contact.email,
      message,
    });

    if (res?.error) {
      toast.error(res.error);
      setResponseLoading(false);
      return;
    }

    if (res.success) {
      toast.success(res.success);
      setResponseLoading(false);
      router.refresh();
    }
  };

  const onUpdateStatus = async () => {
    setUpdateContactLoading(true);
    const status = form.getValues("status");

    const res = await updateContact({ contactId: contact.id, status });

    if (res.error) {
      toast.error(res.error);
      setUpdateContactLoading(false);
      return;
    }

    if (res.success) {
      toast.success(res.success);
      setUpdateContactLoading(false);
      router.refresh();
    }
  };

  const onDelete = async () => {
    const res = await deleteContact(contact.id);

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
    <div className="space-y-6">
      <div className="card w-full text-right text-sm" dir="rtl">
        {contact.message}
      </div>

      {contact.ContactResponse && (
        <Badge
          variant={"green"}
          className="text-sm w-full block text-right font-normal"
          dir="rtl"
        >
          <pre className="bg-transparent text-green-800">
            {contact.ContactResponse?.message}
          </pre>
        </Badge>
      )}

      <Separator />

      <div>
        <Form {...form}>
          <form className="space-y-6">
            {!contact.ContactResponse && (
              <>
                <div className="space-y-3">
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Send Message</FormLabel>
                        <FormControl>
                          <Textarea
                            dir="rtl"
                            placeholder="Type Response"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    onClick={onSendResponse}
                    type="button"
                    className="w-full"
                  >
                    <Loader loading={responseLoading} />
                    Send Email
                  </Button>
                </div>
                <Separator />
              </>
            )}

            <div className="space-y-3">
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
                          <SelectValue
                            className=""
                            placeholder="Select a verified email to display"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {status.map((item, index) => (
                          <SelectItem key={index} value={item}>
                            <span
                              className={`${item === "PENDING" ? "text-orange-500" : "text-green-500"}`}
                            >
                              {item}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                disabled={updateContactLoading}
                onClick={onUpdateStatus}
                type="button"
                className="w-full"
                variant={"lightBlue"}
              >
                <Loader loading={updateContactLoading} />
                Save Status
              </Button>
            </div>

            <DeleteButton onDelete={onDelete} />
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ContactForm;
