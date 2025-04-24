"use client";

import { verifyCertificate } from "@/actions/certificate";
import { Button } from "@igraph/ui/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@igraph/ui/components/ui/form";
import { Input } from "@igraph/ui/components/ui/input";
import { useLoading } from "@igraph/utils";
import { formatJalaliDate } from "@igraph/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Certificate, Course, Enrollment, User } from "@igraph/database";
import { CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

const formSchema = z.object({
  serialNumber: z.string().min(6),
});

type FormType = z.infer<typeof formSchema>;

interface CertificateType extends Certificate {
  enrollment: Enrollment & { user: User; course: Course };
}

const CertificateVerifyForm = () => {
  //HOOKS
  const [result, setResult] = useState<"VALID" | "INVALID" | undefined>(
    undefined
  );

  const [certificate, setCertificate] = useState<CertificateType>();
  const { loading, setLoading } = useLoading();
  const router = useRouter();

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    defaultValues: {
      serialNumber: "",
    },
  });
  const { executeRecaptcha } = useGoogleReCaptcha();

  const onSubmit = async (data: FormType) => {
    setLoading(true);
    setResult(undefined);

    if (!executeRecaptcha) {
      toast.error("ری‌کپچا لود نشده است. لطفا مجددا تلاش کنید");
      setLoading(false);
      return;
    }
    const recaptchaToken = await executeRecaptcha("certificate_form");

    const res = await verifyCertificate(data.serialNumber, recaptchaToken);

    if (res.success && res.certificate) {
      toast.success(res.success);
      router.refresh();
      setLoading(false);
      setResult("VALID");
      setCertificate(res.certificate);
      form.reset();
    }

    if (res.error) {
      toast.error(res.error);
      setLoading(false);
      setResult("INVALID");
      router.refresh();
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-3 w-full max-w-sm"
      >
        {result === "VALID" ? (
          <div className="flex flex-col  justify-center items-center gap-3">
            <CheckCircle size={75} className="text-green-500" />
            <span className="font-semibold">
              این مدرک مورد تایید آی‌گرافیکال می باشد.
            </span>
            <div className="card w-full text-gray-500 flex flex-col gap-3">
              <span> دانش آموز: {certificate?.enrollment.user.fullName} </span>
              <span> دوره: {certificate?.enrollment.course?.title} </span>
              <span>تاریخ اخذ: {formatJalaliDate(certificate?.issuedAt!)}</span>
            </div>
          </div>
        ) : result === "INVALID" ? (
          <div className="flex flex-col justify-center items-center gap-3">
            <XCircle size={75} className="text-red-500" />
            این مدرک در سیستم مدارک آی‌گرافیکال ثبت نشده است.
          </div>
        ) : null}

        {result !== "VALID" && (
          <div className="space-y-3">
            <FormField
              control={form.control}
              name="serialNumber"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      maxLength={6}
                      placeholder="شماره سریال 6 رقمی"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className="w-full"
              disabled={!form.formState.isValid || loading}
              type="submit"
            >
              استعلام
            </Button>

            <div className="pt-8 text-center space-y-2">
              <h4>توجه:</h4>
              <div className="text-gray-500 text-sm">
                تنها مدارکی که از تاریخ 4 اردیبهشت 1404 به بعد صادر شده باشند
                قابلیت استعلام دارند.
                <hr className="py-2" />
                برای تاریخ های ماقبل، استعلام مدرک از طریق ایمیل
                info@igraphical.ir مقدور می باشد.
              </div>
            </div>
          </div>
        )}

        {result === "VALID" && (
          <div className="flex justify-center">
            <Button
              onClick={() => setResult(undefined)}
              variant={"secondary"}
              type="button"
              className="w-full"
            >
              بازگشت
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
};

export default CertificateVerifyForm;
