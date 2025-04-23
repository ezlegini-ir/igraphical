"use client";

import { addToCart } from "@/actions/cart";
import { getSessionUser } from "@/data/user";
import { Discount } from "@igraph/database";
import Price from "@igraph/ui/components/Price";
import { Badge } from "@igraph/ui/components/ui/badge";
import { Button } from "@igraph/ui/components/ui/button";
import { Check, Plus, TvMinimalPlay, UserRoundPlus } from "lucide-react";
import Link from "next/link";
import { redirect, usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

const CourseRegisterButton = ({
  courseId,
  isFree,
  isInCart,
  basePrice,
  discount,
  price,
  isUserEnrolled,
  classroomId,
}: {
  courseId: number;
  isFree: boolean;
  isInCart: boolean;
  basePrice: number;
  price: number;
  discount: Discount | null;
  isUserEnrolled: boolean;
  classroomId: string | undefined;
}) => {
  const router = useRouter();
  const pathName = usePathname();

  const onAddToCart = async () => {
    const user = await getSessionUser();
    if (!user) redirect(`/login?callbackUrl=${pathName}`);

    const res = await addToCart(courseId);

    if (res.error) {
      toast.error(res.error);
      return;
    }

    if (res.success) {
      toast.success("به سبد خرید اضافه شد", {
        action: {
          label: "سبد خرید",
          onClick: () => router.push("/cart"),
        },
      });

      router.refresh();
    }
  };

  return (
    <>
      <div className="lg:hidden">
        <div className="card fixed bottom-0 rounded-br-none  rounded-bl-none left-1/2 -translate-x-1/2 px-4 w-full">
          {!isUserEnrolled ? (
            <div className="flex justify-between items-center">
              <div className="flex gap-3">
                {!isInCart && (
                  <Link href={`/quick-cart/${courseId}`}>
                    <Button>
                      <UserRoundPlus size={20} />
                      ثبت نام سریع
                    </Button>
                  </Link>
                )}
              </div>

              <div>
                <Price
                  basePrice={basePrice}
                  discount={discount}
                  price={price}
                />
              </div>
            </div>
          ) : (
            <div>
              <Link href={`/classroom/${classroomId}`}>
                <Button variant={"lightBlue"} className="w-full">
                  <TvMinimalPlay size={22} />
                  ورود به کلاس درس
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {!isUserEnrolled && (
        <div className="space-y-3 pb-3">
          {!isInCart && (
            <Link href={`/quick-cart/${courseId}`}>
              <Button className="w-full">
                <UserRoundPlus size={20} />
                ثبت نام سریع
              </Button>
            </Link>
          )}

          {!isFree &&
            (isInCart ? (
              <div>
                <Link href={"/cart"}>
                  <Badge
                    variant={"green"}
                    className="w-full p-2.5 justify-center"
                  >
                    <Check size={18} />
                    در سبد خرید (ادامه)
                  </Badge>
                </Link>
              </div>
            ) : (
              <Button
                onClick={onAddToCart}
                variant={"secondary"}
                className="w-full"
              >
                <Plus size={20} />
                افزودن به سبد خرید
              </Button>
            ))}
        </div>
      )}
    </>
  );
};

export default CourseRegisterButton;
