"use client";

import { sendOtp } from "@/actions/login/otp";
import { updateUserProfile } from "@/actions/user";
import CardBox from "@/app/panel/components/CardBox";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@igraph/ui/components/ui/dialog";
import { useImagePreview } from "@igraph/utils";
import { useLoading } from "@igraph/utils";
import { detectInputType } from "@igraph/utils";
import { profileFormSchema, ProfileFormType } from "@/lib/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image, User } from "@igraph/database";
import { BadgeCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
import { Input } from "@igraph/ui/components/ui/input";
import Loader from "@igraph/ui/components/Loader";
import ConfirmCredentialForm from "./ConfirmCredentialForm";
import AvatarField from "./AvatarField";
import { getUserByIdentifier } from "@/data/user";

interface UserType extends User {
  image: Image | null;
}

interface Props {
  user: UserType;
}

const UserProfileForm = ({ user }: Props) => {
  // HOOKS
  const router = useRouter();
  const { loading, setLoading } = useLoading();
  const { loading: sendSmsOtpLoading, setLoading: setSendSmsOtpLoading } =
    useLoading();
  const { loading: sendEmailOtpLoading, setLoading: setSendEmailOtpLoading } =
    useLoading();
  const { imagePreview, setImagePreview } = useImagePreview(user?.image?.url);
  const [openOtpForm, setOpenOtpForm] = useState(false);
  const [identifier, setIdentifier] = useState("");

  const form = useForm<ProfileFormType>({
    resolver: zodResolver(profileFormSchema),
    mode: "onChange",
    defaultValues: {
      image: undefined,
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user.email,
      phone: user.phone,
      nationalId: user.nationalId,
    },
  });

  const onSubmit = async (data: ProfileFormType) => {
    setLoading(true);

    const res = await updateUserProfile(data, user.id);

    if (res.error) {
      toast.error(res.error);
      setLoading(false);
    }

    if (res.success) {
      toast.success(res.success);
      setLoading(false);
      router.refresh();
    }
  };

  const phone = form.getValues("phone");
  const email = form.getValues("email");

  const sendConfirmOtp = async (identifier: string) => {
    const emailType = detectInputType(identifier) === "email";

    if (emailType) {
      setSendEmailOtpLoading(true);
      setIdentifier(email);
    } else {
      setSendSmsOtpLoading(true);
      setIdentifier(phone);
    }

    const existingUser = await getUserByIdentifier(identifier);
    if (existingUser) {
      toast.warning(
        `با این ${emailType ? "ایمیل" : "شماره تماس"} از قبل حساب کاربری وجود دارد.`
      );

      if (emailType) setSendEmailOtpLoading(false);
      else setSendSmsOtpLoading(false);

      return;
    }
    const res = await sendOtp({ phoneOrEmail: identifier, userId: user.id });

    if (res.error) {
      toast.error(res.error);
      setSendSmsOtpLoading(false);
      setSendEmailOtpLoading(false);
      return;
    }

    toast.success("کد احراز هویت ارسال شد.");
    setOpenOtpForm(true);
    setSendSmsOtpLoading(false);
    setSendEmailOtpLoading(false);
  };

  return (
    <CardBox title="مشخصات فردی" className="max-w-sm mx-auto">
      <Dialog open={openOtpForm} onOpenChange={setOpenOtpForm}>
        <DialogContent className="sm:max-w-sm">
          <DialogTitle />
          <ConfirmCredentialForm
            userId={user.id}
            identifier={identifier}
            setOpenOtpForm={setOpenOtpForm}
          />
        </DialogContent>
      </Dialog>

      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <AvatarField
            control={form.control}
            imagePreview={imagePreview}
            setImagePreview={setImagePreview}
            public_id={user?.image?.public_id}
            setValue={form.setValue}
          />

          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>نام</FormLabel>
                <FormControl>
                  <Input className="en-digits" {...field} />
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
                  <Input className="en-digits" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <div className="flex justify-between items-center">
                    <span>شماره تماس</span>
                    <ConfirmField
                      loading={sendSmsOtpLoading}
                      identifier={phone}
                      isVerified={user.phoneVerified}
                      sendConfirmOtp={sendConfirmOtp}
                    />
                  </div>
                </FormLabel>
                <FormControl>
                  <Input disabled={user.phoneVerified} dir="ltr" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <div className="flex justify-between items-center">
                    <span>ایمیل</span>
                    <ConfirmField
                      loading={sendEmailOtpLoading}
                      identifier={email}
                      isVerified={user.emailVerified}
                      sendConfirmOtp={sendConfirmOtp}
                    />
                  </div>
                </FormLabel>
                <FormControl>
                  <Input
                    disabled={user.emailVerified}
                    className="en-digits"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nationalId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>کد ملی</FormLabel>

                <FormControl>
                  <Input
                    title={user.nationalId && "فقط یک بار می توان ذخیره کرد"}
                    placeholder="فقط یک بار می توانید کد ملی ذخیره کنید. دقت کنید."
                    maxLength={10}
                    disabled={!!user.nationalId}
                    dir="ltr"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            disabled={!form.formState.isDirty || loading}
            className="w-full flex gap-2"
            type="submit"
          >
            {<Loader loading={loading} />}
            ذخیره
          </Button>
        </form>
      </Form>
    </CardBox>
  );
};

const ConfirmField = ({
  isVerified,
  identifier,
  loading: sendOtpLoading,
  sendConfirmOtp,
}: {
  isVerified: boolean;
  identifier: string;
  loading: boolean;
  sendConfirmOtp: (identifier: string) => void;
}) => {
  return isVerified ? (
    <Badge variant={"green"} className="text-green-500 text-xs gap-1 px-2">
      <BadgeCheck size={16} />
      تایید
    </Badge>
  ) : (
    <Button
      disabled={sendOtpLoading}
      onClick={() => sendConfirmOtp(identifier)}
      size={"sm"}
      type="button"
      variant={"lightBlue"}
    >
      <Loader loading={sendOtpLoading} />
      احراز هویت
    </Button>
  );
};

export default UserProfileForm;
