import { getSessionUser } from "@/data/user";
import { database } from "@igraph/database";
import Cart from "./components/Cart";
import { cart as cartPic } from "@/public";
import Image from "next/image";
import { Button } from "@igraph/ui/components/ui/button";
import Link from "next/link";

const page = async () => {
  const userId = (await getSessionUser())?.id;

  const wallet = await database.wallet.findFirst({
    where: { userId },
  });

  const cart = await database.cart.findFirst({
    where: { userId },
    include: {
      cartItem: {
        include: {
          course: {
            include: {
              discount: true,
              image: true,
              tutor: {
                include: { image: true },
              },
            },
          },
        },
      },
    },
  });

  if (!cart)
    return (
      <div className="flex flex-col justify-center items-center w-full">
        <Image alt="" src={cartPic} width={500} height={500} />
        <div className="text-center mb-5 space-y-2">
          <h1 className="text-4xl">فعلا که خالیه!</h1>
          <p className="text-slate-500">
            برای مشاهده دوره ها می توانید به لیست دوره ها مراجعه کنید:
          </p>
        </div>
        <div className="flex gap-3">
          <Link href={"/courses"}>
            <Button className="w-[150PX]">مشاهده دوره‌ها</Button>
          </Link>
          <Link href={"/"}>
            <Button className="w-[150PX]" variant={"secondary"}>
              صفحه اصلی
            </Button>
          </Link>
        </div>
      </div>
    );

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-base  mb-6">سبد خرید</h2>

      <div className="h-full flex gap-10 mb-20 flex-wrap md:flex-nowrap">
        <Cart cart={cart} wallet={wallet} />
      </div>
    </div>
  );
};

export default page;
