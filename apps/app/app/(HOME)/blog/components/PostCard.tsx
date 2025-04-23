import { Button } from "@igraph/ui/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardTitle,
} from "@igraph/ui/components/ui/card";
import { placeHolder } from "@/public";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PostType } from "./PostGrid";
import { extractSummaryFromLexical } from "@igraph/utils";

const PostCard = ({ post }: { post: PostType }) => {
  const categories = post.categories.map((item, index) => (
    <div key={index} className="text-left ">
      <Button variant={"secondary"} size={"sm"} className="h-6 text-gray-500">
        <Menu className="scale-75" />
        {item.name}
      </Button>
    </div>
  ));

  return (
    <div className="overflow-hidden group card hover:shadow-md p-0 pl-3">
      <Link href={`/${post.url}`}>
        <CardContent className="pl-3 flex gap-3 p-0 w-full">
          <Image
            alt=""
            src={post.image?.url || placeHolder}
            width={250}
            height={250}
            className="aspect-video object-cover"
          />

          <div className="py-3 space-y-3 w-full">
            <div className="flex justify-between flex-wrap gap-3">
              <CardTitle className="text-lg font-medium">
                {post.title}
              </CardTitle>
              <div className="flex gap-2">{categories}</div>
            </div>

            <CardDescription className="flex justify-between items-center text-xs">
              <p>{extractSummaryFromLexical(post.content)}...</p>
            </CardDescription>
          </div>
        </CardContent>
      </Link>
    </div>
  );
};

export default PostCard;
