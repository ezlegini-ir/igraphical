"use client";

import { Button } from "@igraph/ui/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@igraph/ui/components/ui/form";
import { Input } from "@igraph/ui/components/ui/input";
import { commentFormSchema, CommentFormType } from "@/lib/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Textarea } from "@igraph/ui/components/ui/textarea";
import { getSessionUser } from "@/data/user";
import { useEffect, useState } from "react";
import { User } from "@igraph/database";
import { createComment } from "@/actions/comment";
import { toast } from "sonner";
import { useLoading } from "@igraph/utils";
import { useRouter } from "next/navigation";
import Loader from "@igraph/ui/components/Loader";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

const CommentForm = ({ postId }: { postId: number }) => {
  const [user, setUser] = useState<User | null | undefined>();
  const { loading, setLoading } = useLoading();
  const router = useRouter();

  const form = useForm<CommentFormType>({
    resolver: zodResolver(commentFormSchema),
    defaultValues: {
      content: "",
      fullName: "",
      postId: 0,
      userId: 0,
    },
  });
  const { executeRecaptcha } = useGoogleReCaptcha();

  const onSubmit = async (data: CommentFormType) => {
    setLoading(true);

    data.postId = postId;
    if (user) {
      data.userId = user.id;
      data.fullName = user.fullName;
    }

    let recaptchaToken: string | undefined = undefined;
    if (!user) {
      if (!executeRecaptcha) {
        toast.error("ری‌کپچا لود نشده است. لطفا مجددا تلاش کنید");
        setLoading(false);
        return;
      }
      recaptchaToken = await executeRecaptcha("blog_comment_form");
    }

    const res = await createComment(data, recaptchaToken);

    if (res.error) {
      toast.error(res.error);
      setLoading(false);
      return;
    }

    if (res.success) {
      toast.success(res.success);
      setLoading(false);
      form.reset();
      router.refresh();
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getSessionUser();
      setUser(user);
    };

    fetchUser();
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        {!user && (
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="نام و نام خانوادگی" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  className="h-24 bg-white"
                  placeholder="دیدگاه شما..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={!form.formState.isValid || loading} type="submit">
          <Loader loading={loading} />
          ارسال دیدگاه
        </Button>
      </form>
    </Form>
  );
};

export default CommentForm;
