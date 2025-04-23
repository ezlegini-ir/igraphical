"use client";

import { verifyLogin } from "@/actions/login/verify-login";
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
import { useLoading } from "@igraph/utils";
import { LoginFormType, loginFormSchema } from "@/lib/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

interface Props {
  setIdentifier: Dispatch<React.SetStateAction<string>>;
  setLoginStep: Dispatch<SetStateAction<"INPUT" | "OTP">>;
}

const InputForm = ({ setLoginStep, setIdentifier }: Props) => {
  // HOOKS
  const { loading, setLoading } = useLoading();

  const form = useForm<LoginFormType>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      phoneOrEmail: "",
      password: "",
    },
  });
  const { executeRecaptcha } = useGoogleReCaptcha();

  const sendOtp = async (data: LoginFormType) => {
    setLoading(true);

    if (!executeRecaptcha) {
      toast.error("reCaptcha not loaded, please try again...");
      setLoading(false);
      return;
    }
    const recaptchaToken = await executeRecaptcha("login_form");

    const res = await verifyLogin(
      data.phoneOrEmail,
      data.password,
      recaptchaToken
    );

    if (res?.error) {
      toast.error(res.error);
      setLoading(false);
      return;
    }

    setLoginStep?.("OTP");
    setIdentifier?.(data.phoneOrEmail);
  };

  return (
    <>
      <div className="text-sm text-gray-400">
        <p>Welcome Back,</p>
        <h1 className="text-2xl text-black">Tutor Login</h1>
        <p>Please provide credentials to log in...</p>
      </div>

      <Form {...form}>
        <form className="space-y-3" onSubmit={form.handleSubmit(sendOtp)}>
          <FormField
            control={form.control}
            name="phoneOrEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone or Email</FormLabel>
                <FormControl>
                  <Input className="en-digits" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" className="en-digits" {...field} />
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
            Continue
          </Button>
        </form>
      </Form>
    </>
  );
};

export default InputForm;
