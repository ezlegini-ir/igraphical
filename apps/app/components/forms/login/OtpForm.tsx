"use client";

import { authenticator } from "@/actions/login/authenticator";
import { verifyOtp } from "@/actions/login/verify-otp";
import { LoginFormsProps } from "@/app/login/page";
import CountdownTimer from "@igraph/ui/components/CountDown";
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
  FormMessage,
} from "@igraph/ui/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@igraph/ui/components/ui/input-otp";
import Loader from "@igraph/ui/components/Loader";
import { useLoading } from "@igraph/utils";
import { OtpType, otpSchema } from "@/lib/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { CircleCheckBig } from "lucide-react";
import { useEffect, useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { redirect, useSearchParams } from "next/navigation";

const OtpForm = ({
  setLoginStep,
  isNewUser,
  inputFormValue: identifier,
}: LoginFormsProps) => {
  // HOOKS
  const { loading, setLoading } = useLoading();
  const [failedAttempts, setFailedAttempts] = useState(0);

  const form = useForm<OtpType>({
    resolver: zodResolver(otpSchema),
    mode: "onSubmit",
    defaultValues: {
      otp: "",
    },
  });
  const { executeRecaptcha } = useGoogleReCaptcha();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const onVerifyOtp = async (data: OtpType) => {
    setLoading(true);

    if (!identifier) return;

    if (failedAttempts >= 3) {
      toast.warning("بیش از حد مجاز! لطفا مجددا اقدام نمایید.");
      setLoginStep("INPUT");
      setLoading(false);
      return;
    }

    let recaptchaToken = undefined;

    if (failedAttempts >= 2) {
      if (!executeRecaptcha) {
        toast.error("reCAPTCHA is not ready");
        setLoading(false);
        return;
      }

      recaptchaToken = await executeRecaptcha("verify_otp");
    }

    const res = await verifyOtp(data.otp, identifier, recaptchaToken);

    if (res.error) {
      toast.error(res.error);
      setLoading(false);
      form.reset();
      setFailedAttempts((prev) => prev + 1);
      return;
    }

    setFailedAttempts(0);

    // HANDLE RESPONSE
    if (isNewUser) {
      setLoginStep("REGISTER");
    } else {
      const auth = await authenticator(identifier);

      if (auth?.error) {
        toast.error(auth.error);
        setLoading(false);
        return;
      }

      if (auth.success) {
        toast.success(auth.success);
        redirect(callbackUrl || "/panel");
      }
    }
  };

  const otpValue = form.watch("otp");

  useEffect(() => {
    const autoSubmit = async () => {
      if (otpValue.length === 6) {
        await onVerifyOtp({ otp: otpValue });
      }
    };

    autoSubmit();
  }, [otpValue]);

  return (
    <>
      <CardHeader className="space-y-4">
        <CardTitle>
          <h3 className="flex gap-2">
            <CircleCheckBig
              strokeWidth={2.5}
              size={26}
              className="text-green-500"
            />
            {isNewUser ? "ثبت نام جدید" : "ورود به حساب کاربری"}
          </h3>
        </CardTitle>

        <CardDescription>
          لطفا کد ارسال شده به{" "}
          <span className="font-semibold en-digits">
            {identifier?.toLowerCase()}
          </span>{" "}
          را وارد کنید.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form className="space-y-7" onSubmit={form.handleSubmit(onVerifyOtp)}>
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputOTP
                      autoFocus
                      maxLength={6}
                      {...field}
                      pattern={REGEXP_ONLY_DIGITS}
                    >
                      <InputOTPGroup
                        dir="ltr"
                        autoFocus
                        className="w-full font-medium flex justify-center "
                      >
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage className="text-center" />
                </FormItem>
              )}
            />

            <CountdownTimer minute={2} progressBar />

            <div>
              <Button
                disabled={!form.formState.isValid || loading}
                className="w-full mb-3"
                type="submit"
              >
                {<Loader loading={loading} />}
                ادامه
              </Button>

              <Button
                onClick={() => setLoginStep("INPUT")}
                variant={"secondary"}
                className="w-full"
                type="button"
              >
                بازگشت
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </>
  );
};

export default OtpForm;
