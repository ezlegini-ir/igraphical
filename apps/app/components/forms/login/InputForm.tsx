"use client";

import { sendOtp } from "@/actions/login/otp";
import { LoginFormsProps } from "@/app/login/page";
import { Button } from "@igraph/ui/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@igraph/ui/components/ui/card";
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
import { useLoading } from "@igraph/utils";
import { LoginFormType, loginFormSchema } from "@/lib/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

const InputForm = ({
  setLoginStep,
  setInputFormValue,
  setIsNewUser,
}: LoginFormsProps) => {
  // HOOKS
  const router = useRouter();
  const { loading, setLoading } = useLoading();

  const form = useForm<LoginFormType>({
    mode: "onSubmit",
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      phoneOrEmail: "",
    },
  });
  const { executeRecaptcha } = useGoogleReCaptcha();

  const onSendOtp = async (data: LoginFormType) => {
    setLoading(true);
    setIsNewUser?.(false);

    // reCaptcha
    if (!executeRecaptcha) {
      toast.error("ری‌کپچا لود نشده است. لطفا مجددا تلاش کنید");
      setLoading(false);
      return;
    }
    const token = await executeRecaptcha("send_otp");

    const res = await sendOtp({ ...data, recaptchaToken: token });

    if (res.error) {
      toast.error(res.error);
      setLoading(false);
      return;
    }

    if (res.isNewUser) {
      setIsNewUser?.(res.isNewUser);
    }

    setInputFormValue?.(data.phoneOrEmail);

    toast.success("کد احراز هویت ارسال شد");
    setLoginStep("OTP");
  };

  return (
    <>
      <CardHeader>
        <CardTitle>
          <h3>ورود یا ثبت نام</h3>
        </CardTitle>
        <CardDescription>
          برای دسترسی به خدمات آی‌گرافیکال وارد حساب کاربری خود شوید
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form className="space-y-3" onSubmit={form.handleSubmit(onSendOtp)}>
            <FormField
              control={form.control}
              name="phoneOrEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>شماره تماس یا ایمیل</FormLabel>
                  <FormControl>
                    <Input dir="ltr" {...field} />
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
              ادامه
            </Button>

            <Button
              variant={"secondary"}
              onClick={() => router.back()}
              className="w-full"
              type="button"
            >
              بازگشت
            </Button>
          </form>
        </Form>
      </CardContent>
    </>
  );
};

export default InputForm;
