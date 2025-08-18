"use client";

import { authenticator } from "@/actions/login/authenticator";
import { registerUser } from "@/actions/user";
import { LoginFormsProps } from "@/app/login/page";
import {
  RegisterUserFormType,
  registerUserFormSchema,
} from "@/lib/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import Loader from "@igraph/ui/components/Loader";
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
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@igraph/ui/components/ui/hover-card";
import { Input } from "@igraph/ui/components/ui/input";
import { detectInputType, useLoading } from "@igraph/utils";
import { Handshake, Info } from "lucide-react";
import Link from "next/link";
import { redirect, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const RegisterForm = ({
  setLoginStep,
  inputFormValue: identifier,
  redirectTo,
  onSuccess,
}: LoginFormsProps) => {
  // HOOKS
  const { loading, setLoading } = useLoading();

  const inputType = detectInputType(identifier!);

  let email;
  let phone;
  if (inputType === "email") {
    email = identifier?.toLowerCase();
  } else {
    phone = identifier;
  }

  const form = useForm<RegisterUserFormType>({
    mode: "onChange",
    resolver: zodResolver(registerUserFormSchema),
    defaultValues: {
      email: email || "",
      firstName: "",
      lastName: "",
      nationalId: "",
      phone: phone || "",
    },
  });
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const onRegisterUser = async (data: RegisterUserFormType) => {
    setLoading(true);

    const res = await registerUser(data, identifier!);

    if (res.error) {
      toast.error(res.error);
      setLoading(false);
      return;
    }

    const auth = await authenticator(identifier!);

    if (auth?.error) {
      toast.error(auth.error);
      setLoading(false);
      return;
    }

    if (auth.success) {
      toast.success(auth.success);
      if (onSuccess) onSuccess();

      redirect(callbackUrl ? callbackUrl : redirectTo ? redirectTo : "/panel");
    }
  };

  return (
    <>
      <CardHeader className="text-center">
        <CardTitle>
          <h3 className="flex items-center justify-center">
            <span className="text-3xl animate-pulse"> 🎉 </span> به آی‌گرافیکال
            خوش آمدید!
          </h3>
        </CardTitle>

        <CardDescription>
          لطفا برای تکمیل ثبت نام اطلاعات زیر را وارد کنید
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            className="space-y-3"
            onSubmit={form.handleSubmit(onRegisterUser)}
          >
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نام</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نام خانوادگی</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {inputType !== "email" && (
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ایمیل</FormLabel>
                    <FormControl>
                      <Input type="email" className="en-digits" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {inputType !== "phone" && (
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>شماره تماس</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="مثال: 09121234567"
                        type="text"
                        style={{ direction: "ltr" }}
                        maxLength={11}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="nationalId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex gap-1">
                    کد ملی
                    <HoverCard>
                      <HoverCardTrigger>
                        <Info size={12} className="text-gray-500" />
                      </HoverCardTrigger>
                      <HoverCardContent className="max-w-sm font-normal text-gray-500 text-xs">
                        <p>
                          به جهت شفاف سازی حریم شخصی کاربران: کد ملی صرفا جهت
                          صدور مدرک می باشد.
                        </p>
                      </HoverCardContent>
                    </HoverCard>
                  </FormLabel>
                  <FormControl>
                    <Input
                      style={{ direction: "ltr" }}
                      maxLength={10}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <p className="alert alert-secondary text-xs drop-shadow-none  flex gap-1 items-center justify-center text-slate-500">
              <Handshake size={20} />
              با ثبت نام در آی‌گرافیکال با{" "}
              <Link
                className="text-blue-800 underline"
                href={"/terms-and-conditions"}
              >
                قوانین
              </Link>{" "}
              آن موافق هستید!
            </p>

            <Button
              disabled={!form.formState.isValid || loading}
              className="w-full"
              type="submit"
            >
              <Loader loading={loading} />
              تکمیل ثبت نام
            </Button>

            <Button
              onClick={() => setLoginStep("INPUT")}
              variant={"secondary"}
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

export default RegisterForm;
