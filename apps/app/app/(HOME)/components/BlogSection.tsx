import { placeHolder } from "@/public";
import { database } from "@igraph/database";
import { Button } from "@igraph/ui/components/ui/button";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const BlogSection = async () => {
  const posts = await database.post.findMany({
    where: { status: "PUBLISHED" },
    include: { image: true, categories: { include: { category: true } } },
    orderBy: { createdAt: "desc" },
    take: 4,
  });

  return (
    <div className="flex justify-center items-center">
      <div className="bg-slate-100 rounded-lg h-96 w-full absolute -z-10 hidden md:block" />

      <div className="rounded-lg p-5 space-y-3 flex gap-3 flex-wrap md:flex-nowrap justify-center items-center md:mx-3">
        <div className="space-y-3 text-center md:text-right">
          <h2>از گوشه و اطراف دنیای گرافیک</h2>
          <p>
            با مراجعه به صفحه مقالات، جدیدترین آموزش‌ها، ترفندها و نکات تخصصی
            <br />
            دنیای گرافیک را در وب‌سایت آی‌گرافیکال دنبال کنید و همیشه یک قدم
            جلوتر باشید.
          </p>

          <div>
            <Link href={"/blog"}>
              <Button>صفحه وبلاگ</Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3   left-0">
          {posts.map((item, index) => (
            <div key={index} className="card space-y-3">
              <Link href={`/${item.url}`} className="space-y-3">
                <Image
                  alt={"post" + (index + 1)}
                  src={item.image?.url || placeHolder}
                  width={300}
                  height={300}
                  className="aspect-video rounded-lg"
                />
                <h3 className="text-base font-semibold">{item.title} </h3>
              </Link>

              <div className="flex gap-2">
                {item.categories.map((c, index) => (
                  <Link key={index} href={`/blog?category=${c.category.url}`}>
                    <Button variant={"secondary"} className="h-7" size={"sm"}>
                      <Menu className="scale-75" />
                      {c.category.name}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogSection;
