"use client";

import {
  createComment,
  deleteComment,
  updateComment,
} from "@/actions/postComment";
import DeleteButton from "@igraph/ui/components/DeleteButton";
import Loader from "@igraph/ui/components/Loader";
import { Button } from "@igraph/ui/components/ui/button";
import { Calendar } from "@igraph/ui/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@igraph/ui/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@igraph/ui/components/ui/popover";
import { Textarea } from "@igraph/ui/components/ui/textarea";
import { cn } from "@igraph/utils";
import { CommentFormType, commentFormSchema } from "@/lib/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Comment, Post, User } from "@igraph/database";
import { useLoading } from "@igraph/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import SearchField from "../../SearchField";
import { getPostById } from "@/data/post";
import { searchUsers, searchPosts } from "@/data/search";
import { getUserById } from "@/data/user";

interface Props {
  type: "NEW" | "UPDATE";
  comment?: Comment;
}

const CommentForm = ({ type, comment }: Props) => {
  // HOOKS
  const router = useRouter();
  const { loading, setLoading } = useLoading();

  const isUpdateType = type === "UPDATE";

  const form = useForm<CommentFormType>({
    resolver: zodResolver(commentFormSchema),
    mode: "onSubmit",
    defaultValues: {
      content: comment?.content || "",
      postId: comment?.postId || 0,
      date: comment?.createdAt || new Date(),
      userId: comment?.authorId || undefined,
    },
  });

  const onSubmit = async (data: CommentFormType) => {
    setLoading(true);

    const res =
      type === "NEW"
        ? await createComment(data)
        : await updateComment(data, comment?.id!);

    if (res.error) {
      toast.error(res.error);
      setLoading(false);
      return;
    }

    if (res.success) {
      toast.success(res.success);
      setLoading(false);
      router.refresh();
    }
  };

  const onDelete = async () => {
    const res = await deleteComment(comment?.id!);

    if (res.error) {
      toast.error(res.error);
      return;
    }

    if (res.success) {
      toast.success(res.success);
      router.refresh();
    }
  };

  //! SEARCH UTILS
  //HOOKS
  const [defaultUser, setDefaultUser] = useState<User | undefined>(undefined);
  const [defaultPost, setDefaultPost] = useState<Post | undefined>(undefined);

  const fetchUsers = async (query: string): Promise<User[]> => {
    return await searchUsers(query);
  };
  const fetchPosts = async (query: string): Promise<Post[]> => {
    return await searchPosts(query);
  };

  useEffect(() => {
    const fetchSelectedUser = async () => {
      if (comment?.authorId) {
        const user = await getUserById(comment.authorId);
        setDefaultUser(user || undefined);
      }
    };
    fetchSelectedUser();
  }, [comment?.authorId]);

  useEffect(() => {
    const fetchSelectedPost = async () => {
      if (comment?.postId) {
        const post = await getPostById(comment.postId);
        setDefaultPost(post ? post : undefined);
      }
    };
    fetchSelectedPost();
  }, [comment?.postId]);

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea className="min-h-[220px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="userId"
          render={({ field }) => (
            <FormItem className="overflow-visible">
              <FormLabel>User</FormLabel>

              <SearchField<User>
                placeholder="Search Users..."
                fetchResults={fetchUsers}
                onSelect={(user) =>
                  user ? field.onChange(user.id) : field.onChange(undefined)
                }
                getItemLabel={(user) => `${user.fullName} - ${user.email}`}
                defaultItem={defaultUser}
              />

              <FormMessage />
            </FormItem>
          )}
        />

        {!isUpdateType && (
          <FormField
            control={form.control}
            name="postId"
            render={({ field }) => (
              <FormItem className="overflow-visible">
                <FormLabel>Post</FormLabel>

                <SearchField<Post>
                  placeholder="Search Posts..."
                  fetchResults={fetchPosts}
                  onSelect={(post) =>
                    post ? field.onChange(post.id) : field.onChange(undefined)
                  }
                  getItemLabel={(post) => `${post.title}`}
                  defaultItem={defaultPost}
                />

                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "pl-3 text-left font-normal en-digits",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    className="en-digits"
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
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
          {isUpdateType ? "Update" : "Create"}
        </Button>

        {isUpdateType && <DeleteButton onDelete={onDelete} />}
      </form>
    </Form>
  );
};

export default CommentForm;
