"use client";

import { verifyOtp } from "@/actions/login/verify-otp";
import CountdownTimer from "@igraph/ui/components/CountDown";
import { Button } from "@igraph/ui/components/ui/button";
import { CardDescription } from "@igraph/ui/components/ui/card";
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
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Flex from "@igraph/ui/components/Flex";

const ConfirmCredentialForm = ({
  identifier,
  setOpenOtpForm,
}: {
  userId: number;
  identifier: string;
  setOpenOtpForm: Dispatch<SetStateAction<boolean>>;
}) => {
  // HOOKS
  const router = useRouter();
  const { loading, setLoading } = useLoading();
  const [failedAttempts, setFailedAttempts] = useState(0);

  const form = useForm<OtpType>({
    resolver: zodResolver(otpSchema),
    mode: "onSubmit",
    defaultValues: {
      otp: "",
    },
  });

  const onSubmit = async (data: OtpType) => {
    setLoading(true);

    if (failedAttempts >= 3) {
      toast.warning("بیش از حد مجاز! لطفا مجددا اقدام نمایید.");
      setLoading(false);
      setOpenOtpForm(false);
      return;
    }

    const res = await verifyOtp(data.otp, identifier);

    if (res.error) {
      toast.error(res.error);
      setLoading(false);
      form.reset();
      setFailedAttempts((prev) => prev + 1);
      return;
    }

    setFailedAttempts(0);

    toast.success("احراز هویت با موفقیت انجام شد!");
    router.refresh();
    setOpenOtpForm(false);
  };

  const otpValue = form.watch("otp");

  useEffect(() => {
    const autoSubmit = async () => {
      if (otpValue.length === 6) {
        await onSubmit({ otp: otpValue });
      }
    };

    autoSubmit();
  }, [otpValue]);

  return (
    <>
      <Flex className="justify-center mb-3">
        <CardDescription>لطفا کد ارسال شده را وارد کنید.</CardDescription>
      </Flex>

      <div>
        <Form {...form}>
          <form className="space-y-7" onSubmit={form.handleSubmit(onSubmit)}>
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
                تایید
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};

export default ConfirmCredentialForm;
