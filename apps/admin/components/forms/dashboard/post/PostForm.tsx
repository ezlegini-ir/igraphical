"use client";

import { createPost, deletePost, updatePost } from "@/actions/post";
import { PostType } from "@/app/(DASHBOARD)/posts/list/PostsList";
import CardBox from "@igraph/ui/components/CardBox";
import DeleteButton from "@igraph/ui/components/DeleteButton";
import Loader from "@igraph/ui/components/Loader";
import { Button } from "@igraph/ui/components/ui/button";
import { Checkbox } from "@igraph/ui/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@igraph/ui/components/ui/form";
import { Input } from "@igraph/ui/components/ui/input";
import {
  RadioGroup,
  RadioGroupItem,
} from "@igraph/ui/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@igraph/ui/components/ui/select";
import { Separator } from "@igraph/ui/components/ui/separator";
import { Skeleton } from "@igraph/ui/components/ui/skeleton";
import { useImagePreview } from "@igraph/utils";
import { PostFormType, postFormSchema } from "@/lib/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Admin, PostCategory } from "@igraph/database";
import { useLoading } from "@igraph/utils";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import ImageField from "../../ImageField";

const TextEditor = dynamic(() => import("@igraph/editor/Editor"), {
  ssr: false,
  loading: () => (
    <Skeleton className="w-full h-[450px] bg-white border rounded-sm" />
  ),
});

export interface CategoriesType {
  category: PostCategory;
  postId: number;
  categoryId: number;
}

interface Props {
  type: "NEW" | "UPDATE";
  post?: PostType;
  categories: PostCategory[];
  authors: Admin[];
}

let headingCounter = 0;

function addIdsToHeadings(nodes: any[]) {
  for (const node of nodes) {
    if (node.type === "heading" && node.tag) {
      if (!node.id) {
        node.id = String(headingCounter++);
      }
    }
    if (node.children) {
      addIdsToHeadings(node.children);
    }
  }
}

function processLexicalJSON(lexicalContent: string) {
  try {
    headingCounter = 0;
    const content = JSON.parse(lexicalContent);
    if (content.root && content.root.children) {
      addIdsToHeadings(content.root.children);
    }
    return JSON.stringify(content);
  } catch (error) {
    console.error("Error processing Lexical JSON:", error);
    return lexicalContent;
  }
}

const PostForm = ({ type, post, categories, authors }: Props) => {
  // HOOKS
  const router = useRouter();
  const { loading, setLoading } = useLoading();
  const { imagePreview, setImagePreview } = useImagePreview(post?.image?.url);

  // CONSTS
  const isUpdateType = type === "UPDATE";

  const form = useForm<PostFormType>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: post?.title || "",
      url: post?.url || "",
      content: post?.content || "",
      status: post?.status ? (post?.status === "DRAFT" ? "0" : "1") : "0",
      categories: post?.categories?.map((c) => c.category.id.toString()) || [],
      image: undefined,
      author: post?.author?.id?.toString() || "",
    },
  });

  // onSubmit handles post creation/updating.
  const onSubmit = async (data: PostFormType) => {
    setLoading(true);

    // Process the Lexical JSON to ensure headings have sequential IDs.
    const updatedData: PostFormType = {
      ...data,
      content: processLexicalJSON(data.content),
    };

    const res = isUpdateType
      ? await updatePost(updatedData, post?.id!)
      : await createPost(updatedData);

    if (res.error) {
      toast.error(res.error);
      setLoading(false);
      return;
    }

    if (res.success) {
      toast.success(res.success);
      setLoading(false);
      if (isUpdateType) {
        router.refresh();
      } else {
        router.push(`/posts/${res.data?.id}`);
      }
    }
  };

  const onDelete = async () => {
    setLoading(true);

    const res = await deletePost(post?.id!);

    if (res.error) {
      toast.error(res.error);
      setLoading(false);
    }

    if (res.success) {
      toast.success(res.success);
      router.push("/posts/list");
    }
  };

  return (
    <Form {...form}>
      <form
        className="grid grid-cols-12 gap-5"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="col-span-12 md:col-span-9 space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input dir="rtl" className="text-left" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Url</FormLabel>
                  <FormControl>
                    <Input dir="rtl" className="text-left" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isUpdateType && (
              <Link
                href={`${process.env.NEXT_PUBLIC_BASE_URL}/${post?.url}`}
                className="text-xs text-gray-500"
              >
                <p>
                  {process.env.NEXT_PUBLIC_BASE_URL}/{post?.url}
                </p>
              </Link>
            )}
          </div>

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="pb-10">
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <TextEditor onChange={field.onChange} value={field.value} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="col-span-12 md:col-span-3 space-y-4 order-first md:order-last">
          <CardBox title="Actions">
            <Button
              disabled={
                !form.formState.isValid || loading || !form.formState.isDirty
              }
              className="w-full flex gap-2"
              type="submit"
            >
              {<Loader loading={loading} />}
              {type === "NEW" ? "Create" : "Update"}
            </Button>

            <Separator />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="0">⬜ Draft</SelectItem>
                        <SelectItem value="1">🟩 Published</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isUpdateType && (
              <div className="space-y-5">
                <DeleteButton disabled={loading} onDelete={onDelete} />

                <Separator />

                <div className="flex justify-between text-gray-500 text-xs">
                  <p className="flex flex-col">
                    <span>Published At</span>
                    <span className="text-sm">
                      {post?.createdAt.toLocaleString()}
                    </span>
                  </p>

                  <div>
                    <Separator orientation="vertical" />
                  </div>

                  <p className="flex flex-col">
                    <span>Last Update</span>
                    <span className="text-sm">
                      {post?.updatedAt.toLocaleString()}
                    </span>
                  </p>
                </div>
              </div>
            )}
          </CardBox>

          <CardBox title="Image">
            <ImageField
              control={form.control}
              setImagePreview={setImagePreview}
              imagePreview={imagePreview}
              setValue={form.setValue}
              public_id={post?.image?.public_id}
            />
          </CardBox>

          <CardBox title="Categories">
            <FormField
              control={form.control}
              name="categories"
              render={({ field }) => (
                <FormItem>
                  {categories?.map((item) => {
                    const isChecked = field.value?.includes(item.id.toString());

                    return (
                      <FormItem
                        key={item.id}
                        className="flex flex-row items-start gap-3 pb-1.5"
                      >
                        <FormControl>
                          <Checkbox
                            checked={isChecked}
                            onCheckedChange={(checked) => {
                              const updatedCategories = checked
                                ? [...field.value, item.id.toString()]
                                : field.value.filter(
                                    (value) => value !== item.id.toString()
                                  );

                              field.onChange(updatedCategories);
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal cursor-pointer">
                          {item.name}
                        </FormLabel>
                      </FormItem>
                    );
                  })}
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardBox>

          <CardBox title="Author">
            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      {authors?.map((item, index) => (
                        <FormItem
                          key={index}
                          className="flex items-center space-x-3 space-y-0"
                        >
                          <FormControl>
                            <RadioGroupItem value={item.id.toString()} />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            {item.name}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardBox>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;
