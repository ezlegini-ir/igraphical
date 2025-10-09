"use client";

import { addToCart } from "@/actions/cart";
import { getSessionUser } from "@/data/user";
import { Discount } from "@igraph/database";
import Loader from "@igraph/ui/components/Loader";
import Price from "@igraph/ui/components/Price";
import { Badge } from "@igraph/ui/components/ui/badge";
import { Button } from "@igraph/ui/components/ui/button";
import { formatJalaliDate, useLoading } from "@igraph/utils";
import {
  ArrowLeft,
  Check,
  TvMinimalPlay,
  UserPlus,
  UserRoundPlus,
} from "lucide-react";
import Link from "next/link";
import { redirect, usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

const CourseRegisterButton = ({
  courseId,
  isInCart,
  basePrice,
  discount,
  price,
  isUserEnrolled,
  classroomId,
  isPresale,
  releaseDate,
}: {
  courseId: number;
  isInCart: boolean;
  basePrice: number;
  price: number;
  discount: Discount | null;
  isUserEnrolled: boolean;
  classroomId: string | undefined;
  isPresale: boolean;
  releaseDate: Date | null;
}) => {
  const router = useRouter();
  const pathName = usePathname();
  const { loading, setLoading } = useLoading();

  const onAddToCart = async () => {
    setLoading(true);
    const user = await getSessionUser();
    if (!user) redirect(`/login?callbackUrl=${pathName}`);

    const res = await addToCart(courseId);

    if (res.error) {
      toast.error(res.error);
      setLoading(false);
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
    setLoading(false);
  };

  return (
    <>
      <div className="lg:hidden">
        <div className="card fixed bottom-0 rounded-br-none  rounded-bl-none left-1/2 -translate-x-1/2 px-4 w-full">
          {!isUserEnrolled ? (
            <div className="flex justify-between items-center">
              <div className="flex gap-3">
                {!isInCart ? (
                  <Button
                    disabled={loading}
                    onClick={onAddToCart}
                    variant={isPresale ? "dark" : "default"}
                  >
                    <Loader loading={loading} />
                    <UserRoundPlus size={20} />
                    {isPresale ? "پیش خرید" : "ثبت نام"}
                  </Button>
                ) : (
                  <div>
                    <Link href={"/cart"}>
                      <Badge
                        variant={"green"}
                        className="w-full p-2.5 justify-center"
                      >
                        <Check size={18} />
                        در سبد خرید - ادامه
                      </Badge>
                    </Link>
                  </div>
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

      {!isUserEnrolled ? (
        <div className="space-y-3 pb-3">
          {isInCart ? (
            <div className="flex gap-2">
              <Badge
                variant="green"
                className="w-full p-2.5 gap-1 justify-center"
              >
                <Check size={17} />
                در سبد خرید
              </Badge>

              <Link href="/cart">
                <Button variant={"lightBlue"} type="button" className="gap-1">
                  ادامه
                  <ArrowLeft />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex gap-3">
              {isPresale && releaseDate && (
                <Badge variant="blue" className="w-full gap-1">
                  <span>تاریخ انتشار:</span>
                  <span>{formatJalaliDate(releaseDate)}</span>
                </Badge>
              )}

              <Button
                disabled={loading}
                className="w-full"
                onClick={onAddToCart}
              >
                <Loader loading={loading} />
                <UserPlus />
                {isPresale ? "پیش خرید" : "ثبت نام"}
              </Button>
            </div>
          )}
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
    </>
  );
};

export default CourseRegisterButton;
