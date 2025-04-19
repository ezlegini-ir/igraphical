"use client";

import { createPayment, PaymentDataType } from "@/actions/payment";
import CashBackCard from "@igraph/ui/components/CashBackCard";
import { CourseType } from "@/components/forms/QuickCartCheckoutForm";
import { Badge } from "@igraph/ui/components/ui/badge";
import { Button } from "@igraph/ui/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@igraph/ui/components/ui/form";
import { Input } from "@igraph/ui/components/ui/input";
import Loader from "@igraph/ui/components/Loader";
import { Separator } from "@igraph/ui/components/ui/separator";
import { Switch } from "@igraph/ui/components/ui/switch";
import { getCouponByCode } from "@/data/coupon";
import { getSessionUser } from "@/data/user";
import { useLoading } from "@igraph/utils";
import { formatPriceBy3Digits } from "@igraph/utils";
import { discountFormSchema, DiscountFormType } from "@/lib/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Coupon, CouponType, Wallet } from "@igraph/database";
import { X } from "lucide-react";
import { redirect } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { priceType } from "./Cart";

interface Props {
  courses: CourseType[];
  wallet: Wallet | null;
  prices: priceType[];
  setPrices: Dispatch<SetStateAction<priceType[]>>;
}

const CheckoutForm = ({ courses, wallet, prices, setPrices }: Props) => {
  // CONSTS ---------------------------
  const total = prices.reduce((acc, curr) => acc + curr.price, 0);
  const baseTotal = prices.reduce((acc, curr) => acc + curr.originalPrice, 0);
  const walletBalance = wallet?.balance || 0;
  const form = useForm<DiscountFormType>({
    resolver: zodResolver(discountFormSchema),
    defaultValues: { code: "" },
  });
  const discountAmount = baseTotal - total;
  const form_DiscountCode = form.watch("code");

  // HOOKS ---------------------------
  const [initialCartTotal] = useState(total);
  const [cartTotal, setCartTotal] = useState(total);
  const [usedWalletAmount, setUsedWalletAmount] = useState(0);
  const [useWallet, setUseWallet] = useState<boolean>(false);
  const [coupon, setCoupon] = useState<Coupon | undefined>(undefined);
  const [couponAmount, setCouponAmount] = useState(0);
  const { loading: applyDiscountLoading, setLoading: setApplyDiscountLoading } =
    useLoading();
  const { loading, setLoading } = useLoading();

  //! EFFECTS -----------------------------
  useEffect(() => {
    if (useWallet) {
      setCartTotal(total - walletBalance);
    } else if (!useWallet) {
      setCartTotal(total);
    }
  }, [prices]);

  useEffect(() => {
    // enable
    if (useWallet) {
      if (coupon) {
        if (couponAmount === initialCartTotal && useWallet) {
          setUseWallet(false);
        }
        // Coupon Exists
        const usedWalletAmount = Math.min(
          walletBalance,
          initialCartTotal - couponAmount
        );
        setUsedWalletAmount(usedWalletAmount);
        setCartTotal(initialCartTotal - couponAmount - usedWalletAmount);
      } else {
        // Coupon Not Exists
        const usedWalletAmount = Math.min(initialCartTotal, walletBalance);
        setUsedWalletAmount(usedWalletAmount);
        setCartTotal(initialCartTotal - usedWalletAmount);
      }
    } else {
      // disable
      setUsedWalletAmount(0);
      setCartTotal((prev) => prev + usedWalletAmount);
    }
  }, [useWallet, coupon]);

  //! APPLY DISCOUNT  ---------------------------
  const applyDiscount = async () => {
    // REMOVE DISCOUNT CODE if already applied
    if (coupon) {
      setPrices((prev) =>
        prev.map((item, index) => ({
          ...item,
          price: courses[index]!.price,
        }))
      );

      setCoupon(undefined);
      setCartTotal((prev) => prev + couponAmount);
      setCouponAmount(0);
      form.reset();

      toast.warning("کد تخفیف حذف شد");
      if (useWallet && usedWalletAmount > 0) {
        const usedWalletAmount = Math.min(initialCartTotal, walletBalance);
        setUsedWalletAmount(usedWalletAmount);
        setCartTotal(initialCartTotal - usedWalletAmount);
      }

      return;
    }

    setApplyDiscountLoading(true);

    // COUPON CHECK ---------------
    const existingCoupon = await getCouponByCode(form_DiscountCode);
    if (!existingCoupon) {
      toast.error("کد تخفیف نا معتبر می باشد!");
      setApplyDiscountLoading(false);
      return;
    }

    // Handler Fn
    function applyDiscountAmount(type: CouponType) {
      if (!existingCoupon) return;
      setCoupon(existingCoupon);

      switch (type) {
        case "PERCENT": {
          const discountFactor = existingCoupon.amount / 100;
          const discountValue = initialCartTotal * discountFactor;
          setCouponAmount(discountValue);
          setPrices((prev) =>
            prev.map((item) => ({
              ...item,
              price: item.price * (1 - discountFactor),
            }))
          );
          break;
        }
        case "FIXED_ON_CART": {
          const discountValue = existingCoupon.amount;

          if (discountValue >= initialCartTotal) {
            setCouponAmount(initialCartTotal);
            setCartTotal(0);
            setPrices(prices.map((item) => ({ ...item, price: 0 })));
          } else {
            const totalCart = prices.reduce((acc, item) => acc + item.price, 0);
            const updatedPrices = prices.map((item) => {
              const reduction = (item.price / totalCart) * discountValue;
              return {
                ...item,
                price: Math.max(0, item.price - reduction),
              };
            });
            setCouponAmount(discountValue);
            const newTotal = updatedPrices.reduce(
              (acc, item) => acc + item.price,
              0
            );
            setCartTotal(newTotal);
            setPrices(updatedPrices);
          }
          break;
        }
        case "FIXED_ON_COURSE": {
          const discountFactor = existingCoupon.amount;
          setCouponAmount(Math.min(cartTotal, discountFactor * prices.length));

          setPrices((prev) =>
            prev.map((item) => ({
              ...item,
              price: Math.max(0, item.price - discountFactor),
            }))
          );

          break;
        }
        default:
          break;
      }
    }

    // DATE CHECK ---------------
    if (existingCoupon.to) {
      const isExpired = existingCoupon.to < new Date();
      if (isExpired) {
        toast.error("این کد تخفیف منقضی شده است.");
        setApplyDiscountLoading(false);
        return;
      }
    }
    if (existingCoupon.from) {
      const isNotStarted = existingCoupon.from > new Date();
      if (isNotStarted) {
        toast.error("زمان این کد تخفیف شروع نشده است.");
        setApplyDiscountLoading(false);
        return;
      }
    }

    // LIMIT CHECK ---------------
    if (existingCoupon.limit) {
      const isReachedToLimit = existingCoupon.used === existingCoupon.limit;
      if (isReachedToLimit) {
        toast.error("این کد تخفیف به سقف مجاز استفاده رسیده است");
        setApplyDiscountLoading(false);
        return;
      }
    }

    // COURSE INCLUDE/EXCLUDE CHECK ---------------
    if (
      existingCoupon.courseInclude.length > 0 ||
      existingCoupon.courseExclude.length > 0
    ) {
      //* COURSE INCLUDE CHECK
      if (existingCoupon.courseInclude.length > 0) {
        const courseIncludeIds = existingCoupon.courseInclude.map((c) => c.id);
        const coursesIds = courses.map((c) => c.id);
        const isValid = coursesIds.some((id) => courseIncludeIds.includes(id));

        if (!isValid) {
          toast.error("این کد تخفیف برای این دوره (ها) مجاز نمی باشد.");
          setApplyDiscountLoading(false);
          return;
        }

        applyDiscountAmount(existingCoupon.type);
      }

      //* COURSE EXCLUDE CHECK
      if (existingCoupon.courseExclude.length > 0) {
        const courseExcludeIds = existingCoupon.courseExclude.map((c) => c.id);
        const coursesIds = courses.map((c) => c.id);
        const isNotValid = coursesIds.some((id) =>
          courseExcludeIds.includes(id)
        );

        if (isNotValid) {
          toast.error("این کد تخفیف برای حداقل یکی از دوره ها مجاز نمی باشد.");
          setApplyDiscountLoading(false);
          return;
        }

        applyDiscountAmount(existingCoupon.type);
      }
    } else {
      applyDiscountAmount(existingCoupon.type);
    }

    setApplyDiscountLoading(false);
    toast.success("کد تخفیف با موفقیت اعمال شد.");
  };

  //! ON SUBMIT  ---------------------------
  const onPayment = async () => {
    const user = await getSessionUser();
    setLoading(true);
    if (!user) return;

    const discountAmount =
      couponAmount +
      courses.reduce((acc, curr) => acc + (curr.discount?.amount || 0), 0);
    const itemsTotal = courses.reduce((acc, curr) => acc + curr.basePrice, 0);
    const coursesIds = courses.map((c) => c.id);

    const data: PaymentDataType = {
      amount: cartTotal,
      coursesIds,
      user,
      itemsTotal,
      discountAmount,
      discountCode: coupon?.code,
      discountCodeAmount: couponAmount,
      useWallet,
      useWalletAmount: useWallet ? usedWalletAmount : undefined,
      prices,
    };

    const res = await createPayment(data);
    if (res.error) {
      toast.error(res.error);
      setLoading(false);
      return;
    }
    if (res.success && res.paymentUrl) {
      toast.success(res.success);
      redirect(res.paymentUrl);
    }
    if (res.success && res.redirectUrl) {
      toast.success(res.success);
      redirect(res.redirectUrl);
    }
  };

  const totalPrice = courses.reduce((acc, curr) => acc + curr.price, 0);
  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <div className="flex text-nowrap items-center gap-2 text-sm font-medium">
          <span>مجموع</span>
          <div className="w-full">
            <Separator />
          </div>
          <div>
            {formatPriceBy3Digits(baseTotal)}
            <span className="text-gray-500 text-xs mr-1">تومان</span>
          </div>
        </div>

        {discountAmount > 0 && (
          <div className="flex text-nowrap items-center gap-2 text-sm text-slate-400">
            <span>تخفیف ثابت</span>
            <div className="w-full">
              <Separator />
            </div>
            <div>
              {formatPriceBy3Digits(baseTotal - totalPrice)}-{" "}
              <span className="text-xs">تومان</span>
            </div>
          </div>
        )}

        {couponAmount > 0 && (
          <div className="flex text-nowrap items-center gap-2 text-sm text-slate-400">
            <span>کسر کد تخفیف</span>
            <div className="w-full">
              <Separator />
            </div>
            <div>
              {formatPriceBy3Digits(couponAmount)}-{" "}
              <span className="text-xs">تومان</span>
            </div>
          </div>
        )}

        {usedWalletAmount > 0 && (
          <div className="flex text-nowrap items-center gap-2 text-sm text-slate-400">
            <span>کسر کیف پول</span>
            <div className="w-full">
              <Separator />
            </div>
            <div>
              {formatPriceBy3Digits(usedWalletAmount)}-{" "}
              <span className="text-xs">تومان</span>
            </div>
          </div>
        )}

        {/* //! PURCHASE BUTTON */}
        <div className="space-y-3">
          <Button disabled={loading} className="w-full" onClick={onPayment}>
            <Loader loading={loading} />
            {loading ? (
              "در حال انتقال"
            ) : cartTotal > 0 ? (
              <span className="flex">
                پرداخت {formatPriceBy3Digits(cartTotal)} تومان
              </span>
            ) : (
              <span className="flex">تکمیل ثبت نام</span>
            )}
          </Button>

          <CashBackCard price={cartTotal} />
        </div>
      </div>

      {walletBalance > 0 && initialCartTotal !== 0 && (
        <Badge
          variant={useWallet ? "blue" : "gray"}
          className={`flex justify-between items-center text-sm font-medium py-3 hover:bg-slate-50 
            ${
              cartTotal === 0 &&
              coupon &&
              !usedWalletAmount &&
              "pointer-events-none opacity-50"
            }
            `}
        >
          <div className="flex flex-col gap-1">
            <span>استفاده از کیف پول</span>
            <span className="text-xs">
              موجودی: {formatPriceBy3Digits(walletBalance)} تومان
            </span>
          </div>

          <Switch
            dir="ltr"
            checked={useWallet}
            onCheckedChange={(checked: boolean) => setUseWallet(checked)}
          />
        </Badge>
      )}

      {/* //! DISCOUNT BUTTON */}
      <Form {...form}>
        <form className="relative" onSubmit={form.handleSubmit(applyDiscount)}>
          {initialCartTotal !== 0 && (
            <>
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled={!!coupon}
                        className="border-slate-300 relative pl-20 font-medium tracking-wide bg-white en-digits text-right"
                        placeholder="کد تخفیف"
                        {...field}
                        autoComplete="off"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button
                disabled={!form.formState.isValid || applyDiscountLoading}
                className="absolute px-4 inset-y-0 h-7 left-1 my-auto text-black"
                type="submit"
                size={"sm"}
                variant={"secondary"}
              >
                <Loader loading={applyDiscountLoading} />
                {coupon ? (
                  <span className="flex gap-1">
                    <X />
                    حذف
                  </span>
                ) : applyDiscountLoading ? (
                  "در حال بررسی"
                ) : (
                  "بــررســی"
                )}
              </Button>
            </>
          )}
        </form>
      </Form>
    </div>
  );
};

export default CheckoutForm;
