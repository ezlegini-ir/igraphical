"use client";

import { authenticator } from "@/actions/login/authenticator";
import { verifyOtp } from "@/actions/login/verify-otp";
import CountdownTimer from "@igraph/ui/components/CountDown";
import Loader from "@igraph/ui/components/Loader";
import { Button } from "@igraph/ui/components/ui/button";
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
import { OtpType, otpFormSchema } from "@/lib/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLoading } from "@igraph/utils";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { CircleCheckBig } from "lucide-react";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface Props {
  setLoginStep: Dispatch<SetStateAction<"INPUT" | "OTP">>;
  identifier: string;
}

const OtpForm = ({ setLoginStep, identifier }: Props) => {
  // HOOKS
  const { loading, setLoading } = useLoading();

  const form = useForm<OtpType>({
    resolver: zodResolver(otpFormSchema),
    mode: "onSubmit",
    defaultValues: {
      otp: "",
    },
  });
  const { executeRecaptcha } = useGoogleReCaptcha();

  const onVerifyOtp = async (data: OtpType) => {
    setLoading(true);

    if (!executeRecaptcha) {
      if (!executeRecaptcha) {
        toast.error("reCaptcha Not Loaded, Please Try Again...");
        setLoading(false);
        return;
      }
    }

    const recaptchaToken = await executeRecaptcha("otp_form");

    // VERIFY OTP
    const res = await verifyOtp(data.otp, identifier, recaptchaToken);

    if (res.error) {
      toast.error(res.error);
      setLoading(false);
      form.reset();
      return;
    }

    if (res.success) {
      const auth = await authenticator(identifier);

      if (auth?.error) {
        toast.error(auth.error);
        setLoading(false);
        return;
      }

      toast.success("Welcome Back, Logged In Successfuly!");
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
      <div className="space-y-4 pb-6">
        <div>
          <h3 className="flex gap-2 font-semibold">
            <CircleCheckBig
              strokeWidth={2.5}
              size={26}
              className="text-green-500"
            />
            Verification Code Sent
          </h3>
        </div>

        <div>
          Please Provide code sent to{" "}
          <span className="font-semibold en-digits">
            {identifier?.toLowerCase()}
          </span>
        </div>
      </div>

      <Form {...form}>
        <form className="space-y-8" onSubmit={form.handleSubmit(onVerifyOtp)}>
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
                      autoFocus
                      className="w-full en-digits flex justify-center "
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

                <div className="w-11/12 mx-auto pt-3">
                  <CountdownTimer progressBar minute={2} />
                </div>

                <FormMessage className="text-center" />
              </FormItem>
            )}
          />

          <div>
            <Button
              disabled={!form.formState.isValid || loading}
              className="w-full mb-3"
              type="submit"
            >
              {<Loader loading={loading} />}
              Log In
            </Button>

            <Button
              onClick={() => setLoginStep?.("INPUT")}
              variant={"secondary"}
              className="w-full"
              type="button"
            >
              Back
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default OtpForm;
