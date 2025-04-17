"use client";

import { deleteCartItem } from "@/actions/cart";
import Avatar from "@igraph/ui/components/Avatar";
import { Button } from "@igraph/ui/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@igraph/ui/components/ui/table";
import { formatPriceBy3Digits } from "@igraph/utils";
import { placeHolder } from "@/public";
import {
  CartItem,
  Course,
  Discount,
  Image as ImageType,
  Tutor,
} from "@igraph/database";
import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { priceType } from "./Cart";

export interface CartItemType extends CartItem {
  course: Course & {
    discount: Discount | null;
    image: ImageType | null;
    tutor: (Tutor & { image: ImageType | null }) | null;
  };
}

interface Props {
  cartItems: CartItemType[];
  prices: priceType[];
}

const CartList = ({ cartItems, prices }: Props) => {
  const router = useRouter();

  const onDeleteItem = async (cartItemId: number) => {
    const res = await deleteCartItem(cartItemId);

    if (res.error) {
      toast.error(res.error);
      return;
    }

    if (res.success) {
      toast.success(res.success);
      router.refresh();
    }
  };

  const total = prices.reduce((acc, curr) => acc + curr.price, 0);

  return (
    <div className="text-right">
      <Table className="text-right">
        <TableHeader>
          <TableRow>
            <TableHead className="text-right">دوره</TableHead>
            <TableHead className="text-right hidden lg:table-cell">
              مدرس
            </TableHead>
            <TableHead className="text-left">مبلغ (تومان)</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {cartItems.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="py-3">
                <Link
                  href={`/courses/${item.course.url}`}
                  className="flex items-center gap-3"
                >
                  <Image
                    alt=""
                    src={item.course.image?.url || placeHolder}
                    width={70}
                    height={70}
                    className="rounded-sm object-cover"
                  />

                  <p className="font-medium text-sm">{item.course.title}</p>
                </Link>
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                <Link
                  href={`/tutors/${item.course.tutor?.slug}`}
                  className="flex gap-2 items-center"
                >
                  <Avatar src={item.course.tutor?.image?.url} size={30} />
                  <span className="font-medium text-xs ">
                    {item.course.tutor?.displayName}
                  </span>
                </Link>
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-3 items-center">
                  {(item.course.price !== item.course.basePrice ||
                    item.course.price !== prices[index]?.price) && (
                    <span className="text-slate-400 tracking-wider text-sm relative before:absolute before:content-[''] before:w-full before:h-[1px] before:bg-red-500 before:top-1/2 before:left-0 before:-rotate-6">
                      {formatPriceBy3Digits(item.course.basePrice)}
                    </span>
                  )}

                  <span className="text-sm">
                    {formatPriceBy3Digits(prices[index]?.price)}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex justify-end">
                  <Button
                    onClick={() => onDeleteItem(item.id)}
                    variant={"ghost"}
                    size={"icon"}
                    className="[&_svg]:size-3.5 w-7 h-7"
                  >
                    <X size={13} className="text-slate-500" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>

        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>جمع کل</TableCell>
            <TableCell className="text-left">
              {formatPriceBy3Digits(total)}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default CartList;
