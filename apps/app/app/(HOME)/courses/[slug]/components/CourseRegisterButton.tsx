"use client";

import { addToCart } from "@/actions/cart";
import { getSessionUser } from "@/data/user";
import { Badge } from "@igraph/ui/components/ui/badge";
import { Button } from "@igraph/ui/components/ui/button";
import { Check, Plus, UserRoundPlus } from "lucide-react";
import Link from "next/link";
import { redirect, usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

const CourseRegisterButton = ({
  courseId,
  isFree,
  isInCart,
}: {
  courseId: number;
  isFree: boolean;
  isInCart: boolean;
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
              <Badge variant={"green"} className="w-full p-2.5 justify-center">
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
  );
};

export default CourseRegisterButton;
